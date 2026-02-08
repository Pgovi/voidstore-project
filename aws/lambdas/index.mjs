import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand, QueryCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { CognitoIdentityProviderClient, SignUpCommand, InitiateAuthCommand, ConfirmSignUpCommand, GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const cognito = new CognitoIdentityProviderClient({});
const CLIENT_ID = process.env.COGNITO_CLIENT_ID;
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
};
const json = (status, body) => ({ statusCode: status, headers: { ...cors, "Content-Type": "application/json" }, body: JSON.stringify(body) });

/* ── Extract userId from Cognito token ── */
async function getUserId(event) {
  const hdrs = event.headers || {};
  const token = hdrs.Authorization?.replace("Bearer ", "") || hdrs.authorization?.replace("Bearer ", "");
  if (!token) return null;
  try {
    const res = await cognito.send(new GetUserCommand({ AccessToken: token }));
    return res.UserAttributes.find((a) => a.Name === "sub")?.Value;
  } catch { return null; }
}

export async function handler(event) {
  const method = event.requestContext?.http?.method || event.httpMethod;
  const path = event.rawPath || event.path;

  if (method === "OPTIONS") return json(200, {});
  let body = {};
  try { body = JSON.parse(event.body || "{}"); } catch {}

  try {
    /* ════════ AUTH ════════ */
    if (path === "/auth/signup" && method === "POST") {
      const { name, phone, email, password } = body;
      if (!name || !password) return json(400, { error: "Name and password required" });
      if (!phone && !email) return json(400, { error: "Phone or email required" });

      const username = email || `+91${phone}`;
      const attrs = [{ Name: "name", Value: name }];
      if (email) attrs.push({ Name: "email", Value: email });
      if (phone) attrs.push({ Name: "phone_number", Value: `+91${phone}` });

      const res = await cognito.send(new SignUpCommand({
        ClientId: CLIENT_ID, Username: username, Password: password, UserAttributes: attrs,
      }));

      // Save to DynamoDB
      await ddb.send(new PutCommand({
        TableName: "bk-users",
        Item: { userId: res.UserSub, name, phone: phone || "", email: email || "", createdAt: new Date().toISOString() },
      }));

      return json(200, { userId: res.UserSub, confirmed: res.UserConfirmed, message: "Check email/phone for verification code" });
    }

    if (path === "/auth/verify" && method === "POST") {
      const { username, code } = body;
      await cognito.send(new ConfirmSignUpCommand({ ClientId: CLIENT_ID, Username: username, ConfirmationCode: code }));
      return json(200, { message: "Verified successfully" });
    }

    if (path === "/auth/login" && method === "POST") {
      const { username, password } = body;
      const res = await cognito.send(new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH", ClientId: CLIENT_ID,
        AuthParameters: { USERNAME: username, PASSWORD: password },
      }));
      return json(200, {
        accessToken: res.AuthenticationResult.AccessToken,
        idToken: res.AuthenticationResult.IdToken,
        refreshToken: res.AuthenticationResult.RefreshToken,
      });
    }

    if (path === "/auth/me" && method === "GET") {
      const userId = await getUserId(event);
      if (!userId) return json(401, { error: "Unauthorized" });
      const res = await ddb.send(new GetCommand({ TableName: "bk-users", Key: { userId } }));
      return json(200, res.Item || {});
    }

    /* ════════ PRODUCTS ════════ */
    if (path === "/products" && method === "GET") {
      const res = await ddb.send(new ScanCommand({ TableName: "bk-products" }));
      return json(200, res.Items || []);
    }

    if (path.match(/^\/products\/[^/]+$/) && method === "GET") {
      const productId = path.split("/")[2];
      const res = await ddb.send(new GetCommand({ TableName: "bk-products", Key: { productId } }));
      return json(res.Item ? 200 : 404, res.Item || { error: "Not found" });
    }

    if (path.match(/^\/products\/[^/]+\/stock$/) && method === "PATCH") {
      const productId = path.split("/")[2];
      const { stock } = body;
      await ddb.send(new UpdateCommand({
        TableName: "bk-products", Key: { productId },
        UpdateExpression: "SET stock = :s", ExpressionAttributeValues: { ":s": stock },
      }));
      return json(200, { message: "Stock updated" });
    }

    /* ════════ CART ════════ */
    if (path === "/cart" && method === "GET") {
      const userId = await getUserId(event);
      if (!userId) return json(401, { error: "Unauthorized" });
      const res = await ddb.send(new QueryCommand({
        TableName: "bk-cart", KeyConditionExpression: "userId = :u", ExpressionAttributeValues: { ":u": userId },
      }));
      return json(200, res.Items || []);
    }

    if (path === "/cart" && method === "POST") {
      const userId = await getUserId(event);
      if (!userId) return json(401, { error: "Unauthorized" });
      const { productId, qty } = body;
      await ddb.send(new PutCommand({
        TableName: "bk-cart", Item: { userId, productId, qty: qty || 1, addedAt: new Date().toISOString() },
      }));
      return json(200, { message: "Added to cart" });
    }

    if (path.match(/^\/cart\/[^/]+$/) && method === "PATCH") {
      const userId = await getUserId(event);
      if (!userId) return json(401, { error: "Unauthorized" });
      const productId = path.split("/")[2];
      const { qty } = body;
      if (qty <= 0) {
        await ddb.send(new DeleteCommand({ TableName: "bk-cart", Key: { userId, productId } }));
      } else {
        await ddb.send(new UpdateCommand({
          TableName: "bk-cart", Key: { userId, productId },
          UpdateExpression: "SET qty = :q", ExpressionAttributeValues: { ":q": qty },
        }));
      }
      return json(200, { message: "Cart updated" });
    }

    if (path.match(/^\/cart\/[^/]+$/) && method === "DELETE") {
      const userId = await getUserId(event);
      if (!userId) return json(401, { error: "Unauthorized" });
      const productId = path.split("/")[2];
      await ddb.send(new DeleteCommand({ TableName: "bk-cart", Key: { userId, productId } }));
      return json(200, { message: "Removed from cart" });
    }

    /* ════════ WISHLIST ════════ */
    if (path === "/wishlist" && method === "GET") {
      const userId = await getUserId(event);
      if (!userId) return json(401, { error: "Unauthorized" });
      const res = await ddb.send(new QueryCommand({
        TableName: "bk-wishlist", KeyConditionExpression: "userId = :u", ExpressionAttributeValues: { ":u": userId },
      }));
      return json(200, res.Items || []);
    }

    if (path.match(/^\/wishlist\/[^/]+$/) && method === "POST") {
      const userId = await getUserId(event);
      if (!userId) return json(401, { error: "Unauthorized" });
      const productId = path.split("/")[2];
      await ddb.send(new PutCommand({
        TableName: "bk-wishlist", Item: { userId, productId, addedAt: new Date().toISOString() },
      }));
      return json(200, { message: "Added to wishlist" });
    }

    if (path.match(/^\/wishlist\/[^/]+$/) && method === "DELETE") {
      const userId = await getUserId(event);
      if (!userId) return json(401, { error: "Unauthorized" });
      const productId = path.split("/")[2];
      await ddb.send(new DeleteCommand({ TableName: "bk-wishlist", Key: { userId, productId } }));
      return json(200, { message: "Removed from wishlist" });
    }

    /* ════════ ORDERS ════════ */
    if (path === "/orders" && method === "POST") {
      const userId = await getUserId(event);
      if (!userId) return json(401, { error: "Unauthorized" });
      const { items, subtotal, discount, total, paymentMethod, upiTxnId, shippingAddress } = body;
      const orderId = `BK${Date.now().toString(36).toUpperCase()}`;

      // Decrement stock for each item
      for (const item of items) {
        await ddb.send(new UpdateCommand({
          TableName: "bk-products", Key: { productId: item.productId },
          UpdateExpression: "SET stock = stock - :q",
          ExpressionAttributeValues: { ":q": item.qty },
        }));
      }

      await ddb.send(new PutCommand({
        TableName: "bk-orders",
        Item: { orderId, userId, items, subtotal, discount, total, paymentMethod, upiTxnId: upiTxnId || "", shippingAddress, status: "pending", createdAt: new Date().toISOString() },
      }));

      // Clear cart
      const cartItems = await ddb.send(new QueryCommand({
        TableName: "bk-cart", KeyConditionExpression: "userId = :u", ExpressionAttributeValues: { ":u": userId },
      }));
      for (const ci of (cartItems.Items || [])) {
        await ddb.send(new DeleteCommand({ TableName: "bk-cart", Key: { userId, productId: ci.productId } }));
      }

      return json(200, { orderId, message: "Order placed" });
    }

    if (path === "/orders" && method === "GET") {
      const userId = await getUserId(event);
      if (!userId) return json(401, { error: "Unauthorized" });
      const res = await ddb.send(new QueryCommand({
        TableName: "bk-orders", IndexName: "user-orders-index",
        KeyConditionExpression: "userId = :u", ExpressionAttributeValues: { ":u": userId },
      }));
      return json(200, res.Items || []);
    }

    if (path.match(/^\/orders\/[^/]+$/) && method === "GET") {
      const orderId = path.split("/")[2];
      const res = await ddb.send(new GetCommand({ TableName: "bk-orders", Key: { orderId } }));
      return json(res.Item ? 200 : 404, res.Item || { error: "Not found" });
    }

    return json(404, { error: "Not found" });
  } catch (err) {
    console.error("Error:", err);
    return json(500, { error: err.message || "Internal server error" });
  }
}

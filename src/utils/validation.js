// Form validation utilities

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  // Indian phone number: 10 digits
  const re = /^\d{10}$/;
  return re.test(phone.replace(/\s/g, ''));
};

export const validatePincode = (pincode) => {
  // Indian pincode: 6 digits
  const re = /^\d{6}$/;
  return re.test(pincode);
};

export const validateName = (name) => {
  return name.trim().length >= 2;
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  return password.length >= 8;
};

export const validatePasswordStrong = (password) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= 8;
  
  return {
    isValid: hasUpperCase && hasLowerCase && hasNumber && isLongEnough,
    strength: [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar, isLongEnough].filter(Boolean).length,
    feedback: {
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
      isLongEnough,
    }
  };
};

export const validateCheckoutForm = (form) => {
  const errors = {};
  
  if (!validateName(form.name)) {
    errors.name = 'Name must be at least 2 characters';
  }
  
  if (!validatePhone(form.phone)) {
    errors.phone = 'Enter a valid 10-digit phone number';
  }
  
  if (form.email && !validateEmail(form.email)) {
    errors.email = 'Enter a valid email address';
  }
  
  if (!form.address || form.address.trim().length < 10) {
    errors.address = 'Address must be at least 10 characters';
  }
  
  if (!form.city || form.city.trim().length < 2) {
    errors.city = 'Enter a valid city name';
  }
  
  if (!form.state || form.state.trim().length < 2) {
    errors.state = 'Enter a valid state name';
  }
  
  if (!validatePincode(form.pincode)) {
    errors.pincode = 'Enter a valid 6-digit pincode';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const sanitizeInput = (input) => {
  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, '')
    .trim();
};

export const formatPhone = (phone) => {
  // Format: 98765 43210
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
};

export const formatPincode = (pincode) => {
  // Format: 585 401
  const cleaned = pincode.replace(/\D/g, '');
  if (cleaned.length === 6) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
  }
  return pincode;
};

export const validateCouponCode = (code, cartSubtotal) => {
  const normalizedCode = code.trim().toUpperCase();
  
  // Define available coupons
  const coupons = {
    'BIDRI20': { percent: 20, minOrder: 5000 },
    'WELCOME10': { percent: 10, minOrder: 2000 },
    'FESTIVE15': { percent: 15, minOrder: 3000 },
  };
  
  if (!coupons[normalizedCode]) {
    return { valid: false, error: 'Invalid coupon code' };
  }
  
  const coupon = coupons[normalizedCode];
  
  if (cartSubtotal < coupon.minOrder) {
    return { 
      valid: false, 
      error: `Minimum order of ₹${coupon.minOrder.toLocaleString('en-IN')} required for this coupon` 
    };
  }
  
  return { 
    valid: true, 
    coupon: { code: normalizedCode, ...coupon } 
  };
};

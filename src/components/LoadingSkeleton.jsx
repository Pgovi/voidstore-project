export default function LoadingSkeleton({ count = 8, colors }) {
  const { card, border } = colors;
  
  return (
    <div className="product-grid" style={{ 
      display: "grid", 
      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", 
      gap: "16px" 
    }}>
      {Array(count).fill(0).map((_, i) => (
        <div key={i} style={{ 
          background: card, 
          borderRadius: "12px", 
          overflow: "hidden", 
          border: `1px solid ${border}` 
        }}>
          <div style={{ 
            aspectRatio: "1", 
            background: "rgba(0,0,0,0.04)", 
            animation: "pulse 1.5s infinite" 
          }} />
          <div style={{ padding: "16px" }}>
            <div style={{ 
              height: "10px", 
              width: "40%", 
              background: "rgba(0,0,0,0.06)", 
              borderRadius: "4px", 
              marginBottom: "10px", 
              animation: "pulse 1.5s infinite" 
            }} />
            <div style={{ 
              height: "14px", 
              width: "80%", 
              background: "rgba(0,0,0,0.06)", 
              borderRadius: "4px", 
              marginBottom: "8px", 
              animation: "pulse 1.5s infinite" 
            }} />
            <div style={{ 
              height: "14px", 
              width: "60%", 
              background: "rgba(0,0,0,0.06)", 
              borderRadius: "4px", 
              marginBottom: "16px", 
              animation: "pulse 1.5s infinite" 
            }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ 
                height: "18px", 
                width: "30%", 
                background: "rgba(0,0,0,0.06)", 
                borderRadius: "4px", 
                animation: "pulse 1.5s infinite" 
              }} />
              <div style={{ 
                height: "28px", 
                width: "50px", 
                background: "rgba(0,0,0,0.06)", 
                borderRadius: "6px", 
                animation: "pulse 1.5s infinite" 
              }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

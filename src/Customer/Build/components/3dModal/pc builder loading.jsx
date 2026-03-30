export function LoadingScreen({ progress }) {
  if (progress >= 100) return null;

  return (
    <div style={{
      position: "absolute",
      inset: 0,
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(0, 0, 0, 0.3)",
      backdropFilter: "blur(16px)",
    }}>
      <div style={{
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(20px)",
        borderRadius: "24px",
        padding: "36px 48px",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        textAlign: "center",
      }}>
        <div style={{
          width: "32px",
          height: "32px",
          margin: "0 auto 20px",
          borderRadius: "50%",
          border: "2px solid rgba(255, 255, 255, 0.2)",
          borderTopColor: "white",
          animation: "spin 0.7s linear infinite",
        }} />
        
        <div style={{
          width: "200px",
          height: "2px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "999px",
          overflow: "hidden",
          marginBottom: "12px",
        }}>
          <div style={{
            width: `${progress}%`,
            height: "100%",
            background: "white",
            transition: "width 0.3s ease",
          }} />
        </div>
        
        <div style={{
          fontSize: "13px",
          color: "rgba(255, 255, 255, 0.6)",
        }}>
          {Math.round(progress)}%
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
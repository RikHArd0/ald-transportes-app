const Card = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      width: "100vw",
      minHeight: "82vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div
      style={{
        background: "rgba(18,24,38,0.98)",
        borderRadius: 12,
        padding: "40px 36px",
        boxShadow: "0 6px 32px #0004",
        minWidth: 350,
        maxWidth: 420,
        width: "100%",
        border: "1px solid #263047",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      {children}
    </div>
  </div>
);

export default Card;

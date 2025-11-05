import ThemeToggle from '../ui/ThemeToggle';

const Header = () => (
  <header
    style={{
      width: "100%",
      padding: "14px 0",
      background: "#10589a",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      minHeight: 56,
      boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
    }}
  >
    <div style={{ display: "flex", alignItems: "center", marginLeft: 18 }}>
      <img
        src="/Logo.png"
        alt="ALD Turismo"
        style={{
          height: "64px",
          objectFit: "contain",
          display: "inline-block"
        }}
      />
      {/* REMOVA O TEXTO: Não precisa repetir o nome da empresa */}
    </div>
    <div style={{ marginRight: 28 }}>
      <ThemeToggle />
    </div>
  </header>
);

export default Header;

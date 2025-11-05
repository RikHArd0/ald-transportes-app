import Card from "../../components/common/Card";

const Login = () => (
  <Card>
    <div style={{ marginBottom: 24, textAlign: "center" }}>
      <div
        style={{
          border: "2px solid #3fa1ff",
          borderRadius: 12,
          width: 70,
          height: 70,
          margin: "0 auto 14px auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <span
          style={{
            fontWeight: "bold",
            color: "#3fa1ff",
            fontSize: 24,
            letterSpacing: 2,
            fontFamily: "Segoe UI, Arial, sans-serif"
          }}
        >
          ALD
        </span>
      </div>
      <h2 style={{ color: "#fff", fontWeight: 700, fontSize: 26 }}>Bem-vindo!</h2>
      <p style={{ color: "#8da0c2", fontSize: 16, marginTop: 4 }}>Entre para continuar</p>
    </div>

    <form style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ marginBottom: 14, width: "100%" }}>
        <label style={{ color: "#8da0c2", fontWeight: 500, fontSize: 15 }}>
          Email
          <input
            type="email"
            style={{
              display: "block",
              marginTop: 8,
              padding: "10px 12px",
              fontSize: 16,
              borderRadius: 8,
              border: "1px solid #263047",
              background: "#16213a",
              color: "#fff",
              width: "100%",
              boxSizing: "border-box"
            }}
            placeholder="seu@email.com"
            defaultValue="sergio.ricardo_@hotmail.com"
          />
        </label>
      </div>

      <div style={{ marginBottom: 22, width: "100%" }}>
        <label style={{ color: "#8da0c2", fontWeight: 500, fontSize: 15 }}>
          Senha
          <input
            type="password"
            style={{
              display: "block",
              marginTop: 8,
              padding: "10px 12px",
              fontSize: 16,
              borderRadius: 8,
              border: "1px solid #263047",
              background: "#16213a",
              color: "#fff",
              width: "100%",
              boxSizing: "border-box"
            }}
            placeholder="********"
          />
        </label>
      </div>

      <button
        type="submit"
        style={{
          background: "linear-gradient(90deg,#3fa1ff,#3782e0)",
          color: "#fff",
          fontWeight: 600,
          fontSize: 16,
          border: 0,
          borderRadius: 8,
          padding: "12px 0",
          width: "100%",
          cursor: "pointer",
          marginBottom: 14,
          marginTop: 4
        }}
      >
        Entrar
      </button>

      <div style={{ fontSize: 13, color: "#8da0c2", margin: "8px 0 0 0", textAlign: "center" }}>
        Esqueceu sua senha?
      </div>

      <div style={{ fontSize: 13, textAlign: "center", marginTop: 2 }}>
        <a href="/cadastro" style={{ color: "#3fa1ff", textDecoration: "none" }}>
          Não tem uma conta? Cadastre-se
        </a>
      </div>
    </form>
  </Card>
);

export default Login;

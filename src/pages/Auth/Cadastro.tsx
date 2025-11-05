import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

const inputStyle: React.CSSProperties = {
  display: "block",
  marginTop: 6,
  marginBottom: 0,
  width: "100%",
  padding: "12px 10px",
  fontSize: 16,
  borderRadius: 8,
  border: "1.5px solid #263047",
  background: "#16213a",
  color: "#fff",
  outline: "none"
};

const Cadastro = () => {
  const [tipo, setTipo] = useState<"empresa" | "motorista">("empresa");
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const navigate = useNavigate();

  async function cadastrar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setSucesso(false);

    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
    });

    if (error) {
      setErro(error.message);
    } else if (data?.user) {
      await supabase.from("profiles").insert([{
        id: data.user.id,
        email,
        tipo,
        nome_completo: nomeCompleto,
        nome_empresa: tipo === "empresa" ? nomeEmpresa : null,
        telefone
      }]);
      setSucesso(true);
      setTimeout(() => navigate("/"), 1800);
    }
  }

  return (
    <div
      style={{
        background: "#0f1623",
        maxWidth: 400,
        margin: "32px auto",
        borderRadius: 12,
        boxShadow: "0 3px 30px #090f2060",
        padding: 32,
        fontFamily: "Segoe UI, Arial, sans-serif",
        color: "#fff",
        border: "1px solid #22263a"
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <div
          style={{
            display: "inline-block",
            border: "3px solid #358aff",
            borderRadius: 14,
            width: 62,
            height: 62,
            marginBottom: 16,
            alignItems: "center",
            justifyContent: "center",
            verticalAlign: "middle"
          }}
        >
          <span
            style={{
              fontWeight: "bold",
              color: "#358aff",
              fontSize: 27,
              lineHeight: "62px",
              display: "inline-block"
            }}
          >
            ALD
          </span>
        </div>
        <h2 style={{ margin: "14px 0 5px", fontWeight: 700, fontSize: 28 }}>Criar Conta</h2>
        <div style={{ color: "#858ead", fontSize: 15, marginBottom: 22 }}>ALD Transportes</div>
      </div>
      <form onSubmit={cadastrar}>
        <div style={{ display: "flex", marginBottom: 18, gap: 20 }}>
          <button
            type="button"
            onClick={() => setTipo("empresa")}
            style={{
              flex: 1,
              background: tipo === "empresa" ? "#2256e9" : "transparent",
              color: tipo === "empresa" ? "#fff" : "#358aff",
              border: tipo === "empresa" ? "2px solid #2256e9" : "2px solid #358aff",
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 16,
              padding: "12px 0",
              cursor: "pointer",
              boxShadow: tipo === "empresa" ? "0 2px 10px #2256e955" : "none",
              transition: "all 0.2s"
            }}
          >
            Empresa
          </button>
          <button
            type="button"
            onClick={() => setTipo("motorista")}
            style={{
              flex: 1,
              background: tipo === "motorista" ? "#2256e9" : "transparent",
              color: tipo === "motorista" ? "#fff" : "#358aff",
              border: tipo === "motorista" ? "2px solid #2256e9" : "2px solid #358aff",
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 16,
              padding: "12px 0",
              cursor: "pointer",
              boxShadow: tipo === "motorista" ? "0 2px 10px #2256e955" : "none",
              transition: "all 0.2s"
            }}
          >
            Motorista
          </button>
        </div>
        <div style={{ marginBottom: 13 }}>
          <label>Nome Completo
            <input
              type="text"
              value={nomeCompleto}
              onChange={e => setNomeCompleto(e.target.value)}
              required
              style={inputStyle}
            />
          </label>
        </div>
        {tipo === "empresa" && (
          <div style={{ marginBottom: 13 }}>
            <label>Nome da Empresa
              <input
                type="text"
                value={nomeEmpresa}
                onChange={e => setNomeEmpresa(e.target.value)}
                required
                style={inputStyle}
              />
            </label>
          </div>
        )}
        <div style={{ marginBottom: 13 }}>
          <label>Telefone
            <input
              type="tel"
              value={telefone}
              placeholder="(11) 99999-9999"
              onChange={e => setTelefone(e.target.value)}
              required
              style={inputStyle}
            />
          </label>
        </div>
        <div style={{ marginBottom: 13 }}>
          <label>Email
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </label>
        </div>
        <div style={{ marginBottom: 25 }}>
          <label>Senha
            <input
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
              style={inputStyle}
            />
          </label>
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            background: "linear-gradient(90deg,#358aff,#50aaf7)",
            border: "none",
            color: "#fff",
            fontWeight: 700,
            fontSize: 17,
            borderRadius: 8,
            padding: "13px 0",
            marginBottom: 6,
            cursor: "pointer",
            boxShadow: "0 1px 10px #1976d235"
          }}
        >Criar Conta</button>
        {erro && <div style={{ color: "#ff4545", textAlign: "center", fontSize: 13, marginTop: 7 }}>{erro}</div>}
        {sucesso && <div style={{ color: "#25db67", textAlign: "center", fontSize: 13, marginTop: 7 }}>Conta criada! Redirecionando...</div>}
        <div style={{ fontSize: 14, marginTop: 15, textAlign: "center" }}>
          <span
            style={{ color: "#358aff", textDecoration: "underline", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Já tem uma conta? Faça login
          </span>
        </div>
      </form>
    </div>
  );
};

export default Cadastro;

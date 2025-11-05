import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

// Tipagem para o usuário (ajuste os campos conforme o banco!)
type Usuario = {
  id: string;
  name: string;
  role: string;
  // adicione mais campos se houver na tabela profiles
};

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [novo, setNovo] = useState<Usuario>({ id: "", name: "", role: "" });

  async function listar() {
    const { data } = await supabase.from("profiles").select("*");
    setUsuarios((data as Usuario[]) ?? []);
  }

  async function inserir() {
    await supabase.from("profiles").insert([novo]);
    listar();
  }

  async function editar(id: string) {
    await supabase.from("profiles").update(novo).eq("id", id);
    listar();
  }

  async function deletar(id: string) {
    await supabase.from("profiles").delete().eq("id", id);
    listar();
  }

  useEffect(() => { listar(); }, []);

  return (
    <div>
      <input
        placeholder="ID"
        value={novo.id}
        onChange={e => setNovo(n => ({ ...n, id: e.target.value }))}
      />
      <input
        placeholder="Nome"
        value={novo.name}
        onChange={e => setNovo(n => ({ ...n, name: e.target.value }))}
      />
      <input
        placeholder="Role"
        value={novo.role}
        onChange={e => setNovo(n => ({ ...n, role: e.target.value }))}
      />
      <button onClick={inserir}>Inserir</button>
      <ul>
        {usuarios.map(u => (
          <li key={u.id}>
            {u.name} | {u.role}
            <button onClick={() => editar(u.id)}>Editar</button>
            <button onClick={() => deletar(u.id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

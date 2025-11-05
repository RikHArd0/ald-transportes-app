import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type Chamado = {
  id: string;
  origem: string;
  destino: string;
};

export default function Chamados() {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [novo, setNovo] = useState<Chamado>({ id: "", origem: "", destino: "" });

  async function listar() {
    const { data } = await supabase.from("chamados").select("*");
    setChamados((data as Chamado[]) ?? []);
  }

  async function inserir() {
    await supabase.from("chamados").insert([novo]);
    listar();
  }

  async function editar(id: string) {
    await supabase.from("chamados").update(novo).eq("id", id);
    listar();
  }

  async function deletar(id: string) {
    await supabase.from("chamados").delete().eq("id", id);
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
        placeholder="Origem"
        value={novo.origem}
        onChange={e => setNovo(n => ({ ...n, origem: e.target.value }))}
      />
      <input
        placeholder="Destino"
        value={novo.destino}
        onChange={e => setNovo(n => ({ ...n, destino: e.target.value }))}
      />
      <button onClick={inserir}>Inserir</button>
      <ul>
        {chamados.map(c => (
          <li key={c.id}>
            {c.origem} | {c.destino}
            <button onClick={() => editar(c.id)}>Editar</button>
            <button onClick={() => deletar(c.id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

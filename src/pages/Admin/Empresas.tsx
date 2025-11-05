import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type Empresa = {
  id: string;
  nome: string;
  cnpj: string;
};

export default function Empresas() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [novo, setNovo] = useState<Empresa>({ id: "", nome: "", cnpj: "" });

  async function listar() {
    const { data } = await supabase.from("empresas").select("*");
    setEmpresas((data as Empresa[]) ?? []);
  }

  async function inserir() {
    await supabase.from("empresas").insert([novo]);
    listar();
  }

  async function editar(id: string) {
    await supabase.from("empresas").update(novo).eq("id", id);
    listar();
  }

  async function deletar(id: string) {
    await supabase.from("empresas").delete().eq("id", id);
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
        value={novo.nome}
        onChange={e => setNovo(n => ({ ...n, nome: e.target.value }))}
      />
      <input
        placeholder="CNPJ"
        value={novo.cnpj}
        onChange={e => setNovo(n => ({ ...n, cnpj: e.target.value }))}
      />
      <button onClick={inserir}>Inserir</button>
      <ul>
        {empresas.map(e => (
          <li key={e.id}>
            {e.nome} | {e.cnpj}
            <button onClick={() => editar(e.id)}>Editar</button>
            <button onClick={() => deletar(e.id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

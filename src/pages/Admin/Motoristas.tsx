import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type Motorista = {
  id: string;
  nome: string;
  cpf: string;
};

export default function Motoristas() {
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [novo, setNovo] = useState<Motorista>({ id: "", nome: "", cpf: "" });

  async function listar() {
    const { data } = await supabase.from("motoristas").select("*");
    setMotoristas((data as Motorista[]) ?? []);
  }

  async function inserir() {
    await supabase.from("motoristas").insert([novo]);
    listar();
  }

  async function editar(id: string) {
    await supabase.from("motoristas").update(novo).eq("id", id);
    listar();
  }

  async function deletar(id: string) {
    await supabase.from("motoristas").delete().eq("id", id);
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
        placeholder="CPF"
        value={novo.cpf}
        onChange={e => setNovo(n => ({ ...n, cpf: e.target.value }))}
      />
      <button onClick={inserir}>Inserir</button>
      <ul>
        {motoristas.map(m => (
          <li key={m.id}>
            {m.nome} | {m.cpf}
            <button onClick={() => editar(m.id)}>Editar</button>
            <button onClick={() => deletar(m.id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

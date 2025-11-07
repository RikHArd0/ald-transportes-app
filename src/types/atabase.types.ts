export type Profile = {
  id: string
  name: string | null
  role: string | null
  created_at: string
  phone: string | null
  nome_completo: string | null
  nome_empresa: string | null
  telefone: string | null
  tipo: string | null
}

export type Empresa = {
  id: string
  nome: string
  cnpj: string
  endereco: string | null
  telefone: string | null
  email: string | null
  created_at: string
}

export type Motorista = {
  id: string
  nome: string
  cpf: string
  cnh: string | null
  telefone: string | null
  email: string | null
  empresa_id: string | null
  created_at: string
}

export type Chamado = {
  id: string
  origem: string
  destino: string
  data_chamado: string
  status: string | null
  motorista_id: string | null
  empresa_id: string | null
  observacoes: string | null
  created_at: string
  updated_at: string
}

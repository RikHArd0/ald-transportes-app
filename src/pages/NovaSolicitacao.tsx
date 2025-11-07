import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function NovaSolicitacao() {
  const [origem, setOrigem] = useState('')
  const [destinos, setDestinos] = useState([''])
  const [horario, setHorario] = useState('')
  const [numPassageiros, setNumPassageiros] = useState(1)
  const [tipoVeiculo, setTipoVeiculo] = useState('Carro 4 lugares')
  const [observacoes, setObservacoes] = useState('')
  const navigate = useNavigate()

  function adicionarDestino() {
    setDestinos([...destinos, ''])
  }

  function atualizarDestino(index: number, valor: string) {
    const novosDestinos = [...destinos]
    novosDestinos[index] = valor
    setDestinos(novosDestinos)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const destinoFinal = destinos.filter(d => d.trim() !== '').join(' → ')

    const { error } = await supabase
      .from('chamados')
      .insert({
        origem,
        destino: destinoFinal,
        status: 'pendente',
        observacoes: `Horário: ${horario} | Passageiros: ${numPassageiros} | Veículo: ${tipoVeiculo} | Obs: ${observacoes}`,
        empresa_id: user.id
      })

    if (error) {
      alert('Erro ao criar solicitação: ' + error.message)
    } else {
      alert('Solicitação criada! Aguardando motorista aceitar.')
      navigate('/solicitacoes-ativas')
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto', color: 'var(--text-main)' }}>
      <h1>Nova Solicitação</h1>
      <form onSubmit={handleSubmit} style={{ background: 'var(--background-box)', padding: 30, borderRadius: 12 }}>
        
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Origem</label>
        <input 
          type="text" 
          value={origem}
          onChange={e => setOrigem(e.target.value)}
          placeholder="Rua A, 123"
          required
          style={{ width: '100%', padding: 12, fontSize: 16, borderRadius: 8, border: '1px solid #263047', background: 'var(--input-bg)', color: 'var(--input-text)', marginBottom: 16, boxSizing: 'border-box' }}
        />

        {destinos.map((destino, index) => (
          <div key={index} style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Destino {index + 1}</label>
            <input 
              type="text" 
              value={destino}
              onChange={e => atualizarDestino(index, e.target.value)}
              placeholder="Rua B, 200"
              required
              style={{ width: '100%', padding: 12, fontSize: 16, borderRadius: 8, border: '1px solid #263047', background: 'var(--input-bg)', color: 'var(--input-text)', boxSizing: 'border-box' }}
            />
          </div>
        ))}

        <button 
          type="button" 
          onClick={adicionarDestino}
          style={{ background: 'transparent', color: '#358aff', border: '2px dashed #358aff', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', marginBottom: 20, fontWeight: 600 }}
        >
          + Adicionar Destino
        </button>

        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Horário</label>
        <input 
          type="time" 
          value={horario}
          onChange={e => setHorario(e.target.value)}
          required
          style={{ width: '100%', padding: 12, fontSize: 16, borderRadius: 8, border: '1px solid #263047', background: 'var(--input-bg)', color: 'var(--input-text)', marginBottom: 16, boxSizing: 'border-box' }}
        />

        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Nº de Passageiros</label>
        <input 
          type="number" 
          min="1" 
          max="50"
          value={numPassageiros}
          onChange={e => setNumPassageiros(parseInt(e.target.value))}
          required
          style={{ width: '100%', padding: 12, fontSize: 16, borderRadius: 8, border: '1px solid #263047', background: 'var(--input-bg)', color: 'var(--input-text)', marginBottom: 16, boxSizing: 'border-box' }}
        />

        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Tipo de Veículo</label>
        <select 
          value={tipoVeiculo}
          onChange={e => setTipoVeiculo(e.target.value)}
          style={{ width: '100%', padding: 12, fontSize: 16, borderRadius: 8, border: '1px solid #263047', background: 'var(--input-bg)', color: 'var(--input-text)', marginBottom: 16, boxSizing: 'border-box' }}
        >
          <option value="Carro 4 lugares">Carro 4 lugares</option>
          <option value="Van 8 lugares">Van 8 lugares</option>
          <option value="Van 15 lugares">Van 15 lugares</option>
          <option value="Ônibus">Ônibus</option>
        </select>

        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Observações</label>
        <textarea 
          value={observacoes}
          onChange={e => setObservacoes(e.target.value)}
          placeholder="Informações adicionais..."
          rows={4}
          style={{ width: '100%', padding: 12, fontSize: 16, borderRadius: 8, border: '1px solid #263047', background: 'var(--input-bg)', color: 'var(--input-text)', marginBottom: 20, boxSizing: 'border-box', resize: 'vertical' }}
        />

        <button 
          type="submit"
          style={{ width: '100%', background: 'linear-gradient(90deg,#3fa1ff 10%,#358aff 90%)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 18, padding: '15px 0', cursor: 'pointer' }}
        >
          Solicitar
        </button>
      </form>
    </div>
  )
}

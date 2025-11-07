import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

interface Chamado {
  id: string
  origem: string
  destino: string
  status: string
  data_chamado: string
  motorista_id: string | null
  observacoes: string
  created_at: string
}

export default function SolicitacoesAtivas() {
  const [chamados, setChamados] = useState<Chamado[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
  buscarChamadosAtivos()
}, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function buscarChamadosAtivos() {
    setLoading(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      navigate('/login')
      return
    }

    // Busca chamados pendentes ou aceitos da empresa
    const { data, error } = await supabase
      .from('chamados')
      .select('*')
      .eq('empresa_id', user.id)
      .in('status', ['pendente', 'aceito'])
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar chamados:', error)
    } else {
      setChamados(data || [])
    }
    
    setLoading(false)
  }

  function getStatusColor(status: string) {
    switch(status) {
      case 'pendente': return '#ff9500'
      case 'aceito': return '#4ad491'
      case 'em_andamento': return '#3fa1ff'
      default: return '#8da0c2'
    }
  }

  function getStatusText(status: string) {
    switch(status) {
      case 'pendente': return 'Aguardando Motorista'
      case 'aceito': return 'Aceito'
      case 'em_andamento': return 'Em Andamento'
      case 'concluido': return 'Concluído'
      default: return status
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 20, color: 'var(--text-main)', textAlign: 'center' }}>
        <h2>Carregando...</h2>
      </div>
    )
  }

  return (
    <div style={{ padding: 20, color: 'var(--text-main)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <h1>Solicitações Ativas</h1>
        <button 
          onClick={() => navigate('/dashboard')} 
          style={{ background: '#263047', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer' }}
        >
          ← Voltar
        </button>
      </div>

      {chamados.length === 0 ? (
        <div style={{ background: 'var(--background-box)', padding: 40, borderRadius: 12, textAlign: 'center' }}>
          <p style={{ fontSize: 18, color: '#8da0c2' }}>Nenhuma solicitação ativa no momento.</p>
          <button 
            onClick={() => navigate('/nova-solicitacao')} 
            style={{ marginTop: 20, background: 'linear-gradient(90deg,#3fa1ff 10%,#358aff 90%)', color: '#fff', border: 'none', padding: '15px 30px', borderRadius: 8, cursor: 'pointer', fontSize: 16, fontWeight: 600 }}
          >
            + Nova Solicitação
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {chamados.map((chamado) => (
            <div 
              key={chamado.id} 
              style={{ 
                background: 'var(--background-box)', 
                padding: 25, 
                borderRadius: 12, 
                border: `2px solid ${getStatusColor(chamado.status)}`,
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 20, color: '#fff' }}>Chamado #{chamado.id.slice(0, 8)}</h3>
                  <p style={{ margin: '5px 0 0 0', fontSize: 14, color: '#8da0c2' }}>
                    {new Date(chamado.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div 
                  style={{ 
                    background: getStatusColor(chamado.status), 
                    color: '#fff', 
                    padding: '8px 16px', 
                    borderRadius: 20, 
                    fontSize: 14, 
                    fontWeight: 600 
                  }}
                >
                  {getStatusText(chamado.status)}
                </div>
              </div>

              <div style={{ marginTop: 20 }}>
                <div style={{ marginBottom: 10 }}>
                  <span style={{ color: '#8da0c2', fontSize: 14 }}>📍 Origem:</span>
                  <p style={{ margin: '5px 0', fontSize: 16, color: '#fff' }}>{chamado.origem}</p>
                </div>
                
                <div style={{ marginBottom: 10 }}>
                  <span style={{ color: '#8da0c2', fontSize: 14 }}>🎯 Destino:</span>
                  <p style={{ margin: '5px 0', fontSize: 16, color: '#fff' }}>{chamado.destino}</p>
                </div>

                {chamado.observacoes && (
                  <div style={{ marginTop: 15, padding: 15, background: '#0f1623', borderRadius: 8 }}>
                    <span style={{ color: '#8da0c2', fontSize: 14 }}>📝 Detalhes:</span>
                    <p style={{ margin: '5px 0 0 0', fontSize: 14, color: '#fff' }}>{chamado.observacoes}</p>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button 
                  onClick={() => alert('Funcionalidade de rastreamento em desenvolvimento')}
                  style={{ 
                    flex: 1, 
                    background: '#358aff', 
                    color: '#fff', 
                    border: 'none', 
                    padding: 12, 
                    borderRadius: 8, 
                    cursor: 'pointer', 
                    fontWeight: 600 
                  }}
                >
                  📍 Rastrear
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm('Deseja cancelar esta solicitação?')) {
                      // Implementar cancelamento
                      alert('Funcionalidade de cancelamento em desenvolvimento')
                    }
                  }}
                  style={{ 
                    flex: 1, 
                    background: '#e93131', 
                    color: '#fff', 
                    border: 'none', 
                    padding: 12, 
                    borderRadius: 8, 
                    cursor: 'pointer', 
                    fontWeight: 600 
                  }}
                >
                  ❌ Cancelar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

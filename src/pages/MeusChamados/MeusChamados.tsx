import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import './MeusChamados.css';

interface Chamado {
  id: string;
  origem: string;
  destino: string;
  tipo_veiculo: string;
  tipo_carga: string;
  peso_carga: number;
  observacoes: string | null;
  status: string;
  created_at: string;
  aceito_em: string;
  empresa_id: string;
}

function MeusChamados() {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const buscarMeusChamados = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('chamados')
        .select('*')
        .eq('motorista_id', user.id)
        .in('status', ['aceito', 'em_andamento', 'finalizado'])
        .order('aceito_em', { ascending: false });

      if (error) throw error;
      setChamados(data || []);
    } catch (error) {
      console.error('Erro ao buscar meus chamados:', error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    buscarMeusChamados();
  }, [buscarMeusChamados]);

  const handleVerDetalhes = (chamadoId: string) => {
    navigate(`/chamado/${chamadoId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aceito':
        return '#2196F3';
      case 'em_andamento':
        return '#FF9800';
      case 'finalizado':
        return '#4CAF50';
      default:
        return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'aceito':
        return 'Aceito';
      case 'em_andamento':
        return 'Em Andamento';
      case 'finalizado':
        return 'Finalizado';
      default:
        return status;
    }
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <div className="loading">Carregando seus chamados...</div>;
  }

  return (
    <div className="meus-chamados">
      <div className="header">
        <button className="btn-voltar" onClick={() => navigate('/dashboard')}>
          ← Voltar
        </button>
        <h1>Meus Chamados</h1>
      </div>

      {chamados.length === 0 ? (
        <div className="empty-state">
          <p>Você ainda não aceitou nenhum chamado</p>
          <button className="btn-buscar" onClick={() => navigate('/chamados-disponiveis')}>
            Buscar Chamados Disponíveis
          </button>
        </div>
      ) : (
        <div className="chamados-lista">
          {chamados.map((chamado) => (
            <div key={chamado.id} className="chamado-card">
              <div className="chamado-header" style={{ backgroundColor: getStatusColor(chamado.status) }}>
                <div>
                  <span className="chamado-tipo">{chamado.tipo_veiculo}</span>
                  <span className="chamado-status">{getStatusText(chamado.status)}</span>
                </div>
                <span className="chamado-data">{formatarData(chamado.aceito_em)}</span>
              </div>
              
              <div className="chamado-body">
                <div className="rota">
                  <div className="local">
                    <strong>Origem:</strong>
                    <p>{chamado.origem}</p>
                  </div>
                  <div className="seta">→</div>
                  <div className="local">
                    <strong>Destino:</strong>
                    <p>{chamado.destino}</p>
                  </div>
                </div>

                <div className="detalhes">
                  <div className="detalhe-item">
                    <strong>Tipo de Carga:</strong>
                    <span>{chamado.tipo_carga}</span>
                  </div>
                  <div className="detalhe-item">
                    <strong>Peso:</strong>
                    <span>{chamado.peso_carga} kg</span>
                  </div>
                </div>

                {chamado.observacoes && (
                  <div className="observacoes">
                    <strong>Observações:</strong>
                    <p>{chamado.observacoes}</p>
                  </div>
                )}
              </div>

              <div className="chamado-footer">
                <button 
                  className="btn-detalhes"
                  onClick={() => handleVerDetalhes(chamado.id)}
                >
                  Ver Detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MeusChamados;

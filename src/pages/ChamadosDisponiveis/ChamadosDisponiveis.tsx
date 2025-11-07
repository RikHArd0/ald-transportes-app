import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import './ChamadosDisponiveis.css';

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
  empresa_id: string;
}

function ChamadosDisponiveis() {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    buscarChamadosDisponiveis();
  }, []);

  const buscarChamadosDisponiveis = async () => {
    try {
      const { data, error } = await supabase
        .from('chamados')
        .select('*')
        .eq('status', 'pendente')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChamados(data || []);
    } catch (error) {
      console.error('Erro ao buscar chamados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAceitarChamado = async (chamadoId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('Você precisa estar logado');
        navigate('/login');
        return;
      }

      const { error } = await supabase
        .from('chamados')
        .update({ 
          status: 'aceito',
          motorista_id: user.id,
          aceito_em: new Date().toISOString()
        })
        .eq('id', chamadoId);

      if (error) throw error;

      alert('Chamado aceito com sucesso!');
      navigate('/meus-chamados');
    } catch (error) {
      console.error('Erro ao aceitar chamado:', error);
      alert('Erro ao aceitar chamado');
    }
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <div className="loading">Carregando chamados...</div>;
  }

  return (
    <div className="chamados-disponiveis">
      <div className="header">
        <button className="btn-voltar" onClick={() => navigate('/dashboard')}>
          ← Voltar
        </button>
        <h1>Chamados Disponíveis</h1>
      </div>

      {chamados.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum chamado disponível no momento</p>
        </div>
      ) : (
        <div className="chamados-lista">
          {chamados.map((chamado) => (
            <div key={chamado.id} className="chamado-card">
              <div className="chamado-header">
                <span className="chamado-tipo">{chamado.tipo_veiculo}</span>
                <span className="chamado-data">{formatarData(chamado.created_at)}</span>
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
                  className="btn-aceitar"
                  onClick={() => handleAceitarChamado(chamado.id)}
                >
                  Aceitar Chamado
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChamadosDisponiveis;

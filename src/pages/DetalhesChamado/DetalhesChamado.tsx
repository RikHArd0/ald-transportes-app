import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import './DetalhesChamado.css';

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
  iniciado_em: string | null;
  finalizado_em: string | null;
  empresa_id: string;
  motorista_id: string;
}

function DetalhesChamado() {
  const { id } = useParams<{ id: string }>();
  const [chamado, setChamado] = useState<Chamado | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const buscarChamado = useCallback(async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('chamados')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setChamado(data);
    } catch (error) {
      console.error('Erro ao buscar chamado:', error);
      alert('Erro ao carregar chamado');
      navigate('/meus-chamados');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    buscarChamado();
  }, [buscarChamado]);

  const handleIniciarViagem = async () => {
    if (!chamado) return;

    try {
      const { error } = await supabase
        .from('chamados')
        .update({
          status: 'em_andamento',
          iniciado_em: new Date().toISOString()
        })
        .eq('id', chamado.id);

      if (error) throw error;

      alert('Viagem iniciada!');
      buscarChamado();
    } catch (error) {
      console.error('Erro ao iniciar viagem:', error);
      alert('Erro ao iniciar viagem');
    }
  };

  const handleFinalizarViagem = async () => {
    if (!chamado) return;

    const confirmacao = window.confirm('Tem certeza que deseja finalizar esta viagem?');
    if (!confirmacao) return;

    try {
      const { error } = await supabase
        .from('chamados')
        .update({
          status: 'finalizado',
          finalizado_em: new Date().toISOString()
        })
        .eq('id', chamado.id);

      if (error) throw error;

      alert('Viagem finalizada com sucesso!');
      navigate('/meus-chamados');
    } catch (error) {
      console.error('Erro ao finalizar viagem:', error);
      alert('Erro ao finalizar viagem');
    }
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

  const formatarData = (dataString: string | null) => {
    if (!dataString) return '-';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR') + ' às ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <div className="loading">Carregando detalhes...</div>;
  }

  if (!chamado) {
    return <div className="error">Chamado não encontrado</div>;
  }

  return (
    <div className="detalhes-chamado">
      <div className="header">
        <button className="btn-voltar" onClick={() => navigate('/meus-chamados')}>
          ← Voltar
        </button>
        <h1>Detalhes do Chamado</h1>
      </div>

      <div className="chamado-container">
        <div className="status-badge" style={{ backgroundColor: getStatusColor(chamado.status) }}>
          {getStatusText(chamado.status)}
        </div>

        <div className="section">
          <h2>Informações da Viagem</h2>
          
          <div className="rota-completa">
            <div className="local-info">
              <div className="local-icon origem">📍</div>
              <div className="local-detalhes">
                <strong>Origem</strong>
                <p>{chamado.origem}</p>
              </div>
            </div>

            <div className="linha-rota"></div>

            <div className="local-info">
              <div className="local-icon destino">🎯</div>
              <div className="local-detalhes">
                <strong>Destino</strong>
                <p>{chamado.destino}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <h2>Detalhes da Carga</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Tipo de Veículo:</span>
              <span className="value">{chamado.tipo_veiculo}</span>
            </div>
            <div className="info-item">
              <span className="label">Tipo de Carga:</span>
              <span className="value">{chamado.tipo_carga}</span>
            </div>
            <div className="info-item">
              <span className="label">Peso:</span>
              <span className="value">{chamado.peso_carga} kg</span>
            </div>
          </div>

          {chamado.observacoes && (
            <div className="observacoes-box">
              <strong>Observações:</strong>
              <p>{chamado.observacoes}</p>
            </div>
          )}
        </div>

        <div className="section">
          <h2>Timeline</h2>
          <div className="timeline">
            <div className="timeline-item completed">
              <div className="timeline-icon">✓</div>
              <div className="timeline-content">
                <strong>Chamado Criado</strong>
                <span>{formatarData(chamado.created_at)}</span>
              </div>
            </div>

            <div className={`timeline-item ${chamado.aceito_em ? 'completed' : ''}`}>
              <div className="timeline-icon">{chamado.aceito_em ? '✓' : '○'}</div>
              <div className="timeline-content">
                <strong>Chamado Aceito</strong>
                <span>{formatarData(chamado.aceito_em)}</span>
              </div>
            </div>

            <div className={`timeline-item ${chamado.iniciado_em ? 'completed' : ''}`}>
              <div className="timeline-icon">{chamado.iniciado_em ? '✓' : '○'}</div>
              <div className="timeline-content">
                <strong>Viagem Iniciada</strong>
                <span>{formatarData(chamado.iniciado_em)}</span>
              </div>
            </div>

            <div className={`timeline-item ${chamado.finalizado_em ? 'completed' : ''}`}>
              <div className="timeline-icon">{chamado.finalizado_em ? '✓' : '○'}</div>
              <div className="timeline-content">
                <strong>Viagem Finalizada</strong>
                <span>{formatarData(chamado.finalizado_em)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="actions">
          {chamado.status === 'aceito' && (
            <button className="btn-action btn-iniciar" onClick={handleIniciarViagem}>
              🚚 Iniciar Viagem
            </button>
          )}

          {chamado.status === 'em_andamento' && (
            <button className="btn-action btn-finalizar" onClick={handleFinalizarViagem}>
              ✓ Finalizar Viagem
            </button>
          )}

          {chamado.status === 'finalizado' && (
            <div className="finalizado-badge">
              <span>✓ Viagem Concluída</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetalhesChamado;

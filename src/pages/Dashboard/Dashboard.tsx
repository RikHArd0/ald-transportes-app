import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [userType, setUserType] = useState<'empresa' | 'motorista' | 'admin' | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function checkUser() {
    const { data: { user: userData } } = await supabase.auth.getUser();

    if (!userData) {
      navigate('/login');
      return;
    }

    setUser(userData);

    // Buscar perfil do usuário
    const { data: profile } = await supabase
      .from('profiles')
      .select('tipo')
      .eq('id', userData.id)
      .single();

    if (profile) {
      setUserType(profile.tipo);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/login');
  }

  if (!user || !userType) {
    return <div>Carregando...</div>;
  }

  return (
    <div style={{ padding: '20px', color: 'var(--text-main)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>ALD Transportes</h1>
        <button
          onClick={handleLogout}
          style={{
            background: '#e93131',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Sair
        </button>
      </div>

      {/* Redirecionar conforme tipo de usuário */}
      {userType === 'empresa' && <DashboardEmpresa />}
      {userType === 'motorista' && <DashboardMotorista />}
      {userType === 'admin' && <DashboardAdmin />}
    </div>
  );
}

// Dashboard para Empresas
function DashboardEmpresa() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Painel da Empresa</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <button
          onClick={() => navigate('/nova-solicitacao')}
          style={{
            background: 'linear-gradient(90deg, #3fa1ff 10%, #358aff 90%)',
            color: '#fff',
            border: 'none',
            padding: '30px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: '600'
          }}
        >
          Nova Solicitação
        </button>
        <button
          onClick={() => navigate('/solicitacoes-ativas')}
          style={{
            background: 'var(--background-box)',
            color: 'var(--text-main)',
            border: '2px solid #358aff',
            padding: '30px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: '600'
          }}
        >
          Solicitações Ativas
        </button>
        <button
          onClick={() => navigate('/historico')}
          style={{
            background: 'var(--background-box)',
            color: 'var(--text-main)',
            border: '2px solid #358aff',
            padding: '30px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: '600'
          }}
        >
          Histórico
        </button>
        <button
          onClick={() => navigate('/mapa-motoristas')}
          style={{
            background: 'var(--background-box)',
            color: 'var(--text-main)',
            border: '2px solid #4ad491',
            padding: '30px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: '600'
          }}
        >
          Ver Motoristas no Mapa
        </button>
      </div>
    </div>
  );
}

// Dashboard para Motoristas
function DashboardMotorista() {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [chamadosPendentes, setChamadosPendentes] = useState<any>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [meusChamados, setMeusChamados] = useState<any>([]);

  useEffect(() => {
    buscarChamados();
  }, []);

  async function buscarChamados() {
    const { data: { user } } = await supabase.auth.getUser();

    // Buscar chamados pendentes disponíveis
    const { data: pendentes } = await supabase
      .from('chamados')
      .select('*')
      .eq('status', 'pendente')
      .order('createdat', { ascending: false })
      .limit(3);

    if (pendentes) {
      setChamadosPendentes(pendentes);
    }

    // Buscar meus chamados aceitos
    if (user) {
      const { data: aceitos } = await supabase
        .from('chamados')
        .select('*')
        .eq('motoristaid', user.id)
        .in('status', ['aceito', 'emandamento'])
        .order('aceitoem', { ascending: false })
        .limit(3);

      if (aceitos) {
        setMeusChamados(aceitos);
      }
    }
  }

  return (
    <div>
      <h2>Painel do Motorista</h2>

      {/* Cards de Ações Rápidas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px', marginBottom: '30px' }}>
        <button
          onClick={() => navigate('/chamados-disponiveis')}
          style={{
            background: 'linear-gradient(90deg, #4ad491 10%, #2ecc71 90%)',
            color: '#fff',
            border: 'none',
            padding: '30px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: '600'
          }}
        >
          Chamados Disponíveis
          {chamadosPendentes.length > 0 && (
            <div style={{ fontSize: '14px', marginTop: '10px', opacity: 0.9 }}>
              {chamadosPendentes.length} novo{chamadosPendentes.length !== 1 ? 's' : ''}
            </div>
          )}
        </button>
        <button
          onClick={() => navigate('/meus-chamados')}
          style={{
            background: 'var(--background-box)',
            color: 'var(--text-main)',
            border: '2px solid #358aff',
            padding: '30px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: '600'
          }}
        >
          Meus Chamados
          {meusChamados.length > 0 && (
            <div style={{ fontSize: '14px', marginTop: '10px', opacity: 0.7 }}>
              {meusChamados.length} ativo{meusChamados.length !== 1 ? 's' : ''}
            </div>
          )}
        </button>
        <button
          onClick={() => navigate('/minha-localizacao')}
          style={{
            background: 'var(--background-box)',
            color: 'var(--text-main)',
            border: '2px solid #4ad491',
            padding: '30px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: '600'
          }}
        >
          Minha Localização
        </button>
      </div>

      {/* Resumo de Chamados em Andamento */}
      {meusChamados.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h3>Chamados em Andamento ({meusChamados.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {meusChamados.map((chamado: any) => (

              <div
                key={chamado.id}
                style={{
                  background: 'var(--background-box)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '2px solid #FF9800',
                  cursor: 'pointer'
                }}
                onClick={() => navigate(`/chamado/${chamado.id}`)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 10px 0' }}>{chamado.tipoveiculo}</h4>
                    <p style={{ margin: '5px 0' }}><strong>Origem:</strong> {chamado.origem}</p>
                    <p style={{ margin: '5px 0' }}><strong>Destino:</strong> {chamado.destino}</p>
                  </div>
                  <div style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    background: chamado.status === 'aceito' ? '#2196F3' : '#FF9800',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {chamado.status === 'aceito' ? 'Aceito' : 'Em Andamento'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview de Chamados Disponíveis */}
      {chamadosPendentes.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3>Últimos Chamados Disponíveis</h3>
            <button
              onClick={() => navigate('/chamados-disponiveis')}
              style={{
                background: 'transparent',
                color: '#4ad491',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Ver Todos →
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {chamadosPendentes.map((chamado: any) => (

              <div
                key={chamado.id}
                style={{
                  background: 'var(--background-box)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '2px solid #4ad491'
                }}
              >
                <h4>🆕 NOVO CHAMADO</h4>
                <p><strong>Origem:</strong> {chamado.origem}</p>
                <p><strong>Destino:</strong> {chamado.destino}</p>
                <p><strong>Veículo:</strong> {chamado.tipoveiculo}</p>
                <button
                  onClick={() => navigate('/chamados-disponiveis')}
                  style={{
                    marginTop: '15px',
                    background: '#4ad491',
                    color: '#fff',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '16px',
                    width: '100%'
                  }}
                >
                  VER DETALHES
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {chamadosPendentes.length === 0 && meusChamados.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
          <p style={{ fontSize: '18px' }}>Nenhum chamado disponível no momento</p>
          <p style={{ fontSize: '14px', marginTop: '10px' }}>Verifique novamente mais tarde</p>
        </div>
      )}
    </div>
  );
}

// Dashboard Admin
function DashboardAdmin() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ ativas: 0, concluidas: 0, motoristas: 0 });

  useEffect(() => {
    buscarEstatisticas();
  }, []);

  async function buscarEstatisticas() {
    const { data: ativas } = await supabase
      .from('chamados')
      .select('id', { count: 'exact' })
      .in('status', ['pendente', 'aceito']);

    const { data: concluidas } = await supabase
      .from('chamados')
      .select('id', { count: 'exact' })
      .eq('status', 'concluido');

    const { data: motoristas } = await supabase
      .from('motoristas')
      .select('id', { count: 'exact' });

    setStats({
      ativas: ativas?.length || 0,
      concluidas: concluidas?.length || 0,
      motoristas: motoristas?.length || 0
    });
  }
  return (
    <div>
      <h2>Dashboard Administrativo</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <div style={{ background: 'var(--background-box)', padding: '30px', borderRadius: '12px', textAlign: 'center' }}>
          <h1 style={{ margin: '0', fontSize: '48px', color: '#358aff' }}>{stats.ativas}</h1>
          <p>Solicitações Ativas</p>
        </div>
        <div style={{ background: 'var(--background-box)', padding: '30px', borderRadius: '12px', textAlign: 'center' }}>
          <h1 style={{ margin: '0', fontSize: '48px', color: '#4ad491' }}>{stats.concluidas}</h1>
          <p>Solicitações Concluídas</p>
        </div>
        <div style={{ background: 'var(--background-box)', padding: '30px', borderRadius: '12px', textAlign: 'center' }}>
          <h1 style={{ margin: '0', fontSize: '48px', color: '#FF9800' }}>{stats.motoristas}</h1>
          <p>Motoristas Ativos</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '30px' }}>
        <button
          onClick={() => navigate('/admin/usuarios')}
          style={{
            background: 'linear-gradient(90deg, #3fa1ff 10%, #358aff 90%)',
            color: '#fff',
            border: 'none',
            padding: '30px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: '600'
          }}
        >
          Gerenciar Usuários
        </button>
        <button
          onClick={() => navigate('/admin/motoristas')}
          style={{
            background: 'var(--background-box)',
            color: 'var(--text-main)',
            border: '2px solid #358aff',
            padding: '30px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: '600'
          }}
        >
          Gerenciar Motoristas
        </button>
        <button
          onClick={() => navigate('/admin/solicitacoes')}
          style={{
            background: 'var(--background-box)',
            color: 'var(--text-main)',
            border: '2px solid #358aff',
            padding: '30px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: '600'
          }}
        >
          Ver Todas Solicitações
        </button>
        <button
          onClick={() => navigate('/admin/relatorios')}
          style={{
            background: 'var(--background-box)',
            color: 'var(--text-main)',
            border: '2px solid #4ad491',
            padding: '30px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: '600'
          }}
        >
          Relatórios
        </button>
      </div>
    </div>
  );
}

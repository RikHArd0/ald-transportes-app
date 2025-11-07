import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Cadastro from './pages/Auth/Cadastro';
import DashboardHome from './pages/Dashboard/Dashboard';
import PainelAdmin from './pages/Admin/PainelAdmin';
import NotFound from './pages/NotFound';
import Header from './components/common/Header';
import SolicitacoesAtivas from './pages/Empresa/SolicitacoesAtivas';
import ChamadosDisponiveis from './pages/ChamadosDisponiveis/ChamadosDisponiveis';
import MeusChamados from './pages/MeusChamados/MeusChamados';
import DetalhesChamado from './pages/DetalhesChamado/DetalhesChamado';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/admin" element={<PainelAdmin />} />
        <Route path="/solicitacoes-ativas" element={<SolicitacoesAtivas />} />
        <Route path="/chamados-disponiveis" element={<ChamadosDisponiveis />} />
        <Route path="/meus-chamados" element={<MeusChamados />} />
        <Route path="/chamado/:id" element={<DetalhesChamado />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

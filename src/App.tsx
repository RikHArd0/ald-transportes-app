import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Cadastro from "./pages/Auth/Cadastro";
import DashboardHome from "./pages/Dashboard/Home";
import PainelAdmin from "./pages/Admin/PainelAdmin";
import NotFound from "./pages/NotFound";
import Header from "./components/common/Header";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/admin" element={<PainelAdmin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

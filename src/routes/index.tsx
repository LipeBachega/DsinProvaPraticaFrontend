import { BrowserRouter, Routes, Route } from "react-router-dom";
import Appointments from "../pages/appointments";
import Home from "../pages/home";
import Login from "../pages/login";
import SignUp from "../pages/singup";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* O login é a porta de entrada do fluxo. */}
        <Route path="/" element={<Login />} />
        {/* Home concentra o caso principal do desafio: criar agendamento. */}
        <Route path="/home" element={<Home />} />
        {/* Histórico separado para manter a home mais objetiva. */}
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Appointments from "../pages/appointments";
import Home from "../pages/home";
import Login from "../pages/login";
import SignUp from "../pages/singup";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

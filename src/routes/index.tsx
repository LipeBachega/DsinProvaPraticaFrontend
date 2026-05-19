import { BrowserRouter, Route, Routes } from "react-router-dom";
import Appointments from "../pages/appointments";
import AppointmentDetails from "../pages/details";
import Home from "../pages/home";
import Login from "../pages/login";
import SignUp from "../pages/singup";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route
            path="/appointments/:appointmentId/detalhes"
            element={<AppointmentDetails />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

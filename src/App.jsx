import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import Kanban from "./pages/kanban/Kanban";

import MeasurementForm from "./components/measurement/MeasurementForm";
import WorksPage from "./pages/works/WorksPage";
import AddressesPage from "./pages/addresses/AddressesPage";

import PrivateRoute from "./components/PrivateRoute";

import SignIn from "./pages/auth/sign-in";
import Logout from "./pages/auth/logout";



function App() {
  return (
    <Routes>
      <Route path="/login" element={<SignIn />} />
      <Route path="/logout" element={<Logout />} />
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/kanban/*" element={<Kanban />} />
        <Route path="/measurement/*" element={<MeasurementForm />} />
        <Route path="/work/*" element={<WorksPage />} />
        <Route path="/addresses/*" element={<AddressesPage />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      </Route>
      <Route path="*" element={<div>404 - Página não encontrada</div>} />
    </Routes>
  );
}

export default App;

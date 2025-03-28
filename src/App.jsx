import { Route, Routes } from "react-router-dom";
import PaginaInicio from "./pages/paginaInicio";
import Ventas from "./pages/Ventas";

import AñadirProducto from "./pages/AñadirProducto";

import DatosClientes from "./pages/DatosClientes";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import CustomerEditForm from "./pages/CustomerEditForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PaginaInicio />} />
      <Route path="/ventas" element={<Ventas />} />
      <Route path="/DatosClientes" element={<DatosClientes />} />
      <Route path="/AñadirProducto" element={<AñadirProducto />} />
      <Route path="/clientes" element={<Clientes />} />
      <Route path="/customerEditForm" element={<CustomerEditForm />} />
      <Route path="/dashboard" element={<Dashboard/>} />
    </Routes>
  );
}

export default App;

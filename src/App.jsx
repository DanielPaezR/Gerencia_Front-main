import { Route, Routes } from "react-router-dom";
import PaginaInicio from "./pages/paginaInicio";
import Ventas from "./pages/Ventas";
import AñadirCliente from "./pages/AñadirProducto";
import Clientes from "./pages/Clientes";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PaginaInicio />} />
      <Route path="/ventas" element={<Ventas />} />
      <Route path="/añadir-cliente" element={<AñadirCliente />} />
      <Route path="/clientes" element={<Clientes />} />
    </Routes>
  );
}

export default App;

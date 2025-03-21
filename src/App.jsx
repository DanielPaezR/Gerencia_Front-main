import { Route, Routes } from "react-router-dom";
import PaginaInicio from "./pages/paginaInicio";
import Ventas from "./pages/Ventas";
import DatosClientes from "./pages/DatosClientes";
import AñadirProducto from "./pages/AñadirProducto";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PaginaInicio />} />
      <Route path="/ventas" element={<Ventas />} />
      <Route path="/DatosClientes" element={<DatosClientes />} />
      <Route path="/AñadirProducto" element={<AñadirProducto />} />
    </Routes>
  );
}

export default App;

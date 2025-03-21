import { Route, Routes } from "react-router-dom";
import PaginaInicio from "./pages/paginaInicio";
import Ventas from "./pages/Ventas";
<<<<<<< HEAD
import DatosClientes from "./pages/DatosClientes";
import AñadirProducto from "./pages/AñadirProducto";
=======
import AñadirCliente from "./pages/AñadirProducto";
import Clientes from "./pages/Clientes";
>>>>>>> 759bd5b2e2570a391a7d65b1545a880850484a00

function App() {
  return (
    <Routes>
      <Route path="/" element={<PaginaInicio />} />
      <Route path="/ventas" element={<Ventas />} />
<<<<<<< HEAD
      <Route path="/DatosClientes" element={<DatosClientes />} />
      <Route path="/AñadirProducto" element={<AñadirProducto />} />
=======
      <Route path="/añadir-cliente" element={<AñadirCliente />} />
      <Route path="/clientes" element={<Clientes />} />
>>>>>>> 759bd5b2e2570a391a7d65b1545a880850484a00
    </Routes>
  );
}

export default App;

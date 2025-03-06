import { Route, Routes } from "react-router-dom";
import PaginaInicio from "./pages/paginaInicio";
import Ventas from "./pages/Ventas";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PaginaInicio />} />
      <Route path="/ventas" element={<Ventas />} />
    </Routes>
  );
}

export default App;

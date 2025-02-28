import './App.css'
import {Route, Routes} from "react-router-dom";
import PaginaIniciar from './components/PaginaIniciar';
import PaginaGoogle from './pages/RegisterGoogle';
import PaginaFacebook from './pages/RegisterFacebook';

function App() {
  return (
    <Routes>
      <Route path="/" element={<PaginaIniciar />} />
      <Route path="/paginaGoogle" element={<PaginaGoogle />} />
      <Route path="/paginaFacebook" element={<PaginaFacebook />} />
    </Routes>
  )
}

export default App;

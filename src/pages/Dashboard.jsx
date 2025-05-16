import React from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell,
  Legend, ResponsiveContainer
} from 'recharts';
import logo from "../assets/Logo G.png";
import '../styles/Dashboard.css';
import { useNavigate } from 'react-router-dom';

const dataSales = [
  { month: 'Enero', sales: 42000 },
  { month: 'Febrero', sales: 39500 },
  { month: 'Marzo', sales: 46800 },
  { month: 'Abril', sales: 51000 },
  { month: 'Mayo', sales: 48750 },
  { month: 'Junio', sales: 52500 },
];

const dataTopProducts = [
  { name: 'Mountain-100 Silver, 44', quantity: 1890 },
  { name: 'Road-150 Red, 52', quantity: 1705 },
  { name: 'HL Road Tire', quantity: 1523 },
  { name: 'Sport-100 Helmet, Red', quantity: 1400 },
  { name: 'AWC Logo Cap', quantity: 1350 },
];

const dataCategories = [
  { name: 'Bicicletas', value: 83000 },
  { name: 'Componentes', value: 45000 },
  { name: 'Ropa', value: 22500 },
  { name: 'Accesorios', value: 12000 },
];

const dataTopClients = [
  { name: 'John Smith', purchases: 15400 },
  { name: 'Emily Davis', purchases: 13900 },
  { name: 'Michael Johnson', purchases: 12800 },
  { name: 'Sarah Wilson', purchases: 11500 },
  { name: 'David Lee', purchases: 9900 },
];

const dataShippingTime = [
  { month: 'Enero', time: 2.5 },
  { month: 'Febrero', time: 3.1 },
  { month: 'Marzo', time: 2.8 },
  { month: 'Abril', time: 2.2 },
  { month: 'Mayo', time: 2.9 },
  { month: 'Junio', time: 2.6 },
];

const COLORS = ['#646cff', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/ventas");
  };

  return (
    <div className="dashboard-container">
      <aside className="left-sidebar-dashboard">
        <img src={logo} alt="Logo" className="logo" />
        <button className='button-return' onClick={handleBack}>Volver</button>
      </aside>

      <div className="dashboard-content">
        <p className="dashboard-main-title">📊Estadísticas📊</p>

        {/* Ventas Totales por Mes */}
        <div className="chart-container">
          <h2 className="chart-title">Ventas Totales por Mes (USD)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dataSales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#646cff" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Productos Más Vendidos */}
        <div className="chart-container">
          <h2 className="chart-title">Top 5 Productos Más Vendidos (Unidades)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataTopProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="quantity" fill="#00C49F" barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Ventas por Categoría */}
        <div className="chart-container">
          <h2 className="chart-title">Distribución de Ventas por Categoría (USD)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={dataCategories} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {dataCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Clientes con Mayor Volumen de Compra */}
        <div className="chart-container">
          <h2 className="chart-title">Top Clientes por Volumen de Compra (USD)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataTopClients} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="purchases" fill="#FF8042" barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tiempo Promedio de Envío por Mes */}
        <div className="chart-container">
          <h2 className="chart-title">Tiempo Promedio de Envío por Mes (días)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dataShippingTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="time" stroke="#FF0000" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

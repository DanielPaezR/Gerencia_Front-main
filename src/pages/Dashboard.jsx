import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell,
  Legend, ResponsiveContainer
} from 'recharts';
import logo from "../assets/Logo G.png";
import '../styles/Dashboard.css';
import { useNavigate } from 'react-router-dom';

const dataSales = [
  { month: 'Enero', sales: 4000 },
  { month: 'Febrero', sales: 3000 },
  { month: 'Marzo', sales: 5000 },
  { month: 'Abril', sales: 4000 },
];

const dataTopProducts = [
  { name: 'Producto A', quantity: 2400 },
  { name: 'Producto B', quantity: 4567 },
  { name: 'Producto C', quantity: 1398 },
  { name: 'Producto D', quantity: 9800 },
];

const dataCategories = [
  { name: 'Calzado', value: 400 },
  { name: 'Camisetas', value: 300 },
  { name: 'Accesorios', value: 300 },
];

const dataTopClients = [
  { name: 'Cliente A', purchases: 5000 },
  { name: 'Cliente B', purchases: 3000 },
  { name: 'Cliente C', purchases: 2000 },
];

const dataShippingTime = [
  { month: 'Enero', time: 2 },
  { month: 'Febrero', time: 3 },
  { month: 'Marzo', time: 1.5 },
  { month: 'Abril', time: 2.5 },
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

        {/* 🔥 Se agregó nuevamente el título del Dashboard */}
        <p className="dashboard-main-title">📊 Dashboard de Ventas 📊</p>

        <div className="dashboard-section">
          <h2 className="dashboard-title">🚴‍♂️ Ventas de Bicicletas 🚴‍♀️</h2>
          <p>Encuentra la bicicleta y accesorios perfectos para tus aventuras sobre ruedas.</p>
        </div>

        {/* Ventas Totales por Mes */}
        <div className="chart-container">
          <h2 className="chart-title">Ventas Totales por Mes</h2>
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
          <h2 className="chart-title">Top Productos Más Vendidos</h2>
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
          <h2 className="chart-title">Ventas por Categoría</h2>
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
          <h2 className="chart-title">Clientes con Mayor Volumen de Compra</h2>
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
          <h2 className="chart-title">Tiempo Promedio de Envío por Mes</h2>
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

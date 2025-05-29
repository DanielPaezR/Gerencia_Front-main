import React from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell,
  Legend, ResponsiveContainer
} from 'recharts';
import logo from "../assets/Logo G.png";
import '../styles/Dashboard.css';
import { useNavigate } from 'react-router-dom';

/*const dataSales = [
  { month: 'Enero', sales: 42000 },
  { month: 'Febrero', sales: 39500 },
  { month: 'Marzo', sales: 46800 },
  { month: 'Abril', sales: 51000 },
  { month: 'Mayo', sales: 48750 },
  { month: 'Junio', sales: 52500 },
];*/

/*const dataTopProducts = [
  { name: 'Mountain-100 Silver, 44', quantity: 1890 },
  { name: 'Road-150 Red, 52', quantity: 1705 },
  { name: 'HL Road Tire', quantity: 1523 },
  { name: 'Sport-100 Helmet, Red', quantity: 1400 },
  { name: 'AWC Logo Cap', quantity: 1350 },
];*/

/*const dataCategories = [
  { name: 'Bicicletas', value: 83000 },
  { name: 'Componentes', value: 45000 },
  { name: 'Ropa', value: 22500 },
  { name: 'Accesorios', value: 12000 },
];*/

/*const dataShippingTime = [
  { month: 'Enero', time: 2.5 },
  { month: 'Febrero', time: 3.1 },
  { month: 'Marzo', time: 2.8 },
  { month: 'Abril', time: 2.2 },
  { month: 'Mayo', time: 2.9 },
  { month: 'Junio', time: 2.6 },
];*/

const COLORS = ['#646cff', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/ventas");
  };

  const [dataSales, setDataSales] = React.useState([]);

  const monthNames = [
    '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  React.useEffect(() => {
    fetch("http://localhost:3000/api/salesorderheader/monthly") 
      .then(res => res.json())
      .then(json => {
        const result = json.result;
        const mapped = result.map(item => ({
          month: `${monthNames[item.Month]} ${item.Year}`,
          sales: Number(item.TotalSales)
        }));
        setDataSales(mapped);
      })
      .catch(error => {
        console.error("❌ Error al obtener ventas mensuales:", error);
      });
  }, []);

const [dataTopProducts, setDataTopProducts] = React.useState([]);

React.useEffect(() => {
  fetch("http://localhost:3000/api/salesOrderDetail/top-products") 
    .then(res => res.json())
    .then(json => {
      const result = json.result;
      const mapped = result.map(item => ({
        name: item.ProductName,
        quantity: Number(item.TotalQuantity)
      }));
      setDataTopProducts(mapped);
    })
    .catch(error => {
      console.error("❌ Error al obtener productos más vendidos:", error);
    });
}, []);

const [dataCategories, setDataCategories] = React.useState([]);

React.useEffect(() => {
  fetch("http://localhost:3000/api/salesorderheader/by-category")
    .then(res => res.json())
    .then(json => {
      const result = json.result;
      const mapped = result.map(item => ({
        name: item.ProductCategory,
        value: Number(item.TotalSales)
      }));
      setDataCategories(mapped);
    })
    .catch(error => {
      console.error("❌ Error al obtener ventas por categoría:", error);
    });
}, []);

const [topSalesMonth, setTopSalesMonth] = React.useState(null);

React.useEffect(() => {
  fetch("http://localhost:3000/api/top-sales-month")
    .then(res => res.json())
    .then(json => setTopSalesMonth(json.result))
    .catch(error => {
      console.error("❌ Error al obtener el mes con más ventas:", error);
    });
}, []);

const [avgShippingTime, setAvgShippingTime] = React.useState(null);

React.useEffect(() => {
  fetch("http://localhost:3000/api/average-shipping-time")
    .then(res => res.json())
    .then(json => setAvgShippingTime(Number(json.result)))
    .catch(err => {
      console.error("❌ Error al obtener tiempo promedio de envío:", err);
    });
}, []);

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
          <h2 className="chart-title">Productos Más Vendidos (Unidades)</h2>
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

        {/* Mes con más ventas */}
        <div className="chart-container">
          <h2 className="chart-title">📅 Mes con Más Ventas</h2>
          <div style={{ fontSize: "2rem", textAlign: "center", color: "#FFBB28", fontWeight: "bold", marginTop: "1rem" }}>
            {topSalesMonth 
              ? `${topSalesMonth.MonthName} ${topSalesMonth.Year} - $${Number(topSalesMonth.TotalSales).toLocaleString()}`
              : "Cargando..."}
          </div>

        {/* Tiempo Promedio de Envío por Mes */}
        <div className="chart-container">
            <h2 className="chart-title">⏱️ Tiempo Promedio de Envío</h2>
            <div style={{ fontSize: "2.5rem", textAlign: "center", color: "#646cff", fontWeight: "bold", marginTop: "1rem" }}>
              {avgShippingTime !== null ? `${avgShippingTime.toFixed(2)} días` : "Cargando..."}
            </div>
          </div>
        </div>
    </div>
  </div>
  );
};

export default Dashboard;

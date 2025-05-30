import React from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell,
  Legend, ResponsiveContainer
} from 'recharts';

import logo from "../assets/Logo G.png";
import '../styles/Dashboard.css';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#646cff', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/ventas");
  };

  const [dataSales, setDataSales] = React.useState([]);
  const [pieData, setPieData] = React.useState([]);

  const monthNames = [
    '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  React.useEffect(() => {
    fetch("http://localhost:3000/api/salesorderheader/monthly")
      .then(res => res.json())
      .then(json => {
        const result = json.result;
        if (result.length > 0) {
          const item = result[0];
          setDataSales([{
            month: `${monthNames[item.Month]} ${item.Year}`,
            sales: Number(item.TotalSales)
          }]);

          setPieData([
            { name: 'Subtotal', value: item.SubTotalSales },
            { name: 'Impuestos', value: item.TotalTax },
            { name: 'Flete', value: item.TotalFreight }
          ]);
        }
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

        const sorted = result
          .map(item => ({
            name: item.ProductCategory,
            value: Number(item.TotalSales)
          }))
          .sort((a, b) => b.value - a.value);

        const topCategories = sorted.slice(0, 9);
        const otherTotal = sorted.slice(9).reduce((acc, curr) => acc + curr.value, 0);

        const finalData = otherTotal > 0
          ? [...topCategories, { name: "Otros", value: otherTotal }]
          : topCategories;

        setDataCategories(finalData);
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

        {/* Distribución de ingresos y gastos en el mes */}
        {pieData.length > 0 && (  
          <div className="chart-container">
            <h2 className="chart-title">Distribución de Capital – {dataSales[0].month}</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={['#8884d8', '#82ca9d', '#ffc658'][index % 3]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Top Productos Más Vendidos */}
        <div className="chart-container">
          <h2 className="chart-title">Productos Más Vendidos (Unidades)</h2>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={dataTopProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={0} tick={false} />
              <Tooltip
                formatter={(value, name, props) => [`${value} unidades`, 'Cantidad']}
                labelFormatter={(label) => `Producto: ${label}`}
              />
              <Bar dataKey="quantity" barSize={30}>
                {dataTopProducts.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={['#00C49F', '#FFBB28', '#FF8042'][index % 3]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

        </div>

        {/* Ventas por Categoría */}
        <div className="chart-container">
          <h2 className="chart-title">Distribución de Ventas por Categoría (USD)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dataCategories}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={false}
              >
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
          {topSalesMonth ? (
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#FFBB28" }}>
                {monthNames[topSalesMonth.Month]} {topSalesMonth.Year}
              </div>
              <div style={{ fontSize: "1.5rem", marginTop: "0.5rem", color: "#4CAF50" }}>
                Ventas: {Number(topSalesMonth.TotalSales).toLocaleString("es-CO", {
                  style: "currency",
                  currency: "COP",
                  maximumFractionDigits: 0
                })}
              </div>
              <div style={{ fontSize: "1.2rem", marginTop: "0.3rem", color: "#888" }}>
                Órdenes generadas: {topSalesMonth.TotalOrders}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", marginTop: "1rem" }}>Cargando...</div>
          )}
        </div>

        {/* Tiempo Promedio de Envío por Mes */}
        <div className="chart-container">
          <h2 className="chart-title">⏱ Tiempo Promedio de Envío por mes</h2>
          <div style={{
            fontSize: "2.5rem",
            textAlign: "center",
            color: "#646cff",
            fontWeight: "bold",
            marginTop: "1rem"
          }}>
            {avgShippingTime !== null ? `${avgShippingTime.toFixed(2)} días` : "Cargando..."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

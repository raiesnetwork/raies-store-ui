import React, { useEffect, useState } from "react";
import "../Helpers/scss/dadhBoard.scss";
import useMystoreStore from "../Core/Store";
import { getSubdomain } from "../../../Utils/Subdomain";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const { hostname } = window.location;
let subdomain = getSubdomain(hostname);

const StatisticsComponent: React.FC<{ stats: any }> = ({ stats }) => {
  return (
    <div className="statistics-container">
      <div className="stat-card">
        <h4>Total Inventory</h4>
        <p>{stats.totalInventory || 0}</p>
      </div>
      <div className="stat-card">
        <h4>Total Quantity</h4>
        <p>{stats.totalQuantity || 0}</p>
      </div>
      {/* <div className="stat-card">
        <h4>Total Revenue</h4>
        <p>₹{stats.totalRevenue || 0}</p>
      </div> */}
      <div className="stat-card">
        <h4>Pending Payments</h4>
        <p>₹{stats.pendingPayments || 0}</p>
      </div>
    </div>
  );
};

const DealerDashboard: React.FC = () => {
  const { getInventory } = useMystoreStore((state) => state);
//   const [inventory, setInventory] = useState<any>([]);
  const [stats, setStats] = useState({
    totalInventory: 0,
    totalQuantity: 0,
    totalRevenue: 0,
    pendingPayments: 0,
  });
  const [loading, setLoading] = useState<boolean>(false); // Loader state

  useEffect(() => {
    const fetchInventoryData = async () => {
      setLoading(true); // Show loader
      try {
        const { data } = await getInventory(subdomain);
        // setInventory(data?.storeOrders || []);
        calculateStats(data?.storeOrders || []);
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      } finally {
        setLoading(false); // Hide loader
      }
    };

    if (subdomain) {
      fetchInventoryData();
    }
  }, [subdomain]);

  const calculateStats = (orders: any[]) => {
    let totalInventory = 0;
    let totalQuantity = 0;
    let totalRevenue = 0;
    let pendingPayments = 0;

    orders.forEach((order) => {
      totalInventory++;
      order.productDetails.forEach((product: any) => {
        totalQuantity += product.quantity;
        totalRevenue += product.price * product.quantity;
      });

      if (order.paymentStatus !== "Paid") {
        pendingPayments += order.totalAmount;
      }
    });

    setStats({
      totalInventory,
      totalQuantity,
      totalRevenue,
      pendingPayments,
    });
  };

  // Bar chart data
  const barData = {
    labels: ["Total Inventory", "Total Quantity",  "Pending Payments"],
    datasets: [
      {
        label: "Statistics",
        data: [
          stats.totalInventory,
          stats.totalQuantity,
        //   stats.totalRevenue,
          stats.pendingPayments,
        ],
        backgroundColor: ["#4CAF50", "#FF9800",  "#F44336"],
        hoverBackgroundColor: ["#45A049", "#FFB74D",  "#E57373"],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Categories",
          font: {
            size: 14,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Values",
          font: {
            size: 14,
          },
        },
        ticks: {
          stepSize: 0, // Adjust based on your data
        },
      },
    },
  };

  return (
    <div className="dealer-dashboard">
      <header className="dashboard-header">
        <h1>Dealer Dashboard</h1>
        <p>Welcome to your dashboard! Here’s an overview of your inventory and performance.</p>
      </header>

      {loading ? (
        <div className="loader-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <section className="statistics-section">
            <StatisticsComponent stats={stats} />
          </section>

          <section className="inventory-section">
            <h2>Graph View</h2>
            <div className="bar-chart-container" style={{ height: "400px" }}>
              <Bar data={barData} options={barOptions} />
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default DealerDashboard;

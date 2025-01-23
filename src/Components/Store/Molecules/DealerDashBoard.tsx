import React, { useEffect, useState } from "react";
import "../Helpers/scss/dadhBoard.scss"; 
import useMystoreStore from "../Core/Store";
import { getSubdomain } from "../../../Utils/Subdomain";

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
      <div className="stat-card">
        <h4>Total Revenue</h4>
        <p>₹{stats.totalRevenue || 0}</p>
      </div>
      <div className="stat-card">
        <h4>Pending Payments</h4>
        <p>₹{stats.pendingPayments || 0}</p>
      </div>
    </div>
  );
};

const DealerDashboard: React.FC = () => {
  const { getInventory } = useMystoreStore((state) => state);
  const [inventory, setInventory] = useState<any>([]);
  const [stats, setStats] = useState({
    totalInventory: 0,
    totalQuantity: 0,
    totalRevenue: 0,
    pendingPayments: 0,
  });

  useEffect(() => {
    const fetchInventoryData = async () => {
      const { data } = await getInventory(subdomain);
      setInventory(data?.storeOrders || []);
      calculateStats(data?.storeOrders || []);
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

  return (
    <div className="dealer-dashboard">
      <header className="dashboard-header">
        <h1>Dealer Dashboard</h1>
        <p>Welcome to your dashboard! Here’s an overview of your inventory and performance.</p>
      </header>

      <section className="statistics-section">
        <StatisticsComponent stats={stats} />
      </section>

      <section className="inventory-section">
        <h2>Graph view</h2>
      </section>
    </div>
  );
};

export default DealerDashboard;

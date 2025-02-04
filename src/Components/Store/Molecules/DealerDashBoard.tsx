import React, { useEffect, useState } from "react";
import "../Helpers/scss/dadhBoard.scss";
import useMystoreStore from "../Core/Store";
import { getSubdomain } from "../../../Utils/Subdomain";
import { Doughnut } from "react-chartjs-2";
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
        <p>₹{(stats.pendingPayments || 0).toFixed(3)}</p>

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
  const [stockRequests,setStockRequest]=useState({
     totalOrders : 0,
     approvedOrders : 0,
     pendingOrders : 0,
     rejectedOrders : 0,

     totalAmount : 0,
     pendingAmount : 0,
     dueAmount : 0,
     paidAmount:0
  })
  const [loading, setLoading] = useState<boolean>(false); // Loader state

  useEffect(() => {
    const fetchInventoryData = async () => {
      setLoading(true); // Show loader
      try {
        const { data } = await getInventory(subdomain);

        // setInventory(data?.storeOrders || []);
        calculateStats(data?.storeOrders || []);
        // const stockRequest=data?.storeOrders.filter((val:any)=>val.type==='business')
        StockRequestcalculateStats(data.dealerRequests)
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

    orders?.forEach((order) => {
      totalInventory++;
      order?.productDetails?.forEach((product: any) => {
        totalQuantity += parseInt(product.quantity);
        totalRevenue += parseInt(product.price) * parseInt(product.quantity);
      });
      if(order.status!=='Delivered'){

        if (order?.paymentMethod !== "online") {
          pendingPayments += order.totalAmount;
        }
      }
    });

    setStats({
      totalInventory,
      totalQuantity,
      totalRevenue,
      pendingPayments,
    });
  };const StockRequestcalculateStats = (dealerRequests: any[]) => {
    console.log(dealerRequests)
    let totalOrders = 0;
    let approvedOrders = 0;
    let pendingOrders = 0;
    let rejectedOrders = 0;

    let totalAmount = 0;
    let pendingAmount = 0;
    let dueAmount = 0;
    let paidAmount=0

    dealerRequests?.forEach((order) => {
      totalOrders++;
      if(order?.orderId){

        totalAmount+=parseFloat(order?.orderId?.totalAmount)
      }
      
      if(order?.status==="Accepted"){
        approvedOrders++
        if(order?.adwancePaymentMode|| order?.orderId?.status==='Delivered'){
          if(order?.orderId){
          paidAmount+=order?.orderId?.totalAmount
          }
        }
        if(!order?.adwancePaymentMode|| order?.orderId?.status!=='Delivered'){
          if(order?.orderId){
          dueAmount+=order?.orderId?.totalAmount
          }
        }
      }
      if(order?.status==="Rejected"){
        rejectedOrders++
        pendingAmount+=parseInt(order?.stock) * order?.productId?.price

      }
      if(order?.status==="Requested"){
        pendingOrders++
      }
      
    });

    setStockRequest({
      totalOrders ,
      approvedOrders ,
      pendingOrders ,
      rejectedOrders ,
 
      totalAmount ,
      pendingAmount ,
      dueAmount ,
      paidAmount
    });
  };

  // Bar chart data
  const barData = {
    labels: ["Total Orders",  "Approved","Rejected" ,"Pending"],
    datasets: [
      {
        label: "Statistics",
        data: [
          stockRequests.totalOrders,
          
        
          stockRequests.approvedOrders,
          stockRequests.rejectedOrders,
          stockRequests.pendingOrders
        ],
        backgroundColor: ["#FF9800","#4CAF50",   "#F44336",'yellow'],
        hoverBackgroundColor: ["#FF9800","#4CAF50",   "#F44336",'yellow'],
        // borderWidth: 1,
      },
    ],
  }; const barDataP = {
    labels: ["Total Amount",  "Paid","Due" ,"N/A"],
    datasets: [
      {
        label: "Statistics",
        data: [
          stockRequests.totalAmount,
          stockRequests.paidAmount,
        
          stockRequests.dueAmount,
          stockRequests.pendingAmount,
        ],
        backgroundColor: ["#FF9800","#4CAF50",   "#F44336",'yellow'],
        hoverBackgroundColor: ["#FF9800","#4CAF50",   "#F44336",'yellow'],
        // borderWidth: 1,
      },
    ],
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
            <div className='statistics-section-main'>

          <section >
            <h2>Stock Requests Orders</h2>
            <div >
              <Doughnut data={barData}  />
            </div>
          </section>
          <section >
            <h2>Stock Requests Payments</h2>
            <div  >
              <Doughnut data={barDataP}  />
            </div>
          </section>
            </div>
        </>
      )}
    </div>
  );
};

export default DealerDashboard;

import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import "firebase/firestore";
import SideBar from "./components/SideBar";
import { firestore } from "../firebase";
import "./css/Dashboard.css"; // Import your custom CSS file
import { Chart } from "chart.js/auto";

function Dashboard() {
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [bmiStats, setBmiStats] = useState({ average: 0, max: 0, min: 0 });
  const [userDataReady, setUserDataReady] = useState(false);
  const [monthlyOrderData, setMonthlyOrderData] = useState(null); // Add state for monthly order data

  useEffect(() => {
    // Fetch total orders
    const fetchTotalOrders = async () => {
      try {
        const ordersCollection = collection(firestore, "orders");
        const ordersData = await getDocs(ordersCollection);
        setTotalOrders(ordersData.size);
      } catch (error) {
        console.error("Error fetching total orders:", error);
      }
    };

    // Fetch total users
    const fetchTotalUsers = async () => {
      try {
        const usersCollection = collection(firestore, "users");
        const usersData = await getDocs(usersCollection);
        setTotalUsers(usersData.size);
        setUserDataReady(true); // Mark user data as ready
      } catch (error) {
        console.error("Error fetching total users:", error);
      }
    };

    // Fetch total sales - you need to fetch and calculate this separately
    const calculateTotalSales = async () => {
      try {
        const ordersCollection = collection(firestore, "orders");
        const ordersData = await getDocs(ordersCollection);

        // Sum up the totalPrice for each order
        let totalSales = 0;
        ordersData.forEach((doc) => {
          const orderData = doc.data();
          totalSales += orderData.totalPrice;
        });

        setTotalSales(totalSales);
      } catch (error) {
        console.error("Error calculating total sales:", error);
      }
    };

    // Fetch and calculate monthly order data
    const fetchMonthlyOrderData = async () => {
      try {
        const ordersCollection = collection(firestore, "orders");
        const ordersData = await getDocs(ordersCollection);

        const monthlyOrders = new Array(12).fill(0); // Initialize an array for 12 months with 0 orders

        ordersData.forEach((doc) => {
          const orderData = doc.data();
          const orderTimestamp = orderData.orderDate;

          if (orderTimestamp) {
            const orderMonth = orderTimestamp.toDate().getMonth(); // Extract the month
            monthlyOrders[orderMonth]++;
          }
        });

        setMonthlyOrderData(monthlyOrders);
      } catch (error) {
        console.error("Error fetching monthly order data:", error);
      }
    };

    fetchTotalOrders();
    fetchTotalUsers();
    calculateTotalSales();
    fetchMonthlyOrderData(); // Fetch monthly order data
  }, []);

  // Calculate BMI statistics only when user data is ready
  useEffect(() => {
    if (userDataReady) {
      const usersCollection = collection(firestore, "users");
      getDocs(usersCollection)
        .then((usersData) => {
          let totalBmi = 0;
          let maxBmi = -Infinity;
          let minBmi = Infinity;

          usersData.forEach((doc) => {
            const userData = doc.data();
            const bmi = calculateBMI(userData.height, userData.weight);
            totalBmi += bmi;
            maxBmi = Math.max(maxBmi, bmi);
            minBmi = Math.min(minBmi, bmi);
          });

          const averageBmi = usersData.size > 0 ? totalBmi / usersData.size : 0;

          setBmiStats({ average: averageBmi, max: maxBmi, min: minBmi });
        })
        .catch((error) => {
          console.error("Error calculating BMI statistics:", error);
        });
    }
  }, [userDataReady]);

  // Function to calculate BMI
  const calculateBMI = (height, weight) => {
    return (weight / (height * height)) * 10000;
  };

  // Render the chart
  useEffect(() => {
    if (monthlyOrderData) {
      const ctx = document
        .getElementById("monthlyOrdersChart")
        .getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          datasets: [
            {
              label: "Orders",
              data: monthlyOrderData,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [monthlyOrderData]);

  return (
    <div>
      <SideBar>
        <div className="dashboard-container">
          <div className="dashboard-item">
            <i className="fas fa-shopping-cart icon"></i>
            <h2>Total Orders</h2>
            <p>{totalOrders}</p>
          </div>
          <div className="dashboard-item">
            <i className="fas fa-dollar-sign icon"></i>
            <h2>Total Sales</h2>
            <p>${totalSales.toFixed(2)}</p>
          </div>
          <div className="dashboard-item">
            <i className="fas fa-users icon"></i>
            <h2>Total Users Registered</h2>
            <p>{totalUsers}</p>
          </div>
          <div className="dashboard-statistics">
            <h2>User Statistics</h2>
            <div className="bmi-statistics">
              <p>
                Average BMI: {bmiStats.average.toFixed(2)} | Max BMI:{" "}
                {bmiStats.max.toFixed(2)} | Min BMI: {bmiStats.min.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="dashboard-container">
          <div className="dashboard-chart">
            <h2>Monthly Orders</h2>
            <canvas id="monthlyOrdersChart" width="400" height="200" />
          </div>
        </div>
      </SideBar>
    </div>
  );
}

export default Dashboard;

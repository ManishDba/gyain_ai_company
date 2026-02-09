import { useEffect, useState } from "react";
import axios from "../../services/axios";
import endpoint from "../../services/endpoint";

const UseHomeScreenHooks = () => {
  const [dailyData, setDailyData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

    const fetchData = async () => {
      try {
        const [dailyResponse, monthlyResponse, userResponse] = await Promise.all([
          axios.get(endpoint.req_daily()),
          axios.get(endpoint.req_monthly()),
          axios.get(endpoint.user_month_req()),
        ]);

        setDailyData({
          labels: Object.keys(dailyResponse.data.daily_counts).slice(-7),
          data: Object.values(dailyResponse.data.daily_counts).slice(-7),
        });
        

        setMonthlyData({
          labels: Object.keys(monthlyResponse.data.counts),
          data: Object.values(monthlyResponse.data.counts),
        });

        const transformedData = Object.entries(userResponse.data.user_counts).map(([userId, userDetails]) => ({
          UserId: userId,
          Data: userDetails.Data || 0,
          Document: userDetails.Document || 0,
        }));
    
        setUserData(transformedData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

  return { dailyData, monthlyData, userData, loading,fetchData };
};

export default UseHomeScreenHooks;
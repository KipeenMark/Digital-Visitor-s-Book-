import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Daily Visitors'
    }
  }
};

const Dashboard = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/visitors');
      if (!response.ok) {
        throw new Error('Failed to fetch visitors');
      }
      const data = await response.json();
      setVisitors(data);
      setError(null);
    } catch (err) {
      setError('Error loading dashboard data');
      console.error('Error fetching visitors:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalVisitors = visitors.length;
    
    // Get dates for the last 7 days
    const today = new Date();
    const last7Days = Array.from({length: 7}, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    // Count visitors per day based on timeIn
    const dailyVisitors = last7Days.reduce((acc, date) => {
      acc[date] = visitors.filter(visitor => {
        if (!visitor.timeIn) return false;
        return visitor.timeIn.split('T')[0] === date;
      }).length;
      return acc;
    }, {});

    // Calculate active visitors (those without timeOut)
    const activeVisitors = visitors.filter(visitor => !visitor.timeOut).length;

    return {
      totalVisitors,
      activeVisitors,
      dailyVisitors,
      labels: last7Days.map(date => {
        const [year, month, day] = date.split('-');
        return `${day}/${month}`;
      }),
      data: last7Days.map(date => dailyVisitors[date] || 0)
    };
  };

  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-6">Loading dashboard...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  const stats = calculateStats();
  
  const chartData = {
    labels: stats.labels,
    datasets: [
      {
        label: 'Visitors',
        data: stats.data,
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      }
    ]
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-4">
          <h3 className="text-lg font-semibold mb-2">Total Visitors</h3>
          <p className="text-3xl font-bold text-primary">{stats.totalVisitors}</p>
        </div>
        
        <div className="card p-4">
          <h3 className="text-lg font-semibold mb-2">Active Visitors</h3>
          <p className="text-3xl font-bold text-success">
            {stats.activeVisitors}
          </p>
        </div>
        
        <div className="card p-4">
          <h3 className="text-lg font-semibold mb-2">Average Daily Visitors</h3>
          <p className="text-3xl font-bold text-purple-600">
            {Math.round(stats.data.reduce((a, b) => a + b, 0) / stats.data.length)}
          </p>
        </div>
      </div>

      <div className="card p-4">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default Dashboard;
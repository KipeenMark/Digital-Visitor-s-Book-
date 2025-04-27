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

function Dashboard() {
  const today = new Date();
  const [visitors, setVisitors] = useState([]);
  const [filteredVisitors, setFilteredVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(today.getDate().toString().padStart(2, '0'));
  const [selectedMonth, setSelectedMonth] = useState((today.getMonth() + 1).toString().padStart(2, '0'));
  const [selectedYear, setSelectedYear] = useState(today.getFullYear().toString());

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
      filterVisitors(
        today.getDate().toString().padStart(2, '0'),
        (today.getMonth() + 1).toString().padStart(2, '0'),
        today.getFullYear().toString(),
        data
      );
      setError(null);
    } catch (err) {
      setError('Error loading dashboard data');
      console.error('Error fetching visitors:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterVisitors = (day, month, year, visitorsList = visitors) => {
    let filtered = [...visitorsList];

    if (day || month || year) {
      filtered = filtered.filter(visitor => {
        if (!visitor.timeIn) return false;
        
        const visitDate = new Date(visitor.timeIn);
        const visitDay = visitDate.getDate().toString().padStart(2, '0');
        const visitMonth = (visitDate.getMonth() + 1).toString().padStart(2, '0');
        const visitYear = visitDate.getFullYear().toString();

        const matchDay = !day || visitDay === day;
        const matchMonth = !month || visitMonth === month;
        const matchYear = !year || visitYear === year;

        return matchDay && matchMonth && matchYear;
      });
    }

    setFilteredVisitors(filtered);
  };

  const resetFilters = () => {
    setSelectedDay(today.getDate().toString().padStart(2, '0'));
    setSelectedMonth((today.getMonth() + 1).toString().padStart(2, '0'));
    setSelectedYear(today.getFullYear().toString());
    filterVisitors(
      today.getDate().toString().padStart(2, '0'),
      (today.getMonth() + 1).toString().padStart(2, '0'),
      today.getFullYear().toString()
    );
  };

  const calculateStats = () => {
    const totalVisitors = filteredVisitors.length;
    
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
    const activeVisitors = filteredVisitors.filter(visitor => !visitor.timeOut).length;

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
      <h2 className="text-2xl font-semibold mb-6">Today's Dashboard Overview</h2>
      
      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <select
            value={selectedDay}
            onChange={(e) => {
              setSelectedDay(e.target.value);
              filterVisitors(e.target.value, selectedMonth, selectedYear);
            }}
            className="form-select"
          >
            <option value="">Day</option>
            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
              <option key={day} value={day.toString().padStart(2, '0')}>
                {day}
              </option>
            ))}
          </select>

          <select
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(e.target.value);
              filterVisitors(selectedDay, e.target.value, selectedYear);
            }}
            className="form-select"
          >
            <option value="">Month</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
              <option key={month} value={month.toString().padStart(2, '0')}>
                {new Date(2024, month - 1).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              filterVisitors(selectedDay, selectedMonth, e.target.value);
            }}
            className="form-select"
          >
            <option value="">Year</option>
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <button 
            onClick={resetFilters}
            className="btn btn-outline-secondary"
          >
            Today's Report
          </button>
        </div>
      </div>

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
}

export default Dashboard;
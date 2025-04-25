import React from 'react';
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
      text: 'Weekly Visitors'
    }
  }
};

const Dashboard = () => {
  const data = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    datasets: [
      {
        label: 'Visitors',
        data: [12, 19, 15, 8, 22],
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
          <p className="text-3xl font-bold text-primary">25</p>
        </div>
        
        <div className="card p-4">
          <h3 className="text-lg font-semibold mb-2">Current Visitors</h3>
          <p className="text-3xl font-bold text-success">8</p>
        </div>
        
        <div className="card p-4">
          <h3 className="text-lg font-semibold mb-2">Average Duration</h3>
          <p className="text-3xl font-bold text-purple-600">1.5h</p>
        </div>
      </div>

      <div className="card p-4">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default Dashboard;
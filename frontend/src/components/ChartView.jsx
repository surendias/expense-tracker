import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ChartView({ entries, categories }) {
  if (!entries.length) return <p className="text-muted">No data to visualize.</p>;

  // Group totals by category
  const totalsByCategory = entries.reduce((acc, entry) => {
    const catName = entry.category?.name || 'Uncategorized';
    acc[catName] = (acc[catName] || 0) + parseFloat(entry.amount);
    return acc;
  }, {});

  const labels = Object.keys(totalsByCategory);
  const data = Object.values(totalsByCategory);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Total Amount',
        data,
        backgroundColor: '#60a5fa', // Tailwind blue-400
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => `₹ ${ctx.raw.toLocaleString()}` } }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (val) => `₹${val}`,
        },
      },
    },
  };

  return (
    <div style={{ height: '300px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

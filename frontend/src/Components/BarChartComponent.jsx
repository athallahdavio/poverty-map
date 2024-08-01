import { Chart } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  LineController,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  LineController
);


const BarChartComponent = ({ title, data }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          filter: (item, chart) => {
            return item.text !== "Line Example";
          },
        },
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return <Chart type="bar" data={data} options={options} />;
};

export default BarChartComponent;

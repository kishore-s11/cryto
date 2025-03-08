import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Col, Row, Typography, Select } from 'antd';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import moment from 'moment';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const { Title: AntTitle } = Typography;
const { Option } = Select;

interface LineChartProps {
  coinHistory: any;
  currentPrice: string;
  coinName: string;
  coinColor?: string;
  onTimeframeChange: (days: number) => void;
}

const LineChart: React.FC<LineChartProps> = ({ 
  coinHistory, 
  currentPrice, 
  coinName, 
  coinColor = '#1677ff',
  onTimeframeChange 
}) => {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (coinHistory?.prices) {
      const coinTimestamps = coinHistory.prices.map((price: any) => 
        moment(price[0]).format('MMM DD, YYYY')
      );
      
      const coinPrices = coinHistory.prices.map((price: any) => price[1]);
      
      setChartData({
        labels: coinTimestamps,
        datasets: [
          {
            label: 'Price in USD',
            data: coinPrices,
            fill: false,
            backgroundColor: coinColor,
            borderColor: coinColor,
            tension: 0.1,
          },
        ],
      });
    }
  }, [coinHistory, coinColor]);

  const timeframes = [
    { value: 1, label: '24h' },
    { value: 7, label: '7d' },
    { value: 30, label: '30d' },
    { value: 90, label: '3m' },
    { value: 180, label: '6m' },
    { value: 365, label: '1y' },
    { value: 1825, label: '5y' },
  ];

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  return (
    <div className="mt-8">
      <Row className="mb-6">
        <Col span={12}>
          <AntTitle level={4} className="chart-title">
            {coinName} Price Chart
          </AntTitle>
        </Col>
        <Col span={12} className="flex justify-end items-center">
          <div className="mr-4">
            <Select 
              defaultValue={365} 
              style={{ width: 120 }} 
              onChange={onTimeframeChange}
            >
              {timeframes.map((timeframe) => (
                <Option key={timeframe.value} value={timeframe.value}>
                  {timeframe.label}
                </Option>
              ))}
            </Select>
          </div>
          <div>
            <AntTitle level={5} className="price-change">
              Current Price: ${parseFloat(currentPrice).toLocaleString()}
            </AntTitle>
          </div>
        </Col>
      </Row>
      {chartData.labels.length > 0 && (
        <Line data={chartData} options={options} />
      )}
    </div>
  );
};

export default LineChart;
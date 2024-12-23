import React from 'react';
import PropTypes from 'prop-types';



const LineChart = ({ data, width = 500, height = 300 }) => {
  if (!data || data.length === 0) {
    return <p>Aucune donnée disponible</p>;
  }

  const maxValue = Math.max(...data.map(item => item.value));
  const chartWidth = width - 40;
  const chartHeight = height - 40;

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * chartWidth + 20;
    const y = chartHeight - (item.value / maxValue) * chartHeight + 20;
    return { x, y, label: item.label, value: item.value };
  });

  const linePoints = points.map(point => `${point.x},${point.y}`).join(' ');

  return (
    <svg width={width} height={height} style={{ border: '1px solid #ccc' }}>
      <line x1="20" y1="20" x2="20" y2={chartHeight + 20} stroke="black" />
      <line x1="20" y1={chartHeight + 20} x2={chartWidth + 20} y2={chartHeight + 20} stroke="black" />

      {data.map((item, index) => (
        <text
          key={item.label}
          x={(index / (data.length - 1)) * chartWidth + 20}
          y={chartHeight + 35}
          textAnchor="middle"
          style={{ fontSize: '10px' }}
        >
          {item.label}
        </text>
      ))}
      <text x="5" y="20" textAnchor="middle" style={{ fontSize: '10px' }}>
        {maxValue}
      </text>

      <polyline
        points={linePoints}
        fill="none"
        stroke="rgb(75, 192, 192)"
        strokeWidth="2"
      />

      {points.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r="4"
          fill="rgb(75, 192, 192)"
        >
          <title>{`${point.label}: ${point.value}`}</title>
        </circle>
      ))}
    </svg>
  );
};

LineChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default LineChart;

type Item = {
  label: string;
  value: number;
};

type Props = {
  items: Item[];
  metricLabel?: string;
};

const StatsChart = ({ items, metricLabel = 'ед.' }: Props) => {
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="chart">
      {items.map((item) => (
        <div className="chart-row" key={item.label}>
          <span>{item.label}</span>
          <div className="chart-track">
            <div className="chart-bar" style={{ width: `${(item.value / maxValue) * 100}%` }} />
          </div>
          <strong>{item.value} {metricLabel}</strong>
        </div>
      ))}
    </div>
  );
};

export default StatsChart;

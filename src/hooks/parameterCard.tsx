import { LineChart, Line, ResponsiveContainer } from 'recharts';

type ParameterCardProps = {
  label: string;
  value: string;
  description: string;
  onClick: () => void;
  chartData?: Array<{ time: string; value: number }>;
  children?: React.ReactNode;
}

export default function ParameterCard({ label, value, description, onClick, chartData, children }: ParameterCardProps) {
  return (
    <div
      className="bg-white/80 backdrop-blur-sm rounded-lg p-4 pb-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <p className="text-xs font-medium text-[#5D5346] tracking-wider">{label}</p>
      <p className="text-xl font-bold text-[#005E6E] mt-1">{value}</p>
      {chartData && !children && (
        <div className="h-16 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#005E6E" 
                strokeWidth={1.5} 
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {children}
    </div>
  );
} 
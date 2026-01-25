'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

// Color palette for charts
const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

interface ChartProps {
  data: any[];
  height?: number;
}

// Line Chart for trends over time
export function TrendLineChart({ 
  data, 
  height = 300,
  dataKey = 'value',
  xAxisKey = 'name',
  color = '#3b82f6'
}: ChartProps & { dataKey?: string; xAxisKey?: string; color?: string }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
        <XAxis 
          dataKey={xAxisKey} 
          stroke="#6b7280" 
          fontSize={12}
          tickLine={false}
        />
        <YAxis 
          stroke="#6b7280" 
          fontSize={12}
          tickLine={false}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1f2937', 
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#fff'
          }}
        />
        <Area 
          type="monotone" 
          dataKey={dataKey} 
          stroke={color} 
          fillOpacity={1}
          fill="url(#colorValue)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// Bar Chart for comparisons
export function ComparisonBarChart({ 
  data, 
  height = 300,
  dataKey = 'value',
  xAxisKey = 'name',
}: ChartProps & { dataKey?: string; xAxisKey?: string }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
        <XAxis 
          dataKey={xAxisKey} 
          stroke="#6b7280" 
          fontSize={12}
          tickLine={false}
        />
        <YAxis 
          stroke="#6b7280" 
          fontSize={12}
          tickLine={false}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1f2937', 
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#fff'
          }}
        />
        <Bar 
          dataKey={dataKey} 
          fill="#3b82f6"
          radius={[4, 4, 0, 0]}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// Pie Chart for distributions
export function DistributionPieChart({ 
  data, 
  height = 300,
  dataKey = 'value',
  nameKey = 'name',
}: ChartProps & { dataKey?: string; nameKey?: string }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          innerRadius={60}
          dataKey={dataKey}
          nameKey={nameKey}
          label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1f2937', 
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#fff'
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

// Multi-line chart for multiple data series
export function MultiLineChart({ 
  data, 
  height = 300,
  lines,
}: ChartProps & { lines: Array<{ dataKey: string; color: string; name: string }> }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
        <XAxis 
          dataKey="name" 
          stroke="#6b7280" 
          fontSize={12}
          tickLine={false}
        />
        <YAxis 
          stroke="#6b7280" 
          fontSize={12}
          tickLine={false}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1f2937', 
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#fff'
          }}
        />
        <Legend />
        {lines.map((line) => (
          <Line 
            key={line.dataKey}
            type="monotone" 
            dataKey={line.dataKey} 
            stroke={line.color}
            strokeWidth={2}
            dot={{ fill: line.color, strokeWidth: 2 }}
            name={line.name}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

// Sample data generators for testing
export const samplePerformanceData = [
  { name: 'Jan', value: 75 },
  { name: 'Feb', value: 78 },
  { name: 'Mar', value: 82 },
  { name: 'Apr', value: 80 },
  { name: 'May', value: 85 },
  { name: 'Jun', value: 88 },
];

export const sampleSubjectData = [
  { name: 'Math', value: 92 },
  { name: 'Physics', value: 88 },
  { name: 'Chemistry', value: 78 },
  { name: 'English', value: 85 },
  { name: 'Hindi', value: 82 },
];

export const sampleAttendanceData = [
  { name: 'Present', value: 175 },
  { name: 'Absent', value: 15 },
  { name: 'Leave', value: 10 },
];

export const sampleComparisonData = [
  { name: 'Class 10A', math: 85, science: 82, english: 78 },
  { name: 'Class 10B', math: 80, science: 85, english: 82 },
  { name: 'Class 10C', math: 78, science: 80, english: 85 },
  { name: 'Class 9A', math: 82, science: 78, english: 80 },
];

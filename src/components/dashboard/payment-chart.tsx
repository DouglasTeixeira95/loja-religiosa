'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const data = [
  { name: 'Pix', value: 4500 },
  { name: 'Dinheiro', value: 1200 },
  { name: 'Crédito', value: 3800 },
  { name: 'Débito', value: 2400 },
  { name: 'Crediário', value: 1500 },
]

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#6366f1', '#a855f7']

export function PaymentChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => `R$ ${value.toFixed(2)}`}
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

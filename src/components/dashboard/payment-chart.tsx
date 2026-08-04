'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const data = [
  { name: 'Pix', value: 0, fill: 'var(--color-pix)' },
  { name: 'Dinheiro', value: 0, fill: 'var(--color-dinheiro)' },
  { name: 'Crédito', value: 0, fill: 'var(--color-credito)' },
  { name: 'Débito', value: 0, fill: 'var(--color-debito)' },
  { name: 'Crediário', value: 0, fill: 'var(--color-crediario)' },
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
          formatter={(value: any) => `R$ ${Number(value).toFixed(2)}`}
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

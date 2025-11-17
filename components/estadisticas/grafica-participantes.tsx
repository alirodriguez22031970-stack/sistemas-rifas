'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface GraficaParticipantesProps {
  data: Array<{ cedula: string; cantidad: number }>
}

export function GraficaParticipantes({ data }: GraficaParticipantesProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="cedula" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="cantidad" fill="#00C49F" name="Boletos" />
      </BarChart>
    </ResponsiveContainer>
  )
}


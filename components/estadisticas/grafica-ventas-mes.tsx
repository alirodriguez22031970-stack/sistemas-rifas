'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface GraficaVentasMesProps {
  data: Array<{ mes: string; total: number }>
}

export function GraficaVentasMes({ data }: GraficaVentasMesProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="mes" />
        <YAxis />
        <Tooltip formatter={(value: number) => formatCurrency(value)} />
        <Bar dataKey="total" fill="#0088FE" />
      </BarChart>
    </ResponsiveContainer>
  )
}


import React from 'react'
import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer } from 'recharts'

export default function MPie({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 relative min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="80%"
              startAngle={90}
              endAngle={-270}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((curItem, i) => (
                <Cell key={`cell-${i}`} fill={curItem.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: "#10151D", border: "1px solid #1E2733", borderRadius: "8px" }}
              labelStyle={{ color: "#E6EDF3" }}
              itemStyle={{ color: "#E6EDF3" }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-slate-100 text-xl font-bold">{total}</div>
          <div className="text-slate-500 text-[10px]">Total</div>
        </div>
      </div>

      <div className="flex-shrink-0 flex justify-center gap-3 mt-2 flex-wrap">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.color }}></span>
            <span className="text-slate-400 text-[11px] whitespace-nowrap">
              {item.name} <span className="text-slate-300">({item.value})</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
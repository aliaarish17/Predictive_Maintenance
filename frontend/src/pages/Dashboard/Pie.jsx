import React from 'react'
import { Pie, PieChart,Cell,Tooltip, ResponsiveContainer } from 'recharts'

export default function MPie ({data})  {
  console.log(data);
  

  return (
    <div className>
      <ResponsiveContainer width="100%" height={270}>
        <PieChart>
          <Pie
           data ={data}
           cx = "50%"
           cy = "50%"
           innerRadius = {60}
           outerRadius = {85}
           startAngle={90}
           endAngle={-270}
           paddingAngle={5}
           dataKey= "value"
           >
          <Tooltip/>
          {/* implicitly returning a function: */}
          {data.map((curItem, i) => (
            <Cell key={`cell-${i}`} fill = {curItem.color} />
          ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

    </div>
  )
}

import React from 'react'


function FeatureCard({ title, desc }) {
  return (
    <div className="bg-white/10 h-[180px] cursor-pointer backdrop-blur-md border border-white/10 hover:border-green-500/40 flex flex-col p-5 gap-2 w-56 rounded-xl transition-colors duration-200">
      <h3 className="text-base font-semibold hover:text-green-500 text-white group-hover:text-green-400">{title}</h3>
      <p className="text-sm text-white/60 leading-relaxed">{desc}</p>
    </div>
  )
}

export default FeatureCard
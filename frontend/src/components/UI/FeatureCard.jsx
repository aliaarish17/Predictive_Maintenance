import React from 'react'

function FeatureCard({title,desc}) {
  return (
    <div  className="bg-white/10 backdrop-blur-md flex flex-col p-4 gap-3 max-w-2xl  rounded-xl"> 
    <h3 className='text-xl text-white hover:text-green-500 '>{title}</h3>
    <p className='text-white'>{desc}</p>

    </div>
  )
}

export default FeatureCard
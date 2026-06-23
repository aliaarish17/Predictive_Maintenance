import React from 'react'
import { Link,NavLink } from 'react-router-dom'
import bgImage from "../../assets/bg.jpg"
import FeatureCard from '../../components/UI/FeatureCard'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Common/Navbar'


export default function Home() {
  const navigate = useNavigate()
  const features = [
    {
    title: "Real-time Monitoring",
    desc: 'Monitor machine health continously'
    },

    {
    title: "Real-time Monitoring",
    desc: 'Monitor machine health continously'
    },

    {
    title: "Real-time Monitoring",
    desc: 'Monitor machine health continously'
    },

    {
    title: "Real-time Monitoring",
    desc: 'Monitor machine health continously'
    },
  ]


  return (
    <>
    <nav className='fixed top-0 z-50 left-0 w-full'>
      <Navbar/>
    </nav>
     <div className='relative w-screen h-screen overflow-hidden bg-center bg-cover'
    style={{
      backgroundImage: `url(${bgImage})`
    }}>
      <div className="absolute pointer-events-none inset-0 bg-black/65"></div>
      <div className='relative z-10 h-screen flex flex-col top-4 justify-center bottom-20 items-start px-20'>
        <h1 className='text-6xl  text-white font-bold'>
          AI-Powered <br/>
          <span className='text-green-500 text-5xl'>Predictive Maintenance</span>      
        </h1>

        <p className='text-white mt-4 text-xl font-bold max-w-2xl'>Predict machine failure before they happen and maximise equipment uptime with AI</p>

       <div className="flex flex-row  gap-6 mt-10">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            desc={feature.desc}
          />
        ))}
      </div>

      <button onClick={()=> navigate("/dashboard")} className='border-white cursor-pointer hover:bg-green-600 transition-all ease-in   px-7 py-3 mt-6 rounded-xl text-white font-bold bg-green-500 outline-0 '>
        Launch Dashboard
      </button>
      </div>


    </div>

    </>
    
  )
}


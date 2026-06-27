import React from 'react'
import { Link,NavLink } from 'react-router-dom'
import bgImage from "../../assets/bg.jpg"
import FeatureCard from '../../components/UI/FeatureCard'
import { useNavigate } from 'react-router-dom'
import { delay, motion } from "motion/react"




export default function Home() {
  const navigate = useNavigate()
  const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      
    },
  },
};
 const features = [
  {
    title: "Real-time Monitoring",
    desc: "Continuously monitor machine health with live sensor data and instant status updates.",
  },
  {
    title: "Failure Prediction",
    desc: "Predict equipment failures in advance using an XGBoost machine learning model.",
  },
  {
    title: "Remaining Useful Life",
    desc: "Estimate the remaining operational life of machines to schedule maintenance proactively.",
  },
  {
    title: "AI-Powered Insights",
    desc: "Gemini AI explains predictions, highlights key risk factors, and recommends maintenance actions.",
  },
];

   return (
    <>
    
  <motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
  className="relative w-full min-h-screen overflow-hidden bg-center bg-cover"
    style={{
      backgroundImage: `url(${bgImage})`
    }}>
      <div className="absolute pointer-events-none inset-0 bg-black/65"></div>
      <div className="absolute inset-0 bg-black/65"></div>

    <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(40)].map((_, i) => (
    <span
      key={i}
      className="particle"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 8}s`,
        animationDuration: `${8 + Math.random() * 8}s`,
      }}
    />
  ))}
 </div>

    <div className="glow glow-green"></div>
    <div className="glow glow-cyan"></div>


  <motion.div 
      variant ={containerVariants}
      className='relative z-10 h-screen flex flex-col top-0.5  justify-center bottom-12 items-start px-20'>
      <motion.h1
          variants={itemVariants}
          className="text-6xl mt-7 text-white font-bold"
        >
        AI-Powered <br />
        <span className="text-green-500 text-5xl">
         Predictive Maintenance
        </span>
     </motion.h1>

    <motion.p
     variants={itemVariants}
     className="text-white mt-4 text-xl font-bold max-w-2xl">
       Predict machine failure before they happen and maximise equipment uptime with AI
    </motion.p>

  <motion.div
   variants={itemVariants}
   className="flex flex-row gap-6 mt-10">
   {features.map((feature, index) => (
    <motion.div
      key={index}
      whileHover={{
        y: -8,
        scale: 1.03,
      }}
      transition={{ duration: 0.2 }}
    >
      <FeatureCard
        title={feature.title}
        desc={feature.desc}
      />
    </motion.div>
  ))}
  </motion.div>

  <motion.div className='flex flex-row gap-5 my-2' variants={itemVariants}>
  <Link to="/dashboard">
    <motion.button
      whileHover={{
        scale: 1.05,y:-2, borderColor: "green"
      }}
      whileTap={{
        scale: 0.9,y:1
      }}
      className="border-white  hover:border-green-800  cursor-pointer hover:bg-green-600 px-7 py-3 mt-6 rounded-xl text-white font-bold bg-green-500"
    >
      Launch Dashboard 
    </motion.button>
  </Link>

  <motion.button
      whileHover={{
        scale: 1.05,y:-2
      }}
      whileTap={{
        scale: 0.9,y:1
      }}
      className="border-white cursor-pointer hover:bg-green-600 px-7 py-3 mt-6 rounded-xl text-white font-bold bg-green-500"
    >
      How it Works 
    </motion.button>
</motion.div>

<motion.div
  variants={itemVariants}
  className="mt-10 flex flex-row  gap-6 max-w-[720px]"
>
  <div className="bg-white/10 backdrop-blur-md hover:scale-[1.2] hover:border-green-800 hover:y-[-8] duration-200 ease-in cursor-pointer rounded-xl p-4 border border-white/10">
    <p className="text-green-400 font-bold">94%</p>
    <p className="text-white text-sm">Prediction Accuracy</p>
  </div>

  <div className="bg-white/10 backdrop-blur-md hover:scale-[1.2] hover:border-green-800  hover:y-[-8] duration-200 ease-in cursor-pointer rounded-xl p-4 border border-white/10">
    <p className="text-green-400 font-bold">NASA CMAPSS</p>
    <p className="text-white text-sm">FD001 Dataset</p>
  </div>

  <div className="bg-white/10  hover:scale-[1.2] hover:y-[-8] hover:border-green-800  duration-200 ease-in cursor-pointer backdrop-blur-md rounded-xl p-4 border border-white/10">
    <p className="text-green-400 font-bold">XGBoost</p>
    <p className="text-white text-sm">Prediction Model</p>
  </div>

  <div className="bg-white/10 backdrop-blur-md hover:scale-[1.2] hover:border-green-800 hover:y-[-8] duration-200 ease-in cursor-pointer  rounded-xl p-4 border border-white/10">
    <p className="text-green-400 font-bold">Gemini AI</p>
    <p className="text-white text-sm">Failure Explanation</p>
  </div>
</motion.div>

      </motion.div>


    </motion.div>

    </>
    
  )
}


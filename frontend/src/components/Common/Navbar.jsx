import React from 'react'
import logo from '../../assets/logo.svg'
import { Link,NavLink,useLocation } from 'react-router-dom'


export default function Navbar() {
    const location = useLocation()
    
  return (
    <>
    <div
  className={`fixed top-0 left-0 w-full z-50 flex justify-between ${
    location.pathname === "/home"
      ? "bg-black/30 backdrop-blur-md  text-white border-b border-white/10"
      : "bg-[#0A0E14] text-white border-b  border-white/10"
  }`}
>
    <div className='pt-3 pb-2 pr-3 pl-2'>
     <Link to="/" className='flex flex-row items-center gap-3'>
      <img className='w-8 h-8' src={logo} alt="Logo" />
      <p className=' font-bold leading-tight'>
        PREDICTIVE <br/>
        <span className='text-[#059669]'>MAINTENANCE</span> 
      </p>
     </Link>
   </div>

        <div className='relative left-5'>
            <ul className='flex flex-row pt-3 pb-2 pr-9 pl-2 justify-between relative gap-6 '>
                <li>
                    <NavLink
                    to="/home"
                    className={({isActive})=> `block font-bold py-2 pr-4 pl-3 duration-200 ${isActive? "text-[#059669]":""} hover:text-[#059669] transition-all ease-in-out  `
                    }
                    > Home
                    </NavLink>

                </li>

                <li>
                    <NavLink
                    to="/dashboard"
                    className={({isActive})=> `block font-bold py-2 pr-4 pl-3 duration-200 ${isActive? "text-[#059669]":""} hover:text-[#059669] transition-all ease-in-out `
                    }
                    >
                        Dashboard

                    </NavLink>

                </li>

                <li>
                    <NavLink
                    to="/machines"
                    className={({isActive})=> `block font-bold py-2 pr-4 pl-3 duration-200 ${isActive? "text-[#059669]":""} hover:text-[#059669] transition-all ease-in-out  `
                    }
                    >
                        Machine

                    </NavLink>

                </li>

                <li>
                    <NavLink
                    to="/predict"
                    className={({isActive})=> `block font-bold py-2 pr-4 pl-3 duration-200 ${isActive? "text-[#059669]":""} hover:text-[#059669] transition-all ease-in-out `
                    }
                    >
                        Predict

                    </NavLink>

                </li>

                <li>
                    <NavLink
                    to="/history"
                    className={({isActive})=> `block transition-all ease-in-out font-bold py-2 pr-4 pl-3 duration-200 ${isActive? "text-[#059669]":""} hover:text-[#059669] transition-all ease-in-out `
                    }
                    >
                        History

                    </NavLink>

                </li>
            </ul>
        </div>

        


    </div>

    </>
    )
}


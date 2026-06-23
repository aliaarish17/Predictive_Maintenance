import React from 'react'
import logo from '../../assets/logo.svg'
import { Link,NavLink } from 'react-router-dom'
function Navbar() {
  return (
    <>
    <div className=' fixed  flex flex-row justify-between  w-full h-auto bg-[#F8FAFC] border-2 border-[#E2E8F0]'>
    <div className='pt-3 pb-2 pr-3 pl-2'>
     <Link to="/" className='flex flex-row items-center gap-3'>
      <img className='w-8 h-8' src={logo} alt="Logo" />
      <p className='text-[#0F172A] font-bold leading-tight'>
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
                    className={({isActive})=> `block font-bold py-2 pr-4 pl-3 duration-200 ${isActive? "text-[#059669]":"text-[#0F172A]"} hover:text-[#059669] transition-all ease-in-out  `
                    }
                    > Home
                    </NavLink>

                </li>

                <li>
                    <NavLink
                    to="/dashboard"
                    className={({isActive})=> `block font-bold py-2 pr-4 pl-3 duration-200 ${isActive? "text-[#059669]":"text-[#0F172A]"} hover:text-[#059669] transition-all ease-in-out `
                    }
                    >
                        Dashboard

                    </NavLink>

                </li>

                <li>
                    <NavLink
                    to="/machines"
                    className={({isActive})=> `block font-bold py-2 pr-4 pl-3 duration-200 ${isActive? "text-[#059669]":"text-[#0F172A]"} hover:text-[#059669] transition-all ease-in-out  `
                    }
                    >
                        Machine

                    </NavLink>

                </li>

                <li>
                    <NavLink
                    to="/predict"
                    className={({isActive})=> `block font-bold py-2 pr-4 pl-3 duration-200 ${isActive? "text-[#059669]":"text-[#0F172A]"} hover:text-[#059669] transition-all ease-in-out `
                    }
                    >
                        Predict

                    </NavLink>

                </li>

                <li>
                    <NavLink
                    to="/history"
                    className={({isActive})=> `block transition-all ease-in-out font-bold py-2 pr-4 pl-3 duration-200 ${isActive? "text-[#059669]":"text-[#0F172A]"} hover:text-[#059669] transition-all ease-in-out `
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

export default Navbar
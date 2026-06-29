import { Outlet } from "react-router-dom";
import Navbar from "./components/UI/Navbar";
import {AnimatePresence, motion} from "motion/react"
import { pageTransition } from "./animations/pageTransition";


export default function Layout(){
   
    return(
       <>
        <Navbar />
          <Outlet />
       </>

   
    )
}
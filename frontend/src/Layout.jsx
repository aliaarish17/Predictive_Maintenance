import { Outlet,useLocation } from "react-router-dom";
import Navbar from "./components/Common/Navbar";
import {AnimatePresence, motion} from "motion/react"
import { pageTransition } from "./animations/pageTransition";


export default function Layout(){
    const location = useLocation()
    return(
       <>
        <Navbar />
        {/* <AnimatePresence mode="wait"> */}
            <motion.div
            key={location.pathname}
            variants={pageTransition}
            initial="hidden"
            animate="visible"
            exit="exit">
          <Outlet />

            </motion.div>

        {/* </AnimatePresence> */}
       
       </>

   
    )
}
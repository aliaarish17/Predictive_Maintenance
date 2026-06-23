import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider,createBrowserRouter, createRoutesFromChildren,Route,Router, createRoutesFromElements } from 'react-router-dom'
//LAYOUT+PAGES
import Layout from './Layout.jsx'
import Home from './pages/Home/Home.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import Machines from './pages/Machines/Machines.jsx'
import PredictionPage from './pages/Prediction/PredictionPage.jsx'
import History from './pages/History/History.jsx'

//Layout is the parent--> array creation for router


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout/>}>
      <Route path='home' element={<Home/>}/>
      <Route path='dashboard' element={<Dashboard/>}/>
      <Route path='machines' element={<Machines/>}/>
      <Route path='predict' element={<PredictionPage/>}/>
      <Route path='history' element={<History/>}/>
    </Route>
  )
)
//Rendering the app through router provider
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)

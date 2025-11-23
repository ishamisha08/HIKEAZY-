import React from 'react'
import Header from '../components/Header'
import StateMenu from '../components/StateMenu'
import TopTrails from '../components/TopTrails'
import Banner from '../components/Banner'
import Navbar from '../components/Navbar'

const Home = () => {
  return (
    <div >
       <Header/>
       <StateMenu />
       <TopTrails />
       <Banner />
    </div>
  )
}

export default Home 
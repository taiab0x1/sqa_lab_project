import React from 'react'
import Header from '../components/Header'
import Support from '../components/HomeComponent/Support'
import WorkFlow from '../components/HomeComponent/WorkFlow'
import Ads from '../components/HomeComponent/Ads'
import Service from '../components/HomeComponent/Service'
import State from '../components/HomeComponent/State'
import Equipment from '../components/HomeComponent/Equipment'

function Home() {
  return (
    <div>
        <Header/>
        <Support/>
        <WorkFlow/>
        <Ads/>
        <Service/>
        <State/>
        <Equipment/>
    </div>
  )
}

export default Home
import { useEffect } from 'react'
import Hero from '../component/Hero'
import P_Category from '../component/P_Category'
import R_L from '../component/R_L'
import R_D from '../component/R_D'
import R_A from '../component/R_A'
import R_C from '../component/R_C'


const Home = () => {

    useEffect(() => {
    window.scrollTo(0, 0)
  }, [])


  return (
    <div>
      <Hero />
      <P_Category />
      <R_L />
      <R_D />
      <R_A />
      <R_C />
    </div>
  )
}

export default Home
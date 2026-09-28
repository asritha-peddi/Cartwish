import React from 'react'
import HeroSection from './HeroSection';
import iphone from '../../assets/iphone-14-pro.webp'
import mac from '../../assets/mac-system-cut.jfif'
import FeaturedProducts from './FeaturedProducts';


const HomePage = () => {
  return (
    <div>
      

      <HeroSection
        title="Buy iPhone 14 Pro"
        subtitle="Get the latest iPhone with amazing features"
        image={iphone}
     link="/products/6892766d96e9edafca3302b2"   
      />
      <FeaturedProducts />
      <HeroSection
        title="Buy MacBook Pro"
        subtitle="Experience the power of M1 chip"
        image={mac}
        link="/products/6892766d96e9edafca3302ba"
      />
    </div>
  )
}

export default HomePage


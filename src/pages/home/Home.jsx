import React from 'react';
import Featured from '../../compenents/featured/Featured';
import TrustedBy from '../../compenents/trustedBy/TrustedBy';
import Slide from '../../compenents/slide/Slide';
import CatCard from '../../compenents/catCard/CatCard';
import Description from '../../compenents/description/Description';
import MarketPlace from '../../compenents/marketPlace/MarketPlace';
import Contact from '../../compenents/contact/Contact';
import {cards} from '../../data';
import { useEffect } from "react";


const Home = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  useEffect(() => {
  
    window.scrollTo(0, 0);
  });


  return (
    <div >

     {currentUser  && (
         <>
       <Featured />
      
        
    <TrustedBy />
  
    <Slide slidesToShow={5} arrowsScroll={5}>
        {cards.map((card) => (
          <CatCard key={card.id} card={card} />
        ))}
      </Slide>
      </>
         )}
      <Description />
      
        

      {currentUser  && (
        <>
      <MarketPlace />
     
        
      </>
)}
       <Contact />
    </div>
    
  )
}

export default Home
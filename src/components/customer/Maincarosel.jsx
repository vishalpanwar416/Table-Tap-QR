import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { MaincaroselData } from './MaincaroselData';

const responsive = {
  0: { items: 1 },
  1024: { items: 1 }
};

const Maincarosel = () => {
  const items = MaincaroselData.map((item, index) => (
    <div
      key={index}
      className="flex flex-row w-full h-[190px] md:h-[240px] rounded-[3rem] overflow-hidden shadow-md"
    >
      <div className="w-1/2 bg-gray-700 text-white flex flex-col justify-center items-center px-3">
        <p className="text-xl md:text-2xl font-medium text-center">{item.message}</p>
        <p className="text-4xl md:text-5xl font-extrabold mt-2 text-center">{item.discount}</p>
      </div>
      <div className="w-1/2">
        <img 
          src={item.imade} 
          alt="Dish" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  ));

  return (
    <AliceCarousel
      mouseTracking
      items={items}
      responsive={responsive}
      controlsStrategy="responsive"
      autoPlay
      autoPlayInterval={3000}
      infinite
      disableDotsControls
      disableButtonsControls
      animationType="fade"
      animationDuration={1000}
    />
  );
};

export default Maincarosel;
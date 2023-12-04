import React from 'react';
import FuelStation from './FuelStation'; 
import Restaurant from './Restaurant';

const RouteData = ({ fuelStations, restaurants }) => (
  <div>
    <h2>Fuel Stations</h2>
    {fuelStations.map((station, index) => (
      <FuelStation key={index} {...station} />
    ))}

    <h2>Restaurants</h2>
    {restaurants.map((restaurant, index) => (
      <Restaurant key={index} {...restaurant} />
    ))}
  </div>
);

export default RouteData;

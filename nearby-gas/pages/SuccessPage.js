import React from 'react';

const SuccessPage = ({ routeData }) => {
  return (
    <div>
      <h1>Success Page</h1>
      <p>Display your success message or any other information here.</p>
      {/* Render your routeData here */}
      {routeData && (
        <div>
          {/* Display the routeData from the API response */}
          {/* Example: */}
          <h2>Fuel Stations</h2>
          <ul>
            {routeData.fuelStations.map((station, index) => (
              <li key={index}>{station.name}</li>
            ))}
          </ul>

          <h2>Restaurants</h2>
          <ul>
            {routeData.restaurants.map((restaurant, index) => (
              <li key={index}>{restaurant.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SuccessPage;

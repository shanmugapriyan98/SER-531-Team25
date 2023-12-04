/* SuccessPage.js */
import React from 'react';
import styles from './SuccessPage.module.scss';

const FuelStationCard = ({ items }) => (
  <div className={styles.card}>
    <div className={styles.cardHeader}>Fuel Stations</div>
    <div className={styles.cardBody}>
      <ul className={styles.itemList}>
        {items.map((item, index) => (
          <li key={index} className={styles.item}>
            {item.name}
            <div className={styles.details}>
              <span className={styles.detailLabel}>{item.city}</span>
              <span className={styles.detailValue}>{item.fuelCode}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const RestaurantCard = ({ items }) => (
  <div className={styles.card}>
    <div className={styles.cardHeader}>Restaurants</div>
    <div className={styles.cardBody}>
      <ul className={styles.itemList}>
        {items.map((item, index) => (
          <li key={index} className={styles.item}>
            {item.name}
            <div className={styles.details}>
              <span className={styles.detailLabel}>{item.address}</span>
              <span className={styles.detailValue}>{item.postalCode}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const SuccessPage = ({ routeData }) => {
  return (
    <div className={styles.successContainer}>
      {routeData ? (
        <div className={styles.listContainer}>
          <FuelStationCard items={routeData.fuelStations} />
          <RestaurantCard items={routeData.restaurants} />
        </div>
      ) : (
        <p>No data available for display.</p>
      )}
    </div>
  );
};

export default SuccessPage;

import React, { useState } from 'react';
import axios from 'axios';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { useRouter } from 'next/router';
import styles from './FormWithAutocomplete.module.scss';
import SuccessPage from 'pages/SuccessPage'; // Import the SuccessPage component

const FormWithAutocomplete = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
  });
  const [routeData, setRouteData] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false); // New state variable

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelect = async (name, address) => {
    const results = await geocodeByAddress(address);
    const latLng = await getLatLng(results[0]);
    console.log(`Selected ${name}:`, latLng);

    setFormData((prevData) => ({
      ...prevData,
      [name]: address,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiUrl = 'http://localhost:8080/route';

    try {
      const response = await axios.get(apiUrl, {
        params: {
          source: formData.source,
          destination: formData.destination,
        },
      });

      console.log('Full API Response:', response.data); 

      if (response.data && Array.isArray(response.data.fuelStations) && Array.isArray(response.data.restaurants)) {
        console.log('API Response:', response.data);

        // Set route data in the state
        setRouteData(response.data);

        // Set the formSubmitted state to true
        setFormSubmitted(true);

        // No need to navigate here, let the rendering logic handle it
      } else {
        console.error('API Error here:', response.data.error);
      }
    } catch (error) {
      console.error('API Request Error:', error);
    }
  };

  return (
    <div className={styles.container}>
      {formSubmitted ? (
        // Render the SuccessPage component with the routeData
        <SuccessPage routeData={routeData} />
      ) : (
        // Render the form as usual
        <div className={styles.formContainer}>
          <h1 className={styles.formTitle}>Travel Information Form</h1>
          <div className={styles.inputContainer}>
            <label className={styles.label}>
              Source:
              <PlacesAutocomplete
                value={formData.source}
                onChange={(value) => handleInputChange('source', value)}
                onSelect={(value) => handleSelect('source', value)}
              >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                  <div className={styles.autocompleteContainer}>
                    <input
                      {...getInputProps({
                        placeholder: 'Enter start location',
                        className: styles.formInput,
                      })}
                    />
                    <div className={styles.autocompleteDropdownContainer}>
                      {loading && <div>Loading...</div>}
                      {suggestions.map((suggestion) => (
                        <div {...getSuggestionItemProps(suggestion)} key={suggestion.placeId}>
                          {suggestion.description}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </PlacesAutocomplete>
            </label>
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.label}>
              Destination:
              <PlacesAutocomplete
                value={formData.destination}
                onChange={(value) => handleInputChange('destination', value)}
                onSelect={(value) => handleSelect('destination', value)}
              >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                  <div className={styles.autocompleteContainer}>
                    <input
                      {...getInputProps({
                        placeholder: 'Enter destination location',
                        className: styles.formInput,
                      })}
                    />
                    <div className={styles.autocompleteDropdownContainer}>
                      {loading && <div>Loading...</div>}
                      {suggestions.map((suggestion) => (
                        <div {...getSuggestionItemProps(suggestion)} key={suggestion.placeId}>
                          {suggestion.description}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </PlacesAutocomplete>
            </label>
          </div>
          <div className={styles.centerSubmitButton}>
            <button type="button" className={styles.submitButton} onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormWithAutocomplete;

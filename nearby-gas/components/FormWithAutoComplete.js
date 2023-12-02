import React, { useState } from 'react';
import axios from 'axios';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { useRouter } from 'next/router';
import styles from './FormWithAutocomplete.module.scss';

const FormWithAutocomplete = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
  });

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

      if (response.data.success) {
        console.log('API Response:', response.data);

        router.push({
          pathname: '/successPage',
          query: { responseData: JSON.stringify(response.data) },
        });
      } else {
        console.error('API Error:', response.data.error);
      }
    } catch (error) {
      console.error('API Request Error:', error);
    }
  };

  return (
    <div className={styles.container}>
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
    </div>
  );
};

export default FormWithAutocomplete;

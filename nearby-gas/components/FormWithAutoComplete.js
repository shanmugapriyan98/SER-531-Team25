import React, { useState } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import styles from './FormWithAutocomplete.module.scss';

const FormWithAutoComplete = () => {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
  });

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelect = (name, address) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: address,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.formTitle}>Find Nearby Gas Station</h1>
        <div className={styles.inputContainer}>
          <label className={styles.label}>
            From:
            <PlacesAutocomplete
              value={formData.from}
              onChange={(value) => handleInputChange('from', value)}
              onSelect={(value) => handleSelect('from', value)}
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
            To:
            <PlacesAutocomplete
              value={formData.to}
              onChange={(value) => handleInputChange('to', value)}
              onSelect={(value) => handleSelect('to', value)}
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
          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormWithAutoComplete;

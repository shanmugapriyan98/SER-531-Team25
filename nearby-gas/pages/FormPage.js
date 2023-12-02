import React from 'react';
import Head from 'next/head';
import FormWithAutoComplete from '../components/FormWithAutoComplete';

const FormPage = () => {
  return (
    <div>
      <Head>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyC3nfH5oqck92--QACrsXCRav7Ta2mOsUs&libraries=places`}
          async
          defer
        ></script>
      </Head>
      <FormWithAutoComplete />
    </div>
  );
};

export default FormPage;
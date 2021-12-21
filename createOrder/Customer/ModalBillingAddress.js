import React, {useCallback, useState} from 'react';
import {Form, Modal, TextField, Layout, Checkbox, Select, Button } from '@shopify/polaris';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';


function ModalBillingAddress(props) {
    
  const [active, setActive] = useState(false);
  const handleModalChange = useCallback(() => setActive(!active), [active]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const selectedAddressChange = useCallback((value) => setSelectedAddress(value), []);
  const [countryValue, setCountryValue] = useState(props.addressesCountry);
  const countryChange = useCallback((newValue) => setCountryValue(newValue), []);
  const [firstName, setFirstName] = useState(props.addressesFirstName)
  const firstNameChange = useCallback((newValue) => setFirstName(newValue), []);
  const [lastName, setLastName] = useState(props.addressesLastName)
  const lastNameChange = useCallback((newValue) => setLastName(newValue), []);
  const [company, setCompany] = useState(props.addressesCompany);
  const companyChange = useCallback((newValue) => setCompany(newValue), []);
  const [address1, setAddress1] = useState(props.addressesaddress1)
  const addressChange = useCallback((newValue) => setAddress1(newValue), []);
  const [address2, setAddress2] = useState(props.addressesaddress2);
  const address2Change = useCallback((newValue) => setAddress2(newValue), []);
  const [city, setCity] = useState(props.addressesCity);
  const cityChange = useCallback((newValue) => setCity(newValue), []);
  const [regionValue, setRegionValue] = useState(props.addressesProvinceCode);
  const regionChange = useCallback((newValue) => setRegionValue(newValue), []);
  const [postalCodeValue, setPostalCodeValue] = useState(props.addressesZip);
  const postalCodeChange = useCallback((newValue) => setPostalCodeValue(newValue), []);
  const [phoneCustomer, setPhoneCustomer] = useState(props.addressesPhone)
  const phoneChange = useCallback(newValue => props.setPhoneCustomer(newValue), []);

  const handleClose = () => {
    handleModalChange();
  };
  const saveInfo = useCallback(() => {
    props.setAddressesCountry(countryValue)
    props.setAddressesFirstName(firstName)
    props.setAddressesLastName(lastName)
    props.setAddressesCompany(company)
    props.setAddressesaddress1(address1)
    props.setAddressesaddress2(address2)
    props.setAddressesCity(city)
    props.setAddressesProvinceCode(regionValue)
    props.setAddressesZip(postalCodeValue)
    props.setAddressesPhone(phoneCustomer)
    handleModalChange();
  })
  const activator = 
  <Button 
    plain 
    onClick={handleModalChange}
  >
    Edit
  </Button>;
    const options = [
      {label: 'Select Address', value: 'selectAddress'},
    ];
  return (
    <Form>
      <Modal
        activator={activator}
        open={active}
        onClose={handleClose}
        title="Edit billing address"
        primaryAction={[
          {
            content: 'Done',
            onAction: saveInfo,
          },
        ]}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: handleModalChange,
          },
        ]}
      >
        <Modal.Section>
          <Layout>
            <Layout.Section>
              <div style={{width:"33.33" + "%", paddingRight:"5px"}}>
                <Select
                  label="Select Address"
                  placeholder='Select'
                  options={options}
                  onChange={selectedAddressChange}
                  value={selectedAddress}
                />
              </div>
              <p style={{marginBottom:"5px", marginTop:"5px"}}>Country/region</p>
              <CountryDropdown
                id='country'
                classes='test'
                value={countryValue}
                onChange={countryChange} 
              />
              <div style={{width:"100" + "%", display:"inline-flex"}}>
                <div style={{width:"50" + "%", paddingRight:"10px"}}>
                  <TextField
                    label="First Name"
                    value={firstName}
                    onChange={firstNameChange}
                    autoComplete="off"
                  />
                </div>
                <div style={{width:"50" + "%", paddingLeft:"10px"}}>
                  <TextField
                    label="Last Name"
                    value={lastName}
                    onChange={lastNameChange}
                    autoComplete="off"
                  />
                </div>
              </div>
              <TextField
                label="Company"
                value={company}
                onChange={companyChange}
                autoComplete="off"
              />
              <TextField
                label="Address"
                value={address1}
                onChange={addressChange}
                autoComplete="off"
              />
              <TextField
                label="Apartment, suite, etc."
                value={address2}
                onChange={address2Change}
                autoComplete="off"
              />
              <div style={{width:"100%", display:"inline-flex"}}>
                <div style={{width:"33.33" + "%", paddingRight:"5px"}}>
                  <TextField
                    label="City"
                    value={city}
                    onChange={cityChange}
                    autoComplete="off"
                  />
                </div>
                <div style={{width:"33.33" + "%", paddingLeft:"5px"}}>
                  <p style={{marginBottom:"4px"}}>Province</p>
                  <RegionDropdown
                    classes='test'
                    country={countryValue}
                    value={regionValue}
                    onChange={regionChange} 
                  />
                </div>
                <div style={{width:"33.33" + "%", paddingLeft:"10px"}}>
                <TextField
                  label="Postal Code"
                  value={postalCodeValue}
                  onChange={postalCodeChange}
                  autoComplete="off"
                />
                </div>
              </div>
              <p style={{marginBottom:"4px"}}>Phone number</p>
              <PhoneInput
                inputClass='test'
                country={'us'}
                value={phoneCustomer}
                onChange={phoneChange}
                autoComplete="nope"
              />
            </Layout.Section>
          </Layout>
        </Modal.Section>
      </Modal>
    </Form>
  );
}
export { ModalBillingAddress }
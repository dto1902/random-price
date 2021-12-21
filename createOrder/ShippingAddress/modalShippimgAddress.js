import React, {useCallback, useState} from 'react';
import {Form, Modal, TextField, Layout, Checkbox, ActionList, Button, Card, Popover } from '@shopify/polaris';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const GET_ADDRESSES = gql`
query Customer($id: ID!)
{
  customer(id: $id) {
    	addresses (first: 100){
      firstName
      lastName
      company
      address1
      address2
      zip
      city
      province
      country
      phone
    }
  }
}
`
function ModalShippingAddress(props) {
    
  const [active, setActive] = useState(false);
  const handleModalChange = useCallback(() => setActive(!active), [active]);
  const [countryValue, setCountryValue] = useState('');
  const countryChange = useCallback((newValue) => setCountryValue(newValue), []);
  const [firstName, setFirstName] = useState('');
  const firstNameChange = useCallback((newValue) => setFirstName(newValue), []);
  const [lastName, setLastName] = useState('');
  const lastNameChange = useCallback((newValue) => setLastName(newValue), []);
  const [company, setCompany] = useState('');
  const companyChange = useCallback((newValue) => setCompany(newValue), []);
  const [address1, setAddress1] = useState('')
  const addressChange = useCallback((newValue) => setAddress1(newValue), []);
  const [address2, setAddress2] = useState('');
  const address2Change = useCallback((newValue) => setAddress2(newValue), []);
  const [city, setCity] = useState('');
  const cityChange = useCallback((newValue) => setCity(newValue), []);
  const [regionValue, setRegionValue] = useState('');
  const regionChange = useCallback((newValue) => setRegionValue(newValue), []);
  const [postalCodeValue, setPostalCodeValue] = useState('');
  const postalCodeChange = useCallback((newValue) => setPostalCodeValue(newValue), []);
  const [phoneCustomer, setPhoneCustomer] = useState('')
  const phoneChange = useCallback(newValue => setPhoneCustomer(newValue), []);
  const [popoverActive, setPopoverActive] = useState(true);
  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );
  const popOveActivator = (
    <Button onClick={togglePopoverActive} disclosure>
      More actions
    </Button>
  );
  const handleClose = () => {
    handleModalChange();
  };
  const saveInfo = useCallback(() => {
      props.setShippingFirstName(firstName)
      props.setShippingLastName(lastName)
      props.setShippingCompany(company)
      props.setShippingAddress1(address1)
      props.setShippingAddress2(address2)
      props.setShippingZip(postalCodeValue)
      props.setShippingCity(city)
      props.setShippingProvince(regionValue)
      props.setShippingCountry(countryValue)
      props.setShippingPhone(phoneCustomer)
    handleModalChange();
  })
  const activator = 
  <Button 
    plain 
    onClick={handleModalChange}
  >
    Edit
  </Button>;
  var desSelectOptions = [];
    if (props.customerSelectedId) {
    return(
      <Query query={GET_ADDRESSES} variables={{ id: String(props.customerSelectedId) }}>
      {({ data, loading, error }) => {
        if (loading) return 'loading'
        if (error) return <p>{error.message}</p>;
        if (data) {
          desSelectOptions = data.customer.addresses.map((arrayAddress) =>{
            return {
              content: 
                <div>
                  <div>{arrayAddress.firstName} {arrayAddress.lastName}</div>
                  <div>{arrayAddress.company}</div>
                  <div>{arrayAddress.address1}</div>
                  <div>{arrayAddress.address2}</div>
                  <div>
                    {arrayAddress.zip} {arrayAddress.city} {arrayAddress.province}
                  </div>
                  <div>{arrayAddress.country}</div>
                </div>,
              onAction:() => {
                setFirstName(arrayAddress.firstName);
                setLastName(arrayAddress.lastName);
                setCompany(arrayAddress.company);
                setAddress1(arrayAddress.address1);
                setAddress2(arrayAddress.address2);
                setPostalCodeValue(arrayAddress.zip);
                setCity(arrayAddress.city);
                setRegionValue(arrayAddress.province);
                setCountryValue(arrayAddress.country);
                setPhoneCustomer(arrayAddress.phone);
                togglePopoverActive();
              },
            }
          })
        };
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
                      <Popover
                        active={popoverActive}
                        activator={popOveActivator}
                        onClose={togglePopoverActive}
                      >
                        <ActionList
                          items={desSelectOptions}
                        />
                      </Popover>
                    </div>
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
                    <TextField
                      label="City"
                      value={city}
                      onChange={cityChange}
                      autoComplete="off"
                    />
                    <div style={{width:"100%", display:"inline-flex"}}>
                      <div style={{width:"33.33" + "%", paddingRight:"5px"}}>
                        <p style={{marginBottom:"4px"}}>Country/region</p>
                          <CountryDropdown
                            id='country'
                            classes='test'
                            value={countryValue}
                            onChange={countryChange} 
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
    }}
    </Query>
    )} else {
      return (
      <Card>
      </Card>
      )
    }
}
export { ModalShippingAddress }
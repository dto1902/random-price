import React, {useCallback, useState, useMemo} from 'react';
import {Form, Modal, Subheading, TextField, Layout, Checkbox, Label, TextContainer, Button, Banner, Toast } from '@shopify/polaris';
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const CUSTOMER_CREATE = gql`
  mutation customerCreate($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer {
        id,
      }
      userErrors {
        field
        message
      }
    }
  }
`;
function CreateCustomer(props) {

  const handleModalChange = useCallback(() => props.setActive(!props.active), [props.active]);
  const [selectedExport, setSelectedExport] = useState('');
  const [firstName, setFirstName] = useState('');
  const firstNameChange = useCallback((newValue) => setFirstName(newValue), []);
  const [lastName, setLastName] = useState('');
  const lastNameChange = useCallback((newValue) => setLastName(newValue), []);
  const [emailName, setEmailName] = useState('');
  const emailChange = useCallback((newValue) => setEmailName(newValue), []);
  const [checkedMarketing, setCheckedMarketing] = useState(false);
  const checkedMarketingChange = useCallback((newChecked) => setCheckedMarketing(newChecked), []);
  const [checkedtax, setCheckedtax] = useState(false);
  const taxChange = useCallback((newChecked) => setCheckedtax(newChecked), []);
  const [companyValue, setCompanyValue] = useState('');
  const companyChange = useCallback((newValue) => setCompanyValue(newValue), []);
  const [addressValue, setAddressValue] = useState('');
  const addressChange = useCallback((newValue) => setAddressValue(newValue), []);
  const [address2Value, setAddressValue2] = useState('');
  const address2Change = useCallback((newValue) => setAddressValue2(newValue), []);
  const [cityValue, setCityValue] = useState('');
  const cityChange = useCallback((newValue) => setCityValue(newValue), []);
  const [countryValue, setCountryValue] = useState('');
  const countryChange = useCallback((newValue) => setCountryValue(newValue), []);
  const [regionValue, setRegionValue] = useState('');
  const regionChange = useCallback((newValue) => setRegionValue(newValue), []);
  const [postalCodeValue, setPostalCodeValue] = useState('');
  const postalCodeChange = useCallback((newValue) => setPostalCodeValue(newValue), []);
  const [phoneValue, setPhoneValue] = useState('');
  const phoneChange = useCallback(newValue => setPhoneValue(newValue), []);

  const handleClose = () => {
    handleModalChange();
  };

  return (
  <Mutation mutation={CUSTOMER_CREATE}>
      {(handleSubmit, {error, data }) => {
      const [hasResults, setHasResults] = useState(false);

      const showError = error && (
          <Banner status="critical">{error.message}</Banner>) && ( 
          <Banner>{data.customerCreate.userErrors[0].message}</Banner>
      );

      const showToast = hasResults && (
          <Toast
          content="Successfully updated"
          onDismiss={() => setHasResults(false)}
          />
      );
  return (
    <Form>
      <Modal
        open={props.active}
        onClose={handleClose}
        title="Create a new customer"
        primaryAction={{
          content: 'Create customer',
          onAction: () => {
          let customerCreate = 
          {
            "firstName":firstName,
            "lastName":lastName,
            "email":emailName,
            "acceptsMarketing":checkedMarketing,
            "taxExempt":checkedtax,
            "addresses":{
              "company":companyValue,
              "address1":addressValue,
              "address2":address2Value,
              "city":cityValue,
              "country":countryValue,
              "province":regionValue,
              "provinceCode":postalCodeValue,
              "phone":phoneValue
            },
          }
      console.log(customerCreate)
      let promise = new Promise((resolve) => resolve());

      promise = promise.then(() => handleSubmit({ variables: { input: customerCreate }}))
          .then(response => {console.log(response)})
          .then(() => {
            setFirstName('');
            setLastName('');
            setEmailName('');
            setCheckedMarketing(false);
            setCheckedtax(false);
            setCompanyValue('');
            setAddressValue('');
            setAddressValue2();
            setCityValue('');
            setCountryValue('');
            setRegionValue('');
            setPostalCodeValue('');
            setPhoneValue('');
            handleModalChange();
          })
        }}}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: handleModalChange,
          },
        ]}
      >
        <Modal.Section>
          <Layout>
            {showToast}
            <Layout.Section>
                {showError}
            </Layout.Section>
            <Layout.Section>
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
                label="Email"
                value={emailName}
                onChange={emailChange}
                autoComplete="off"
                type="email"
              />
              </Layout.Section>
              <Layout.Section>
              <Checkbox
                label="Customer accepts email marketing"
                checked={checkedMarketing}
                onChange={checkedMarketingChange}
              />
              </Layout.Section>
              <Layout.Section>
              <Checkbox
                label="Customer is tax exempt"
                checked={checkedtax}
                onChange={taxChange}
              />
            </Layout.Section>
          </Layout>
        </Modal.Section>
        <Modal.Section>
          <Layout>
            <Layout.Section>
              <Subheading>
                Shipping address
              </Subheading>
              <TextField
                label="Company"
                value={companyValue}
                onChange={companyChange}
                autoComplete="off"
              />
              <TextField
                label="Address"
                value={addressValue}
                onChange={addressChange}
                autoComplete="off"
              />
              <TextField
                label="Apartment, suite, etc."
                value={address2Value}
                onChange={address2Change}
                autoComplete="off"
              />
              <TextField
                label="City"
                value={cityValue}
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
              <p style={{marginBottom:"4px"}}>Phone</p>
              <PhoneInput
                inputClass='test'
                country={'us'}
                value={phoneValue}
                onChange={phoneChange}
              />
            </Layout.Section>
            {/* <Layout.Section fullWidth>
              <div style={{textAlign: 'right'}}> 
                <Button
                  textAlign={"center"}
                  paddingLeft="5px"
                  onClick={() => {
                    handleModalChange();
                  }}
                >
                  Cancel
                </Button>
              
              <Button
                primary
                paddingRight="5px"
                textAlign={"center"}
                onClick={() => {
                  let customerCreate = 
                    {
                      "firstName":firstName,
                      "lastName":lastName,
                      "email":emailName,
                      "acceptsMarketing":checkedMarketing,
                      "taxExempt":checkedtax,
                      "addresses":{
                        "company":companyValue,
                        "address1":addressValue,
                        "address2":address2Value,
                        "city":cityValue,
                        "country":countryValue,
                        "province":regionValue,
                        "provinceCode":postalCodeValue,
                        "phone":phoneValue
                      },
                    }
                console.log(customerCreate)
                let promise = new Promise((resolve) => resolve());

                promise = promise.then(() => handleSubmit({ variables: { input: customerCreate }}))
                    .then(response => {console.log(response)})
                    .then(() => {
                      setFirstName('');
                      setLastName('');
                      setEmailName('');
                      setCheckedMarketing('');
                      setCheckedtax('');
                      setCompanyValue('');
                      setAddressValue('');
                      setAddressValue2();
                      setCityValue('');
                      setCountryValue('');
                      setRegionValue('');
                      setPostalCodeValue('');
                      setPhoneValue('');
                      handleModalChange();
                    })

                }
                }
                >
                  Create Customer
              </Button>
              </div>
            </Layout.Section> */}
          </Layout>
        </Modal.Section>
      </Modal>
    </Form>
  );
  }}
  </Mutation>
  )
}
export { CreateCustomer }
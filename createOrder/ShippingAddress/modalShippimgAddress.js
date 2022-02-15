import React, {useCallback, useState} from 'react';
import {Form, Modal, TextField, Layout, Checkbox, ActionList, Button, Card, Popover } from '@shopify/polaris';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';
import { NewProductCalculate } from '../Produtcs/ModalNewProduct';
import { ResourceProducts } from '../Produtcs/ResourceListProducts';
import { discount } from '../TablePayments/ModalAddDiscount';
import { customerId, selectedShippingAddress } from '../Customer/FindOrCreateCustomer';
import { shippingLine } from '../TablePayments/ModalAddShipping';
import { taxExempt } from '../TablePayments/ModalTaxes';

var shippingAddress = {};
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
  const phoneChange = useCallback(newValue => {setPhoneCustomer(newValue), []});
  const [popoverActive, setPopoverActive] = useState(true);
  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );
  const popOveActivator = (
    <Button onClick={togglePopoverActive} disclosure>
      Select address
    </Button>
  );
  const handleClose = () => {
    handleModalChange();
  };
  const saveInfo = useCallback(() => {
      props.setShippingFirstName(firstName);
      props.setShippingLastName(lastName);
      props.setShippingCompany(company);
      props.setShippingAddress1(address1);
      props.setShippingAddress2(address2);
      props.setShippingZip(postalCodeValue);
      props.setShippingCity(city);
      props.setShippingProvince(regionValue);
      props.setShippingCountry(countryValue);
      props.setShippingPhone(phoneCustomer);

      var allProducts = [];
      allProducts = allProducts.concat(ResourceProducts, NewProductCalculate);
      shippingAddress = {
        firstName: firstName,
        lastName: lastName,
        address1: address1,
        address2: address2,
        phone: phoneCustomer,
        city: city,
        country: countryValue,
        provinceCode: regionValue,
        zip: postalCodeValue
    }
      var allProducts = [];
      allProducts = allProducts.concat(ResourceProducts, NewProductCalculate);
      if (allProducts.length > 0){
        let promise = new Promise((resolve, reject) => resolve());
        let orderCalculateShipping = {
          lineItems: allProducts,
          appliedDiscount: discount,
          shippingAddress: shippingAddress,
          shippingLine: shippingLine,
          taxExempt: taxExempt
        }
      promise = promise.then(() => props.handleSubmit({ variables: { input: orderCalculateShipping }}))
        .then(response => {
          if (response.data.draftOrderCalculate.calculatedDraftOrder.availableShippingRates.length > 0) {
            props.setValueRadioButton(response.data.draftOrderCalculate.calculatedDraftOrder.availableShippingRates[0].handle);
            var shippingLine_2 = {
              price: response.data.draftOrderCalculate.calculatedDraftOrder.availableShippingRates[0].price.amount,
              shippingRateHandle: response.data.draftOrderCalculate.calculatedDraftOrder.availableShippingRates[0].handle,
              title: response.data.draftOrderCalculate.calculatedDraftOrder.availableShippingRates[0].title
            }
            var orderCalculateTotal = {
              lineItems: allProducts,
              appliedDiscount: discount,
              shippingAddress: shippingAddress,
              shippingLine: shippingLine_2,
              taxExempt: taxExempt
            }
          } else {
            var orderCalculateTotal = {
              lineItems: allProducts,
              appliedDiscount: discount,
              shippingAddress: shippingAddress,
              shippingLine: shippingLine,
              taxExempt: taxExempt
            }
          }

          promise = promise.then(() => props.handleSubmit({ variables: { input: orderCalculateTotal }}))
          .then(response => {
            props.setArrayAvailableShippingRates(response.data.draftOrderCalculate.calculatedDraftOrder.availableShippingRates);
            props.setAddShippingReason(orderCalculateTotal.shippingLine.title);
            props.setAddShipping((parseFloat(orderCalculateTotal.shippingLine.price)))
            if(response.data.draftOrderCalculate.calculatedDraftOrder.taxLines.length > 0){
              props.setTaxPercentage(response.data.draftOrderCalculate.calculatedDraftOrder.taxLines[0].ratePercentage);
              props.setTotalTax(parseFloat(response.data.draftOrderCalculate.calculatedDraftOrder.totalTax));
            } else {
              props.setTaxPercentage('Not collected');
              props.setTotalTax(0);
            };
            props.setTaxLines(response.data.draftOrderCalculate.calculatedDraftOrder.taxLines);
            props.setTotalPrice(parseFloat(response.data.draftOrderCalculate.calculatedDraftOrder.totalPrice));
          })
        })
      }
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
  // var desSelectOptions2 = [];
    // if (props.customerSelectedId) {
          var desSelectOptions = selectedShippingAddress[0].map((arrayAddress) =>{
            return ({
              content:
                <>
                  <p>{arrayAddress.firstName} {arrayAddress.lastName}</p>
                  <p>{arrayAddress.company}</p>
                  <p>{arrayAddress.address1}</p>
                  <p>{arrayAddress.address2}</p>
                  <p>{arrayAddress.zip} {arrayAddress.city} {arrayAddress.province}</p>
                  <p>{arrayAddress.country}</p>
                </>,
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
            })
          })
          console.log(desSelectOptions);
        return (
          <Form>
            <Modal
              activator={activator}
              open={active}
              onClose={handleClose}
              title="Edit Recipient Info"
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
                            // valueType="short"
                            id='country'
                            classes='test'
                            value={countryValue}
                            onChange={countryChange} 
                          />
                        </div>
                      <div style={{width:"33.33" + "%", paddingLeft:"5px"}}>
                        <p style={{marginBottom:"4px"}}>State</p>
                        <RegionDropdown
                          // countryValueType="short"
                          classes='test'
                          country={countryValue}
                          value={regionValue}
                          onChange={regionChange} 
                        />
                      </div>
                      <div style={{width:"33.33" + "%", paddingLeft:"10px"}}>
                      <TextField
                        label="Zip Code"
                        value={postalCodeValue}
                        onChange={postalCodeChange}
                        autoComplete="off"
                      />
                      </div>
                    </div>
                    <p style={{marginBottom:"4px"}}>Phone</p>
                    <input
                      className = 'test'
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
  // } else {
  //     return (
  //     <Card>
  //     </Card>
  //     )
  //   }
}
export { ModalShippingAddress, shippingAddress }
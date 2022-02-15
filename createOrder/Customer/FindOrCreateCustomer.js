import React, { useState} from 'react';
import {Autocomplete, Card, Icon, Stack, Subheading, Layout } from '@shopify/polaris';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { SearchMinor} from '@shopify/polaris-icons';
import { CreateCustomer } from './CreateCustomer';
import { ModalEditCustomerInfo } from '../Customer/ModalEditCustomerInfo';
import { ModalBillingAddress } from './ModalBillingAddress';
import { CancelSmallMinor} from '@shopify/polaris-icons';
import { ModalShippingAddress } from '../ShippingAddress/modalShippimgAddress';
import { NewProductCalculate } from '../Produtcs/ModalNewProduct';
import { ResourceProducts } from '../Produtcs/ResourceListProducts';
import { discount } from '../TablePayments/ModalAddDiscount';import { DeliveryDate } from '../DeliveryDate';
import { PickUpDate } from '../PickUpDate';

const GET_CUSTOMERS = gql`
query ($query: String!){
  customers(first: 10, query: $query) {
    edges {
      node {
        firstName
        lastName
        email
        id
        phone
        ordersCount
        addresses{
          firstName
          lastName
          company
          address1
          address2
          zip
          provinceCode
          city
          country
          phone
          id
        }
      }
    }
  }
}
`
var customerId = '';
var billingAddress = {}, contactInformation = {}, shippingAddress ={}, selectedShippingAddress = [];
function FindOrCreateCustomer(props) {
  const [inputValue, setInputValue] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const updateText = (value) => setInputValue(value);
  const [active, setActive] = useState(false);
  const [emailCustomer, setEmailCustomer] = useState('');
  const [phoneCustomer, setPhoneCustomer] = useState('');

  const [addressesFirstName, setAddressesFirstName] = useState('');
  const [addressesLastName, setAddressesLastName] = useState('');
  const [addressesCompany, setAddressesCompany] = useState('');
  const [addressesaddress1, setAddressesaddress1] = useState('');
  const [addressesaddress2, setAddressesaddress2] = useState('');
  const [addressesZip, setAddressesZip] = useState('');
  const [addressesCity, setAddressesCity] = useState('');
  const [addressesProvinceCode, setAddressesProvinceCode] = useState('');
  const [addressesCountry, setAddressesCountry] = useState('');
  const [addressesPhone, setAddressesPhone] = useState('');
  const [names, setNames] = useState('');
  const [ordersCountCustomer, setOrdersCountCustomer] = useState(0);
  const [shippingFirstName, setShippingFirstName] = useState('');
  const [shippingLastName, setShippingLastName] = useState('');
  const [shippingCompany, setShippingCompany] = useState('');
  const [shippingAddress1, setShippingAddress1] = useState('');
  const [shippingAddress2, setShippingAddress2] = useState('');
  const [shippingZip, setShippingZip] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingProvince, setShippingProvince] = useState('');
  const [shippingCountry, setShippingCountry] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  
  var loadingCustomers = false;
  var selectedBillingAddress = [];

return(
  <Query query={GET_CUSTOMERS} variables={{ query: inputValue }}>
    {({ data, loading, error }) => {
      if (loading) {
        loadingCustomers = true;
        var options = loadingCustomers;
      } else {
        loadingCustomers = false;
        var options = data.customers.edges.map(getInfo);
      };
      if (error) return <p>{error.message}</p>;
      // const customerById = {};
      // if (data) {
      // data.customers.edges.forEach(customer => customerById[customer.node.id] = customer);
      // };
      
      function getInfo(getInfo) {
        return {
          'value': getInfo.node.id,
          'label': `${getInfo.node.firstName} ${getInfo.node.lastName} ${getInfo.node.email}`,
          'onlyNames': `${getInfo.node.firstName} ${getInfo.node.lastName}`,
          'email': getInfo.node.email,
          'phone': getInfo.node.phone,
          'addresses': getInfo.node.addresses,
          'ordersCount':getInfo.node.ordersCount,
        };
      };
      // const options = deselectedOptions;

      const updateSelection = (selected) => {
          const selectedText = selected.map((selectedItem) => {
            const matchedOption = options.find((option) => {
              return (option.value.match(selectedItem));
            });
            return matchedOption && matchedOption.onlyNames;
          });
          const selectedContactInfo = selected.map((selectedItem) => {
            const matchedOption = options.find((option) => {
              return (option.value.match(selectedItem));
            });
            return {
              'emailCustomer': matchedOption.email || 'No email',
              'phoneCustomer': matchedOption.phone || 'No phone number',
              'ordersCount': matchedOption.ordersCount};
          });
          setNames(selectedText[0]);
          setOrdersCountCustomer(selectedContactInfo[0].ordersCount);
          setEmailCustomer(selectedContactInfo[0].emailCustomer);
          setPhoneCustomer(selectedContactInfo[0].phoneCustomer);
          
          setSelectedOptions(selected);
          setInputValue(selectedText[0]);
          props.setCustomerSelectedId(selected);
          customerId = selected;
          
          selectedBillingAddress = selected.map((selectedItem) => {
            const matchedOption = options.find((option) => {
              return (option.value.match(selectedItem));
            });
            if(matchedOption.addresses[0]){
              return {
                'addressesFirstName': matchedOption.addresses[0].firstName,
                'addressesLastName': matchedOption.addresses[0].lastName,
                'addressesCompany': matchedOption.addresses[0].company,
                'addressesaddress1': matchedOption.addresses[0].address1,
                'addressesaddress2': matchedOption.addresses[0].address2,
                'addressesZip': matchedOption.addresses[0].zip,
                'addressesCity': matchedOption.addresses[0].city,
                'addressesProvinceCode': matchedOption.addresses[0].provinceCode,
                'addressesCountry': matchedOption.addresses[0].country,
                'addressesPhone': matchedOption.addresses[0].phone,
              };
            }
          });
          if(selectedBillingAddress[0] !== undefined){
            setAddressesFirstName(selectedBillingAddress[0].addressesFirstName);
            setAddressesLastName(selectedBillingAddress[0].addressesLastName);
            setAddressesCompany(selectedBillingAddress[0].addressesCompany);
            setAddressesaddress1(selectedBillingAddress[0].addressesaddress1);
            setAddressesaddress2(selectedBillingAddress[0].addressesaddress2);
            setAddressesZip(selectedBillingAddress[0].addressesZip);
            setAddressesCity(selectedBillingAddress[0].addressesCity);
            setAddressesProvinceCode(selectedBillingAddress[0].addressesProvinceCode);
            setAddressesCountry(selectedBillingAddress[0].addressesCountry);
            setAddressesPhone(selectedBillingAddress[0].addressesPhone);
          } else {
            setAddressesFirstName('');
            setAddressesLastName('');
            setAddressesCompany('');
            setAddressesaddress1('');
            setAddressesaddress2('');
            setAddressesZip('');
            setAddressesCity('');
            setAddressesProvinceCode('');
            setAddressesCountry('');
            setAddressesPhone('');
        };
        selectedShippingAddress = selected.map((selectedItem) => {
          const matchedOption = options.find((option) => {
            return (option.value.match(selectedItem));
          });
          return matchedOption.addresses
          // if(matchedOption.addresses[1]){
          //   return {
          //     'addressesFirstName': matchedOption.addresses[1].firstName,
          //     'addressesLastName': matchedOption.addresses[1].lastName,
          //     'addressesCompany': matchedOption.addresses[1].company,
          //     'addressesaddress1': matchedOption.addresses[1].address1,
          //     'addressesaddress2': matchedOption.addresses[1].address2,
          //     'addressesZip': matchedOption.addresses[1].zip,
          //     'addressesCity': matchedOption.addresses[1].city,
          //     'addressesProvinceCode': matchedOption.addresses[1].provinceCode,
          //     'addressesCountry': matchedOption.addresses[1].country,
          //     'addressesPhone': matchedOption.addresses[1].phone,
          //   };
          // }
        });
      }
      if(ordersCountCustomer === 0){
        var ordersNumber = 'No orders';
      } else if (ordersCountCustomer === 1){
        var ordersNumber = `${ordersCountCustomer} order`
      } else if (ordersCountCustomer >= 2){
        var ordersNumber = `${ordersCountCustomer} orders`
      }
      var info= "", contactInfo = "", infoBillingAddress = "";
      
      if (props.customerSelectedId) {
        info = 
          <Card.Section>
            <div>{names}</div>
            <div>{ordersNumber}</div>
          </Card.Section>;

        contactInfo = 
          <Card.Section>
            <Stack>
              <Stack.Item fill>
                <Subheading fullWidth={true}>
                  CONTACT INFORMATION
                </Subheading>
              </Stack.Item>
              <Stack.Item>
                <ModalEditCustomerInfo
                  emailCustomer = {emailCustomer}
                  setEmailCustomer = {setEmailCustomer}
                  phoneCustomer = {phoneCustomer}
                  setPhoneCustomer = {setPhoneCustomer}
                />
              </Stack.Item>
            </Stack>
            <div style={{marginTop:'1em'}}><p>{emailCustomer}</p></div>
            <div style={{marginTop:'1em'}}><p>{phoneCustomer}</p></div>
          </Card.Section>;
          
        if(addressesFirstName != '' || addressesLastName != '' || addressesCompany != '' || addressesaddress1 != '' || addressesaddress2 != '' || addressesZip != '' || addressesCity != '' || addressesProvinceCode != '' || addressesCountry != '' || addressesPhone != ''){
          infoBillingAddress =
            <Card.Section>
              <Stack>
                <Stack.Item fill>
                  <Subheading fullWidth={true}>Billing Address</Subheading>
                </Stack.Item>
                <Stack.Item>
                  <ModalBillingAddress
                    addressesFirstName = {addressesFirstName}
                    setAddressesFirstName = {setAddressesFirstName}
                    addressesLastName = {addressesLastName}
                    setAddressesLastName = {setAddressesLastName}
                    addressesCompany = {addressesCompany}
                    setAddressesCompany = {setAddressesCompany}
                    addressesaddress1 = {addressesaddress1}
                    setAddressesaddress1 = {setAddressesaddress1}
                    addressesaddress2 = {addressesaddress2}
                    setAddressesaddress2 = {setAddressesaddress2}
                    addressesZip = {addressesZip}
                    setAddressesZip = {setAddressesZip}
                    addressesCity = {addressesCity}
                    setAddressesCity = {setAddressesCity}
                    addressesProvinceCode = {addressesProvinceCode}
                    setAddressesProvinceCode = {setAddressesProvinceCode}
                    addressesCountry = {addressesCountry}
                    setAddressesCountry = {setAddressesCountry}
                    addressesPhone = {addressesPhone}
                    setAddressesPhone = {setAddressesPhone}
                  />
                </Stack.Item>
              </Stack>
              <div style={{marginTop:'1em'}}><p >{addressesFirstName} {addressesLastName}</p></div>
              <div><p>{addressesCompany}</p></div>
              <div><p>{addressesaddress1}</p></div>
              <div><p>{addressesaddress2}</p></div>
              <div><p>{addressesZip} {addressesCity} {addressesProvinceCode}</p></div>
              <div><p>{addressesCountry}</p></div>
              <div><p>{addressesPhone}</p></div>
            </Card.Section>
        } else {
          infoBillingAddress = 
            <Card.Section>
              <Stack>
                <Stack.Item fill>
                  <Subheading fullWidth={true}>Billing Address</Subheading>
                </Stack.Item>
                <Stack.Item>
                  <ModalBillingAddress
                    addressesFirstName = {addressesFirstName}
                    setAddressesFirstName = {setAddressesFirstName}
                    addressesLastName = {addressesLastName}
                    setAddressesLastName = {setAddressesLastName}
                    addressesCompany = {addressesCompany}
                    setAddressesCompany = {setAddressesCompany}
                    addressesaddress1 = {addressesaddress1}
                    setAddressesaddress1 = {setAddressesaddress1}
                    addressesaddress2 = {addressesaddress2}
                    setAddressesaddress2 = {setAddressesaddress2}
                    addressesZip = {addressesZip}
                    setAddressesZip = {setAddressesZip}
                    addressesCity = {addressesCity}
                    setAddressesCity = {setAddressesCity}
                    addressesProvinceCode = {addressesProvinceCode}
                    setAddressesProvinceCode = {setAddressesProvinceCode}
                    addressesCountry = {addressesCountry}
                    setAddressesCountry = {setAddressesCountry}
                    addressesPhone = {addressesPhone}
                    setAddressesPhone = {setAddressesPhone}
                  />
                </Stack.Item>
              </Stack>
              <div><p>No Billing address provided</p></div>
            </Card.Section>
        };
      };
        
      const textField = (
        <Autocomplete.TextField
          onChange={updateText}
          label="Find or Create Customer"
          value={inputValue}
          prefix={<Icon source={SearchMinor} color="inkLighter" />}
          placeholder="Search"
          autoComplete="new-password"
          ariaAutocomplete='whatever'
          id='textFieldAutocomplete'
          onFocus={(event) => {
              event.target.autocomplete = "not-autocomplete";
          }}
        />
      );
      var shippingInfo = '';
      if (props.customerSelectedId) {
        shippingInfo = <>
        <div style={{marginTop:'1em'}}><p >{shippingFirstName} {shippingLastName}</p></div>
        <div><p>{shippingCompany}</p></div>
        <div><p>{shippingAddress1}</p></div>
        <div><p>{shippingAddress2}</p></div>
        <div><p>{shippingZip} {shippingCity} {shippingProvince}</p></div>
        <div><p>{shippingCountry}</p></div>
        <div><p>{shippingPhone}</p></div>
        </>
      }
      contactInformation = {
        "email": emailCustomer,
      };
      billingAddress = {
        "firstName": addressesFirstName,
        "lastName": addressesLastName,
        "company": addressesCompany,
        "address1": addressesaddress1,
        "address2": addressesaddress2,
        "zip": addressesZip,
        "city": addressesCity,
        "province": addressesProvinceCode,
        "country": addressesCountry,
        "phone": addressesPhone
      };
      shippingAddress = {
        "firstName": shippingFirstName,
        "lastName": shippingLastName,
        "company": shippingCompany,
        "address1": shippingAddress1,
        "address2": shippingAddress2,
        "zip": shippingZip,
        "city": shippingCity,
        "province": shippingProvince,
        "country": shippingCountry,
        "phone": shippingPhone
      };
      var cardDateAndTime =
        <Card>
        <div id='DeliveryDate'>
          <DeliveryDate />
        </div>
        <div id='PickUpDate' style={{display:'none'}}>
          <PickUpDate />
        </div>
      </Card>;
      return (
        !props.customerSelectedId ? (
          <>
            <div style={{width: '100%', display: 'flex'}}>
            <div style={{width: '50%', marginRight: '10px'}}>
              <Card>
                <Card.Section>
                  <CreateCustomer 
                    active={active}
                    setActive={setActive}
                    setNames={setNames}
                    setInputValue={setInputValue}
                    setCustomerSelectedId={props.setCustomerSelectedId}
                    setEmailCustomer = {setEmailCustomer}
                    setPhoneCustomer = {setPhoneCustomer}
                    setAddressesFirstName = {setAddressesFirstName}
                    setAddressesLastName = {setAddressesLastName}
                    setAddressesCompany = {setAddressesCompany}
                    setAddressesaddress1 = {setAddressesaddress1}
                    setAddressesaddress2 = {setAddressesaddress2}
                    setAddressesZip = {setAddressesZip}
                    setAddressesCity = {setAddressesCity}
                    setAddressesProvinceCode = {setAddressesProvinceCode}
                    setAddressesCountry = {setAddressesCountry}
                    setAddressesPhone = {setAddressesPhone}
                    setOrdersCountCustomer = {setOrdersCountCustomer}
                  />
                  <Autocomplete
                    actionBefore={{
                      accessibilityLabel: 'Action label',
                      content: 'Create a new customer',
                      onAction: () => {
                        setActive(!active), [active];
                      }
                    }}
                    options={options}
                    selected={selectedOptions}
                    onSelect={updateSelection}
                    listTitle="Suggested Customers"
                    loading={loadingCustomers}
                    textField={textField}
                    autoComplete="whatever"
                    autocomplete="whatever"
                  />
                </Card.Section>
              </Card>
            </div>
            <div style={{width: '50%', marginLeft: '10px'}}>
              <Card>
                <Card.Section>
                  <Stack>
                    <Stack.Item fill>
                      {/* <Subheading fullWidth={true}> */}
                        Recipient Info
                      {/* </Subheading> */}
                    </Stack.Item>
                  </Stack>
                </Card.Section>
              </Card>
              {cardDateAndTime}
            </div>
            </div>
          </>
        ) : (
          <>
            <div style={{width: '100%', display: 'flex'}}>
            <div style={{width: '50%', marginRight: '10px'}}>
            <Card
                title="Customer" 
                actions={[
                  {
                    content: <Icon source={CancelSmallMinor} color="critical" />,
                    onAction: () => {
                      setInputValue('')
                      props.setCustomerSelectedId('');
                      setActive(false)
                      setShippingFirstName('');
                      setShippingLastName('');
                      setShippingCompany('');
                      setShippingAddress1('');
                      setShippingAddress2('');
                      setShippingZip('');
                      setShippingCity('');
                      setShippingProvince('');
                      setShippingCountry('');
                      setShippingPhone('');
                      customerId=[]
                    }
                  }
                ]}
              >
                {info}
                {contactInfo}
                {infoBillingAddress}
              </Card>
            </div>
            <div style={{width: '50%', marginLeft: '10px'}}>
            <Card>
                <Card.Section>
                  <Stack>
                    <Stack.Item fill>
                      {/* <Subheading fullWidth={true}> */}
                        Recipient Info
                      {/* </Subheading> */}
                    </Stack.Item>
                    <Stack.Item>
                      <ModalShippingAddress
                        customerSelectedId={props.customerSelectedId}
                        setCustomerSelectedId={props.setCustomerSelectedId}
                        setShippingFirstName={setShippingFirstName}
                        setShippingLastName={setShippingLastName}
                        setShippingCompany={setShippingCompany}
                        setShippingAddress1={setShippingAddress1}
                        setShippingAddress2={setShippingAddress2}
                        setShippingZip={setShippingZip}
                        setShippingCity={setShippingCity}
                        setShippingProvince={setShippingProvince}
                        setShippingCountry={setShippingCountry}
                        setShippingPhone={setShippingPhone}
                        handleSubmit={props.handleSubmit}
                        setTotalPrice={props.setTotalPrice}
                        setTaxPercentage={props.setTaxPercentage}
                        setTotalTax={props.setTotalTax}
                        setAddShipping = {props.setAddShipping}
                        setAddShippingReason = {props.setAddShippingReason}
                        setTaxLines={props.setTaxLines}
                        setArrayAvailableShippingRates={props.setArrayAvailableShippingRates}
                        valueRadioButton={props.valueRadioButton}
                        setValueRadioButton={props.setValueRadioButton}
                      />
                    </Stack.Item>
                    
                  </Stack>
                  {shippingInfo}
                </Card.Section>
              </Card>
              <Card>
                {cardDateAndTime}
              </Card>
            </div>
            </div>
          </>
        )
      );
    }}
  </Query>
  )
}
export { FindOrCreateCustomer, customerId, billingAddress, shippingAddress, contactInformation, selectedShippingAddress }
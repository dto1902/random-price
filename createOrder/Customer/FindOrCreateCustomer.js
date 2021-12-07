import React, { useState} from 'react';
import {Autocomplete, Card, Icon, Stack, Subheading } from '@shopify/polaris';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { SearchMinor} from '@shopify/polaris-icons';
import { CreateCustomer } from './CreateCustomer';
import { ModalEditCustomerInfo } from '../Customer/ModalEditCustomerInfo';

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
        }
      }
    }
  }
}
`
var customerId = '';
function FindOrCreateCustomer() {
  const [inputValue, setInputValue] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const updateText = (value) => setInputValue(value);
  const [active, setActive] = useState(false);
  const [contactInfo, setContactInfo] = useState([]);
  const [billingAddress, setBillingAddress] = useState([]);
  const [activeEditCustomerInfo, setActiveEditCustomerInfo] = useState(false);
  const [emailCustomer, setEmailCustomer] = useState('');
  const [phoneCustomer, setPhoneCustomer] = useState('');
  var loadingCustomers = false;
return(
  <Query query={GET_CUSTOMERS} variables={{ query: inputValue }}>
    {({ data, loading, error }) => { // Refetches products by ID
      if (loading) {
        loadingCustomers = true;
        var deselectedOptions = loadingCustomers;
      } else {
        loadingCustomers = false;
        var deselectedOptions = data.customers.edges.map(getInfo);
      };
      if (error) return <p>{error.message}</p>;
      
      const customerById = {};
      if (data) {
      data.customers.edges.forEach(customer => customerById[customer.node.id] = customer);
      };
      
      function getInfo(getInfo) {
        return {
          'value': getInfo.node.id,
          'label': `${getInfo.node.firstName} ${getInfo.node.lastName} ${getInfo.node.email}`,
          'onlyNames': `${getInfo.node.firstName} ${getInfo.node.lastName}`,
          'email': getInfo.node.email,
          'phone': getInfo.node.phone,
          'addresses': getInfo.node.addresses,
        };
      };
      
      const options = deselectedOptions;

      const updateSelection = 
        (selected) => {
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
            
            return {'emailCustomer': matchedOption.email || 'No email', 'phoneCustomer': matchedOption.phone || 'No phone number'};
          });
          
          setEmailCustomer(selectedContactInfo[0].emailCustomer);
          setPhoneCustomer(selectedContactInfo[0].phoneCustomer);
          
          setSelectedOptions(selected);
          setInputValue(selectedText[0]);
          customerId = selected;

          const selectedBillingAddress = selected.map((selectedItem) => {
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
            setBillingAddress(
              <Card.Section>
                <Subheading>Billing Address</Subheading>
                <div style={{marginTop:'1em'}}><p >{selectedBillingAddress[0].addressesFirstName} {selectedBillingAddress[0].addressesFirstName}</p></div>
                <div><p>{selectedBillingAddress[0].addressesCompany}</p></div>
                <div><p>{selectedBillingAddress[0].addressesaddress1}</p></div>
                <div><p>{selectedBillingAddress[0].addressesaddress2}</p></div>
                <div><p>{selectedBillingAddress[0].addressesZip} {selectedBillingAddress[0].addressesCity} {selectedBillingAddress[0].addressesProvinceCode}</p></div>
                <div><p>{selectedBillingAddress[0].addressesCountry}</p></div>
                <div><p>{selectedBillingAddress[0].addressesPhone}</p></div>
              </Card.Section>
            );
          } else {
            setBillingAddress(
              <Card.Section>
                <Subheading>Billing Address</Subheading>
                <div><p>No Billing address provided</p></div>
              </Card.Section>
            );
          }
        }
        var customerInfo = "";
        if (customerId) {
          customerInfo = 
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
        </Card.Section>
        } 
        const textField = (
          <Autocomplete.TextField
            onChange={updateText}
            label="Find or Create Customer"
            value={inputValue}
            prefix={<Icon source={SearchMinor} color="inkLighter" />}
            placeholder="Search"
            autoComplete="nope"
            ariaAutocomplete='nope'
            id='textFieldAutocomplete'
            onFocus={() => {
              let x = document.getElementById('textFieldAutocomplete').ariaAutocomplete;
            }}
          />
        );
        return (
          <Card>
            <Card.Section>
              <CreateCustomer 
                active={active}
                setActive={setActive}
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
                  autoComplete="nope"
                />
            </Card.Section>
            {customerInfo}
            {billingAddress}
          </Card>
        );
    }}
  </Query>
  )
}
export { FindOrCreateCustomer, customerId }
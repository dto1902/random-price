import React, {useCallback, useState} from 'react';
import {Card, Stack, Subheading } from '@shopify/polaris';
import { ModalShippingAddress } from './modalShippimgAddress'

function ShippingAddress(props) {
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
  return (
    <Card>
        <Card.Section>
        <Stack>
          <Stack.Item fill>
            <Subheading fullWidth={true}>
            Shipping Address
            </Subheading>
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
            />
          </Stack.Item>
          {shippingInfo}
        </Stack>
      </Card.Section>
    </Card>
  );
}
export { ShippingAddress }
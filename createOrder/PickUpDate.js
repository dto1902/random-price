import React, {useCallback, useState} from 'react';
import {TextField, Card } from '@shopify/polaris';

function PickUpDate() {
  const [pickUpDatevalue, setPickUpDatevalue] = useState('');
  const pickUpDatevalueChange = useCallback((newValue) => setPickUpDatevalue(newValue), []);


  return (
    <Card>
      <Card.Section>
          <TextField
            label="Delivery Date"
            value={pickUpDatevalue}
            onChange={pickUpDatevalueChange}
            autoComplete="off"
          />
        </Card.Section>
    </Card>
  );
}

export { PickUpDate }
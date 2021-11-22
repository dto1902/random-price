import React, {useCallback, useState} from 'react';
import {TextField, Card } from '@shopify/polaris';

function PickUpDate() {
  const [pickUpDatevalue, setPickUpDatevalue] = useState('');
  const pickUpDateValueChange = useCallback((newValue) => setPickUpDatevalue(newValue), []);


  return (
    <Card>
      <Card.Section>
          <TextField
            label="Delivery Date"
            value={pickUpDatevalue}
            onChange={pickUpDateValueChange}
            autoComplete="off"
          />
        </Card.Section>
    </Card>
  );
}

export { PickUpDate }
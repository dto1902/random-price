import React, {useCallback, useState} from 'react';
import {Card, TextField} from '@shopify/polaris';

function ShippingAddress() {

  const [recipientInfoValue, setRecipientInfoValue] = useState('');
  const RecipientInfoChange = useCallback((newValue) => setRecipientInfoValue(newValue), []);

  return (
    <Card>
        <Card.Section>
            <TextField
                label="Shipping Address"
                value={recipientInfoValue}
                onChange={RecipientInfoChange}
                autoComplete="off"
            />
      </Card.Section>
    </Card>
  );
}
export { ShippingAddress }
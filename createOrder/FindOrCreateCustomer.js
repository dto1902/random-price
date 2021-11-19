import React, {useCallback, useState} from 'react';
import {Card, TextField} from '@shopify/polaris';

function FindOrCreateCustomer() {

  const [findCustomer, setFindCustomer] = useState('');
  const FindChange = useCallback((newValue) => setFindCustomer(newValue), []);

  return (
    <Card>
        <Card.Section>
            <TextField
                label="Find or Create Customer"
                value={findCustomer}
                onChange={FindChange}
                autoComplete="off"
            />
      </Card.Section>
    </Card>
  );
}
export { FindOrCreateCustomer }
import React, {useCallback, useState} from 'react';
import {Card, TextField} from '@shopify/polaris';

function RecipientInfo() {

  const [recipientInfoValue, setRecipientInfoValue] = useState('');
  const RecipientInfoChange = useCallback((newValue) => setRecipientInfoValue(newValue), []);

  return (
    <Card>
        <Card.Section>
            <TextField
                label="Find or Create Customer"
                value={recipientInfoValue}
                onChange={RecipientInfoChange}
                autoComplete="off"
            />
      </Card.Section>
    </Card>
  );
}
export { RecipientInfo }
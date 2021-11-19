import React, {useCallback, useState} from 'react';
import {Card, TextField} from '@shopify/polaris';

function RecipientReferentName() {

  const [recipientValue, setRecipientValue] = useState('');
  const recipientValueChange = useCallback((newValue) => setRecipientValue(newValue), []);

  return (
    <Card>
        <Card.Section>
            <TextField
                label="Find or Create Customer"
                value={recipientValue}
                onChange={recipientValueChange}
                autoComplete="off"
            />
      </Card.Section>
    </Card>
  );
}
export { RecipientReferentName }
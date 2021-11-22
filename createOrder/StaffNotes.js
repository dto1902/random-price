import React, {useCallback, useState} from 'react';
import {Card, TextField} from '@shopify/polaris';

function StaffNotes(props) {
  const [staffNotesValue, setStaffNotesValue] = useState('')
  const StaffNotesChange = useCallback((newValue) => setStaffNotesValue(newValue), []);

  return (
    <Card>
        <Card.Section>
            <TextField
                id='StaffNotesValue'
                label="Specials Instructions"
                value={staffNotesValue}
                onChange={StaffNotesChange}
                autoComplete="off"
            />
      </Card.Section>
    </Card>
  );
}
export { StaffNotes }
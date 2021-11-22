import React, {useCallback, useState} from 'react';
import {Card, TextField} from '@shopify/polaris';

function Note(props) {

  const notesChange = useCallback((newValue) => props.setNoteValue(newValue), []);

  return (
    <Card>
        <Card.Section>
            <TextField
                label="Notes"
                value={props.noteValue}
                onChange={notesChange}
                autoComplete="off"
            />
      </Card.Section>
    </Card>
  );
}
export { Note }
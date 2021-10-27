import React, {useCallback, useState} from 'react';
import {TextField} from '@shopify/polaris';

function NumberFieldExample(prop) {
  const [value, setValue] = useState('1');

  const handleChange = useCallback((newValue) => setValue(newValue), []);
  console.log(document.getElementById(prop.id))
  return (
    <TextField
      type="number"
      id={prop.id}
      value={value}
      onChange={handleChange}
      autoComplete="off"
      min='1'
      max={prop.max}
      
    />
  );
}
export { NumberFieldExample }

import React, {useCallback, useState} from 'react';
import {TextField} from '@shopify/polaris';

const TextFieldExample = () => {

    const [value, setValue] = useState('Jaded Pixel');

    const handleChange = useCallback((newValue) => setValue(newValue), []);

    return (
        <TextField
        label="Store name"
        value={value}
        onChange={handleChange}
        autoComplete="off"
        />
    );

}

export default TextFieldExample();

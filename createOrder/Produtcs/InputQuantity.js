import React, {useCallback, useState} from 'react';
import {IndexTable, TextField, TextStyle, Link} from '@shopify/polaris';
import { ModalPrice } from './ModalPrice'


function ValueQuantity(props) {
  var [valueQuantityText, setValueQuantityText] = useState('1');
  const [priceDiscount, setPriceDiscount] = useState(props.price);

  const quantityChange = useCallback((newValue) => {
    setValueQuantityText(newValue), []
  });
  return (
    <>
      <IndexTable.Cell>
        <p><TextStyle><Link url={props.onlyproductid} external={true}>{props.titleProduct}</Link></TextStyle></p>
        <p><TextStyle>{props.titleVariant}</TextStyle></p>
        <p><TextStyle>{props.sku}</TextStyle></p>
        <TextStyle>
          <ModalPrice 
            price={props.price}
            id={props.id}
            resourcesIds={props.resourcesIds}
            setResourcesIds={props.setResourcesIds}
            priceDiscount={priceDiscount}
            setPriceDiscount={setPriceDiscount}
          />
        </TextStyle>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <TextField
          type="number"
          id={'id:' + props.id}
          value={valueQuantityText}
          onChange={quantityChange}
          autoComplete="off"
          min='1'
          max={props.max}
        />
      </IndexTable.Cell>
      <IndexTable.Cell>
        {(priceDiscount * valueQuantityText).toFixed(2)}
      </IndexTable.Cell>
    </>
  );
}
export { ValueQuantity }

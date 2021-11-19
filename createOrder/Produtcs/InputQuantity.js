import React, {useCallback, useState} from 'react';
import {IndexTable, TextField, TextStyle, Link} from '@shopify/polaris';
import { ModalPrice } from './ModalPrice'


function ValueQuantity(props) {
  if (props.quantity) {
    var qty = props.quantity;
  } else {
    var qty = '1'
  }
  var [valueQuantityText, setValueQuantityText] = useState(qty);
  const [priceDiscount, setPriceDiscount] = useState(props.price);

  const quantityChange = useCallback((newValue) => {
    setValueQuantityText(newValue), []
  });
  
  if (props.onlyproductid) {
    var title = <Link url={props.onlyproductid} external={true}>{props.titleProduct}</Link>;
  } else {
    var title = props.titleProduct
  }
  return (
    <>
      <IndexTable.Cell>
        <p><TextStyle>{title}</TextStyle></p>
        <p><TextStyle>{props.title}</TextStyle></p>
        <p><TextStyle>{props.sku}</TextStyle></p>
          <ModalPrice 
            price={props.price}
            id={props.id}
            resourcesIds={props.resourcesIds}
            setResourcesIds={props.setResourcesIds}
            priceDiscount={priceDiscount}
            setPriceDiscount={setPriceDiscount}
          />
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

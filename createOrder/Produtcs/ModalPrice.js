import React, {useCallback, useState} from 'react';
import {Button, Modal, FormLayout, Select, TextStyle, TextField} from '@shopify/polaris';

var discountObject = [], priceWithDiscount = 0;
function ModalPrice(props) {
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState('Amount');
  const [valueDiscount, setValueDiscount] = useState(0);
  const [valueReason, setValueReason] = useState('test');
  
  

  const handleChange = useCallback(() => { setActive(!active), [active] });
  const handleApply = useCallback(() => {
    if(selected === 'Amount') {
      let price = props.price;
      price = parseFloat(price) - parseFloat(valueDiscount);
      if (price <= 0 ) {
        props.setPriceDiscount('0')
      } else {
        props.setPriceDiscount(price.toFixed(2))
      }
    } else {
      let price = props.price;
      price = parseFloat(price) - (parseFloat(price) * (parseFloat(valueDiscount) / 100));
      if (price <= 0 ) {
        props.setPriceDiscount('0')
      } else {
        props.setPriceDiscount(price.toFixed(2))
      }
    }
    var arrayDiscountObject = discountObject.map((idsDiscounts) => {return idsDiscounts.id});
    var indiceVariantId = arrayDiscountObject.findIndex(ind => ind.toString() === props.id.toString());

    if (indiceVariantId !== -1) {
      discountObject[indiceVariantId] ={
        "id": props.id,
        "type": selected,
        "value": valueDiscount,
        "reason": valueReason
      }
    } else {
      discountObject = discountObject.concat({
        "id": props.id,
        "type": selected,
        "value": valueDiscount,
        "reason": valueReason
      })
    }
    setSelected('Amount')
    setValueDiscount('')
    setValueReason('')
    setActive(!active), [active]
  });
  const selectedChange = useCallback((value) => setSelected(value), []);
  
  const activator = 
    <Button 
      plain 
      onClick={handleChange}
    >
      {props.priceDiscount}
    </Button>;

  const options = [
    {label: 'Amount', value: 'FIXED_AMOUNT'},
    {label: 'Percentage', value: 'PERCENTAGE'},
  ];
  const ChangeDiscountValue = useCallback((newValue) => {
    setValueDiscount(newValue), []
  });
  const ChangeReason = useCallback((newValue) => {
    setValueReason(newValue), []
  });
  if (props.price !== props.priceDiscount) {
    var newPrice = ` ${props.price}`
  }
  return (
    <p style={{display: 'flex'}}>
    <Modal
        activator={activator}
        open={active}
        onClose={handleChange}
        title="Add discount"
        primaryAction={{
          content: 'Apply',
          onAction: handleApply,
        }}
        secondaryActions={[
          {
            content: 'Discard',
            onAction: handleChange,
          },
        ]}
      >
        <Modal.Section>
        <FormLayout>
            <FormLayout.Group>
                <Select
                    id="typeDiscount"
                    label="Type Discount"
                    options={options}
                    onChange={selectedChange}
                    value={selected}
                />
                <TextField
                    id="valueDiscount"
                    label="Discount value"
                    value={valueDiscount}
                    onChange={ChangeDiscountValue}
                    autoComplete="off"
                />
            </FormLayout.Group>
            <FormLayout.Group>
                <TextField
                    id="valueReason"
                    label="Reason"
                    value={valueReason}
                    onChange={ChangeReason}
                    autoComplete="off"
                    helpText="Your customers can see this reason"
                />
            </FormLayout.Group>
        </FormLayout>
        </Modal.Section>
      </Modal>
      <span style={{textDecoration: "line-through", paddingLeft: '6' + '%', fontSize: '1.4' + 'rem', fontWeight: '400'}}>{newPrice}</span>
    </p>
  );
}
export { ModalPrice, discountObject }
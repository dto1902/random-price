import React, {useCallback, useState} from 'react';
import {Button, Modal, FormLayout, Select, TextStyle, TextField} from '@shopify/polaris';

var discountObject = [];
function ModalPrice(props) {
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState('Amount');
  const [valueDiscount, setValueDiscount] = useState(0);
  const [valueReason, setValueReason] = useState('');
  
  const handleChange = useCallback(() => { setActive(!active), [active] });
  const handleApply = useCallback(() => {
    console.log('hello');
    if(selected === 'Amount') {
      let price = props.price;
      var seletedValue = 'FIXED_AMOUNT'
      price = price - valueDiscount;
      if (price <= 0 ) {
        props.setPriceDiscount('0')
      } else {
        props.setPriceDiscount(price.toFixed(2))
      }
    } else {
      var seletedValue = 'PERCENTAGE'
      let price = props.price;
      price = price - (price * valueDiscount / 100);
      if (price <= 0 ) {
        props.setPriceDiscount('0')
      } else {
        props.setPriceDiscount(price.toFixed(2))
      }
    }
    var arrayDiscountObject = discountObject.map((idsDiscounts) => {return idsDiscounts.id});
    var indiceVariantId = arrayDiscountObject.findIndex(ind => ind.toString() === props.id.toString());

    if (indiceVariantId !== -1) {
      discountObject[indiceVariantId] = {
        "id": props.id,
        "type": seletedValue,
        "value": valueDiscount,
        "reason": valueReason
      }
    } else {
      discountObject = discountObject.concat({
        "id": props.id,
        "type": seletedValue,
        "value": valueDiscount,
        "reason": valueReason
      })
    }
    for( let i = 0; i < props.productsCalculate.length; i++) {
      var indiceDiscountPrice = props.productsCalculate.findIndex(ind => ind.variantId.toString() === props.id.toString());
      props.productsCalculate[indiceDiscountPrice].appliedDiscount = {
            "value": parseFloat(valueDiscount),
            "valueType": seletedValue,
            "title": valueReason
          };
    }
    console.log(props.productsCalculate)
    let promise = new Promise((resolve) => resolve());
    let orderCalculate = {
        lineItems: props.productsCalculate
    }
    promise = promise.then(() => props.handleSubmit({ variables: { input: orderCalculate }}))
        .then(response => {
          props.setSubTotalPrice(response.data.draftOrderCalculate.calculatedDraftOrder.subtotalPrice);
        })
    setSelected('Amount');
    setValueDiscount('');
    setValueReason('');
    setActive(!active), [active];
  });
  const selectedChange = useCallback((options) => setSelected(options));
  
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
    <span style={{display: 'flex'}}>
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
    </span>
  );
}
export { ModalPrice, discountObject }
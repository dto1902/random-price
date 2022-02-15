import React, {useCallback, useState} from 'react';
import {Button, Modal, FormLayout, Select, TextStyle, TextField} from '@shopify/polaris';
import { NewProductCalculate } from '../Produtcs/ModalNewProduct';
import { ResourceProducts } from '../Produtcs/ResourceListProducts';
import { shippingAddress, arrayAvailableShippingRates } from '../ShippingAddress/modalShippimgAddress';
import { shippingLine } from './ModalAddShipping';
import { taxExempt } from './ModalTaxes'

var seletedValue = 0, discount = null;
function ModalAddDiscount(props) {
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState('FIXED_AMOUNT');
  const [valueDiscount, setValueDiscount] = useState(0.00);
  const [valueReason, setValueReason] = useState('');
  const [typeDiscount, setTypeDiscount] = useState('text')
  const [placeholderDiscValue, setPlaceholderDiscValue] = useState("");
  const [suffix, setSuffix] = useState ()
  const [prefix, setPrefix] = useState (`${props.returnCurrencyCode}`)
  
  var allProducts = [];
  const handleChange = useCallback(() => { setActive(!active), [active] });
  const handleApply = useCallback(() => {
    if(selected === 'FIXED_AMOUNT') {
      seletedValue = 'FIXED_AMOUNT';
      // var discountCalc = parseFloat(valueDiscount);
      // console.log(discountCalc);
      // props.setDiscountAmount(discountCalc.toLocaleString("en-US", {style:"currency", currency:"USD"}));
    } else {
      seletedValue = 'PERCENTAGE'
      // var discountCalc = parseFloat((props.subTotal * valueDiscount / 100).toFixed(2));
      // console.log(discountCalc);
      // props.setDiscountAmount((discountCalc.toLocaleString("en-US", {style:"currency", currency:"USD"})));
    }
    setActive(!active), [active];
    props.setDiscountReason(valueReason);
    discount = {
      "title": valueReason,
      "value": parseFloat(valueDiscount),
      "valueType": seletedValue
    }
    promiseCalculate();
  });
  const selectedChange = useCallback((options) => {
    if (options === "PERCENTAGE") {
      setTypeDiscount("number")
      setPlaceholderDiscValue();
      setPrefix('')
      setSuffix("%")
    } else if (options === "FIXED_AMOUNT"){
      setPlaceholderDiscValue(`0.00`);
      setTypeDiscount("text");
      setPrefix(props.returnCurrencyCode)
      setSuffix();
    }
    setSelected(options)
  });
  var disabledButton = false;
  if (props.subTotal == 0){
    disabledButton = true;
  } else {
    disabledButton = false;
  }
  const activator = 
    <Button 
      plain
      disabled = {disabledButton}
      onClick={handleChange}
    >
      Add discount
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
  const deleteAll = () => {
    setSelected('Amount');
    setValueDiscount(0.00);
    setValueReason('');
    discount = null;
    promiseCalculate();
    props.setDiscountReason('-');
    props.setDiscountAmount(0);
    handleChange();
  }
  if (props.discountAmount == 0){
    var secondButton = {
      content: 'Discard',
      onAction: handleChange,
    }
  } else {
    var secondButton = {
      textAlign: 'left',
      content: 'Remove discount',
      destructive: true,
      onAction: deleteAll,
    }
  }
  const promiseCalculate = () => {
    allProducts = allProducts.concat(ResourceProducts, NewProductCalculate);
    let promise = new Promise((resolve) => resolve());
    let orderCalculateTotal = {
        lineItems: allProducts,
        appliedDiscount: discount,
        shippingAddress: shippingAddress,
        shippingLine: shippingLine,
        taxExempt: taxExempt
    }
    promise = promise.then(() => props.handleSubmit({ variables: { input: orderCalculateTotal }}))
      .then(response => {
        console.log(response);
        if(response.data.draftOrderCalculate.calculatedDraftOrder.appliedDiscount){
        props.setDiscountAmount(parseFloat(response.data.draftOrderCalculate.calculatedDraftOrder.appliedDiscount.amountV2.amount));
        }
        props.setAddShippingReason(orderCalculateTotal.shippingLine.title);
        props.setAddShipping((parseFloat(orderCalculateTotal.shippingLine.price)))
      if(response.data.draftOrderCalculate.calculatedDraftOrder.taxLines.length > 0){
        props.setTaxPercentage(response.data.draftOrderCalculate.calculatedDraftOrder.taxLines[0].ratePercentage);
        props.setTotalTax(parseFloat(response.data.draftOrderCalculate.calculatedDraftOrder.totalTax));
      } else {
        props.setTaxPercentage('Not calculate');
        props.setTotalTax(0);
      }
      props.setTaxLines(response.data.draftOrderCalculate.calculatedDraftOrder.taxLines);
      props.setTotalPrice(parseFloat(response.data.draftOrderCalculate.calculatedDraftOrder.totalPrice));
    })
  }
  return (
    <span style={{display: 'flex'}}>
    <Modal
        activator={activator}
        open={active}
        onClose={handleChange}
        title="Edit discount"
        primaryAction={{
          content: 'Apply',
          onAction: handleApply,
        }}
        secondaryActions={[
          secondButton,
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
                    placeholder={placeholderDiscValue}
                    type={typeDiscount}
                    suffix={suffix}
                    prefix={prefix}
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
    </span>
  );
}
export { ModalAddDiscount, seletedValue, discount }
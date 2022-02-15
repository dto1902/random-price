import React, {useCallback, useState} from 'react';
import {Button, Modal, RadioButton, Banner, Stack, TextField, FormLayout} from '@shopify/polaris';
import { NewProductCalculate } from '../Produtcs/ModalNewProduct';
import { ResourceProducts } from '../Produtcs/ResourceListProducts';
import { discount } from '../TablePayments/ModalAddDiscount';
import { shippingAddress } from '../ShippingAddress/modalShippimgAddress';
import { taxExempt } from './ModalTaxes';

var shippingLine = {
    price: 0,
    title: '-'
  }
// var shippingTitle = "-";
// var shippingPrice = 0;
// var shippingHandle = "";
  
function ModalAddShipping(props) {
    const [active, setActive] = useState(false);
    // const [value, setValue] = useState('');
    const [rateValue, setRateValue] = useState('');
    const [priceValue, setPriceValue] = useState('');
    const [idSelection, setIdSelection] = useState('')

    const rateChange = useCallback((newValue) => setRateValue(newValue), []);
    const priceChange = useCallback((newValue) => setPriceValue(newValue), []);

    var allProducts = [];
    allProducts = allProducts.concat(ResourceProducts, NewProductCalculate);
    
    if (idSelection === "FreeShipping"){
      var shippingTitle = "Free shipping";
      var shippingPrice = 0;
      var shippingHandle = "";
    } else if (idSelection === "Custom"){
      var shippingTitle = rateValue;
      var shippingPrice = parseFloat(priceValue);
      var shippingHandle = "";
    } else if (props.arrayAvailableShippingRates.length > 0){
      for (let i = 0; i < props.arrayAvailableShippingRates.length; i++){
          if (props.arrayAvailableShippingRates[i].handle === idSelection){
              var shippingTitle = props.arrayAvailableShippingRates[i].title;
              var shippingPrice = props.arrayAvailableShippingRates[i].price.amount;
              var shippingHandle = props.arrayAvailableShippingRates[i].handle
          }
          if (idSelection === ''){
          shippingLine = {
            title: props.arrayAvailableShippingRates[0].title,
            price: props.arrayAvailableShippingRates[0].price.amount,
            shippingRateHandle: props.arrayAvailableShippingRates[0].handle
        }}
      }
    }
    const applyChange = useCallback(() => {
      shippingLine = {
        price: shippingPrice,
        shippingRateHandle: shippingHandle,
        title: shippingTitle
      }
        promiseCalculate();
        setActive(!active), [active];
    });

    const removeChange = useCallback(() => {
      props.setValueRadioButton("");
      shippingLine = {
        price: 0,
        title: '-'
      }
      promiseCalculate();
      setActive(!active), [active];
    });
    const handleChange = useCallback(() => setActive(!active), [active]);

    var disabledButton = false;
    if (props.subTotal == 0){
        disabledButton = true;
      } else {
        disabledButton = false;
      }
    const activator = 
    <Button
        disabled = {disabledButton}
        plain
        onClick={handleChange}
    >
        Add shipping
    </Button>;

    const shippingChange = (
        (_checked, newValue) => {
            props.setValueRadioButton(newValue)
            setIdSelection(newValue);
    });
    if (props.valueRadioButton == 'Custom'){
        var rateAndPrice = 
            <FormLayout>
                <FormLayout.Group>
                    <TextField
                        label="Rate name"
                        value={rateValue}
                        onChange={rateChange}
                        autoComplete="off"
                    />
                    <TextField
                        label="Price"
                        value={priceValue}
                        onChange={priceChange}
                        autoComplete="off"
                    />
                </FormLayout.Group>
            </FormLayout>
    }
    if (props.arrayAvailableShippingRates.length > 0){
        var shippingRates = []
        for (let i = 0; i < props.arrayAvailableShippingRates.length; i++) {
            shippingRates = shippingRates.concat(
              <Stack key={`shipping${i}`}>
                <RadioButton
                    label={`${props.arrayAvailableShippingRates[i].title} - ${parseFloat(props.arrayAvailableShippingRates[i].price.amount).toFixed(2)}`}
                    id={props.arrayAvailableShippingRates[i].handle}
                    name='AddShipping'
                    checked={props.valueRadioButton === props.arrayAvailableShippingRates[i].handle}
                    onChange={shippingChange}
                />
              </Stack>
            )
        }
    } else {
        var bannerModalShipping = 
            <Banner
                status="warning"
            >
                <p>
                    If you're not seeing all your rates, add a customer with a complete shipping address.
                </p>
            </Banner>
    }
    if(props.valueRadioButton == ""){
      var secondButton = 
      [{
        content: 'Cancel',
        onAction: handleChange,
      }]
    } else {
      var secondButton = 
      [{
          content: 'Remove shipping',
          onAction: removeChange,
        }]
    }
    const promiseCalculate = () => {

    if (allProducts.length > 0){
    //   let indiceVariantId = arrayAvailableShippingRates.handle.findIndex(ind => ind.toString() === id.toString());
      let promise = new Promise((resolve, reject) => resolve());
      let orderCalculateTotal = {
        lineItems: allProducts,
        appliedDiscount: discount,
        shippingAddress: shippingAddress,
        shippingLine: shippingLine,
        taxExempt: taxExempt
      }
      promise = promise.then(() => props.handleSubmit({ variables: { input: orderCalculateTotal }}))
        .then(response => {
            props.setAddShippingReason(orderCalculateTotal.shippingLine.title);
            props.setAddShipping((parseFloat(orderCalculateTotal.shippingLine.price)));
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
    }
  return (
      <Modal
        activator={activator}
        open={active}
        onClose={handleChange}
        title="Add Shipping"
        primaryAction={{
          content: 'Apply',
          onAction: applyChange,
        }}
        secondaryActions={secondButton}
      >
        <Modal.Section>
            <Stack>
                {bannerModalShipping}
            </Stack>
        </Modal.Section>
        <Modal.Section>
            {shippingRates}
            <Stack>
                <RadioButton
                    label="Free shipping"
                    id="FreeShipping"
                    name="AddShipping"
                    checked={props.valueRadioButton === "FreeShipping"}
                    onChange={shippingChange}
                />
            </Stack>
            <Stack>
                <RadioButton
                    label="Custom"
                    id="Custom"
                    name="AddShipping"
                    checked={props.valueRadioButton === 'Custom'}
                    onChange={shippingChange}
                />
            </Stack>
            {rateAndPrice}
        </Modal.Section>
      </Modal>
  );
}
export { ModalAddShipping, shippingLine }
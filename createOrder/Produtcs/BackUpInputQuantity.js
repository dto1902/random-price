import React, {useCallback, useState} from 'react';
import {IndexTable, TextField, TextStyle, Link} from '@shopify/polaris';
import { ModalPrice } from './ModalPrice';
import { NewProductCalculate } from './ModalNewProduct';
import { ResourceProducts } from './ResourceListProducts';
import { discount } from '../TablePayments/ModalAddDiscount';
import { shippingAddress } from '../ShippingAddress/modalShippimgAddress';
import { shippingLine } from '../TablePayments/ModalAddShipping';

var allProductsQuantity = [];
function ValueQuantity(props) {
  if (props.quantity) {
    var qty = props.quantity.toString();
  } else {
    var qty = '1'
  }
  for (let i = 0; i < ResourceProducts.length; i++){
    if(ResourceProducts[i].variantId == props.id){
      var qty = (ResourceProducts[i].quantity).toString();
    };
  }
  const [valueQuantityText, setValueQuantityText] = useState(qty);
  const [priceDiscount, setPriceDiscount] = useState(props.price);
  const quantityChange = useCallback((newValue) => {
    let allProducts = []
    for( let i = 0; i < ResourceProducts.length; i++) {
      let indiceQuantity = ResourceProducts.findIndex(ind => ind.variantId.toString() === props.id.toString());
      if (indiceQuantity != -1){
        props.productsCalculate[indiceQuantity].quantity = parseInt(newValue);
      }
    }
    for( let i = 0; i < NewProductCalculate.length; i++) {
      let indiceQuantity = NewProductCalculate.findIndex(ind => ind.title.toString() === props.titleProduct.toString());
      if (indiceQuantity != -1){
        NewProductCalculate[indiceQuantity].quantity = parseInt(newValue);
      }
    }
    allProducts = allProducts.concat(ResourceProducts, NewProductCalculate);
    allProductsQuantity = allProducts;
    let promise = new Promise((resolve) => resolve());
    let orderCalculateTotal = {
        lineItems: allProducts,
        appliedDiscount: discount,
        shippingAddress: shippingAddress,
        shippingLine: shippingLine
    }
    promise = promise.then(() => props.handleSubmit({ variables: { input: orderCalculateTotal }}))
      .then(response => {
        props.setSubTotalPrice(response.data.draftOrderCalculate.calculatedDraftOrder.subtotalPrice);
        if(response.data.draftOrderCalculate.calculatedDraftOrder.appliedDiscount){
        props.setDiscountAmount(parseFloat(response.data.draftOrderCalculate.calculatedDraftOrder.appliedDiscount.value).toLocaleString("en-US", {style:"currency", currency:"USD"}));
        }
        props.setAddShippingReason(orderCalculateTotal.shippingLine.title);
        props.setAddShipping((parseFloat(orderCalculateTotal.shippingLine.price)).toLocaleString("en-US", {style:"currency", currency:"USD"}))
      if(response.data.draftOrderCalculate.calculatedDraftOrder.taxLines.length > 0){
        props.setTaxPercentage(response.data.draftOrderCalculate.calculatedDraftOrder.taxLines[0].ratePercentage);
        props.setTotalTax(parseFloat(response.data.draftOrderCalculate.calculatedDraftOrder.totalTax).toLocaleString("en-US", {style:"currency", currency:"USD"}));
      } else {
        props.setTaxPercentage('Not calculate');
        props.setTotalTax(0);
      }
      props.setTaxLines(response.data.draftOrderCalculate.calculatedDraftOrder.taxLines);
      props.setTotalPrice(parseFloat(response.data.draftOrderCalculate.calculatedDraftOrder.totalPrice).toLocaleString("en-US", {style:"currency", currency:"USD"}));
    })
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
            productsCalculate = { props.productsCalculate }
            setProductsCalculate = {props.setProductsCalculate}
            handleSubmit={props.handleSubmit}
            setSubTotalPrice={props.setSubTotalPrice}
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
        {/* {(priceDiscount)} */}
        {(priceDiscount * valueQuantityText).toFixed(2)}
      </IndexTable.Cell>
    </>
  );
}
export { ValueQuantity, allProductsQuantity }

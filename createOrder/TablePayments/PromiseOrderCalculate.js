import React, {useCallback, useState} from 'react';
import { shippingAddress } from '../ShippingAddress/modalShippimgAddress';
import { NewProductCalculate } from '../Produtcs/ModalNewProduct';
import { ResourceProducts } from '../Produtcs/ResourceListProducts';
import { discount } from '../TablePayments/ModalAddDiscount';
import { Mutation } from 'react-apollo';
import { DRAFT_ORDER_CALCULATE } from './DraftOrderCalculate';

function PromiseOrderCalculate(props) {
  console.log('hola');
    var allProducts = [];
    allProducts = allProducts.concat(ResourceProducts, NewProductCalculate);
    let promise = new Promise((resolve, reject) => resolve());
    let orderCalculateTotal = {
      lineItems: allProducts,
      appliedDiscount: discount,
      shippingAddress: shippingAddress
    }
    console.log('bye'),
    promise = promise.then(() => handleSubmit({ variables: { input: orderCalculateTotal }}))
      .then(response => {
        props.setTotalPrice(response.data.draftOrderCalculate.calculatedDraftOrder.totalPrice);
        if(response.data.draftOrderCalculate.calculatedDraftOrder.taxLines.length > 0){
          props.setTaxPercentage(response.data.draftOrderCalculate.calculatedDraftOrder.taxLines[0].ratePercentage);
          props.setTotalTax(response.data.draftOrderCalculate.calculatedDraftOrder.totalTax);
        } else {
          props.setTaxPercentage(placeHolderTax);
          props.setTotalTax(0);
        }
      })
}
export { PromiseOrderCalculate }
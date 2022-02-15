import React, {useCallback, useState} from 'react';
import {Button, Modal, FormLayout, Checkbox} from '@shopify/polaris';
import { billingAddress } from '../Customer/FindOrCreateCustomer';
import { shippingAddress } from '../ShippingAddress/modalShippimgAddress';
import { NewProductCalculate } from '../Produtcs/ModalNewProduct';
import { ResourceProducts } from '../Produtcs/ResourceListProducts';
import { discount } from '../TablePayments/ModalAddDiscount';
import { shippingLine } from './ModalAddShipping';

var taxExempt = false;

function ModalTaxes(props) {
  const [active, setActive] = useState(false);
  const [checked, setChecked] = useState(true);
  const ModalChange = useCallback(() => { setActive(!active), [active] });
  
  const handleApply = useCallback(() => {
    
    if (checked){
      var newShipping = shippingAddress;
      var placeHolderTax = 'Not calculate'
      taxExempt = false;
    } else {
      var newShipping = {};
      var placeHolderTax = 'Not collected';
      taxExempt = true;
    }
    var allProducts = [];
    allProducts = allProducts.concat(ResourceProducts, NewProductCalculate);
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
        response
        props.setAddShippingReason(orderCalculateTotal.shippingLine.title);
        props.setAddShipping((parseFloat(orderCalculateTotal.shippingLine.price)))
        if(response.data.draftOrderCalculate.calculatedDraftOrder.taxLines.length > 0){
          props.setTaxPercentage(response.data.draftOrderCalculate.calculatedDraftOrder.taxLines[0].ratePercentage);
          props.setTotalTax(response.data.draftOrderCalculate.calculatedDraftOrder.totalTax);
        } else {
          props.setTaxPercentage(placeHolderTax);
          props.setTotalTax(0);
        }
        props.setTotalPrice(response.data.draftOrderCalculate.calculatedDraftOrder.totalPrice);
      })
    setActive(!active), [active];
  });
  const checkedChange = useCallback((newChecked) => setChecked(newChecked), []);

  const activator = 
    <Button 
      plain
      onClick={ModalChange}
    >
      Tax
    </Button>;
  return (
    <span style={{display: 'flex'}}>
    <Modal
        activator={activator}
        open={active}
        onClose={ModalChange}
        title="Taxes are automatically calculated."
        primaryAction={{
          content: 'Apply',
          onAction: handleApply,
        }}
        secondaryActions={{
          content: 'Cancel',
          onAction: ModalChange,
        }}
      >
        <Modal.Section>
        <FormLayout>
            <FormLayout.Group>
                <Checkbox
                    label="Charge taxes"
                    checked={checked}
                    onChange={checkedChange}
                />
            </FormLayout.Group>
        </FormLayout>
        </Modal.Section>
      </Modal>
    </span>
  );
}
export { ModalTaxes, taxExempt }
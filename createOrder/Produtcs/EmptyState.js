import React, { useState } from 'react';
import { Card, Stack, Heading, TextField, Icon, Button } from "@shopify/polaris";
import { ResourcePicker } from '@shopify/app-bridge-react';
import store from 'store-js';
import { ResourceListProducts } from '../Produtcs/ResourceListProducts';
import { ModalNewProduct } from '../Produtcs/ModalNewProduct';
import { NewProductCalculate } from '../Produtcs/ModalNewProduct';
import { ResourceProducts } from '../Produtcs/ResourceListProducts';
import { discount } from '../TablePayments/ModalAddDiscount';
import { shippingAddress } from '../ShippingAddress/modalShippimgAddress';
import { shippingLine } from '../TablePayments/ModalAddShipping';


function EmptyStateProducts (props) {
  var qty = 1, ResourceProducts = [];
  // allProducts = allProducts.concat(ResourceProducts, NewProductCalculate);
  const [newProductsCalculate, setNewProductsCalculate] = useState([]);

  const handleSelection = (resources) => {
    const idsFromVariantResources = resources.selection.map(( product ) => product.variants);
    var idsFromVariantResources2 = [];
    var productsCalculate = [];
    var idsFromVariantResources3 = [];
    for (let i = 0; i < idsFromVariantResources.length; i++) {
      var idsFromVariantResources2 = idsFromVariantResources2.concat(idsFromVariantResources[i]);
      for (let j = 0; j < idsFromVariantResources[i].length; j++){
        var idsFromVariantResources3 = idsFromVariantResources3.concat(idsFromVariantResources[i][j].id);

        if (ResourceProducts[i]){
          if (ResourceProducts[i].variantId == idsFromVariantResources[i][j].id){
            qty = parseInt(ResourceProducts[i].quantity);
          }
        } else {
          qty = parseInt(1);
        }productsCalculate.push({
          "variantId": idsFromVariantResources[i][j].id,
          "quantity": qty,
          "appliedDiscount": null
        })
      }
    };
    props.setOpen(false);
    store.set('ids', idsFromVariantResources3);
    props.setResourcesIds({'ids': idsFromVariantResources3});
    props.setBannerError('');
    props.setProductsCalculate(productsCalculate);
    ResourceProducts = (productsCalculate.concat(newProductsCalculate))
    let promise = new Promise((resolve, reject) => resolve());
    let orderCalculateSubTotal = {
      lineItems: productsCalculate.concat(newProductsCalculate),
    }
    let orderCalculateTotal = {
      lineItems: productsCalculate,
      appliedDiscount: discount,
      shippingAddress: shippingAddress,
      shippingLine: shippingLine
    }
    promise = promise.then(() => props.handleSubmit({ variables: { input: orderCalculateSubTotal }}))
      .then(response => {
        props.setSubTotalPrice(response.data.draftOrderCalculate.calculatedDraftOrder.subtotalPrice);
      })
    promise = promise.then(() => props.handleSubmit({ variables: { input: orderCalculateTotal }}))
    .then(response => {
      props.setAddShippingReason(orderCalculateTotal.shippingLine.title);
      props.setAddShipping((parseFloat(orderCalculateTotal.shippingLine.price)).toLocaleString("en-US", {style:"currency", currency:"USD"}))
      if(response.data.draftOrderCalculate.calculatedDraftOrder.taxLines.length > 0){
        props.setTaxPercentage(response.data.draftOrderCalculate.calculatedDraftOrder.taxLines[0].ratePercentage);
        props.setTotalTax(parseFloat(response.data.draftOrderCalculate.calculatedDraftOrder.totalTax).toLocaleString("en-US", {style:"currency", currency:"USD"}));
      } else {
        props.setTaxPercentage('Not collected');
        props.setTotalTax(0);
      };
      props.setTaxLines(response.data.draftOrderCalculate.calculatedDraftOrder.taxLines);
      props.setTotalPrice(parseFloat(response.data.draftOrderCalculate.calculatedDraftOrder.totalPrice).toLocaleString("en-US", {style:"currency", currency:"USD"}));
    })
  };
  console.log(NewProductCalculate);
    if(NewProductCalculate.length <= 0) {
      return (
        <Card>
        <Card.Section>
        <Stack>
            <Stack.Item fill>
              <Heading fullWidth={true}>
                Products
              </Heading>
            </Stack.Item>
            <Stack.Item>
              <ModalNewProduct 
                resourcesIds={props.resourcesIds}
                setResourcesIds={props.setResourcesIds}
                productsCalculate = {props.productsCalculate}
                setProductsCalculate = {props.setProductsCalculate}
                handleSubmit={props.handleSubmit}
                setSubTotalPrice={props.setSubTotalPrice}Z
              />
            </Stack.Item>
          </Stack>
        <ResourcePicker
          resourceType="Product"
          open={props.open}
          onSelection={(resources) => handleSelection(resources)}
          onCancel = {() => props.setOpen(false)}
        />
        <TextField
          value={ props.valueBrowse }
          placeholder='Search Products'
          onChange={() => {
            props.setValueBrowse('')
            props.setOpen(true)
          }}
          autoComplete="off"
          connectedRight={
            <Button
            onClick = {() => props.setOpen(true)}
            primary={true}
            >
              Browse
            </Button>
          }
        />
        </Card.Section>
        </Card>
    );
    } else {
      return(
        <ResourceListProducts
        productsCalculate = {props.productsCalculate}
        setProductsCalculate = {props.setProductsCalculate}
        open={props.open}
        setOpen={props.setOpen}
        valueBrowse={props.valueBrowse}
        setValueBrowse={props.setValueBrowse}
        resourcesIds={props.resourcesIds}
        setResourcesIds={props.setResourcesIds}
        setBannerError={props.setBannerError}
        handleSubmit={props.handleSubmit}
        setSubTotalPrice={props.setSubTotalPrice}
        setTotalPrice={props.setTotalPrice}
        discountAmount = {props.discountAmount}
        setTaxPercentage={props.setTaxPercentage}
        setTotalTax={props.setTotalTax}
        setAddShipping = {props.setAddShipping}
        setAddShippingReason = {props.setAddShippingReason}
        setTaxLines={props.setTaxLines}
        setDiscountAmount={props.setDiscountAmount}
        />
      )
    }
}

export { EmptyStateProducts };

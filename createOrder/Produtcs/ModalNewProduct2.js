import React, {useCallback, useState} from 'react';
import store from 'store-js';
import {Button, Modal, TextField, Layout, Checkbox, Select, Thumbnail, IndexTable, TextStyle, useIndexResourceState} from '@shopify/polaris';
import { ValueQuantity } from './InputQuantity';

var NewProduct = [], newProductsCalculate = [];

function ModalNewProduct(props) {
  const [active, setActive] = useState(false);
  const [itemNameValue, setItemNameValue] = useState(0);
  const [priceNewProduct, setPriceNewProduct] = useState('');
  const [quantityNewProducts, setQuantityNewProducts] = useState('1');
  const [taxableNewProduct, setTaxableNewProduct] = useState(true);
  const [shippingNewProduct, setShippingNewProduct] = useState(true);
  const {selectedResources, allResourcesSelected, handleSelectionChange} = useIndexResourceState([]);

  const handleChange = useCallback(() => {
    setActive(!active), [active] 
    setItemNameValue(0);
    setPriceNewProduct('');
    setQuantityNewProducts('1');
  });
  const handleApply = () => {
    store.set('ids', [])
    NewProduct = NewProduct.concat([{
      title: itemNameValue,
      id: itemNameValue.replace(/ /gi, "")+priceNewProduct,
      variantId: itemNameValue.replace(/ /gi, "")+priceNewProduct,
      price: parseFloat(priceNewProduct).toFixed(2),
      product: {title: itemNameValue},
      quantity: quantityNewProducts,
      taxable: taxableNewProduct,
      shipping: shippingNewProduct,
      inventoryItem:
        {tracked: false},
      sku: "Not/Aplicated",
      newProduct: true,
    }]);
    setItemNameValue(0);
    setPriceNewProduct('');
    setQuantityNewProducts('1');

    for( let i = 0; i < NewProduct.length; i++){
      newProductsCalculate = [];
      newProductsCalculate.push({
        "title": NewProduct[i].title,
        "quantity": parseInt(NewProduct[i].quantity),
        "originalUnitPrice": NewProduct[i].price,
      })
    }
    props.setProductsCalculate(props.productsCalculate.concat(newProductsCalculate));
    let promise = new Promise((resolve) => resolve());
    let orderCalculate = {
      lineItems: props.productsCalculate.concat(newProductsCalculate)
    }
    promise = promise.then(() => props.handleSubmit({ variables: { input: orderCalculate }}))
      .then(response => {
        props.setSubTotalPrice(response.data.draftOrderCalculate.calculatedDraftOrder.subtotalPrice);
      });
      setActive(!active), [active];
      props.setRowMarkup2(NewProduct.map(getTable));
    };
    
    function getTable(getTable) {
      var id = getTable.id;
      var max = '1000';
      var titleProduct = getTable.product.title;
      var price = getTable.price;
      var qty = getTable.quantity;
      if (getTable.shipping) { 
        var sku = 'Requires shipping';
      } else {
          var sku = 'Does not require shipping';
      }
      var media = (
          <Thumbnail
          source={
              getTable.image
              ? getTable.image.originalSrc
              : ''
          }
          alt={
              getTable.image
              ? getTable.image.altText
              : ''
          }
          />
      );
      return (
        <IndexTable.Row
            id={id} 
            key={id}
            selected={selectedResources.includes(id)}
            index= {NewProduct.findIndex(ind => ind.id.toString() === id.toString())}
        >
          <IndexTable.Cell>{media}</IndexTable.Cell>
          <ValueQuantity
              id={id} 
              max={max}
              titleProduct={titleProduct}
              price={price}
              onlyproductid=''
              title=''
              sku={sku}
              resourcesIds={props.resourcesIds}
              setResourcesIds={props.setResourcesIds}
              quantity={qty}
              handleSubmit={props.handleSubmit}
              setSubTotalPrice={props.setSubTotalPrice}
              productsCalculate = {props.productsCalculate}
              setProductsCalculate = {props.setProductsCalculate}
              newProductsCalculate = {newProductsCalculate}
          />
          <IndexTable.Cell>
            <Button
                plain
                variation="strong"
                onClick={() => {
                    let indiceNewProduct = NewProduct.findIndex(ind => ind.id.toString() === id.toString());
                    let positionIndVariantId = parseInt(indiceNewProduct);
                    NewProduct.splice( positionIndVariantId, 1);
                    props.setRowMarkup2(props.rowMarkup2);
                }}
            >
              X
            </Button>  
          </IndexTable.Cell>
        </IndexTable.Row>
      )
    };

  const ChangeItemNameValue = useCallback((newValue) => {
    setItemNameValue(newValue), []
  });
  const ChangePriceNewProduct = useCallback((newValue) => {
    setPriceNewProduct(newValue), []
  });
  const ChangeQuantityNewProducts = useCallback((newValue) => {
    setQuantityNewProducts(newValue), []
  });
  const ChangeTaxableNewProduct = useCallback((newValue) => {
    setTaxableNewProduct(newValue), []
  });
  const ChangeShippingNewProduct = useCallback((newValue) => {
    setShippingNewProduct(newValue), [];
  });
  const activator = 
    <Button 
      plain 
      onClick={handleChange}
    >
      Add custom item
    </Button>;
  return (
    <span style={{display: 'flex'}}>
    <Modal
        activator={activator}
        open={active}
        onClose={handleChange}
        title="Add custom item"
        primaryAction={{
          content: 'Done',
          onAction: handleApply,
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: handleChange,
          },
        ]}
      >
        <Modal.Section>
        <Layout>
            <Layout.Section>
                <div style={{width:"100" + "%", display:"inline-flex"}}>
                    <div style={{width:"50" + "%"}}>
                        <TextField
                            id="itemName"
                            label="Item Name"
                            value={itemNameValue}
                            onChange={ChangeItemNameValue}
                            autoComplete="off"
                        />  
                    </div>
                    <div style={{width:"25" + "%", paddingLeft:"2" + "%"}}>
                        <TextField
                            id="priceNewProduct"
                            label="Price"
                            value={priceNewProduct}
                            onChange={ChangePriceNewProduct}
                            autoComplete="off"
                            placeholder="0.00"
                            type="number"
                        />
                    </div>
                    <div style={{width:"25" + "%", paddingLeft:"2" + "%"}}>
                        <TextField
                            type="number"
                            label="Quantity"
                            id="quantityNewProducts"
                            value={quantityNewProducts}
                            onChange={ChangeQuantityNewProducts}
                            autoComplete="off"
                            min='1'
                            type="number"           
                        />
                    </div>
                </div>
            </Layout.Section>
            <Layout.Section>
                <Checkbox
                    label="Item is taxable"
                    checked={taxableNewProduct}
                    onChange={ChangeTaxableNewProduct}
                />
            </Layout.Section>
            <Layout.Section>
                <Checkbox
                    label="Item requires shipping"
                    checked={shippingNewProduct}
                    onChange={ChangeShippingNewProduct}
                />
            </Layout.Section>
        </Layout>
        </Modal.Section>
      </Modal>
    </span>
  );
}
export { ModalNewProduct, NewProduct }
import React, { useState } from 'react';
import {Card, IndexTable, TextField, Button, Stack, Heading} from '@shopify/polaris';
import { ModalNewProduct } from './Produtcs/ModalNewProduct';
import { ResourcePicker } from '@shopify/app-bridge-react';
import store from 'store-js';

function IndexTableTest(props) {

    const [rowMarkup2, setRowMarkup2] = useState([]);

  const resourceName = {
    singular: 'customer',
    plural: 'customers',
  };
  console.log(rowMarkup2)
    const handleSelection = (resources) => {
        const idsFromVariantResources = resources.selection.map(( product ) => product.variants);
        var idsFromVariantResources2 = [];
        var idsFromVariantResources3 = [];
        for (let i = 0; i < idsFromVariantResources.length; i++) {
          var idsFromVariantResources2 = idsFromVariantResources2.concat(idsFromVariantResources[i]);
          for (let j = 0; j < idsFromVariantResources[i].length; j++){
            var idsFromVariantResources3 = idsFromVariantResources3.concat(idsFromVariantResources[i][j].id);
          }
        };
        
        props.setOpen(false);
        store.set('ids', idsFromVariantResources3)
        props.setResourcesIds({'ids': "gid://shopify/ProductVariant/41707532910755"})
      };
  return (
    <Card>
        <Stack>
            <Stack.Item fill>
                <Heading fullWidth={true}>
                Products
                </Heading>
            </Stack.Item>
            <Stack.Item>
                <ModalNewProduct
                    rowMarkup2={rowMarkup2}
                    setRowMarkup2={setRowMarkup2}
                />
            </Stack.Item>
        </Stack>
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
        <IndexTable
        selectedItemsCount='{}'
            resourceName={resourceName}
            itemCount={rowMarkup2.length}
            headings={[
            {title: 'Name'},
            {title: 'Location'},
            {title: 'Order count'},
            {title: 'Amount spent', hidden: false},
            ]}
            selectable={false}
        >
            {rowMarkup2}
        </IndexTable>
        <ResourcePicker
            resourceType="Product"
            open={props.open}
            onSelection={(resources) => handleSelection(resources)}
            onCancel = {() => props.setOpen(false)}
            // initialSelectionIds={
            //   firstObject
            // }
        />
    </Card>
  );
}

export { IndexTableTest }

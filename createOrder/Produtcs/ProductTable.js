import React, { useState } from 'react';
import { Card, TextField, IndexTable, Button, Heading, Stack, useIndexResourceState } from '@shopify/polaris';
import { ModalNewProduct } from './ModalNewProduct';
import { ResourcePicker } from '@shopify/app-bridge-react';
import store from 'store-js';
import { ResourceListProducts } from '../Produtcs/ResourceListProducts'

function ProductTable (props) {
    
    const [rowMarkup2, setRowMarkup2] = useState([]);
    const [rowMarkup, setRowMarkup] = useState([]);

    const resourceName = {
        singular: 'product',
        plural: 'products',
    };
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
        props.setResourcesIds({'ids': idsFromVariantResources3})
        
      };
      
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
            <ResourcePicker
                resourceType="Product"
                open={props.open}
                onSelection={(resources) => handleSelection(resources)}
                onCancel = {() => props.setOpen(false)}
                // initialSelectionIds={
                //     firstObject
                // }
            />
            <IndexTable
                resourceName={resourceName}
                itemCount={rowMarkup2.length}
                selectedItemsCount='{}'
                headings={[
                {title: ''},
                {title: 'Title'},
                {title: 'Quantity'},
                {title: 'Price'},
                ]}
            >
                {rowMarkup}
                {rowMarkup2}
            </IndexTable>
        </Card.Section>
      </Card>
    )
}

export { ProductTable };
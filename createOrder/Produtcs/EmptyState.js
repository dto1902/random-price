import React, { useState } from 'react';
import { Card, Stack, Heading, TextField, Icon, Button } from "@shopify/polaris";
import { ResourcePicker } from '@shopify/app-bridge-react';
import store from 'store-js';
import { ResourceListProducts } from '../Produtcs/ResourceListProducts';
import { ModalNewProduct } from '../Produtcs/ModalNewProduct';


function EmptyStateProducts (props) {
  const [newProduct, setNewProduct] = useState([]);
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

    // if(store.get('ids')) {
    //   return (
    //     <Card>
    //     <Card.Section>
    //     <Stack>
    //         <Stack.Item fill>
    //           <Heading fullWidth={true}>
    //             Products
    //           </Heading>
    //         </Stack.Item>
    //         <Stack.Item>
    //           <ModalNewProduct 
    //             newProduct={props.newProduct}
    //             setNewProduct={props.setNewProduct}
    //           />
    //         </Stack.Item>
    //       </Stack>
    //     <ResourcePicker
    //       resourceType="Product"
    //       open={props.open}
    //       onSelection={(resources) => handleSelection(resources)}
    //       onCancel = {() => props.setOpen(false)}
    //     />
    //     <TextField
    //       value={ props.valueBrowse }
    //       placeholder='Search Products'
    //       onChange={() => {
    //         props.setValueBrowse('')
    //         props.setOpen(true)
    //       }}
    //       autoComplete="off"
    //       connectedRight={
    //         <Button
    //         onClick = {() => props.setOpen(true)}
    //         primary={true}
    //         >
    //           Browse
    //         </Button>
    //       }
    //     />
    //     </Card.Section>
    //     </Card>
    // );
    // } else {
      return(
        <ResourceListProducts 
          open={props.open}
          setOpen={props.setOpen}
          valueBrowse={props.valueBrowse}
          setValueBrowse={props.setValueBrowse}
          resourcesIds={props.resourcesIds}
          setResourcesIds={props.setResourcesIds}
        />
      )
    // }
}

export default EmptyStateProducts;

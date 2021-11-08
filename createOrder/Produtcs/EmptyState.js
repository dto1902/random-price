import React from 'react';
import { Card, Layout, EmptyState, TextField, SettingToggle } from "@shopify/polaris";
import { ResourcePicker } from '@shopify/app-bridge-react';
import store from 'store-js';
import { ResourceListProducts } from '../Produtcs/ResourceListProducts';

function EmptyStateProducts (props) {

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
  
    const emptyState = !store.get('ids');
    if(!store.get('ids')) {
      return (
        <Card>
        <Card.Section>
        <ResourcePicker
          resourceType="Product"
          open={props.open}
          onSelection={(resources) => handleSelection(resources)}
          onCancel = {() => props.setOpen(false)}
        />
        <SettingToggle
          heading="Select Products"
          action={{
            content: 'Browse',
            onAction: () => props.setOpen(true),
          }}
        >
        <TextField
          value={ props.valueBrowse }
          onChange={() => {
            props.setValueBrowse('')
            props.setOpen(true)
          }}
          autoComplete="off"
        />
        </SettingToggle>
        </Card.Section>
        </Card>
    );
    } else {
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
    }
}

export default EmptyStateProducts;

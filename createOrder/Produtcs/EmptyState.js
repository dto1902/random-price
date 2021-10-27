import React from 'react';
import { Card, Layout, EmptyState, TextField, SettingToggle } from "@shopify/polaris";
import { ResourcePicker } from '@shopify/app-bridge-react';
import store from 'store-js';
import { ResourceListProducts } from '../Produtcs/ResourceListProducts';

class EmptyStateProducts extends React.Component {
  state = { open: false, valueBrowse: '' };
  render() {
    // A constant that defines your app's empty state
    const emptyState = !store.get('ids');
    if(!store.get('ids')) {
      return (
        <Card>
        <Card.Section>
        <ResourcePicker
          resourceType="Product"
          showVariants={true}
          open={this.state.open}
          onSelection={(resources) => this.handleSelection(resources)}
          onCancel={() => this.setState({ open: false })}
        />
        <SettingToggle
          heading="Select Products"
          action={{
            content: 'Browse',
            onAction: () => this.setState({ open: true }),
          }}
        >
        <TextField
          value={() => this.setState({ valueBrowse: '' })}
          onChange={() => {
            this.setState({ valueBrowse: '' })
            this.setState({ open: true })
          }}
          autoComplete="off"
        />
        </SettingToggle>
        </Card.Section>
        </Card>
    );
    } else {
      return(
        <ResourceListProducts />
      )
    }

  }
  handleSelection = (resources) => {
    //const idsFromResources = resources.selection.map((product) => product.id);
    const idsFromVariantResources = resources.selection.map(( product ) => product.variants);
    var idsFromVariantResources2 = [];
    var idsFromVariantResources3 = [];
    for (let i = 0; i < idsFromVariantResources.length; i++) {
      idsFromVariantResources2 = idsFromVariantResources2.concat(idsFromVariantResources[i]);
      for (let j = 0; j < idsFromVariantResources[i].length; j++){
        idsFromVariantResources3 = idsFromVariantResources3.concat(idsFromVariantResources[i][j].id);
      }
    };
    this.setState({ open: false });
    store.set('ids', idsFromVariantResources3);
    
  };
}

export default EmptyStateProducts;

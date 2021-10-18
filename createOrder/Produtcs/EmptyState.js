import React from 'react';
import { Card, Layout, EmptyState } from "@shopify/polaris";
import { ResourcePicker } from '@shopify/app-bridge-react';
import store from 'store-js';
import ResourceListProducts from '../Produtcs/ResourceListProducts';

class EmptyStateProducts extends React.Component {
  state = { open: false };
  render() {
    // A constant that defines your app's empty state
    const emptyState = !store.get('ids');
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
        {emptyState ? ( // Controls the layout of your app's empty state
          <Layout>
            <EmptyState
              heading="Select Products"
              action={{
                content: 'Browse',
                onAction: () => this.setState({ open: true }),
              }}
            >
            </EmptyState>
          </Layout>
        ) : (
          // Uses the new resource list that retrieves products by IDs
          <ResourceListProducts />
        )}
        </Card.Section>
        </Card>
    );
  }
  handleSelection = (resources) => {
    const idsFromResources = resources.selection.map((product) => product.id);
    this.setState({ open: false });
    store.set('ids', idsFromResources);
  };
}

export default EmptyStateProducts;

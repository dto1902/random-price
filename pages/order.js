import React from 'react';
import { Page, Layout } from "@shopify/polaris";
import OrderCreate from '../components/CreateOrder';

class Orders extends React.Component {
  render() {
    return (
      <Page>
          <Layout.AnnotatedSection
            title='Orders'
            description='Create a new order'
          >
            <OrderCreate />
          </Layout.AnnotatedSection>
      </Page>
    );
  }
}

export default Orders;

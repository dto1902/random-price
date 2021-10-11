import React from 'react';
import { Page, Layout } from "@shopify/polaris";
import DraftOrderCreate from "../components/draftOrderCreate";

class Orders extends React.Component {
  state = { open: false };
  render() {
    return (
      <Page>
          <Layout.AnnotatedSection
            title='Orders'
            description='Create a new order'
          >
            <DraftOrderCreate />
          </Layout.AnnotatedSection>
      </Page>
    );
  }
}

export default Orders;

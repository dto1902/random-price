import React, { useState } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Page, Layout, Button, Banner, Toast, Frame, FormLayout, TextField, Card, EmptyState } from '@shopify/polaris';
import { Context } from '@shopify/app-bridge-react';
import store from 'store-js';
import OrderTypeButtons from '../createOrder/OrderTypeButtons';
import FindOrCreateOrder from '../createOrder/FindOrCreateCustomer'
import RecipientInfo from '../createOrder/RecipientInfo';
import RecipientReferentName from '../createOrder/RecipientReferentName';
import DeliveryDate from '../createOrder/DeliveryDate';
import PickUpDate from '../createOrder/PickUpDate';
import CardMessage from '../createOrder/CardMessage';
import ResourceListProducts from '../createOrder/ResourceListProducts';
import { test } from "../createOrder/ResourceListProducts"

//import OrderCreate from '../components/CreateOrder';
const CREATE_ORDER = gql`
    mutation draftOrderCreate($input: DraftOrderInput!){
        draftOrderCreate(input: $input)
        {
        draftOrder {
            id
        }
        userErrors {
            message
        }
        }
    }
`;
class order extends React.Component {

  static contextType = Context;
  state = { valueOne: 0, open: false };

  render() {

    return ( // Uses mutation's input to update product prices
    <Mutation mutation={CREATE_ORDER}>
        {(handleSubmit, {error, data }) => {
        const [hasResults, setHasResults] = useState(false);

        const showError = error && (
            <Banner status="critical">{error.message}</Banner>
        );

        const showToast = hasResults && (
            <Toast
            content="Successfully updated"
            onDismiss={() => setHasResults(false)}
            />
        );

    return (
      <Page>
        {/* {showToast}
        <Layout.Section>
            {showError}
        </Layout.Section> */}
        <Layout>
          <Layout.Section fullWidth>
            <Card>
              <Card.Section>
                <OrderTypeButtons />
              </Card.Section>
            </Card>
          </Layout.Section>
          <Layout.Section oneThird>
            <FindOrCreateOrder />
          </Layout.Section>
          <Layout.Section oneThird>
            <div id='RecipientInfo'>
              <RecipientInfo />
            </div>
            <div id='RecipientReferentName' style={{display:'none'}}>
              <RecipientReferentName />
            </div>
          </Layout.Section>
          <Layout.Section oneThird>
            <div id='DeliveryDate'>
              <DeliveryDate />
            </div>
            <div id='PickUpDate' style={{display:'none'}}>
              <PickUpDate />
            </div>
          </Layout.Section>
          <Layout.Section>
          <ResourceListProducts />
          </Layout.Section>
          <Layout.Section secondary>
            <CardMessage />
          </Layout.Section>
          <Layout.Section>
            <CardMessage />
          </Layout.Section>
          <Layout.Section secondary>
            <CardMessage />
          </Layout.Section>
          <Layout.Section>
            <CardMessage />
          </Layout.Section>
          <Layout.Section>
            <div style={{textAlign:"center"}}>
              <Card>
              <Card.Section>
                <Button
                  primary
                  textAlign={"center"}
                  onClick={() => {
                  let promise = new Promise((resolve) => resolve());
                  let draftOrderInput = {
                      lineItems: [
                          {
                              variantId: "gid://shopify/ProductVariant/41238505095331",
                              quantity: 1,
                          }
                      ]
                  }
                  promise = promise.then(() => handleSubmit({ variables: { input: draftOrderInput }}))
                                   .then(response => {console.log(response)});
                  console.log(this.props.selectedItems);
                }
                }
                >
                  Create Order
                </Button>
                </Card.Section>
              </Card>
            </div>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }}
  </Mutation>
  );
  }
  handleSelection = (resources) => {
    const idsFromResources = resources.selection.map((product) => product.id);
    this.setState({ open: false });
    store.set('ids', idsFromResources);
  };
}

export default order;

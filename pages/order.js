import React, { useState } from 'react';
import { CREATE_ORDER } from '../createOrder/Produtcs/GraphQl/MutaionCreateDraftOrder'
import { Mutation } from 'react-apollo';
import { Page, Layout, Button, Banner, Toast, Frame, FormLayout, TextField, Card, EmptyState } from '@shopify/polaris';
import store from 'store-js';
import { Context } from '@shopify/app-bridge-react';
import OrderTypeButtons from '../createOrder/OrderTypeButtons';
import FindOrCreateOrder from '../createOrder/FindOrCreateCustomer'
import RecipientInfo from '../createOrder/RecipientInfo';
import RecipientReferentName from '../createOrder/RecipientReferentName';
import DeliveryDate from '../createOrder/DeliveryDate';
import PickUpDate from '../createOrder/PickUpDate';
import CardMessage from '../createOrder/CardMessage';
import EmptyStateProducts from '../createOrder/Produtcs/EmptyState';
import { discountObject } from '../createOrder/Produtcs/ModalPrice'

function Order () {
  const [valueBrowse, setValueBrowse] = useState('');
  const [open, setOpen] = useState(false);
  const [resourcesIds, setResourcesIds] = useState({ids: store.get('ids')});

var DraftOrderLineItemInput = [];
var inputQty = 1;


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
          {/* <Layout.Section fullWidth>
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
          <EmptyStateProducts />
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
          </Layout.Section> */}
          <Layout.Section>
            <EmptyStateProducts
              open={open}
              setOpen={setOpen}
              valueBrowse={valueBrowse}
              setValueBrowse={setValueBrowse}
              resourcesIds={resourcesIds}
              setResourcesIds={setResourcesIds}
            />
          </Layout.Section>
          <Layout.Section>
          <Button
            primary
            textAlign={"center"}
            onClick={() => {
              DraftOrderLineItemInput = [];
              for( let i = 0; i < resourcesIds.ids.length; i++) {
                inputQty = document.getElementById('id:' + resourcesIds.ids[i]).value;
                console.log(discountObject);
                DraftOrderLineItemInput = DraftOrderLineItemInput.concat({
                  "variantId": resourcesIds.ids[i],
                  "quantity":  parseInt(inputQty),
                })
              }
              console.log(DraftOrderLineItemInput)
              // let promise = new Promise((resolve) => resolve());

              // let draftOrderInput = {
              //     lineItems: 
              //       DraftOrderLineItemInput
              // }
              // promise = promise.then(() => handleSubmit({ variables: { input: draftOrderInput }}))
              //     .then(response => {console.log(response)});

              }
              }
            >
                Create Order
          </Button>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }}
  </Mutation>
  );
}

export default Order;

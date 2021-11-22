import React, { useState } from 'react';
import { CREATE_ORDER } from '../createOrder/Produtcs/GraphQl/MutaionCreateDraftOrder'
import { Mutation } from 'react-apollo';
import { Page, Layout, Button, Banner, Toast, Card } from '@shopify/polaris';
import store from 'store-js';
import { Note } from '../createOrder/Note';
import OrderTypeButtons from '../createOrder/OrderTypeButtons';
import { FindOrCreateCustomer } from '../createOrder/FindOrCreateCustomer'
import { RecipientInfo } from '../createOrder/RecipientInfo';
import { RecipientReferentName } from '../createOrder/RecipientReferentName';
import { DeliveryDate } from '../createOrder/DeliveryDate';
import { PickUpDate } from '../createOrder/PickUpDate';
import EmptyStateProducts from '../createOrder/Produtcs/EmptyState';
import { discountObject } from '../createOrder/Produtcs/ModalPrice';
import { allProducts } from '../createOrder/Produtcs/ResourceListProducts';
import { StaffNotes } from '../createOrder/StaffNotes'

function Order () {
  const [valueBrowse, setValueBrowse] = useState('');
  const [open, setOpen] = useState(false);
  const [resourcesIds, setResourcesIds] = useState({ids: store.get('ids')});
  const [noteValue, setNoteValue] = useState('');

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
        {showToast}
        <Layout.Section>
            {showError}
        </Layout.Section>
        <Layout>
          <Layout.Section fullWidth>
            <Card>
              <Card.Section>
                <OrderTypeButtons />
              </Card.Section>
            </Card>
          </Layout.Section>
          <Layout.Section oneThird>
            <FindOrCreateCustomer />
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
            <EmptyStateProducts
              open={open}
              setOpen={setOpen}
              valueBrowse={valueBrowse}
              setValueBrowse={setValueBrowse}
              resourcesIds={resourcesIds}
              setResourcesIds={setResourcesIds}
            />
          </Layout.Section>
          <Layout.Section secondary>
            <Note 
              noteValue={noteValue}
              setNoteValue={setNoteValue}
            />
          </Layout.Section>
          <Layout.Section>
            <StaffNotes />
          </Layout.Section>
          <Layout.Section>
          <Button
            primary
            textAlign={"center"}
            onClick={() => {
              DraftOrderLineItemInput = [];
              for( let i = 0; i < allProducts.length; i++) {
                inputQty = document.getElementById('id:' + allProducts[i].id).value;
                var indiceDiscount = discountObject.findIndex(ind => ind.id.toString() === allProducts[0].id.toString());
                if (discountObject[indiceDiscount]) {
                  var type = discountObject[indiceDiscount].type;
                  var value = discountObject[indiceDiscount].value;
                  var reason = discountObject[indiceDiscount].reason;
                } else {
                  var type = 'FIXED_AMOUNT', value = 0, reason = '';
                }
                if (allProducts[i].newProduct) {
                  DraftOrderLineItemInput = DraftOrderLineItemInput.concat({
                    "title": allProducts[i].product.title,
                    "originalUnitPrice": allProducts[i].price,
                    "quantity":  parseInt(inputQty),
                    "requiresShipping": allProducts[i].shipping,
                    "taxable": allProducts[i].taxable,
                    "appliedDiscount": {
                      "valueType": type,
                      "value": parseInt(value),
                      "title": reason,
                    },
                  })
                } else {
                  DraftOrderLineItemInput = DraftOrderLineItemInput.concat({
                    "variantId": allProducts[i].id,
                    "quantity":  parseInt(inputQty),
                    "appliedDiscount": {
                      "valueType": type,
                      "value": parseInt(value),
                      "title": reason,
                    },
                  })
                }
              }
              let attributes = [
              {
                "key": "delivery-date",
                "value": document.getElementById('datePicker').value
              },
              {
                "key": "Pickup-Time",
                "value": document.getElementById('Pickup-Time').value
              },
              {
                "key": "Staff-Notes",
                "value": document.getElementById('StaffNotesValue').value
              }
              ]
              let promise = new Promise((resolve) => resolve());

              let draftOrderInput = {
                  lineItems: 
                    DraftOrderLineItemInput,
                  note: noteValue,
                  customAttributes: attributes,
              }
              promise = promise.then(() => handleSubmit({ variables: { input: draftOrderInput }}))
                  .then(response => {console.log(response)});

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

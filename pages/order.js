import React, { useState } from 'react';
import { CREATE_ORDER } from '../createOrder/Produtcs/GraphQl/MutaionCreateDraftOrder'
import { Mutation } from 'react-apollo';
import { Page, Layout, Button, Banner, Toast, Card } from '@shopify/polaris';
import store from 'store-js';
import { Note } from '../createOrder/Note';
import OrderTypeButtons from '../createOrder/OrderTypeButtons';
import { FindOrCreateCustomer } from '../createOrder/Customer/FindOrCreateCustomer'
import { ShippingAddress } from '../createOrder/ShippingAddress/RecipientInfo';
import { RecipientReferentName } from '../createOrder/RecipientReferentName';
import { DeliveryDate } from '../createOrder/DeliveryDate';
import { PickUpDate } from '../createOrder/PickUpDate';
import EmptyStateProducts from '../createOrder/Produtcs/EmptyState';
import { StaffNotes } from '../createOrder/StaffNotes'
import { TablePayments } from '../createOrder/TablePayments'
import { ButtonCreateOrder } from '../createOrder/ButtonCreateOrder'

function Order () {
  const [valueBrowse, setValueBrowse] = useState('');
  const [open, setOpen] = useState(false);
  const [resourcesIds, setResourcesIds] = useState(({'ids': []}));
  const [noteValue, setNoteValue] = useState('');
  const [customerSelectedId, setCustomerSelectedId] = useState('');

    return (
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
          {/* <Layout.Section twoThird> */}
            <FindOrCreateCustomer 
              customerSelectedId={customerSelectedId}
              setCustomerSelectedId={setCustomerSelectedId}
            />
          {/* </Layout.Section> */}
          {/* <Layout.Section oneThird>
            <div id='RecipientInfo'>
              <ShippingAddress 
                customerSelectedId={customerSelectedId}
                setCustomerSelectedId={setCustomerSelectedId}
              />
            </div>
            <div id='RecipientReferentName' style={{display:'none'}}>
              <RecipientReferentName />
            </div>
          </Layout.Section> */}
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
            <StaffNotes secondary/>
          </Layout.Section>
          <Layout.Section>
            <TablePayments />
          </Layout.Section>
          <Layout.Section>
            <ButtonCreateOrder 
              noteValue={noteValue}
              handleSubmit={handleSubmit}
            />
          </Layout.Section>
        </Layout>
      </Page>
    );
  }}
  </Mutation>
  );
}

export default Order;

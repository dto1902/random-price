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
import { StaffNotes } from '../createOrder/StaffNotes';
import { TablePayments } from '../createOrder/TablePayments/TablePayments';
import { ButtonCreateOrder } from '../createOrder/ButtonCreateOrder';
import { BannerError } from '../createOrder/BannerError'
import { TablePayments_2 } from '../createOrder/TablePayments/TablePayments-2'

function Order () {
  const [valueBrowse, setValueBrowse] = useState('');
  const [open, setOpen] = useState(false);
  const [resourcesIds, setResourcesIds] = useState(({'ids': []}));
  const [noteValue, setNoteValue] = useState('');
  const [customerSelectedId, setCustomerSelectedId] = useState('');
  const [bannerError, setBannerError] = useState('');
  const [productsCalculate, setProductsCalculate] = useState([])

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
        var bannerfunction = "";
        if (bannerError.length != 0){
          bannerfunction = 
            <Layout.Section fullWidth>
              <Card>
                <Card.Section>
                  <BannerError 
                    bannerError={bannerError}
                    setBannerError={setBannerError}
                  />
                </Card.Section>
              </Card>
            </Layout.Section>
        };
    return (
      <Page>
        {showToast}
        <Layout.Section>
            {showError}
        </Layout.Section>
        <Layout>
          {bannerfunction}
          <Layout.Section fullWidth>
            <Card>
              <Card.Section>
                <OrderTypeButtons />
              </Card.Section>
            </Card>
          </Layout.Section>
          {/* <Layout.Section twoThird> */}
            {/* <FindOrCreateCustomer 
              customerSelectedId={customerSelectedId}
              setCustomerSelectedId={setCustomerSelectedId}
            /> */}
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
          {/* <Layout.Section oneThird>
            <div id='DeliveryDate'>
              <DeliveryDate />
            </div>
            <div id='PickUpDate' style={{display:'none'}}>
              <PickUpDate />
            </div>
          </Layout.Section> */}
          <Layout.Section>
            {/* <EmptyStateProducts
              setProductsCalculate = {setProductsCalculate}
              open={open}
              setOpen={setOpen}
              valueBrowse={valueBrowse}
              setValueBrowse={setValueBrowse}
              resourcesIds={resourcesIds}
              setResourcesIds={setResourcesIds}
              setBannerError={setBannerError}
            /> */}
            <TablePayments_2
              productsCalculate = {productsCalculate}
              setProductsCalculate = {setProductsCalculate}
              open={open}
              setOpen={setOpen}
              valueBrowse={valueBrowse}
              setValueBrowse={setValueBrowse}
              resourcesIds={resourcesIds}
              setResourcesIds={setResourcesIds}
              setBannerError={setBannerError}
              customerSelectedId={customerSelectedId}
              setCustomerSelectedId={setCustomerSelectedId}
              noteValue={noteValue}
              setNoteValue={setNoteValue}
            />
            {/* <TablePayments 
              subTotal = {0}
              productsCalculate={draftOrderCalculate}
            /> */}
          </Layout.Section>
          {/* <Layout.Section secondary>
            <Note 
              noteValue={noteValue}
              setNoteValue={setNoteValue}
            />
            <StaffNotes secondary/>
          </Layout.Section> */}
          <Layout.Section twoThird>
            
          </Layout.Section>
          {bannerfunction}
          <Layout.Section>
            <ButtonCreateOrder 
              noteValue={noteValue}
              handleSubmit={handleSubmit}
              bannerError={bannerError}
              setBannerError={setBannerError}
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

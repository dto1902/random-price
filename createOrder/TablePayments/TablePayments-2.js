import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import { DRAFT_ORDER_CALCULATE } from './DraftOrderCalculate';
import { Card, Layout, Heading, DataTable, TextStyle, Subheading } from '@shopify/polaris';
import { ResourceListProducts } from '../Produtcs/ResourceListProducts';
import { ModalAddDiscount,  } from './ModalAddDiscount';
import { ModalAddShipping } from './ModalAddShipping';
import { billingAddress, customerId } from '../Customer/FindOrCreateCustomer';
import { ModalTaxes } from './ModalTaxes';
import { FindOrCreateCustomer } from '../Customer/FindOrCreateCustomer';
import { DeliveryDate } from '../DeliveryDate';
import { PickUpDate } from '../PickUpDate';
import { Note } from '../Note';
import { StaffNotes } from '../StaffNotes';
import { NewProductCalculate } from '../Produtcs/ModalNewProduct';
import { ResourceProducts } from '../Produtcs/ResourceListProducts';
import { discount } from './ModalAddDiscount';
import { ModalShowTaxRates } from './ModalShowTaxRates';
import { EmptyStateProducts } from '../Produtcs/EmptyState';
import { CurrencyCode, returnCurrencyCode } from './CurrencyCode';

function TablePayments_2 (props) {
    const [discountAmount, setDiscountAmount] = useState(0);
    const [discountReason, setDiscountReason] = useState('-');
    const [addShipping, setAddShipping] = useState(0);
    const [addShippingReason, setAddShippingReason] = useState('-');
    const [subTotalPrice, setSubTotalPrice] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [taxPercentage, setTaxPercentage] = useState(0);
    const [totalTax, setTotalTax] = useState(0);
    const [taxLines, setTaxLines] = useState([]);
    const [arrayAvailableShippingRates, setArrayAvailableShippingRates] = useState([]);
    const [valueRadioButton, setValueRadioButton] = useState('');
    
    // const [taxLinesTotal, setTaxLinesTotal] = useState(0);
    var allProducts = [];
    allProducts = allProducts.concat(ResourceProducts, NewProductCalculate);
    return (
        <Mutation mutation={DRAFT_ORDER_CALCULATE}>
            {(handleSubmit, {error, data }) => {
            
            if(allProducts.length > 0) {
                var taxes = [
                    <ModalTaxes
                        handleSubmit={handleSubmit}
                        setTotalPrice={setTotalPrice}
                        setTaxPercentage={setTaxPercentage}
                        setTotalTax={setTotalTax}
                        setTaxLines={setTaxLines}
                        setAddShipping = {setAddShipping}
                        setAddShippingReason = {setAddShippingReason}
                    />,
                    <ModalShowTaxRates
                        totalTax={totalTax}
                        taxLines={taxLines}
                    />,
                    `${returnCurrencyCode} ${parseFloat(totalTax).toFixed(2)}`
                ]
            } else {
                var taxes = [<TextStyle variation="subdued">Tax</TextStyle>,<TextStyle variation="subdued">Not calculated</TextStyle>,`${returnCurrencyCode} 0.00`,]
            }
            const rows = [
                ['Subtotal', '', `${returnCurrencyCode} ${parseFloat(subTotalPrice).toFixed(2)}`],
                [
                    <ModalAddDiscount
                        subTotal = {subTotalPrice}
                        setAddShipping = {setAddShipping}
                        setAddShippingReason = {setAddShippingReason}
                        discountAmount = {discountAmount}
                        setDiscountAmount = {setDiscountAmount}
                        setDiscountReason = {setDiscountReason}
                        setTaxLines={setTaxLines}
                        setTotalPrice={setTotalPrice}
                        handleSubmit={handleSubmit}
                        setTaxPercentage={setTaxPercentage}
                        setTotalTax={setTotalTax}
                        returnCurrencyCode={returnCurrencyCode}
                    />, 
                    discountReason,
                    `-${returnCurrencyCode} ${parseFloat(discountAmount).toFixed(2)}`
                ],
                [
                    <ModalAddShipping 
                        subTotal = {subTotalPrice}
                        setAddShipping = {setAddShipping}
                        setAddShippingReason = {setAddShippingReason}
                        handleSubmit={handleSubmit}
                        setTotalPrice={setTotalPrice}
                        setTaxPercentage={setTaxPercentage}
                        setTotalTax={setTotalTax}
                        setAddShippingReason={setAddShippingReason}
                        setAddShipping={setAddShipping}
                        setTaxLines={setTaxLines}
                        arrayAvailableShippingRates={arrayAvailableShippingRates}
                        valueRadioButton={valueRadioButton}
                        setValueRadioButton={setValueRadioButton}
                    />, 
                    addShippingReason,
                    `${returnCurrencyCode} ${parseFloat(addShipping).toFixed(2)}`
                ],
                taxes
            ];
            var total = `${returnCurrencyCode} ${parseFloat(totalPrice).toFixed(2)}`;
                return (
                    <Layout>
                        <Layout.Section>
                            <div style={{marginBottom:'20px'}}>
                                <FindOrCreateCustomer 
                                    customerSelectedId={props.customerSelectedId}
                                    setCustomerSelectedId={props.setCustomerSelectedId}
                                    handleSubmit={handleSubmit}
                                    setTotalPrice={setTotalPrice}
                                    setTaxPercentage={setTaxPercentage}
                                    setTotalTax={setTotalTax}
                                    setAddShipping = {setAddShipping}
                                    setAddShippingReason = {setAddShippingReason}
                                    setTaxLines={setTaxLines}
                                    setArrayAvailableShippingRates={setArrayAvailableShippingRates}
                                    valueRadioButton={valueRadioButton}
                                    setValueRadioButton={setValueRadioButton}
                                />
                            </div>
                            <div style={{marginBottom:'20px'}}>
                                <ResourceListProducts
                                    productsCalculate = {props.productsCalculate}
                                    setProductsCalculate = {props.setProductsCalculate}
                                    open={props.open}
                                    setOpen={props.setOpen}
                                    valueBrowse={props.valueBrowse}
                                    setValueBrowse={props.setValueBrowse}
                                    resourcesIds={props.resourcesIds}
                                    setResourcesIds={props.setResourcesIds}
                                    setBannerError={props.setBannerError}
                                    handleSubmit={handleSubmit}
                                    setSubTotalPrice={setSubTotalPrice}
                                    setTotalPrice={setTotalPrice}
                                    discountAmount = {discountAmount}
                                    setTaxPercentage={setTaxPercentage}
                                    setTotalTax={setTotalTax}
                                    setAddShipping = {setAddShipping}
                                    setAddShippingReason = {setAddShippingReason}
                                    setTaxLines={setTaxLines}
                                    setDiscountAmount={setDiscountAmount}
                                    setArrayAvailableShippingRates={setArrayAvailableShippingRates}
                                    arrayAvailableShippingRates={arrayAvailableShippingRates}
                                    valueRadioButton={valueRadioButton}
                                    setValueRadioButton={setValueRadioButton}
                                />
                            </div>
                            <Card>
                                <Card.Section>
                                {/* </Card.Section> */}
                                    <DataTable
                                    columnContentTypes={[
                                        'text',
                                        'numeric',
                                        'numeric',
                                    ]}
                                    headings={[
                                        <Heading >Payment</Heading>,
                                        '',
                                        '',
                                    ]}
                                    rows={rows}
                                    totals={['','', total]}
                                    showTotalsInFooter
                                    />
                                    </Card.Section>
                            </Card>
                        </Layout.Section>
                        
                        <Layout.Section secondary>
                            <Note 
                                noteValue={props.noteValue}
                                setNoteValue={props.setNoteValue}
                            />
                            <StaffNotes secondary/>
                        </Layout.Section>
                        <CurrencyCode />
                    </Layout>
                );
            }}
    </Mutation>
  );
}
export {TablePayments_2};

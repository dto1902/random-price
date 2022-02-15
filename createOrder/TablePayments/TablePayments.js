import React, { useState } from 'react';
import {Card, DataTable, Stack, Heading} from '@shopify/polaris';
import { ModalAddDiscount,  } from './ModalAddDiscount';
import { ModalAddShipping } from './ModalAddShipping'
import { Mutation } from 'react-apollo';
import { DRAFT_ORDER_CALCULATE } from './DraftOrderCalculate'


function TablePayments(props) {
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountReason, setDiscountReason] = useState('-');
  const [addShipping, setAddShipping] = useState(0);
  const [addShippingReason, setAddShippingReason] = useState('')
  // const [total, setTotal] = useState(0);

        const rows = [
          ['Subtotal', '', (0)],
          [
            <ModalAddDiscount
              subTotal = {props.subTotal}
              discountAmount = {discountAmount}
              setDiscountAmount = {setDiscountAmount}
              setDiscountReason = {setDiscountReason}
            />, 
            discountReason, 
            `- ${parseFloat(discountAmount)}`],
          [
            <ModalAddShipping 
              subTotal = {props.subTotal}
              setAddShipping = {setAddShipping}
              setAddShippingReason = {setAddShippingReason}
            />, 
            addShippingReason, 
            addShipping
          ],
          ['Tax', 'Not calculated', '0'],
        ];
         var total = (props.subTotal.toFixed(2));

        return (
          <Card>
            <Card.Section>
              <Heading>
                Payment
              </Heading>
            </Card.Section>
                <DataTable
                  columnContentTypes={[
                    'text',
                    'numeric',
                    'numeric',
                  ]}
                  headings={[
                    '',
                    '',
                    '',
                  ]}
                  rows={rows}
                  totals={['','', total]}
                  showTotalsInFooter
                />
          </Card>
      );
}
export { TablePayments }
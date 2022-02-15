import React, {useCallback, useState} from 'react';
import {Button, Modal, Stack, TextStyle} from '@shopify/polaris';
import { returnCurrencyCode } from './CurrencyCode';

function ModalShowTaxRates(props) {
  const [active, setActive] = useState(false);

  const handleChange = useCallback(() => setActive(!active), [active]);
  if (props.totalTax > 0){
    var activator = <Button plain onClick={handleChange}>Show Tax rates</Button>;
  } else {
    var activator = <Button disabled plain onClick={handleChange}>Not collected</Button>;
  }
  
  var taxLinesModal = [];
  if (props.taxLines.length > 0){
  for (let i = 0; i < props.taxLines.length; i++){
    taxLinesModal = taxLinesModal.concat(
        <Stack key={`'stack'${i}`} distribution="equalSpacing">
            <Stack.Item key={`${props.taxLines[i].title}${[i]}`}>{`${props.taxLines[i].title} (${props.taxLines[i].ratePercentage}%)`}</Stack.Item>
            <Stack.Item key ={`${props.taxLines[i]}${[i]}`}>{`${returnCurrencyCode} ${parseFloat(props.taxLines[i].priceSet.presentmentMoney.amount).toFixed(2)}`}</Stack.Item>
        </Stack>,
    )
  }};
  return (
      <Modal
        activator={activator}
        open={active}
        onClose={handleChange}
        title="Tax rates"
        primaryAction={{
          content: 'Close',
          onAction: handleChange,
        }}
      >
        <Modal.Section>
            {taxLinesModal}
            <Stack distribution="equalSpacing">
                <Stack.Item key="total"><TextStyle variation="strong">Total Tax</TextStyle></Stack.Item>
                <Stack.Item key="totalAmount"><TextStyle variation="strong">{`${returnCurrencyCode} ${parseFloat(props.totalTax).toFixed(2)}`}</TextStyle></Stack.Item>
            </Stack>
        </Modal.Section>
      </Modal>
  );
}
export { ModalShowTaxRates }
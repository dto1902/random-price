import React, {useCallback, useState} from 'react';
import {Button, Modal, TextContainer, Select, TextField, Layout} from '@shopify/polaris';

export default function ModalPrice(prop) {
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState('Amount');
  const [valueDiscount, setValueDiscount] = useState('');
  const [valueReason, setValueReason] = useState('');

  const handleChange = useCallback(() => {
    setActive(!active), [active]
  });
  const handleApply = useCallback(() => {
    console.log(selected)
    console.log(valueDiscount)
    console.log(valueReason)
    setSelected('Amount')
    setValueDiscount('')
    setValueReason('')
    setActive(!active), [active]
  });
  const selectedChange = useCallback((value) => {
    setSelected(value), []
    //console.log(value)
  });
  const activator = 
    <Button 
      plain 
        onClick={handleChange}
    >
      {prop.price}
    </Button>;
  const options = [
    {label: 'Amount', value: 'amount'},
    {label: 'Percentage', value: 'percentage'},
  ];
  const ChangeDiscountValue = useCallback((newValue) => {
    setValueDiscount(newValue), []
    //console.log(newValue)
  });
  const ChangeReason = useCallback((newValue) => {
    setValueReason(newValue), []
    //console.log(newValue)
  });
  return (
      <Modal
        activator={activator}
        open={active}
        onClose={handleChange}
        title="Add discount"
        primaryAction={{
          content: 'Apply',
          onAction: handleApply,
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: handleChange,
          },
        ]}
      >
        <Modal.Section>
        <Layout>
            <div style={{width: '50' + '%'}}>
            <Layout.Section oneHalf>
                <Select
                    label="Date range"
                    options={options}
                    onChange={selectedChange}
                    value={selected}
                />
            </Layout.Section>
            </div>
            <div style={{width: '50' + '%'}}>
            <Layout.Section oneHalf>
                <TextField
                    label="Discount value"
                    value={valueDiscount}
                    onChange={ChangeDiscountValue}
                    autoComplete="off"
                />
            </Layout.Section>
            </div>
            <Layout.Section>
                <TextField
                    label="Reason"
                    value={valueReason}
                    onChange={ChangeReason}
                    autoComplete="off"
                    helpText="Your customers can see this reason"
                />
            </Layout.Section>
        </Layout>
        </Modal.Section>
      </Modal>
  );
}

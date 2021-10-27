import React, {useCallback, useState} from 'react';
import {Button, Modal, TextContainer, Select, TextField, Layout} from '@shopify/polaris';

export default function ModalPrice(prop) {
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState('today');
  const [value, setValue] = useState('');
  const [valueReason, setValueReason] = useState('');
  const handleSelectChange = useCallback((value) => setSelected(value), []);
  const handleChange = useCallback(() => setActive(!active), [active]);
  const activator = <Button plain onClick={handleChange}>{prop.price}</Button>;
  const options = [
    {label: 'Amount', value: 'amount'},
    {label: 'Percentage', value: 'percentage'},
  ];
  const handleChangeDiscountValue = useCallback((newValue) => setValue(newValue), []);
  const handleChangeReason = useCallback((newValue) => setValue(newValue), []);
  return (
      <Modal
        activator={activator}
        open={active}
        onClose={handleChange}
        title="Add discount"
        primaryAction={{
          content: 'Aply',
          onAction: handleChange,
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
                    onChange={handleSelectChange}
                    value={selected}
                />
            </Layout.Section>
            </div>
            <div style={{width: '50' + '%'}}>
            <Layout.Section oneHalf>
                <TextField
                    label="Discount value"
                    value={value}
                    onChange={handleChangeDiscountValue}
                    autoComplete="off"
                />
            </Layout.Section>
            </div>
            <Layout.Section>
                <TextField
                    label="Reason"
                    value={valueReason}
                    onChange={handleChangeReason}
                    autoComplete="off"
                    helpText="Your customers can see this reason"
                />
            </Layout.Section>
        </Layout>
        </Modal.Section>
      </Modal>
  );
}

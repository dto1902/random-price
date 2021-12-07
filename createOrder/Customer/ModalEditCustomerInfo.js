import React, {useCallback, useState} from 'react';
import {Form, Modal, TextField, Layout, Checkbox, Banner, Toast, Button } from '@shopify/polaris';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

function ModalEditCustomerInfo(props) {
    
  const [active, setActive] = useState(false);
  const handleModalChange = useCallback(() => setActive(!active), [active]);
  const emailChange = useCallback((newValue) => props.setEmailCustomer(newValue), []);
  const phoneChange = useCallback(newValue => props.setPhoneCustomer(newValue), []);
  const [checkedMarketing, setCheckedMarketing] = useState(false);
  const checkedMarketingChange = useCallback((newChecked) => setCheckedMarketing(newChecked), []);

  const handleClose = () => {
    handleModalChange();
  };
  const saveInfo = useCallback(() => {
    handleModalChange();
  })
  const activator = 
  <Button 
    plain 
    onClick={handleModalChange}
  >
    Edit
  </Button>;
  return (
    <Form>
      <Modal
        activator={activator}
        open={active}
        onClose={handleClose}
        title="Edit contact information"
        primaryAction={[
          {
            content: 'Done',
            onAction: saveInfo,
          },
        ]}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: handleModalChange,
          },
        ]}
      >
        <Modal.Section>
          <Layout>
            <Layout.Section>
              <TextField
                label="Email"
                value={props.emailCustomer}
                onChange={emailChange}
                autoComplete="nope"
                type="email"
              />
              <p style={{marginBottom:"4px"}}>Phone number</p>
              <PhoneInput
                inputClass='test'
                country={'us'}
                value={props.phoneCustomer}
                onChange={phoneChange}
                autoComplete="nope"
              />
              <Checkbox
                label="Update customer profile"
                checked={checkedMarketing}
                onChange={checkedMarketingChange}
              />
            </Layout.Section>
          </Layout>
        </Modal.Section>
      </Modal>
    </Form>
  );
}
export { ModalEditCustomerInfo }
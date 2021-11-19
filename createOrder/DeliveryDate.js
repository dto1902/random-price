import React, {useCallback, useState} from 'react';
import {TextField, Modal, Card, DatePicker, Layout} from '@shopify/polaris';
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import 'rc-time-picker/assets/index.css';

function DeliveryDate() {
  const [value, setValue] = useState('');
  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const [{month, year}, setDate] = useState({month: 1, year: 2018});
  const [open, setOpen] = useState(false)
  const [selectedDates, setSelectedDates] = useState({
    start: new Date('Wed Feb 07 2018 00:00:00 GMT-0500 (EST)'),
    end: new Date('Wed Feb 07 2018 00:00:00 GMT-0500 (EST)'),
  });
  const handleMonthChange = useCallback(
    (month, year) => setDate({month, year}),
    [],
  );
  const handleChange = () => {
    setValue('')
  setActive(true)
  };
  var timerOpen = () => {
    setOpen( true );
  };
  var timerClose = () => {
    setOpen( false );
  };

  function onChange() {
    setOpen(false);
    close(true);
  }

  return (
    <Card>
      <Card.Section>
          <TextField
            label="Delivery Date"
            value={value}
            onChange={handleChange}
            autoComplete="off"
          />
          <Modal
            small
            open={active}
            onClose={toggleActive}
            title="Import customers by CSV"
            primaryAction={{
              content: 'Delivery Date',
              onAction: toggleActive,
            }}
            secondaryActions={[
              {
                content: 'Cancel',
                onAction: toggleActive,
              },
            ]}
          >
            <Modal.Section>
              <DatePicker
                month={month}
                year={year}
                onChange={setSelectedDates}
                onMonthChange={handleMonthChange}
                selected={selectedDates}
              />
            </Modal.Section>
          </Modal>
          </Card.Section>
          <Card.Section>
          <p>Pick Up Time</p>
          <TimePicker
            open={open}
            onOpen={timerOpen}
            onClose={timerClose}
            minuteStep={60}
            showSecond={false}
            id="test"
            style={{ width: 100 + '%' }}
            defaultValue={moment()}
            onChange={onChange}
            disabledHours={() => [0,1,2,3,4,5,6,7,12,13,19,20,21,22,23]}
          />
        </Card.Section>
    </Card>
  );
}

export { DeliveryDate }
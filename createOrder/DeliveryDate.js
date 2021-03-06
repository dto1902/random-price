import React, {useCallback, useState} from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {TextField, Modal, Card, Layout} from '@shopify/polaris';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';

function DeliveryDate(props) {
  const [startDate, setStartDate] = useState('');
  const [open, setOpen] = useState(false)
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
    <div style={{width: '100%', display: 'flex'}}>
      <div style={{width: '50%'}}>
        <Card.Section>
        <p>Delivery Date</p>
        <DatePicker
          minDate={new Date()}
          selected={startDate}
          className='test'
          id="datePicker"
          autoComplete="new-password---"
          onChange={(date) => {
            setStartDate(date)
          }}
          onFocus={() => {
            document.getElementById('datePicker').className = 'test'
            
          }}
          />
        </Card.Section>
      </div>
      <div style={{width: '50%'}}>
        <Card.Section>
          <p>Delivery Time</p>
          <TimePicker
            id='Pickup-Time'
            open={open}
            onOpen={timerOpen}
            onClose={timerClose}
            minuteStep={60}
            showSecond={false}
            style={{ width: 100 + '%' }}
            onChange={onChange}
            disabledHours={() => [0,1,2,3,4,5,6,7,12,13,19,20,21,22,23]}
          />
        </Card.Section>
      </div>
    </div>
    </Card>
  );
}

export { DeliveryDate }
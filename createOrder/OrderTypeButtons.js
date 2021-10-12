import React, {useCallback, useState} from 'react';
import {Button, ButtonGroup} from '@shopify/polaris';

function OrderTypeButtons() {
  const [isFirstButtonActive, setIsFirstButtonActive] = useState(true);

  const handleFirstButtonClick = useCallback(() => {
    if (isFirstButtonActive) return;
    setIsFirstButtonActive(true);
    document.getElementById('RecipientInfo').style.display = 'block'
    document.getElementById('RecipientReferentName').style.display = 'none'
    document.getElementById('DeliveryDate').style.display = 'block'
    document.getElementById('PickUpDate').style.display = 'none'
  }, [isFirstButtonActive]);

  const handleSecondButtonClick = useCallback(() => {
    if (!isFirstButtonActive) return;
    setIsFirstButtonActive(false);
    document.getElementById('RecipientInfo').style.display = 'none'
    document.getElementById('RecipientReferentName').style.display = 'block'
    document.getElementById('DeliveryDate').style.display = 'none'
    document.getElementById('PickUpDate').style.display = 'block'
  }, [isFirstButtonActive]);

  return <ButtonGroup fullWidth>
      <Button pressed={isFirstButtonActive} onClick={handleFirstButtonClick} primary={true}>
        First button
      </Button>
      <Button pressed={!isFirstButtonActive} onClick={handleSecondButtonClick} primary={true}>
        Second button
      </Button>
    </ButtonGroup>;
}

export default OrderTypeButtons;
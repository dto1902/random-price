import React from 'react';
import {Banner} from '@shopify/polaris';

function BannerError(props) {

    return (
      <Banner
        title="To save this draft order, 1 change needs to be made:"
        status="critical"
        >
          {props.bannerError}
      </Banner>
    );
}
export { BannerError }

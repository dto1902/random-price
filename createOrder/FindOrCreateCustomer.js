import React from 'react';
import {TextStyle, Card, ResourceList, Thumbnail} from '@shopify/polaris';

export default class FindOrCreateOrder extends React.Component {
  render() {
    return (
      <Card title="Find or Create Customer" actions={[{content: 'Manage'}]}>
        <Card.Section>
          <TextStyle variation="subdued">455 units available</TextStyle>
        </Card.Section>
        <Card.Section title="Items">
          {/* <ResourceList
            resourceName={{singular: 'product', plural: 'products'}}
            items={[
              {
                id: 343,
                url: 'produdcts/343',
                name: 'Black & orange scarf',
                sku: '9234194023',
                quantity: '254',
                media: (
                  <Thumbnail
                    source="https://burst.shopifycdn.com/photos/black-orange-stripes_373x@2x.jpg"
                    alt="Black orange scarf"
                  />
                ),
              },
            ]}
            renderItem={(item) => {
              const {id, url, name, sku, media, quantity} = item;

              return (
                <ResourceList.Item
                  id={id}
                  url={url}
                  media={media}
                  accessibilityLabel={`View details for ${name}`}
                >
                  <h3>
                    <TextStyle variation="strong">{name}</TextStyle>
                  </h3>
                  <div>SKU: {sku}</div>
                  <div>{quantity} available</div>
                </ResourceList.Item>
              );
            }}
          /> */}
        </Card.Section>
      </Card>
        );
    }
}
import React, { useState } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Layout, Button, Banner, Toast, Stack, Frame } from '@shopify/polaris';
import { Context } from '@shopify/app-bridge-react';

// GraphQL mutation that updates the prices of products
const UPDATE_PRICE = gql`
  mutation productVariantUpdate($input: ProductVariantInput!) {
    productVariantUpdate(input: $input) {
      product {
        title
      }
      productVariant {
        id
        price
      }
    }
  }
`;

class ApplyRandomPrices extends React.Component {
  static contextType = Context;

  render() {
    return ( // Uses mutation's input to update product prices
      <Mutation mutation={UPDATE_PRICE}>
        {(handleSubmit, {error, data}) => {
          const [hasResults, setHasResults] = useState(false);

          const showError = error && (
            <Banner status="critical">{error.message}</Banner>
          );

          const showToast = hasResults && (
            <Toast
              content="Successfully updated"
              onDismiss={() => setHasResults(false)}
            />
          );

          return (
            <Frame>
              {showToast}
              <Layout.Section>
                {showError}
              </Layout.Section>

              <Layout.Section>
                <Stack distribution={"center"}>
                  <Button
                    primary
                    textAlign={"center"}
                    onClick={() => {
                      let promise = new Promise((resolve) => resolve());
                      for (const variantId in this.props.selectedItems) {
                        const price = Math.random().toPrecision(3) * 10;
                        const productVariableInput = {
                          id: this.props.selectedItems[variantId].variants.edges[0].node.id,
                          price: price,
                        };
                        
                        promise = promise.then(() => handleSubmit({ variables: { input: productVariableInput }}));
                      }
                      if (promise) {
                        promise.then(() => this.props.onUpdate().then(() => setHasResults(true)));
                    }
                  }
                  }
                  >
                    Randomize prices
                  </Button>
                </Stack>
              </Layout.Section>
            </Frame>
          );
        }}
      </Mutation>
    );
  }
}

export default ApplyRandomPrices;

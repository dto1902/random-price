import React, { useState } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Layout, Button, Banner, Toast, Stack, Frame } from '@shopify/polaris';
import { Context } from '@shopify/app-bridge-react';

// GraphQL mutation that updates the prices of products
const CREATE_ORDER = gql`
    mutation draftOrderCreate($items: DraftOrderInput!){
        draftOrderCreate(input: $items)
        {
        draftOrder {
            id
        }
        userErrors {
            message
        }
        }
    }
`;

class OrderCreate extends React.Component {
    static contextType = Context;
    
    render() {
        return ( // Uses mutation's input to update product prices
        <Mutation mutation={CREATE_ORDER}>
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
                        let orderVariableInput = {
                            lineItems: 
                                {
                                    title: "testInputDiego",
                                    quantity: 2,
                                    originalUnitPrice: "30.00"
                                }
                        }
    
                        promise = promise.then(() => handleSubmit({ variables: { items: orderVariableInput }}))
                            .then(response => {console.log(response)});
    
                        console.log(orderVariableInput)
    
                        // if (promise) {
                        //     promise.then(() => this.props.onUpdate().then(() => setHasResults(true)));
                        // }
                    }
                    }
                    >
                        OrderCreate
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
  
  export default OrderCreate;
  
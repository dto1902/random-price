import React, { useState } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Layout, Button, Banner, Toast, Frame, FormLayout, TextField, Card, EmptyState } from '@shopify/polaris';
import { Context } from '@shopify/app-bridge-react';
import store from 'store-js';
import { ResourcePicker } from '@shopify/app-bridge-react';
import ResourceListProducts from "./ResourceListProducts";
import { test } from "./ResourceListProducts"

// GraphQL mutation that updates the prices of products
const CREATE_ORDER = gql`
    mutation draftOrderCreate($input: DraftOrderInput!){
        draftOrderCreate(input: $input)
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

class DraftOrderCreate extends React.Component {
    static contextType = Context;
    state = { valueOne: "", valueTwo: 0, valueThree: "", open: false };

    render() {
        return ( // Uses mutation's input to update product prices
        <Mutation mutation={CREATE_ORDER}>
            {(handleSubmit, {error, data }) => {
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
            // console.log(test);
            return (
                <Frame>
                {showToast}
                <Layout.Section>
                    {showError}
                </Layout.Section>
    
                <Layout.Section>
                    <FormLayout>
                        <Card title="Customer">
                            <Card.Section>
                                <TextField
                                    value={this.state.valueOne}
                                    label="Title"
                                    onChange={(newValue) => this.setState({ valueOne: newValue })}
                                    autoComplete="off"
                                />
                                <TextField
                                    value = {this.state.valueTwo}
                                    label="Quantity"
                                    onChange={(newValue) => this.setState({ valueTwo: newValue })}
                                    autoComplete="email"
                                />
                            </Card.Section>
                            <Card.Section fullWidth>
                                <EmptyState
                                    fullWidth
                                    heading="Select products"
                                    action={{
                                        content: 'Select products',
                                        onAction: () => this.setState({ open: true }),
                                    }}
                                    >
                                    <ResourceListProducts />
                                </EmptyState> 
                            </Card.Section>
                            <ResourcePicker
                                resourceType="Product"
                                showVariants={false}
                                open={this.state.open}
                                onSelection={(resources) => this.handleSelection(resources)}
                                onCancel={() => this.setState({ open: false })}
                                />
                        </Card>
                        <Button
                            primary
                            textAlign={"center"}
                            onClick={() => {
                            let promise = new Promise((resolve) => resolve());

                            let draftOrderInput = {
                                lineItems: [
                                    {
                                        variantId: test,
                                        quantity: parseInt(`${this.state.valueTwo}`),
                                    }
                                ]
                            }
                            promise = promise.then(() => handleSubmit({ variables: { input: draftOrderInput }}))
                                .then(response => {console.log(response)});
        
                                console.log(this.props.selectedItems);
                        }
                        }
                        >
                            Create Order
                        </Button>
                    </FormLayout>
                </Layout.Section>
                </Frame>
            );
            }}
        </Mutation>
        );
    }
    handleSelection = (resources) => {
        const idsFromResources = resources.selection.map((product) => product.id);
        this.setState({ open: false });
        store.set('ids', idsFromResources);
      };
}
export default DraftOrderCreate;
  
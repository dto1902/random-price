import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import {
  Card,
  ResourceList,
  Stack,
  TextStyle,
  TextField,
  SettingToggle,
  Thumbnail,
} from '@shopify/polaris';
import { ResourcePicker } from '@shopify/app-bridge-react';
import store from 'store-js';
import { Context } from '@shopify/app-bridge-react';

// GraphQL query that retrieves products by ID
const GET_PRODUCTS_BY_ID = gql`
  query getProducts($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        title
        handle
        descriptionHtml
        id
        images(first: 1) {
          edges {
            node {
              originalSrc
              altText
            }
          }
        }
        variants(first: 99) {
          edges {
            node {
              id
              title
              price
              image {
                altText
                originalSrc
                }
            }
          }
        }
      }
    }
  }
`;

var arraySeletedProducts = '';
var arrayVariant = '';
var arrayVariantSeleted = '';

class ResourceListProducts extends React.Component {
  static contextType = Context;
  state = { valueOne: "", open: false };
  
  // A constructor that defines selected items and nodes
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: [],
      selectedNodes: {},
    };
  }

  render() {
    const app = this.context;

    // Returns products by ID
    return (
        <Query query={GET_PRODUCTS_BY_ID} variables={{ ids: store.get('ids') }}>
          {({ data, loading, error }) => { // Refetches products by ID
            if (loading) return <div>Loading…</div>;
            if (error) return <div>{error.message}</div>;
            
            const nodesById = {};
            data.nodes.forEach(node => nodesById[node.id] = node);

            arraySeletedProducts = data.nodes.map(getIds);
            function getIds(productsIds) {
              return productsIds.id;
            };

            var firstObject = [];
            for (let i = 0; i < arraySeletedProducts.length; i++) {
              firstObject = firstObject.concat({id: arraySeletedProducts[i].toString()});
            };

            return (
            <Card>
                  <SettingToggle
                    heading="Select Products"
                    action={{
                      content: 'Browse',
                      onAction: () => this.setState({ open: true }),
                    }}
                  >
                  <TextField
                      value = {this.state.valueOne}
                      onChange={ () => this.setState({ open: true })
                      }
                      autoComplete="off"
                  />
                  </SettingToggle>
                  <ResourceList
                    showHeader
                    resourceName={{ singular: 'Product', plural: 'Products' }}
                    items={data.nodes}
                    //selectable
                    //  selectedItems={this.state.selectedItems}
                    // onSelectionChange={selectedItems => {
                    //   const selectedNodes = {};
                    //   selectedItems.forEach(item => selectedNodes[item] = nodesById[item]);

                    //   return this.setState({
                    //     selectedItems: selectedItems,
                    //     selectedNodes: selectedNodes,
                    //   });
                    // }}
                    renderItem={item => {
                      const media = (
                        <Thumbnail
                          source={
                            item.images.edges[0]
                              ? item.images.edges[0].node.originalSrc
                              : ''
                          }
                          alt={
                            item.images.edges[0]
                              ? item.images.edges[0].node.altText
                              : ''
                          }
                        />
                      );
                      const price = item.variants.edges[0].node.price;
                      return (
                        <ResourceList.Item
                          id={item.id}
                          media={media}
                          accessibilityLabel={`View details for ${item.title}`}
                          verticalAlignment="center"
                        >
                          
                          <Stack alignment="right">
                            <Stack.Item fill>
                              <h3>
                                <TextStyle variation="strong">
                                  {item.title}
                                </TextStyle>
                              </h3>
                            </Stack.Item>
                            <Stack.Item>
                              <p>{price}</p>
                            </Stack.Item>
                          </Stack>
                        </ResourceList.Item>
                      );
                    }}
                  />
                  <ResourcePicker
                    resourceType="Product"
                    showVariants={true}
                    open={this.state.open}
                    onSelection={(resources) => this.handleSelection(resources)}
                    onCancel={() => this.setState({ open: false })}
                    initialSelectionIds={
                      firstObject
                    }
                  />
            </Card>    
          );
        }}
      </Query>
    );
  }
  handleSelection = (resources) => {
    const idsFromResources = resources.selection.map((product) => product.id);
    this.setState({ open: false });
    store.set('ids', idsFromResources);
  };
}
const test = store.set('ids');;
export default  ResourceListProducts;
export { test }
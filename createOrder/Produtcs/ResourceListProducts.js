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
query getProductsVariants($ids: [ID!]!) {
  nodes(ids: $ids) {
    ... on ProductVariant {
      id
      price
      title
      image {
        altText
        originalSrc
      }
      product {
        id
        title
        images(first: 1) {
          edges {
            node {
              originalSrc
              altText
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
                      if ( item.image === null) {
                        var media = (
                          <Thumbnail
                            source={
                              item.product.images.edges[0].node
                                ? item.product.images.edges[0].node.originalSrc
                                : ''
                            }
                            alt={
                              item.product.images.edges[0].node
                                ? item.product.images.edges[0].node.altText
                                : ''
                            }
                          />
                        )
                      } else {
                      var media = (
                        <Thumbnail
                          source={
                            item.image
                              ? item.image.originalSrc
                              : ''
                          }
                          alt={
                            item.image
                              ? item.image.altText
                              : ''
                          }
                        />
                      );
                    };
                      if ( item.title === 'Default Title') {
                        var title = item.product.title;
                      } else {
                        var title = item.title;
                      };
                      const price = item.price;
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
                                  {title}
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
                    open={this.state.open}
                    onSelection={(resources) => this.handleSelection(resources)}
                    onCancel={() => this.setState({ open: false })}
                    // initialSelectionIds={
                    //   firstObject
                    // }
                  />
            </Card>    
          );
        }}
      </Query>
    );
  }
  handleSelection = (resources) => {
    //const idsFromResources = resources.selection.map((product) => product.id);
    const idsFromVariantResources = resources.selection.map(( product ) => product.variants);
    var idsFromVariantResources2 = [];
    var idsFromVariantResources3 = [];
    for (let i = 0; i < idsFromVariantResources.length; i++) {
      idsFromVariantResources2 = idsFromVariantResources2.concat(idsFromVariantResources[i]);
      for (let j = 0; j < idsFromVariantResources[i].length; j++){
        idsFromVariantResources3 = idsFromVariantResources3.concat(idsFromVariantResources[i][j].id);
      }
    };
    //console.log(idsFromVariantResources3);
    this.setState({ open: false });
    store.set('ids', idsFromVariantResources3);
    
  };
}
const test = store.get('ids');
export default  ResourceListProducts;
export { test }
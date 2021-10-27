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
  Link,
  IndexTable,
  Button,
  Heading
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
      sku
      image {
        altText
        originalSrc
      }
      product {
        id
        title
        onlineStorePreviewUrl
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
var arraySeletedVariants = '';

class ResourceListProducts extends React.Component {
  static contextType = Context;
  state = { valueOne: "", open: false, quantity: "" };
  
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
          {({ data, loading, error, refetch }) => { // Refetches products by ID
            if (loading) return <div>Loading…</div>;
            if (error) return <div>{error.message}</div>;
            
            const nodesById = {};
            data.nodes.forEach(node => nodesById[node.id] = node);

            arraySeletedVariants = data.nodes.map(getIdsVariants);
            function getIdsVariants(variantsIds) {
              return variantsIds.id ;
            };

            arraySeletedProducts = data.nodes.map(getIdsProducts);
            function getIdsProducts(productsIds) {
              return productsIds.product.id ;
            };

            var firstObject = [];
            for (let i = 0; i < arraySeletedProducts.length; i++) {
              firstObject = firstObject.concat({id: arraySeletedProducts[i].toString(), variants: [{id: arraySeletedVariants[i].toString()}] });
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
                      onChange={ (newValue) => this.setState({ valueOne: newValue })
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
                      if ( item.image === null ) {
                        if ( item.product.images.edges[0] !== undefined ){
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
                        }
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
                      if ( item.title === 'Default Title' || item.title === 'default title') {
                        var titleProduct = item.product.title;
                        var titleVariant = '';
                      } else {
                        var titleProduct = item.product.title;
                        var titleVariant = item.title;
                      };
                      const price = item.price;
                      return (
                        <ResourceList.Item
                          id={item.id}
                          media={media}
                          accessibilityLabel={`View details for ${titleProduct}`}
                          verticalAlignment="center"
                        >
                          
                          <Stack distribution="equalSpacing" spacing="tight" alignment="leading">
                            <Stack.Item>
                              <h3>
                              <TextStyle>
                                <Link url={item.product.onlineStorePreviewUrl} external>{titleProduct}</Link>
                                  {/* <a target="_blank" href={item.product.onlineStorePreviewUrl}>{titleProduct}</a> */}
                              </TextStyle>
                              </h3>
                              <h3>
                              <TextStyle>
                                {titleVariant}
                              </TextStyle>
                              </h3>
                              <h3>
                                <TextStyle>
                                  {item.sku}
                                </TextStyle>
                              </h3>
                              <h3>
                                <TextStyle>
                                  {price}
                                </TextStyle>
                              </h3>
                            </Stack.Item>
                            <Stack.Item>
                                <TextField
                                  value = {this.state.quantity}
                                  type="number"
                                  onChange={(newValue) => this.setState({ quantity: newValue })}
                                />
                            </Stack.Item>
                            <Stack.Item fill>
                              <p>{price}</p>
                            </Stack.Item>
                            <Stack.Item>
                              <Button 
                              plain
                              destructive
                              onClick={() => {
                                var indice = data.nodes.findIndex(ind => ind.id.toString() === item.id.toString());
                                //console.log(indice);
                                var num = parseInt(indice);
                                console.log(data.nodes);
                                data.nodes.splice( num , 1);
                                console.log(data.nodes);
                              }}
                              >
                                X
                              </Button>
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
    this.setState({ open: false });
    store.set('ids', idsFromVariantResources3);
    
  };
}
const test = store.get('ids');
export default  ResourceListProducts;
export { test }


var variableButton = () => {
  var indiceVariantId = data.nodes.findIndex(ind => ind.id.toString() === getTable.id.toString());
  var indiceArrayTable = arrayTable.findIndex(ind => ind[0].props.children === getTable.id.toString());
  console.log(indiceArrayTable);
  var positionIndVariantId = parseInt(indiceVariantId);
  var positionIndiceArrayTable = parseInt(indiceVariantId);
  data.nodes.splice( positionIndVariantId, 1);
  arrayTable.splice( positionIndiceArrayTable, 1);
  
  var arrayVariantsId = [];
  arrayVariantsId = data.nodes.map(getVariantsId);
  function getVariantsId(getVariantsId) {
    return getVariantsId.id
  }
  store.set('ids', arrayVariantsId);
  refetch ({ rows: arrayTable });
  //console.log(arrayVariantsId);
  console.log(arrayTable);}
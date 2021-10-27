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
  Heading,
  DataTable,
} from '@shopify/polaris';
import { ResourcePicker } from '@shopify/app-bridge-react';
import store from 'store-js';
import { Context } from '@shopify/app-bridge-react';
import all from 'store-js/storages/all';

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

var arraySeletedProducts = '', arraySeletedVariants = '', arrayTable = '';

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

            arrayTable = data.nodes.map(getTable);
            function getTable(getTable) {
              if (getTable.title === 'Default Title'){
                var titleProduct = getTable.product.title;
              } else {
                var titleProduct = `${getTable.product.title}
                 ${getTable.title}`;
              }
              return [
                titleProduct,
                getTable.sku, 
                getTable.price, ];
            };

            console.log(data.nodes)
            const rows = arrayTable;

            return (
              <Card>
              <DataTable
                columnContentTypes={[
                  'text',
                  'numeric',
                  'numeric',
                ]}
                headings={[
                  'Title',
                  'SKU Number',
                  'Price',
                ]}
                rows={rows}
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
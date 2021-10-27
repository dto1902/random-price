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
  Page,
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

var arraySeletedProducts = '', arraySeletedVariants = '', arrayTable = [];

class ResourceListProducts extends React.Component {
  static contextType = Context;
  state = { valueOne: "", open: false };

  constructor(props) {
    super(props);
    this.state = {
      saludo: '',
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
            var rows = arrayTable;
            console.log(arrayTable);
            var saludo = "hola";
            console.log(saludo);
            var changeSaludo = (saludar) => {this.setState({ saludo: saludar })}
          

            function getTable(getTable) {
              var variantIdSeleted = getTable.id;
              
              if (getTable.title === 'Default Title'){
                var titleProduct = getTable.product.title;
              } else {
                var titleProduct = getTable.product.title;
                var titleVariant = getTable.title;
              }
              if ( getTable.image === null && getTable.product.images.edges[0] !== undefined ) {
                var media = (
                  <Thumbnail
                    source={
                      getTable.product.images.edges[0].node
                        ? getTable.product.images.edges[0].node.originalSrc
                        : ''
                    }
                    alt={
                      getTable.product.images.edges[0].node
                        ? getTable.product.images.edges[0].node.altText
                        : ''
                    }
                  />
                )
              } else {
                var media = (
                  <Thumbnail
                    source={
                      getTable.image
                        ? getTable.image.originalSrc
                        : ''
                    }
                    alt={
                      getTable.image
                        ? getTable.image.altText
                        : ''
                    }
                  />
                );
              }
              return [
                <div style={{display: 'none'}}>
                  {variantIdSeleted}
                </div>,
                media,
                <table style={{textAlign: 'left' }}>
                  <tbody>
                    <tr>
                      <td>
                      {titleProduct}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {titleVariant}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {getTable.sku}
                      </td>
                    </tr>
                    <tr>
                      <td>
                      {getTable.price}
                      </td>
                    </tr>
                  </tbody>
                </table>,
                  <input type='number' style={{width: '80' + '%'}}/>,
                getTable.price,
                <Button 
                plain
                destructive
                onClick={() => {
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
                  rows = arrayTable;
                  store.set('ids', arrayVariantsId);
                  saludo = 'hello';
                  changeSaludo(saludo);
                  setTimeout(() => refetch( store.set('ids', arrayVariantsId), data), 1000);
                }}
                >
                  X
                </Button>
              ];
            };
            console.log(saludo)
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
                <DataTable
                  columnContentTypes={[
                    '',
                    'image',
                    'text',
                    'numeric',
                    'numeric',
                    '',
                  ]}
                  headings={[
                    '',
                    '',
                    'Title',
                    'Quantity',
                    'Price',
                    '',
                  ]}
                  verticalAlign="middle"
                  rows={rows}
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
    //console.log(idsFromVariantResources3)
    this.setState({ open: false });
    store.set('ids', idsFromVariantResources3);
    
  };
}
const test = store.get('ids');
export default  ResourceListProducts;
export { test }
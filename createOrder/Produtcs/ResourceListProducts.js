import React, { useState, useCallback } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import {
  Card,
  TextField,
  SettingToggle,
  TextStyle,
  Link,
  IndexTable,
  Thumbnail,
  Button,
  Heading,
  DataTable,
  Page,
  useIndexResourceState
} from '@shopify/polaris';
import { ResourcePicker } from '@shopify/app-bridge-react';
import store from 'store-js';
import ModalPrice from './ModalPrice.js'
import { NumberFieldExample } from './InputQuantity'

// GraphQL query that retrieves products by ID
const GET_PRODUCTS_BY_ID = gql`
query getProductsVariants($ids: [ID!]!) {
  nodes(ids: $ids) {
    ... on ProductVariant {
      id
      price
      title
      sku
      inventoryQuantity
      inventoryItem {
        tracked
      }
      image {
        altText
        originalSrc
      }
      product {
        id
        title
        onlineStorePreviewUrl
        legacyResourceId
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
  shop {
    url
  }
}
`;

function ResourceListProducts() {

  const [valueBrowse, setValueBrowse] = useState('');
  const [open, setOpen] = useState(false);
  const [resourcesIds, setresourcesIds] = useState({ids: store.get('ids')});
  const {selectedResources, allResourcesSelected, handleSelectionChange} = useIndexResourceState([]);

    return (
        <Query query={GET_PRODUCTS_BY_ID} variables={ resourcesIds }>
          {({ data, loading, error, refetch }) => { // Refetches products by ID
            if (loading) return <div>Loading…</div>;
            if (error) return <div>{error.message}</div>;
            
            const nodesById = {};
            data.nodes.forEach(node => nodesById[node.id] = node);

            var arraySeletedProducts = '', arraySeletedVariants = '';
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
            const handleSelection = (resources) => {
              const idsFromVariantResources = resources.selection.map(( product ) => product.variants);
              var idsFromVariantResources2 = [];
              var idsFromVariantResources3 = [];
              for (let i = 0; i < idsFromVariantResources.length; i++) {
                var idsFromVariantResources2 = idsFromVariantResources2.concat(idsFromVariantResources[i]);
                for (let j = 0; j < idsFromVariantResources[i].length; j++){
                  var idsFromVariantResources3 = idsFromVariantResources3.concat(idsFromVariantResources[i][j].id);
                }
              };
              setOpen(false);
              store.set('ids', idsFromVariantResources3)
              setresourcesIds({'ids': idsFromVariantResources3})
            };

            const products = [data.nodes];
            console.log(products)
            const resourceName = {
              singular: 'product',
              plural: 'products',
            };
            const promotedBulkActions = [
              {
                content: 'Delete Products',
                onAction: () => console.log('Todo: implement bulk edit'),
              },
            ];

            var rowMarkup = data.nodes.map(getTable);
            function getTable(getTable) {
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
              var id = getTable.id;
              var price = getTable.price;
              var sku = getTable.sku;
              var onlyproductid = `${data.shop.url}/admin/products/${getTable.product.legacyResourceId}`;
              if (getTable.inventoryItem.tracked) {
                var max = getTable.inventoryQuantity
              } else {
                var max = '1000'
              }
              return  <IndexTable.Row 
                        id={id} 
                        key={id}
                        selected={selectedResources.includes(id).val}
                        index= {resourcesIds.ids.findIndex(ind => ind.toString() === id.toString())}
                      >
                        <IndexTable.Cell>{media}</IndexTable.Cell>
                        <IndexTable.Cell>
                          <p><TextStyle><Link url={onlyproductid} external={true}>{titleProduct}</Link></TextStyle></p>
                          <p><TextStyle>{titleVariant}</TextStyle></p>
                          <p><TextStyle>{sku}</TextStyle></p>
                          <TextStyle><ModalPrice price={price}/></TextStyle>
                        </IndexTable.Cell>
                        <IndexTable.Cell><NumberFieldExample max={max} id={id}/></IndexTable.Cell>
                        <IndexTable.Cell>{price}</IndexTable.Cell>
                        <IndexTable.Cell>
                          <Button
                            plain
                            variation="strong"
                            onClick={() => {
                              var indiceVariantId = resourcesIds.ids.findIndex(ind => ind.toString() === id.toString());
                              var positionIndVariantId = parseInt(indiceVariantId);
                              resourcesIds.ids.splice( positionIndVariantId, 1);
                              data.nodes.splice( positionIndVariantId, 1);
                              store.set('ids', resourcesIds.ids)
                              setresourcesIds({'ids': resourcesIds.ids})
                              
                            }}
                          >
                            X
                          </Button>  
                        </IndexTable.Cell>
                      </IndexTable.Row>;
            };

            return (
              <Card>
                <SettingToggle
                  heading="Select Products"
                  action={{
                    content: 'Browse',
                    onAction: () => {setOpen(true)},
                  }}
                >
                <TextField
                  value={ valueBrowse }
                  onChange={() => {
                    setValueBrowse('')
                    setOpen(true)
                  }}
                  autoComplete="off"
                />
                </SettingToggle>
                <IndexTable
                  resourceName={resourceName}
                  itemCount={products.length}
                  selectedItemsCount={
                    allResourcesSelected ? 'All' : selectedResources.length
                  }
                  onSelectionChange={handleSelectionChange}
                  promotedBulkActions={promotedBulkActions}
                  headings={[
                    {title: ''},
                    {title: 'Title'},
                    {title: 'Quantity'},
                    {title: 'Price'},
                  ]}
                >
                  {rowMarkup}
                </IndexTable>
                <ResourcePicker
                  resourceType="Product"
                  open={open}
                  onSelection={(resources) => handleSelection(resources)}
                  onCancel = {() => setOpen(false)}
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
export { ResourceListProducts }
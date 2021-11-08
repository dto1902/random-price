import React, { useState, useCallback, useEffect } from 'react';
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
import { ModalPrice } from './ModalPrice.js'
import { ValueQuantity } from './InputQuantity'

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

function ResourceListProducts(props) {
  const {selectedResources, allResourcesSelected, handleSelectionChange} = useIndexResourceState([]);

    return (
        <Query query={GET_PRODUCTS_BY_ID} variables={ props.resourcesIds }>
          {({ data, loading, error }) => { // Refetches products by ID
            if (loading) return 'Loading...';
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
              props.setOpen(false);
              store.set('ids', idsFromVariantResources3)
              props.setResourcesIds({'ids': idsFromVariantResources3})
            };

            const products = [data.nodes];
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
                        index= {props.resourcesIds.ids.findIndex(ind => ind.toString() === id.toString())}
                      >
                        <IndexTable.Cell>{media}</IndexTable.Cell>
                          <ValueQuantity 
                            max={max} 
                            id={id} 
                            titleProduct={titleProduct}
                            price={price}
                            onlyproductid={onlyproductid}
                            title={titleVariant}
                            sku={sku}
                            resourcesIds={props.resourcesIds}
                            setResourcesIds={props.setResourcesIds}
                          />
                        <IndexTable.Cell>
                          <Button
                            plain
                            variation="strong"
                            onClick={() => {
                              var indiceVariantId = props.resourcesIds.ids.findIndex(ind => ind.toString() === id.toString());
                              var positionIndVariantId = parseInt(indiceVariantId);
                              props.resourcesIds.ids.splice( positionIndVariantId, 1);
                              data.nodes.splice( positionIndVariantId, 1);
                              store.set('ids', props.resourcesIds.ids)
                              props.setResourcesIds({'ids': props.resourcesIds.ids})
                              
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
                    onAction: () => {props.setOpen(true)},
                  }}
                >
                <TextField
                  value={ props.valueBrowse }
                  onChange={() => {
                    props.setValueBrowse('')
                    props.setOpen(true)
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
                  selectable={false}
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
                  open={props.open}
                  onSelection={(resources) => handleSelection(resources)}
                  onCancel = {() => props.setOpen(false)}
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
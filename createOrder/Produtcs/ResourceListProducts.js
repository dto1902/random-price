import React, { useState } from 'react';
import { GET_PRODUCTS_BY_ID } from './GraphQl/QueryGetProducts'
import { Query } from 'react-apollo';
import {
  Card,
  TextField,
  SettingToggle,
  IndexTable,
  Thumbnail,
  Button,
  Heading,
  useIndexResourceState,
  Stack
} from '@shopify/polaris';
import { ResourcePicker } from '@shopify/app-bridge-react';
import store from 'store-js';
import { ModalNewProduct, NewProduct } from './ModalNewProduct';
import { ValueQuantity } from './InputQuantity';

// GraphQL query that retrieves products by ID


var allProducts = [];

function ResourceListProducts(props) {
  const {selectedResources, allResourcesSelected, handleSelectionChange} = useIndexResourceState([]);
  const [rowMarkup2, setRowMarkup2] = useState([]);

    return (
        <Query query={GET_PRODUCTS_BY_ID} variables={ props.resourcesIds }>
          {({ data, loading, error }) => { // Refetches products by ID
            if (loading) return 'Loading...';
            if (error) return <p>{error.message}</p>;
            
            const nodesById = {};
            data.nodes.forEach(node => nodesById[node.id] = node);
            var arraySeletedProducts = '', arraySeletedVariants = '';

            arraySeletedVariants = data.nodes.map(getIdsVariants);
            function getIdsVariants(variantsIds) {
              return variantsIds.id;
            };

            arraySeletedProducts = data.nodes.map(getIdsProducts);
            function getIdsProducts(productsIds) {
              return productsIds.product.id;
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
            
            allProducts = (data.nodes.concat(NewProduct))
            
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
              
              return  (
                  <IndexTable.Row
                  id={id} 
                  key={id}
                  selected={selectedResources.includes(id)}
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
                        quantity={getTable.quantity}
                      />
                    <IndexTable.Cell>
                      <Button
                        plain
                        variation="strong"
                        onClick={() => {
                          let indiceVariantId = props.resourcesIds.ids.findIndex(ind => ind.toString() === id.toString());
                          let positionIndVariantId = parseInt(indiceVariantId);
                          props.resourcesIds.ids.splice( positionIndVariantId, 1);
                          data.nodes.splice( positionIndVariantId, 1);
                          store.set('ids', props.resourcesIds.ids)
                          props.setResourcesIds({'ids': props.resourcesIds.ids});
                        }}
                      >
                        X
                      </Button>  
                    </IndexTable.Cell>
                  </IndexTable.Row>
              )
            };

            return (
              <Card>
                <Card.Section>
                  <Stack>
                    <Stack.Item fill>
                      <Heading fullWidth={true}>
                        Products
                      </Heading>
                    </Stack.Item>
                    <Stack.Item>
                      <ModalNewProduct 
                      newProduct={props.newProduct}
                      setNewProduct={props.setNewProduct}
                      resourcesIds={props.resourcesIds}
                      setResourcesIds={props.setResourcesIds}
                      rowMarkup2={rowMarkup2}
                      setRowMarkup2={setRowMarkup2}
                      />
                    </Stack.Item>
                  </Stack>
                    <TextField
                      value={ props.valueBrowse }
                      placeholder='Search Products'
                      onChange={() => {
                        props.setValueBrowse('')
                        props.setOpen(true)
                      }}
                      autoComplete="off"
                      connectedRight={
                        <Button
                        onClick = {() => props.setOpen(true)}
                        primary={true}
                        >
                          Browse
                        </Button>
                      }
                    />
                  <IndexTable
                    resourceName={resourceName}
                    firstRowSticky={false}
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
                    {rowMarkup2}
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
                </Card.Section>
              </Card>
            );
        }}
      </Query>
    );

}
export { ResourceListProducts, allProducts }
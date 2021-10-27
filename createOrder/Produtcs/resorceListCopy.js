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
                          
                          <Stack distribution="fillEvenly" spacing="extraLoose">
                            <Stack.Item fill>
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
                            <Stack.Item >
                              <div style={{width: 50 + '%', float: 'right'}}>
                              <TextField
                                value = {this.state.quantity}
                                type="number"
                                onChange={(newValue) => this.setState({ quantity: newValue })}
                              />
                              </div>
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



import React, {useCallback, useState} from 'react';
import {Avatar, Button, Card, Filters, ResourceItem, ResourceList, TextField, TextStyle} from '@shopify/polaris';

export default function ResourceListExample() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortValue, setSortValue] = useState('DATE_MODIFIED_DESC');
  const [taggedWith, setTaggedWith] = useState('VIP');
  const [queryValue, setQueryValue] = useState(null);

  const handleTaggedWithChange = useCallback(
    (value) => setTaggedWith(value),
    [],
  );
  const handleQueryValueChange = useCallback(
    (value) => setQueryValue(value),
    [],
  );
  const handleTaggedWithRemove = useCallback(() => setTaggedWith(null), []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);
  const handleClearAll = useCallback(() => {
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [handleQueryValueRemove, handleTaggedWithRemove]);

  const resourceName = {
    singular: 'customer',
    plural: 'customers',
  };

  const items = [
    {
      id: 112,
      url: 'customers/341',
      name: 'Mae Jemison',
      location: 'Decatur, USA',
      latestOrderUrl: 'orders/1456',
    },
    {
      id: 212,
      url: 'customers/256',
      name: 'Ellen Ochoa',
      location: 'Los Angeles, USA',
      latestOrderUrl: 'orders/1457',
    },
  ];

  const promotedBulkActions = [
    {
      content: 'Edit customers',
      onAction: () => console.log('Todo: implement bulk edit'),
    },
  ];

  const bulkActions = [
    {
      content: 'Add tags',
      onAction: () => console.log('Todo: implement bulk add tags'),
    },
    {
      content: 'Remove tags',
      onAction: () => {
        console.log('Todo: implement bulk remove tags')
        console.log('Todo: implement bulk remove tags')      
      }
    },
    {
      content: 'Delete customers',
      onAction: () => {
        var indices = items.findIndex(abc => abc.id.toString() === selectedItems.toString());
        console.log(items);
        var num = parseInt(indices);
        items.splice( num , 1);
        console.log(items);
        renderItem(items);
      }
      //let indice = arreglo.findIndex(mascota => mascota.nombre === busqueda);
    },
  ];

  const filters = [
    {
      key: 'taggedWith3',
      label: 'Tagged with',
      filter: (
        <TextField
          label="Tagged with"
          value={taggedWith}
          onChange={handleTaggedWithChange}
          autoComplete="off"
          labelHidden
        />
      ),
      shortcut: true,
    },
  ];

  const appliedFilters = !isEmpty(taggedWith)
    ? [
        {
          key: 'taggedWith3',
          label: disambiguateLabel('taggedWith3', taggedWith),
          onRemove: handleTaggedWithRemove,
        },
      ]
    : [];

  const filterControl = (
    <Filters
      queryValue={queryValue}
      filters={filters}
      appliedFilters={appliedFilters}
      onQueryChange={handleQueryValueChange}
      onQueryClear={handleQueryValueRemove}
      onClearAll={handleClearAll}
    >
      <div style={{paddingLeft: '8px'}}>
        <Button onClick={() => console.log('New filter saved')}>Save</Button>
      </div>
    </Filters>
  );

  return (
    <Card>
      <ResourceList
        resourceName={resourceName}
        items={items}
        renderItem={renderItem}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        promotedBulkActions={promotedBulkActions}
        bulkActions={bulkActions}
        sortValue={sortValue}
        sortOptions={[
          {label: 'Newest update', value: 'DATE_MODIFIED_DESC'},
          {label: 'Oldest update', value: 'DATE_MODIFIED_ASC'},
        ]}
        onSortChange={(selected) => {
          setSortValue(selected);
          console.log(`Sort option changed to ${selected}.`);
        }}
        filterControl={filterControl}
      />
    </Card>
  );

  function renderItem(item) {
    const {id, url, name, location, latestOrderUrl} = item;
    const media = <Avatar customer size="medium" name={name} />;
    const shortcutActions = latestOrderUrl
      ? [{content: 'View latest order', url: latestOrderUrl}]
      : null;
    return (
      <ResourceItem
        id={id}
        url={url}
        media={media}
        accessibilityLabel={`View details for ${name}`}
        shortcutActions={shortcutActions}
        persistActions
      >
        <h3>
          <TextStyle variation="strong">{name}</TextStyle>
        </h3>
        <div>{location}</div>
      </ResourceItem>
    );
  }

  function disambiguateLabel(key, value) {
    switch (key) {
      case 'taggedWith3':
        return `Tagged with ${value}`;
      default:
        return value;
    }
  }

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === '' || value == null;
    }
  }
}


<Stack.Item>
<Button 
plain
destructive
onClick={() => {
  var indice = data.nodes.findIndex(ind => ind.id.toString() === item.id.toString());
  console.log(indice);
  var num = parseInt(indice);
  data.nodes.splice( num , 1);
  console.log(item.id);
}}
>
  X
</Button>
</Stack.Item>
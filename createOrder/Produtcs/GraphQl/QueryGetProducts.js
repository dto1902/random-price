import gql from 'graphql-tag';

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

export { GET_PRODUCTS_BY_ID };
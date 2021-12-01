import gql from 'graphql-tag';

const CUSTOMER_CREATE = gql`
  mutation customerCreate($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer {
        id,
      }
      userErrors {
        field
        message
      }
    }
  }
`;
export { CUSTOMER_CREATE }
import React, { useState} from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const GET_CUSTOMERS = gql`
query ($query: String!){
  customers(first: 10, query: $query) {
    edges {
      node {
        firstName
        lastName
        email
        id
      }
    }
  }
}
`
const test = '';
function FindCustomer() {
return(
  <Query query={GET_CUSTOMERS} variables={{ query: '' }}>
    {({ data, loading, error }) => { // Refetches products by ID
      if (loading) return 'Loading...';
      if (error) return <p>{error.message}</p>;
      
      const customerById = {};
      data.customers.edges.forEach(customer => customerById[customer.node.id] = customer);
      
      const staff = data.customers.edges.map(getNames);
      function getNames(names) {
        return `${names.node.firstName} ${names.node.lastName}`;
      };
      test = staff
      return (
          console.log(test)
      )
    }}
  </Query>
  )
}
export { FindCustomer, test }
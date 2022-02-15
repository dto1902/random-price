import React from "react";
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const CURRENCY_CODE = gql`
query {
    shop {
        currencyCode
    }
}    
`
var returnCurrencyCode = '';
function CurrencyCode(props) {

            return(
                <Query query={CURRENCY_CODE}>
                {({ data, loading, error }) => { // Refetches products by ID
                    if (loading) return 'Loading...';
                    if (error) return <p>{error.message}</p>;
                    returnCurrencyCode = data.shop.currencyCode
                        return(
                            ''
                        )
                    }}
                </Query>
            )
}
export { CurrencyCode, returnCurrencyCode }
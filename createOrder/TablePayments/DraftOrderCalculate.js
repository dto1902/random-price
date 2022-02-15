import gql from 'graphql-tag';

const DRAFT_ORDER_CALCULATE = gql`
    mutation draftOrderCalculate($input: DraftOrderInput!) {
        draftOrderCalculate(input: $input) {
            calculatedDraftOrder {
                subtotalPrice
                totalPrice
                totalShippingPrice
                totalTax
                taxLines {
                    title
                    ratePercentage
                    priceSet{
                        presentmentMoney{
                          amount
                        }
                      }
                  }
                appliedDiscount {
                    title
                    value
                    valueType
                    amountV2{
                        amount
                      }
                  }
                availableShippingRates {
                    handle
                    title
                    price {
                        amount
                    }
                }
                shippingLine{
                    taxLines{
                        title
                        ratePercentage
                        priceSet{
                            presentmentMoney{
                            amount
                            }
                        }
                    }
                }
            }
            userErrors {
            field
            message
            }
        }
    }
`;

export { DRAFT_ORDER_CALCULATE };
import gql from 'graphql-tag';

const CREATE_ORDER = gql`
    mutation draftOrderCreate($input: DraftOrderInput!){
        draftOrderCreate(input: $input)
        {
        draftOrder {
            id
        }
        userErrors {
            message
        }
        }
    }
`;
export { CREATE_ORDER }
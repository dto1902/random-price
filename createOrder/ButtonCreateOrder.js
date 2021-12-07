import React from "react";
import { Button } from "@shopify/polaris";
import { allProducts } from '../createOrder/Produtcs/ResourceListProducts';
import { customerId } from '../createOrder/Customer/FindOrCreateCustomer'
import { discountObject } from '../createOrder/Produtcs/ModalPrice';

function ButtonCreateOrder(props) {
    
    var DraftOrderLineItemInput = [];
    var inputQty = 1;
    return(
        <Button
            primary
            textAlign={"center"}
            onClick={() => {
            DraftOrderLineItemInput = [];
            for( let i = 0; i < allProducts.length; i++) {
                inputQty = document.getElementById('id:' + allProducts[i].id).value;
                var indiceDiscount = discountObject.findIndex(ind => ind.id.toString() === allProducts[0].id.toString());
                if (discountObject[indiceDiscount]) {
                var type = discountObject[indiceDiscount].type;
                var value = discountObject[indiceDiscount].value;
                var reason = discountObject[indiceDiscount].reason;
                } else {
                var type = 'FIXED_AMOUNT', value = 0, reason = '';
                }
                if (allProducts[i].newProduct) {
                DraftOrderLineItemInput = DraftOrderLineItemInput.concat({
                    "title": allProducts[i].product.title,
                    "originalUnitPrice": allProducts[i].price,
                    "quantity":  parseInt(inputQty),
                    "requiresShipping": allProducts[i].shipping,
                    "taxable": allProducts[i].taxable,
                    "appliedDiscount": {
                    "valueType": type,
                    "value": parseInt(value),
                    "title": reason,
                    },
                })
                } else {
                DraftOrderLineItemInput = DraftOrderLineItemInput.concat({
                    "variantId": allProducts[i].id,
                    "quantity":  parseInt(inputQty),
                    "appliedDiscount": {
                    "valueType": type,
                    "value": parseInt(value),
                    "title": reason,
                    },
                })
                }
            }
            let attributes = [
            {
                "key": "delivery-date",
                "value": document.getElementById('datePicker').value
            },
            {
                "key": "Pickup-Time",
                "value": document.getElementById('Pickup-Time').value
            },
            {
                "key": "Staff-Notes",
                "value": document.getElementById('StaffNotesValue').value
            }
            ]
            
            let promise = new Promise((resolve) => resolve());

            let draftOrderInput = {
                lineItems: 
                    DraftOrderLineItemInput,
                note: props.noteValue,
                customAttributes: attributes,
                customerId: customerId[0],
            }
            promise = promise.then(() => props.handleSubmit({ variables: { input: draftOrderInput }}))
                .then(response => {console.log(response)});

            }
            }
            >
            Create Order
      </Button>
    )
}
export { ButtonCreateOrder }
import React from "react";
import { Button } from "@shopify/polaris";
import { allProducts } from '../createOrder/Produtcs/ResourceListProducts';
import { customerId } from '../createOrder/Customer/FindOrCreateCustomer'
import { discountObject } from '../createOrder/Produtcs/ModalPrice';
import { billingAddress, shippingAddress, contactInformation } from './Customer/FindOrCreateCustomer';
import { discount } from './TablePayments/ModalAddDiscount';
import { shippingLine } from './TablePayments/ModalAddShipping';
import { taxExempt } from './TablePayments/ModalTaxes'
// import { shippingAddress } from './ShippingAddress/modalShippimgAddress'
console.log(shippingLine);
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
                // console.log(allProducts);
                // console.log(document.getElementById('id:' + allProducts[i].id));
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

            let promise = new Promise((resolve, reject) => resolve());

            let draftOrderInput = {
                lineItems: 
                    DraftOrderLineItemInput,
                    note: props.noteValue,
                    customAttributes: attributes,
                    customerId: customerId[0],
                    billingAddress: billingAddress,
                    shippingAddress: shippingAddress,
                    appliedDiscount: discount,
                    shippingLine: shippingLine,
                    taxExempt: taxExempt
            }
            promise = promise.then(() => props.handleSubmit({ variables: { input: draftOrderInput }}))
                .then(response => {console.log(response)
                    const arrayErrors = response.data.draftOrderCreate.userErrors.map((err) => {
                        return err.message
                    })
                    if (arrayErrors) {
                        props.setBannerError(arrayErrors)
                    }
                })
                .catch(err => console.error(err))

            }
            }
            >
            Create Order
      </Button>
    )
}
export { ButtonCreateOrder }
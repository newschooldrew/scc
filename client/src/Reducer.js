import {addItemToCart,removeItemFromCart} from './cart.utils'

const Reducer = (state,{type,payload}) =>{
    switch(type){
    case "FETCH_ALL_MASKS":
        return{
            ...state,
            allMasks:payload
        }

    case "ADD_ITEM_TO_CART":
        let sessionItems = JSON.parse(sessionStorage.getItem('cart'))
        console.log("sessionItems within reducer")
        console.log(sessionItems)
                return{
                ...state,
                cartItems:addItemToCart(sessionItems || [],payload)
                }
    case "REMOVE_ITEM_FROM_CART":
            let sessionItems_1 = JSON.parse(sessionStorage.getItem('cart'))
            let cartTotal = JSON.parse(sessionStorage.getItem('cartTotal'))
                return{
                    ...state,
                    cartItems:removeItemFromCart(sessionItems_1 || [],payload,cartTotal)
                    }          
    case "UPDATE_CART":
            return{
                ...state,
                cartItems:addItemToCart(payload,[])
            }
    
    case "CLEAR_CART":
        let sessionItems_2 = JSON.parse(sessionStorage.getItem('cart')) || []
            return{
                ...state,
                cartItems:sessionItems_2.filter(
                    cartItem => cartItem.id !==payload.id
                    )
                }
    
    case "TOGGLE_CART":
            return{
                ...state,
                toggleCart:!state.toggleCart
                    }   
    case "EMPTY_CART":
        return{
                ...state,
                cartItems:[]
            }   
    }
}
export default Reducer;
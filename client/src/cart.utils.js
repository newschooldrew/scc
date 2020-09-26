export const addItemToCart = (cartItems, cartItemToAdd) =>{
    console.log("cartItems in util")
    console.log(cartItems)
    console.log(typeof cartItems)
        const existingCartItem = cartItems.find(
            cartItem =>cartItem.id === cartItemToAdd.id
            )
        if(existingCartItem){
            return cartItems.map(cartItem =>
                    // returns a new array
                    // this returns a new version of our state
                    // so our components know how to re render properly
                    cartItem.id === cartItemToAdd.id
                    ? {...cartItem, quantity:cartItem.quantity + 1}
                    : cartItem
            )
        }
        return [...cartItems,{...cartItemToAdd,quantity:1}]   
    }

export const removeItemFromCart = (cartItems,cartItemToRemove,cartTotal) => {
        // find out if there is an item in the count
        console.log("cartItems from removeItem fn")
        console.log(cartItems)
        const existingCartItem = cartItems.find(
            cartItem => cartItem.id === cartItemToRemove.id
            )
                // check if quantity is one
                // you want to keep the values where they dont match
                if(existingCartItem && existingCartItem.quantity == 1){
                    return cartItems.filter(cartItem => cartItem.id !== cartItemToRemove.id)
                    }
                        // bring in cartItem
                     return  cartItems.map(cartItem => 
                            cartItem.id == cartItemToRemove.id
                            ? {...cartItem,quantity: cartItem.quantity - 1}
                            : cartItem
                        // otherwise decrease the quantity                
                        // the new value of quantity is whatever that items quantity is, minus 1
                            
                    )
                }

export const totalPrice = items =>{
    console.log("total Price items")
    console.log(items)
    let price = items.reduce((acc,item) => acc + item.quantity * item.price,0);
    return price.toFixed(2);
}

export const totalItemPrice = item => {
    console.log("item:")
    console.log(item)
    let price = item.quantity * item.price;
    return price.toFixed(2);
}
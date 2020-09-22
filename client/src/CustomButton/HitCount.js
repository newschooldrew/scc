import React, {useRef} from 'react'
const hitButton = useRef(0)

const CustomButton = (type,{id,title,price}) => {

    const removeItemFromCart = (id,title,price) =>{
        const item = {id,title,price};
        dispatch({type:"REMOVE_ITEM_FROM_CART",payload:item})
        let myCachedTotal = JSON.parse(sessionStorage.getItem('cartTotal'))
    
        if(myCachedTotal == 1){
            sessionStorage.removeItem('cart');
            sessionStorage.setItem('cartTotal',0)
        }
        
            let existingNum = parseInt(sessionStorage.getItem(id));
            sessionStorage.setItem(`${id}`,existingNum - 1)
    
    }
    
    const addItemToCart = (id,title,price,url) =>{
        console.log(state)
        const item = {id,title,price,url};
        dispatch({type:"ADD_ITEM_TO_CART",payload:item})
        let foundItem;
        removeItemFromInventory(id,sessionCartItems)
    
        let existingNum;
          if(sessionStorage.getItem(id)){
            existingNum = parseInt(sessionStorage.getItem(id));
            console.log("existingNum exists")
            console.log(existingNum)
            sessionStorage.setItem(`${id}`,existingNum + 1)
          } else{
            console.log("existingNum does not exist")
            sessionStorage.setItem(`${id}`,1)
          }
    }

    return (<>
        {type == "positive" ? (
            <>
                <button onClick={e => addItemToCart(id,title,price,url,currentItem)}>+</button>
            </>
        ): (
            <>
                <button onClick={() => removeItemFromCart(id,title,price,url)}>-</button>
            </>
        )}
    </>)
}

export default CustomButton
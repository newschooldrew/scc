import React, {useRef,useContext} from 'react'
import AuthContext from '../AuthContext'
// import Button from "../CustomButtons/Button.js";
import {
    Button
  } from "reactstrap";

const CustomButton = ({type,id,title,price,url,qty}) => {
    const {state,dispatch} = useContext(AuthContext)

    let sessionCartItems = JSON.parse(sessionStorage.getItem('cart'))

    let hitButton = useRef(0)

    const buttonStyle = {
        'fontSize':'1.75em'
    }

    const addItemToCart = (id,title,price,url) =>{
        const item = {id,title,price,url};
        dispatch({type:"ADD_ITEM_TO_CART",payload:item})
        dispatch({type:"HIT_COUNT",payload:hitButton.current +=1})
        let foundItem;
    
        let existingNum;
          if(sessionStorage.getItem(id)){
            existingNum = parseInt(sessionStorage.getItem(id));
            sessionStorage.setItem(`${id}`,existingNum + 1)
          } else{
            sessionStorage.setItem(`${id}`,1)
          }
    }
    
    const removeItemFromCart = (id,title,price) =>{
        const item = {id,title,price};
        dispatch({type:"REMOVE_ITEM_FROM_CART",payload:item})
        dispatch({type:"HIT_COUNT",payload:hitButton.current -=1})
        let myCachedTotal = JSON.parse(sessionStorage.getItem('cartTotal'))
        
        if(myCachedTotal == 1){
            sessionStorage.setItem('cart',JSON.stringify([]));
            sessionStorage.setItem('cartTotal',0)
            dispatch({type:"EMPTY_CART"})
        }
        
            let existingNum = parseInt(sessionStorage.getItem(id));
            sessionStorage.setItem(`${id}`,existingNum - 1)
    
    }

    let limitReached,
        disabled,
        found;
    if(sessionStorage.getItem(id) == qty){
        limitReached = true;
    }

    if(sessionCartItems && sessionCartItems.length > 0){
        let found = sessionStorage.getItem(`${id}`)

        try{
            if(found == 0 || found == null){
                disabled=false
            }

            if(found >= 1){
                disabled=true
            }
        } catch(e){
            console.log("e")
        }
    }

    return (<>
        {type == "positive" ? (
            <>
                <Button color="success" type="button"
                    onClick={e => addItemToCart(id,title,price,url)}
                    disabled={limitReached || qty == 0}
                >
                    <span style={buttonStyle}>+</span>
                </Button>
            </>
        ): (
            <>
                <Button color="success" type="button"
                    onClick={() => removeItemFromCart(id,title,price,url)}
                    disabled={!disabled || qty == 0}
                >
                    <span style={buttonStyle}>-</span>
                    </Button>
            </>
        )}
    </>)
}

export default CustomButton
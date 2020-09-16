import React from 'react'
import CartItem from '../CartItem/CartItem'
import {withRouter} from 'react-router-dom'
import './CartDropdown.scss'

const CartDropdown = ({cartItems, history}) =>
{console.log("dropdown cartItems:")
    console.log(typeof cartItems)
    console.log(cartItems)
    return(
    <div className='cart-dropdown'>
        <div />
        {
            cartItems ? (
                cartItems.map(cartItem =>(<CartItem key={cartItems.id} item={cartItem}/>)
            )) :
            (<span className='empty-message'>No cart items</span>)
        }
            <button onClick={()=>history.push('/checkout')}>
                Go To Checkout
            </button>
        </div>
)}

export default withRouter(CartDropdown)
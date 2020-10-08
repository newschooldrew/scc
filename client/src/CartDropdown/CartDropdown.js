import React from 'react'
import CartItem from '../CartItem/CartItem'
import {withRouter} from 'react-router-dom'
import './CartDropdown.scss'
import {
    Button
  } from "reactstrap";

const CartDropdown = ({cartItems, history}) =>
{
    return (<>
        {history.location.pathname == '/checkout' || history.location.pathname == '/receipt' ?
        null :
    (<div className='cart-dropdown'>
        <div />
        {
            cartItems ? (
                cartItems.map(cartItem =>(<CartItem key={cartItems.id} item={cartItem}/>)
            )) :
            (<span className='empty-message'>No cart items</span>)
        }
            <Button color="info" type="button" onClick={()=>history.push('/checkout')}>
                Go To Checkout
            </Button>
        </div>
    )}
    </>
    )
}

export default withRouter(CartDropdown)
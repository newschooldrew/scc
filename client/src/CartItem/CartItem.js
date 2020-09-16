import React from 'react';
import './CartItem.scss'

const CartItem = ({item}) => {
    const {url,title,price, quantity} = item;
    return (
    <div className='cart-item'>
        <img src={url} alt='item' />
        <div className='item-details'>
            <span className='name'>{title}</span>
            <span className='price'>
                {quantity} x ${price}
            </span>
        </div>
    </div>
)}

export default CartItem;
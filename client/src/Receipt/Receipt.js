import React, {useContext} from 'react'
import AuthContext from '../AuthContext'
import {totalPrice} from '../cart.utils'
import { Table } from 'reactstrap';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const divStyle = {
    margin:'21% 0 0 0'
}

const mobDivStyle = {
    margin:'30% 0 0 0'
}

const pStyle = {
    textAlign: 'center',
    margin: '4%'
}

const totalStyleDiv = {
    width:'100%',
    display:'flex'
}

const headerTextStyle = {
    fontWeight:'bold',
    margin:'5% 0 0 0',
    fontSize:'1.25em'
}

const thankYouStyle = {
    fontWeight:'bold',
    fontSize:'2em'
}

const innertotalStyle = {
    width:'65%'
}

const fontBold = {
    fontWeight:'bold'
}

const receiptformStyle = {
    width:'100%',
    display:'flex',
    flexDirection:'row',
    justifyContent:'spaceBetween'
}

const receiptInnerFormStyle = {
    width:'40%',
    justifyContent:'spaceBetween'
}

const receiptMiddleFormStyle = {
    width:'10%',
    justifyContent:'spaceBetween'
}

const mobReceiptMiddleFormStyle = {
    width:'25%',
    justifyContent:'spaceBetween'
}

const receiptOuterFormStyle = {
    width:'40%',
    justifyContent:'spaceBetween'
}

const totalStyle = {
    width:'35%',
    display:'flex',
    flexDirection:'column',
    backgroundColor:'tan',
    padding:'3%'
}


const Receipt = () => {
    const {state} = useContext(AuthContext)
    let {username,order,confirmation} = state;
    const cartItems = JSON.parse(sessionStorage.getItem('cart'))
    const mobileSize = useMediaQuery('(max-width:600px)');
    
    let sessionItems = JSON.parse(sessionStorage.getItem('cart'))
    let maskTotal = totalPrice(sessionItems);
    let trueTotal = parseFloat(maskTotal) + 5.00;
    console.log("order")
    console.log(order)
    const getData = item => {
        console.log("get Data ran");
        console.log(item)
        console.log(item.length)
        sessionStorage.setItem('cart',0)
        sessionStorage.setItem('cartTotal',null)
        if(username == "alert_tester"){
            sessionStorage.setItem('orderCount',item.length)
        }
      };

    window.addEventListener('beforeunload', function (e) {
        e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
        sessionStorage.removeItem('cart')
        sessionStorage.removeItem('cartTotal')

        Object.keys(sessionStorage).map(data =>{
            sessionStorage.removeItem(data)  
        })

        // Cancel the event
        // Chrome requires returnValue to be set
      });

    return (<div style={mobileSize ? mobDivStyle : divStyle}>
            <div style={pStyle}>

                <p style={thankYouStyle}>
                Your payment was successfully processed!
                </p>

                <p>Thank you for participating in SCC-CAAEYC’s Face Mask Fundraiser.
                Your generous contribution will help our chapter continue providing professional development opportunities,
                advocating for quality early learning, and nurturing leaders in the field of early care and education.</p>

                <p> Please visit our website at http://www.scaeyc.net</p>
                <p> Questions? Email scc.caaeyc@gmail.com</p>

                <div>
                    <p style={headerTextStyle}>Order Details</p>
                    <hr /> 

                    <div style={receiptformStyle}>
                        <div style={receiptInnerFormStyle}>
                            Shipping to:
                            <p>{order.actualName} {order.lastName}</p>
                            <p>{order.address}</p>
                            <p>{order.city}, {order.province} {order.postal_code}</p>
                        </div>
                        <div style={mobileSize ? mobReceiptMiddleFormStyle : receiptMiddleFormStyle}>
                            Confirmation Number
                            <p>{confirmation}</p>
                        </div>
                        <div style={receiptOuterFormStyle}>
                            Confirmation Email sent to:
                            <p>{order.email}</p>
                        </div>
                    </div>
                </div>
            </div>
            <Table responsive>
                <thead>
            <tr>
                <th className="text-center">Title</th>
                <th className="text-center">Price</th>
                <th className="text-center">Quantity</th>
                <th className="text-center">Image</th>
            </tr>
            </thead>
            <tbody>
                {
                    cartItems.map((cart,idx) => {
                        console.log(cart.price)
                        return (
                        <tr key={idx}>
                            <td className="text-center">{cart.title}</td>
                            <td className="text-center">{cart.price}</td>
                            <td className="text-center">{cart.quantity}</td>
                            <td className="text-center"><img height="100px" width="185px" src={cart.url} /></td>
                        </tr>
                            )
                        })
                    }
            </tbody>
            </Table>
            <div style={totalStyleDiv}>
                <div style={innertotalStyle}></div>
                <div style={totalStyle}>
                    <p>Shipping: $5</p>
                    <p>Masks: {totalPrice(cartItems)}</p>
                    <p style={fontBold}>Total: ${trueTotal.toFixed(2)}</p>
                </div>
            </div>
            </div>)
}

export default Receipt

import React,{useContext,useEffect,useRef} from 'react'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AuthContext from '../AuthContext'
import AppBar from "@material-ui/core/AppBar";
import {withRouter} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import CartDropdown from '../CartDropdown/CartDropdown'
import update from 'immutability-helper'
import {fetchAllMasks} from '../actions'
import './header.css'

const Header = ({history,match}) => {
    const {state,dispatch} = useContext(AuthContext)
    const {cartItems,toggleCart,hideStickyUnit,hitCount,alert} = state;
    let cartItemCount = sessionStorage.getItem('cartTotal')
    let orderCountItems = sessionStorage.getItem('orderCount')
    let sessionCartItems = JSON.parse(sessionStorage.getItem('cart'))
    let newTotal;
    let hitButton = useRef(0)
    let wrapperRef = useRef(null)
    
    useEffect(() =>{
        if(cartItemCount == null){
            sessionStorage.setItem('cartTotal',0)
        } 

                if(cartItems == undefined || cartItems == 'null' ){
                    console.log("CartItems is undefined")
                } else{
                    newTotal = cartItems.reduce((acc,cartItem) => acc + cartItem.quantity,0)
                    sessionStorage.setItem('cart',JSON.stringify(cartItems))
                    sessionStorage.setItem('cartTotal',newTotal)
                }
    },[])
    
    useEffect(() =>{
        console.log("alert")
        console.log(alert)
    },[alert])

    useEffect(() =>{              
        if(cartItemCount == null){
            sessionStorage.setItem('cartTotal',0)
        } 
        let currentItem = wrapperRef.current;
        if(cartItems == undefined || cartItems == 'null' ){
            console.log("CartItems is undefined")
        } else{
            
            console.log("currentItem")
            console.log(currentItem)
            // currentItem.classList.add('cart-full')
            sessionStorage.setItem('cart',JSON.stringify(cartItems))
            newTotal = cartItems.reduce((acc,cartItem) => acc + cartItem.quantity,0)
            dispatch({type:"HIT_COUNT",payload:hitButton.current +=1})
            sessionStorage.setItem('cartTotal',newTotal)
            // currentItem.classList.remove('cart-full')
        }

    },[cartItems,hitButton])

        const mobileSize = useMediaQuery('(max-width:600px)');
        const tabletSize = useMediaQuery('(max-width:1000px)');

const handleCartClick = () =>{
    dispatch({type:"TOGGLE_CART",payload:toggleCart})
}

const handleHeaderClick = () => {
    dispatch({type:"SET_ALERT",payload:''})
    if(history.location.pathname == '/receipt') {
        dispatch({type:"EMPTY_CART"})
        history.push('/')
    } else{
        history.push('/')
    }
}

const handleCheckoutClick = () =>{
    fetchAllMasks(dispatch)
    history.push('/checkout')
    console.log(match.params)
    if(history.location.pathname){
        dispatch({type:"HIDE_STICKY_UNIT",payload:true})
    }
}

const headerStyle = {
    width:'100%',
    height:'175px',
    display: 'flex',
    justifyContent: 'spaceBetween'
}

const tabletHeaderStyle = {
    width:'100%',
    height:'135px',
    display: 'flex',
    justifyContent: 'spaceBetween'
}

const mobHeaderStyle = {
    width:'100%',
    height:'105px',
    display: 'flex',
    justifyContent: 'spaceBetween'
}

const iconStyle = {
    width:'85%',
    height:'175px',
    margin:'auto',
    display:'flex'
}

const mobIconStyle = {
    width:'85%',
    margin:'auto',
    display:'flex'
}

const innerIconStyle = {
    width:'75%',
    justifyContent:'spaceBetween'
}

const outerIconStyle = {
    width:'13%',
    justifyContent:'spaceBetween',
}
let cartSectionStyle = {
    width:'15%',
    height:'100%',
    display: 'flex',
    flexDirection: 'column',
    padding:'10px'
}
let mobCartSectionStyle = {
    padding:'0px'
}

let mobButtonStyle = {
    height:'35',
    width:'35',
    float:'right'
}
let mobileFontStyle ={
    fontSize: '20px',
    justifyContent:'center',
    alignItems:'center'
}

let buttonStyle = {
    height:'70',
    width:'70'
}

let fontStyle = {
    fontSize:'14px'
}

    const useStyles = makeStyles(theme => ({
        root: {
          flexGrow: 1
        },
        grow: {
          flexGrow: 1,
          display: "flex",
          alignItems: "center"
        },
        icon: {
          color: "green",
          fontSize: 45
        },
        mobile: {
          display: "none"
        },
        picture: {
          height: "50px",
          borderRadius: "90%"
        },
        menuButton: {
          marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
          },
        alertStyle:{
            backgroundColor:'red',
            width:'5%',
            borderRadius:'55px',
            textAlign:'center'
        },
        appbarHeight:{
            marginTop:'80vh',
            height:'175px',
            display: 'flex',
            flexDirection: 'column'
        },
        appbarInnerDiv:{
            width:'35%',
            justifyContent:'center',
            alignItems:'center'
        },
        appbarOuterDiv:{
            width:'50%',
            justifyContent:'center',
            alignItems:'center',
            margin: '3% 0 0 0'
        },
        appbarHeightDiv:{
            width:'100%',
            margin:'5px',
            justifyContent: 'spaceBetween',
            display: 'flex',
            flexDirection: 'row',
            alignItems:'center'
        },
        bigFont:{
            fontSize:'26px',
            color:'white',
            backgroundColor:'#2ca8ff'
        },
        center:{
            margin:'auto'
        },
        pContainer:{
            margin:'auto',
            textAlign:'center',
            fontWeight:'bold'
        }
      })
    );

    const clickable = {
        cursor:'pointer',
        margin: '0 25px 0 0'
    }
      
    const classes = useStyles();

    return (
        <div className={classes.root}>
         <AppBar color="teal" position="fixed">
         {mobileSize && hideStickyUnit !== true ? 
         (<>
            <AppBar className={classes.appbarHeight} position="fixed" color="info" type="button">
            <Button onClick={handleCheckoutClick} className={classes.bigFont}>
                    <p>
                        Go To Checkout
                    </p>
                
                </Button>
                <div className={classes.appbarHeightDiv}>
                    <div className={classes.appbarInnerDiv}>
                        <ShoppingCartIcon style={mobButtonStyle} />
                    </div>
                    <div className={classes.appbarOuterDiv}>
                        <p style={mobileFontStyle}>
                            Cart Items: {cartItemCount}
                        </p>
                    </div>
                </div>

            </AppBar>
            </>)
         : null}
                
                <div style={mobileSize ? mobHeaderStyle : tabletSize ? tabletHeaderStyle :headerStyle}>
                    <div style={mobileSize ? mobIconStyle : iconStyle}>
                        <div style={outerIconStyle}></div>
                        <div style={innerIconStyle}>
                            <img alt="" onClick={handleHeaderClick} style={clickable} src="https://res.cloudinary.com/dzdvrgbjd/image/upload/v1599961709/CAAEYC_SouthernCalifornia_satellite_wide_tcqkpt.png" />
                        </div>
                        <div style={outerIconStyle}></div>
                    </div>
                            <div>{orderCountItems}</div>
                            {!mobileSize ? 
                                (<div style={mobileSize ? mobCartSectionStyle : cartSectionStyle}>
                                    {history.location.pathname == '/receipt' || history.location.pathname == '/checkout' ? null :(<>
                                    <Button edge="start" onClick={handleCartClick} className={classes.menuButton} color="inherit">
                                    <ShoppingCartIcon style={buttonStyle} />
                                    </Button>
                                        <div className={classes.pContainer}><p ref={wrapperRef} style={fontStyle}>Cart Items: {cartItemCount}</p></div></>)}
                                    {toggleCart ? (<CartDropdown cartItems={sessionCartItems} />):null}
                                </div>)
                        :null}
                </div>  
                        {history.location.pathname == '/checkout' ? 
                        (alert ? 
                            typeof alert == "string" ? (<li>We're sorry, {alert} has sold out. Please remove this item from the cart.</li>) : 
                            
                                alert.map(a =>{
                                    console.log("alert")
                                    console.log(alert)
                                    console.log("a")
                                    console.log(a)
                            
                                return(
                                    <li>We're sorry, {a} has sold out. Please remove this item 
                                        from the cart.</li>
                                )
                            })
                            :null
                        )
                        : null}
                
        </AppBar>
    </div>
    )        
}

export default withRouter(Header);
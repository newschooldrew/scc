import React,{useState,useContext,useEffect} from 'react'
import AuthContext from '../AuthContext'
import AppBar from "@material-ui/core/AppBar";
import {withRouter} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import CartDropdown from '../CartDropdown/CartDropdown'
// import { useToasts } from 'react-toast-notifications'
import HomeIcon from '@material-ui/icons/Home';

const Header = ({history}) => {
    const {state,dispatch} = useContext(AuthContext)
    const {cartItems,toggleCart,hitItem,allMasks} = state;
    // const { addToast } = useToasts()
    let cartAlerts = JSON.parse(sessionStorage.getItem('orderNotification'))
    let cartItemCount = sessionStorage.getItem('cartTotal')
    let orderCountItems = sessionStorage.getItem('orderCount')
    let sessionCartItems = JSON.parse(sessionStorage.getItem('cart'))
    let newTotal;

    useEffect(() =>{              
        sessionCartItems = JSON.parse(sessionStorage.getItem('cart'))
        cartItemCount = sessionStorage.getItem('cartTotal')

        if(cartItemCount == null){
            sessionStorage.setItem('cartTotal',0)
        } 
            // sessionStorage.setItem(`${id}`,[{...foundItem,hitCount:1}])
          

    },[cartItems,hitItem])


const handleCartClick = () =>{
    dispatch({type:"TOGGLE_CART",payload:toggleCart})
}

const headerStyle = {
    width:'100%'
}
const iconStyle = {
    width:'80%',
    float:'left',
    border:'1px solid black'
}
const cartStyle = {
    width:'10%',
    float:'right',
    margin:'40px'
}
const buttonStyle = {
    width:'60',
    height:'60'
}
const fontStyle = {
    fontSize:'18px'
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
        }
      })
    );

    const clickable = {
        cursor:'pointer',
        margin: '0 25px 0 0'
    }

    if(cartItems && cartItems.length > 0){
        try{
            
            sessionStorage.setItem('cart',JSON.stringify(cartItems))
            newTotal = cartItems.reduce((acc,cartItem) => acc + cartItem.quantity,0)
            sessionStorage.setItem('cartTotal',newTotal)
            
        } catch(e){
            console.log("cartItems is empty")
        }
    }
      
    const classes = useStyles();
    
    const showNotification = () =>{
        // addToast('An order was created', { appearance: 'success' }, () => console.log("toast shown"))
    }

    const showAlerts = () =>{
        // dispatch({type:"TOGGLE_ALERT_DROPDOWN",payload:!toggleAlertDropDown})
    }

    return (
        <div className={classes.root}>
         <AppBar position="fixed">
                
                <div style={headerStyle}>
                    <div style={iconStyle}>
                        <a  onClick={() => history.push('/')} style={clickable}><img src="https://res.cloudinary.com/dzdvrgbjd/image/upload/v1599961709/CAAEYC_SouthernCalifornia_satellite_wide_tcqkpt.png" /></a>
                    </div>
                    <div style={cartStyle}>
                        <div>{orderCountItems}</div>
                        <Button edge="start" onClick={handleCartClick} className={classes.menuButton} color="inherit">
                            <ShoppingCartIcon style={buttonStyle} />
                        </Button>
                            <p style={fontStyle}>Cart Items: {cartItemCount}</p>
                        {toggleCart ? (<CartDropdown cartItems={sessionCartItems} />):null}
                        </div>
                    </div>  
                
        </AppBar>
    </div>
    )        
}

export default Header;
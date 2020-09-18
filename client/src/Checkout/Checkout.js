/*eslint-disable*/
import React, {useContext} from "react";
import AuthContext from '../AuthContext'
import {Link} from 'react-router-dom'
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
// @material-ui/icons
import Favorite from "@material-ui/icons/Favorite";
import Close from "@material-ui/icons/Close";
import Remove from "@material-ui/icons/Remove";
import Add from "@material-ui/icons/Add";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
// core components
import Header from "../Header/Header_Checkout.js";
import HeaderLinks from "../Header/HeaderLinks.js";
import Parallax from "../Parallax/Parallax.js";
import Grid from '@material-ui/core/Grid';
import GridContainer from "../Grid/GridContainer.js";
import GridItem from "../Grid/GridItem.js";
// import Footer from "components/Footer/Footer.js";
import CheckoutTable from "../CheckoutTable/CheckoutTable.js";
import Button from "../CustomButtons/Button.js";
import Card from "../Card/Card.js";
import CardBody from "../Card/CardBody.js";
import {totalPrice,totalItemPrice} from '../cart.utils'
import {withRouter} from 'react-router-dom'
import shoppingCartStyle from "../assets/jss/material-kit-pro-react/views/shoppingCartStyle.js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import {fetchAllMasks,getPublicStripeKey} from '../actions'
import CheckoutForm from './CheckoutForm'
import { ButtonGroup, Table, UncontrolledTooltip } from "reactstrap";
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles(shoppingCartStyle);

function ShoppingCartPage({history}) {
  const {state,dispatch} = useContext(AuthContext)
  const {allMasks,cartItems} = state;
  const mobileSize = useMediaQuery('(max-width:600px)');
  const stripePromise = getPublicStripeKey().then(key => {
    console.log("key:")
    console.log(key)
    return loadStripe(key)
  });

  React.useEffect(() => {
    console.log("cartItems:")
    console.log(cartItems)
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    fetchAllMasks(dispatch)
  },[]);

  let limitReached;

  const addItemToCart = (id,title,price) =>{
    console.log("add item from cart")
    const item = {id,title,price};
    dispatch({type:"ADD_ITEM_TO_CART",payload:item})
    console.log("add item to cart in checkout being hit")
    if(sessionStorage.getItem(id)){
      let existingNum = parseInt(sessionStorage.getItem(id));
      console.log("existingNum exists")
      console.log(existingNum)
      sessionStorage.setItem(`${id}`,existingNum + 1)
    } else{console.log("no luck this time")}
}

const goBackToShopping = () =>{
  history.push('/')
}

const removeItemFromCart = (id,title,price) =>{
  console.log("remove item from cart")
  const item = {id,title,price};
  dispatch({type:"REMOVE_ITEM_FROM_CART",payload:item})
  let myCachedTotal = JSON.parse(sessionStorage.getItem('cartTotal'))
  console.log("myCachedTotal:")
  console.log(myCachedTotal)
  if(myCachedTotal == 1){
      console.log("Clear cart")
      sessionStorage.removeItem('cart');
      sessionStorage.setItem('cartTotal',0)
  }
    let existingNum = parseInt(sessionStorage.getItem(id));
    console.log("existingNum exists")
    console.log(existingNum)
    sessionStorage.setItem(`${id}`,existingNum - 1)
}

  const handleClick = item =>{
    let cartCount = JSON.parse(sessionStorage.getItem('cart'))
    if(cartCount && cartCount.length == 1){
        sessionStorage.removeItem('cart');
        sessionStorage.setItem('cartTotal',0)
    }else{
        dispatch({type:"CLEAR_CART",payload:item})
    }
}

const totalPriceDivStyle = {
  width:'100%',
  display:'flex',
  flexDirection:'row'
}

const totalPriceOuterStyle = {
  width:'10%',
  justifyContent:'spaceBetween',
}

const quantityStyle = {
  textAlign:'center'
}
const totalPriceStyle = {
  width:'80%',
  textAlign:'center',
  justifyContent:'spaceBetween',
  fontSize:'3em'
}

const noItemsMargin = {
    margin:'10% 0 0 0'
}

const itemDiv = {
    width:'80%',
    textAlgin:'center',
    fontSize:'1.5em',
    display:'flex',
    textAlign: 'center',
    margin: 'auto',
    flexDirection:'column'
}

const innerItemDiv = {
    justifyContent:'spaceBetween',
    width:'10%',
}

const lineItem = {
    display:'inlineBlock',
}

const classes = useStyles();
let sessionItems = JSON.parse(sessionStorage.getItem('cart'))
let maskTotal = totalPrice(sessionItems||cartItems);
let trueTotal = parseFloat(maskTotal) + 5.00;
if(!cartItems && !sessionItems) return (<div>loading checkout items</div>)

  return (
    <div>
      <Parallax
        image={require("../assets/img/bg3.jpg")}
        filter="dark"
        small
      >
        <div className={classes.container}>
          <GridContainer>
            <GridItem
              md={8}
              sm={8}
              className={classNames(
                classes.mlAuto,
                classes.mrAuto,
                classes.textCenter
              )}
            >
              <h2 className={classes.title}>Your Cart</h2>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>

                    <div className={classNames(classes.main, classes.mainRaised)}>
                      <div className={classes.container}>
                        <Card plain>
                          <CardBody plain>
                            {/* <h3 className={classes.cardTitle}>Shopping Cart</h3> */}
                            <Button color="info" onClick={() => goBackToShopping()}>Back to Shopping</Button>
                    {(() => {

                    if(sessionItems && sessionItems.length > 0){
                      
                      let cartItemCount = JSON.parse(sessionStorage.getItem('cart'))
                      let matchCartItemArr = [];

                      return(
                        sessionItems.map((item,idx) =>{
                          const {id,title,price,quantity} = item;
                          let limitReached;
                          console.log("quantity:")
                          console.log(quantity)

                          if(allMasks){
                          allMasks.map(mask =>{
                            if(mask._id == id){ 
                              matchCartItemArr.push(mask)
                            }
                            console.log("matchCartItemArr:")
                            console.log(matchCartItemArr)
                          })
                        }
                          let currentItem = matchCartItemArr.filter(item => item._id == id)
                      
                          let tableHeadData;

                          if(!mobileSize){
                            tableHeadData = [
                              "",
                              "PRODUCT",
                              "PRICE",
                              "QTY",
                              "AMOUNT",
                              ""
                            ]
                          } else{
                            tableHeadData = [
                              "",
                              "PRICE",
                              "QTY",
                              "AMOUNT",
                              ""
                            ]                            
                          }

                            let tableData = [  
                              // image
                                      <div className={classes.imgContainer} key={1}>
                                      <img src={item.url} alt="..." className={classes.img} />
                                        </div>,
                              // PRODUCT
                                          <span key={1}>
                                          <a href="#jacket" className={classes.tdNameAnchor}>
                                            {item.title}
                                          </a>
                                          <br />
                                          <small className={classes.tdNameSmall}>
                                            {item.description}
                                          </small>
                                        </span>,
                              // PRICE
                                        <span key={1}>
                                          <small className={classes.tdNumberSmall}>$</small> {item.price}
                                        </span>,
                            // QTY
                                        <span key={1}>
                                          {` `}
                                          <div className={classes.buttonGroup}>
                                          
                                            <Button
                                              color="info"
                                              size="sm"
                                              round
                                              disabled={currentItem[0].quantity == quantity}
                                              onClick={() => addItemToCart(id,title,price)}
                                            >
                                              <i className="now-ui-icons ui-1_simple-add"></i>
                                            </Button>
                                            <p style={quantityStyle}>{cartItemCount[idx].quantity}</p>
                                            <Button
                                              color="info"
                                              size="sm"
                                              round
                                              onClick={() => removeItemFromCart(id,title,price)}
                                            >
                                              <i className="now-ui-icons ui-1_simple-delete"></i>
                                            </Button>

                                          </div>
                                        </span>,
                            // AMOUNT
                                        <span key={1}>
                                          <small className={classes.tdNumberSmall}>$</small> {totalItemPrice(item)}
                                        </span>,
                                        <Tooltip
                                          key={1}
                                          id="close1"
                                          title="Remove item"
                                          placement="left"
                                          classes={{ tooltip: classes.tooltip }}
                                        >
                                          <Button link className={classes.actionButton}>
                                            <Close  onClick={() => handleClick(item)}/>
                                          </Button>
                                        </Tooltip>
                                      ]

                                      if(mobileSize){
                                        tableData = tableData.filter((data,idx) =>{
                                              if(idx !== 1){
                                                return data 
                                              }
                                        })
                                      }

                        return(
                                <CheckoutTable
                                    key={id}
                                    tableHead={tableHeadData}
                                    tableData={[tableData]}
                                        />
                                            )
                                          })
                                          // end of sessionItems map

                                         )
                                      } 
                                      // end of sessionItems length

                                      else {return <p style={noItemsMargin}>No items left in this cart</p>}
                                    })()
                                    }
                                          <div style={itemDiv}>
                                            <div style={innerItemDiv}></div>
                                            <div style={lineItem}>
                                              <p> Mask: ${maskTotal}</p>
                                            </div>
                                            <div style={lineItem}>
                                              <p>Shipping: $5</p>
                                              </div>
                                            <div style={innerItemDiv}></div>
                                          </div>                            
                                      <div style={totalPriceDivStyle}>
                                        <div style={totalPriceOuterStyle}></div>
                                            <p style={totalPriceStyle}>Total: ${trueTotal.toFixed(2)}</p>
                                        <div style={totalPriceOuterStyle}></div>
                                          </div>
                                      <Grid item xs={3}></Grid>
                                        <Grid item xs={3}>
                                          </Grid>
                                          <Grid item xs={6}>
                                        <Elements stripe={stripePromise}>
                                          <CheckoutForm price={trueTotal} />
                                        </Elements>
                                        </Grid>
                                        <Grid item xs={3}>
                                          </Grid>
                                      </CardBody>
                                    </Card>
                                    </div>
                                    </div>
                            </div>)}
export default withRouter(ShoppingCartPage)
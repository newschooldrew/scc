import React, {useContext, useEffect, useState,useRef} from 'react'
import AuthContext from './AuthContext'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {fetchAllMasks,filterMasks,changeLimitReached,removeItemFromInventory} from './actions'
import {Link,withRouter} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import CustomButton from './CustomButton/CustomButton'

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  CardText,
  Collapse,
  Label,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";

const App = ({history}) => {
    let itemsArr = [];
    const {state,dispatch} = useContext(AuthContext)
    const {allMasks,cartItems,hitCount} = state;

    const [emailFocus, setEmailFocus] = React.useState(false);
    const [quantity, setQuantities] = useState({})
    
    let sessionCartItems = JSON.parse(sessionStorage.getItem('cart'))
    
    const [filterValue, setFilterValue] = useState({people:false,animals:false,flowers:false})
    const [values, setValues] = useState({people:false,animals:false,flowers:false});
    const mobileSize = useMediaQuery('(max-width:600px)');
    const tabletSize = useMediaQuery('(max-width:800px)');

    const itemsRef = useRef([]);

    const useStyles = makeStyles(theme => ({
        paper: {
          display: 'flex',
          textAlign: 'center',
          flexDirection: 'column',
          padding:'15px',
          margin:'15px',
        },
        avatar: {
          margin: theme.spacing(1),
          backgroundColor: theme.palette.secondary.main,
        },
        form: {
          width: '100%', // Fix IE 11 issue.
          marginTop: theme.spacing(3),
        },
        submit: {
          margin: theme.spacing(3, 0, 2),
        },
        paper: {
          padding: theme.spacing(.25),
          textAlign: 'center',
          color: theme.palette.text.secondary,
        },
        clickable:{
          cursor:'pointer',
          width:'200px',
          height:'160px',
          objectFit:'cover',
          borderRadius:'4x',
        },
        scroll:{
          overflow:'scroll',
          margin:'15% 0 0 0'
        },
        width:{
          width:0
        },
        center:{
          textAlign:'center'
        },
        buttonCenter:{
          margin:'5px'
        },
        fullWidth:{
          margin:'auto'
        },
        buttonMargin:{
          marginRight:'10px'
        }
      }));
    
    const classes = useStyles();

    useEffect(() =>{
        fetchAllMasks(dispatch)
    },[])


    useEffect(() =>{
      fetchAllMasks(dispatch)
      if(cartItems && cartItems.length > 0){
        try{
            
            sessionStorage.setItem('cart',JSON.stringify(cartItems))
            newTotal = cartItems.reduce((acc,cartItem) => acc + cartItem.quantity,0)
            sessionStorage.setItem('cartTotal',newTotal)

          console.log("sessionCartItems")
          console.log(sessionCartItems)
          console.log("cartItems")
          console.log(cartItems)

            if(sessionCartItems == null){
              newTotal = cartItems.reduce((acc,cartItem) => acc + cartItem.quantity,0)
            } else{
              newTotal = sessionCartItems.reduce((acc,cartItem) => acc + cartItem.quantity,0)
            }

        } catch(e){
            console.log("cartItems is empty")
        }
    }
    },[cartItems,hitCount])

    // collapse states and functions
    const [collapses, setCollapses] = React.useState([1]);
    const changeCollapse = (collapse) => {
      if (collapses.includes(collapse)) {
        setCollapses(collapses.filter((prop) => prop !== collapse));
      } else {
        setCollapses([...collapses, collapse]);
      }
    };

    const handleChange = e =>{
      const targetValue = e.target.value;
      filterMasks(targetValue,dispatch)
    }

    const handleMobileChange = e =>{
      const targetValue = e.target.value;
      filterMasks(targetValue,dispatch)

        if(filterValue[targetValue] == null){
          setFilterValue({...filterValue,[targetValue]:true})
        } else{
          setFilterValue({...filterValue,[targetValue]:!filterValue[targetValue]})
        }
    }

    let newTotal;

    const addItemToCart = (id,title,price,url,currentItem) =>{
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

          // itemsRef.current = itemsRef.current.slice(i, i + 1)
          // if(itemsRef.current == 2){
          //   console.log("current ref hit!!")
          // }

          // itemsRef.current[i] += 1
          // console.log("itemsRef")
          // console.log(itemsRef.current)
          // console.log(currentItem.ref)
    }

    // const removeItemFromCart = (id,title,price) =>{
    //     const item = {id,title,price};
    //     dispatch({type:"REMOVE_ITEM_FROM_CART",payload:item})
    //     let myCachedTotal = JSON.parse(sessionStorage.getItem('cartTotal'))

    //     if(myCachedTotal == 1){
    //         sessionStorage.removeItem('cart');
    //         sessionStorage.setItem('cartTotal',0)
    //     }
        
    //         let existingNum = parseInt(sessionStorage.getItem(id));
    //         sessionStorage.setItem(`${id}`,existingNum - 1)

    // }

    return (
        <>
      <div className={"wrapper",classes.scroll}>
        <div className={"main"}>
          <div className="section">
            <Container>
              {!mobileSize ? (<Button color="info" type="button"><Link to="/checkout">Go To Checkout</Link></Button>) : null}
              <Row>
                {mobileSize || tabletSize ? (
                <div className={classes.fullWidth}>
                  <Button color={filterValue["animals"] == true ? "success" : "info"} type="button" className={classes.buttonCenter} value="animals" onClick={e => handleMobileChange(e)}>
                      Animals
                  </Button>
                  <Button color={filterValue["flowers"] == true ? "success" : "info"} type="button" className={classes.buttonCenter} value="flowers" onClick={e => handleMobileChange(e)}>
                      Flowers
                  </Button>
                  <Button color={filterValue["people"] == true ? "success" : "info"} type="button" className={classes.buttonCenter} value="people" onClick={e => handleMobileChange(e)}>
                      People
                  </Button>
                </div>
                ):(
                  <Col md="3">
                  <h2 className="section-title">SCC Masks!</h2>
                  <div className="collapse-panel">
                    <CardBody>
                      <Card className="card-refine card-plain">
                      <CardTitle tag="h4">
                          Filter Your Masks{" "}
                          <Button
                            className="btn-icon btn-neutral pull-right"
                            color="default"
                            id="tooltip633919451"
                          >
                            <i className="arrows-1_refresh-69 now-ui-icons"></i>
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip633919451"
                          >
                            Reset Filter
                          </UncontrolledTooltip>
                        </CardTitle>
                        <CardHeader id="headingTwo" role="tab">
                          <h6>
                            <a
                              className="text-info"
                              aria-expanded={collapses.includes(1)}
                              data-toggle="collapse"
                              data-parent="#accordion"
                              href="#pablo"
                              onClick={(e) => {
                                e.preventDefault();
                                changeCollapse(1);
                              }}
                            >
                              Type{" "}
                              <i className="now-ui-icons arrows-1_minimal-down"></i>
                            </a>
                          </h6>
                        </CardHeader>
                        <Collapse isOpen={collapses.includes(1)}>
                          <CardBody>
                            <FormGroup check>
                              <Label check>
                                <Input type="checkbox" value="flowers" onChange={e => handleChange(e)}></Input>
                                <span className="form-check-sign"></span>
                                Flowers
                              </Label>
                            </FormGroup>
                            <FormGroup check>
                              <Label check>
                                <Input type="checkbox" value="animals" onChange={e => handleChange(e)}></Input>
                                <span className="form-check-sign"></span>
                                Animals
                              </Label>
                            </FormGroup>
                            <FormGroup check>
                              <Label check>
                                <Input type="checkbox" value="people" onChange={e => handleChange(e)}></Input>
                                <span className="form-check-sign"></span>
                                People
                              </Label>
                            </FormGroup>
                          </CardBody>
                        </Collapse>
                      </Card>
                    </CardBody>
                  </div>
                </Col>
                )}
            <Col md="9">
                <Row>
            {allMasks && allMasks.map((post,i) =>{
                const id = post._id;
                const title = post.title;
                const price = post.price;
                const url = post.url;
                const quantity = post.quantity;
                let sessionCartItems = JSON.parse(sessionStorage.getItem('cart'))
                let qty;
                let limit;
                let disabled;
                let currentItem = itemsRef.current[i]

                return(
                <>
                    <Col lg="4" md="6">
                      <Card className="card-product card-plain">
                      <div className={"card-image",classes.center}>
                          <a onClick={(e) => history.push(`/product-page/${post._id}`)}>
                            <img
                              className={classes.clickable}
                              alt="..."
                              src={post.url}
                            />
                          </a>
                        </div>
                        <CardBody>
                            <CardTitle tag="h4">{post.title}</CardTitle>
                            <CardText className="card-description">{post.description}</CardText>
                                <CardTitle className="card-description">${post.price}</CardTitle>
                                <CardTitle>
                                    {/* <Button 
                                        color="info" 
                                        ref={el => itemsRef.current[i] = el}
                                        size={mobileSize || tabletSize  ? "lg" : "regular"}
                                        variant="contained"
                                        disabled={!disabled}
                                        className={classes.buttonMargin}
                                        onClick={() => removeItemFromCart(id,title,price,url)} /> */}
                                          <CustomButton type="negative" id={id} title={title} price={price} url={url} qty={quantity}/>
                                      
                                      {"  "}
                                    {/* <Button 
                                        color="info" 
                                        ref={el => itemsRef.current[i] = el}
                                        size={mobileSize || tabletSize ? "lg" : "regular"}
                                        variant="contained" 
                                        name={id}
                                        className={classes.buttonMargin}
                                        disabled={limitReached}
                                        onClick={e => addItemToCart(id,title,price,url,currentItem)}>
                                        <HitCount type="positive" />
                                      </Button> */}
                                          <CustomButton type="positive" id={id} title={title} price={price} url={url} qty={quantity}/>
                                      <p>{post.limitReached}</p>
                                </CardTitle>
                        </CardBody>
                            <CardFooter>
                                <CardText className={classes.paper}>Quantity: </CardText>
                                <CardText className={classes.paper}>{post.quantity}</CardText>
                            </CardFooter>
                        </Card>
                    </Col>
        </>)})}
                </Row>
            </Col>
    </Row>
</Container>
          </div>
        </div>
      </div>
    </>
        )
}

export default withRouter(App)
import React, {useContext, useEffect, useState} from 'react'
import AuthContext from './AuthContext'
import {fetchAllMasks,filterMasks,changeLimitReached,removeItemFromInventory} from './actions'
import {Link,withRouter} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';

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
    const {allMasks,cartItems} = state;

    const [emailFocus, setEmailFocus] = React.useState(false);
    const [quantity, setQuantities] = useState({})

    let sessionCartItems = JSON.parse(sessionStorage.getItem('cart'))

    const [values, setValues] = useState({people:false,animals:false,flowers:false});

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
          borderRadius:'4x'
        },
        scroll:{
          overflow:'scroll'
        }
      }));
    
    const classes = useStyles();

    useEffect(() =>{
        fetchAllMasks(dispatch)
    },[])

    useEffect(() =>{
      if(cartItems && cartItems.length > 0){
        try{
            
            sessionStorage.setItem('cart',JSON.stringify(cartItems))
            newTotal = cartItems.reduce((acc,cartItem) => acc + cartItem.quantity,0)
            sessionStorage.setItem('cartTotal',newTotal)

        } catch(e){
            console.log("cartItems is empty")
        }
    }
    },[cartItems])

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
      console.log(values)

      const myValue = e.target.value;
      filterMasks(myValue,dispatch)
    }

    let newTotal;

    const addItemToCart = (id,title,price,url) =>{
        console.log(state)
        const item = {id,title,price,url};
        dispatch({type:"ADD_ITEM_TO_CART",payload:item})
        let foundItem;
        removeItemFromInventory(id)

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

    const removeItemFromCart = (id,title,price) =>{
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

    return (
        <>
      <div className={"wrapper",classes.scroll}>
        <div className={"main"}>
          <div className="section">
            <Container>
            <Button color="info" type="button"><Link to="/checkout">Go To Checkout</Link></Button>
              <h2 className="section-title">SCC Masks!</h2>
              <Row>
                <Col md="3">
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

            <Col md="9">
                <Row>
            {allMasks && allMasks.map(post =>{
                const id = post._id;
                const title = post.title;
                const price = post.price;
                const url = post.url;
                const quantity = post.quantity;
                let sessionCartItems = JSON.parse(sessionStorage.getItem('cart'))
                let qty;
                let limit;
                let disabled;

                let limitReached;
                if(sessionStorage.getItem(id) == post.quantity){
                    limitReached = true;
                }

                if(sessionCartItems && sessionCartItems.length > 0){
                  console.log(id)
                  console.log(sessionCartItems.find(e => console.log(e)))
                  let foundId = sessionCartItems.filter(e => e.id == id)
                  console.log(foundId)

                    qty = sessionCartItems.find((e,i) => e.title == post.title)
                        try{
                        disabled = qty.quantity;
                        console.log(disabled)
                        } catch(e){
                            console.log("no quantity")
                        }
                }

                return(
                <>
                    <Col lg="4" md="6">
                      <Card className="card-product card-plain">
                      <div className="card-image">
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
                                    <Button 
                                        color="primary" 
                                        size="small" 
                                        variant="contained"
                                        disabled={!disabled} 
                                        onClick={() => removeItemFromCart(id,title,price,url)}>
                                          -
                                      </Button>

                                    <Button 
                                        color="primary" 
                                        size="small" 
                                        variant="contained" 
                                        name={id}
                                        disabled={limitReached}
                                        onClick={e => addItemToCart(id,title,price,url)}>
                                        +
                                      </Button>
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
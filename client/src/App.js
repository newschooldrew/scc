import React, {useContext, useEffect, useState,useRef} from 'react'
import AuthContext from './AuthContext'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {fetchMaskCategory,fetchAllMasks} from './actions'
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
  Input,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";

const App = ({history,match}) => {

    const {state,dispatch} = useContext(AuthContext)
    const {allMasks,cartItems,masksCategory} = state;
    
    let sessionCartItems = JSON.parse(sessionStorage.getItem('cart'))
    let sessionAllMasks = JSON.parse(sessionStorage.getItem('allMasks'))
    let hitButton = useRef(0)
    const [filterValue, setFilterValue] = useState({people:false,animals:false,flowers:false})
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
          width:'200px',
          height:'160px',
          objectFit:'cover',
          borderRadius:'4x',
        },
        scroll:{
          overflow:'scroll',
          margin:'25% 0 0 0'
        },
        width:{
          width:0
        },
        center:{
          textAlign:'center'
        },
        buttonCenter:{
          margin:'5px',
          cursor:'pointer'
        },
        fullWidth:{
          margin:'auto'
        },
        buttonMargin:{
          marginRight:'10px'
        },
        soldOut:{
          color:'red',
          fontWeight:'bold',
          margin:'0 0 15% 0'
        },
        section:{
          margin:'10% 0 15% 0'
        },
        quantityStyle:{
          margin:'0 0 15% 0'
        },
        header:{
          width:'100%',
          textAlign:'center',
          fontWeight:'bold',
          fontSize:'1.05em',
          display:'flex',
          flexDirection:'row'
        },
        innerHeader:{
          width:'30%',
        },
        mobileInnerHeader:{
          width:'17%',
        },
        outerHeader:{
          width:'65%',
        },
        buttonStyle:{
          'color':'white',
          'fontWeight':'bold'
        },
        filterFont:{
          'fontSize':'1em'
        },
        fontPrice:{
          fontWeight:'bold',
          color:'black'
        }
      }));
    
    const classes = useStyles();

    useEffect(() =>{
      fetchAllMasks(dispatch)
      fetchMaskCategory(dispatch,match.params.category)
      
        dispatch({type:"HIDE_STICKY_UNIT",payload:false})

      if(sessionAllMasks && sessionAllMasks.length > 1 && sessionAllMasks !== null){
        console.log("")
      } else{
        sessionStorage.setItem('allMasks',JSON.stringify(allMasks))
      }
      
    },[])
    
    useEffect(() =>{

      fetchMaskCategory(dispatch,match.params.category)
    },[match.params])
    
    
    useEffect(() =>{
      
      if(sessionAllMasks && sessionAllMasks.length > 1 && sessionAllMasks !== null){
        console.log("")
      } else{
        console.log("allMasks")
        console.log(allMasks)
        sessionStorage.setItem('allMasks',JSON.stringify(allMasks))
      }

      if(cartItems && cartItems.length > 0){
        // try{
          if(cartItems !== undefined || cartItems !== null ){
            sessionStorage.setItem('cart',JSON.stringify(cartItems))
            newTotal = cartItems.reduce((acc,cartItem) => acc + cartItem.quantity,0)
            dispatch({type:"HIT_COUNT",payload:hitButton.current +=1})
            sessionStorage.setItem('cartTotal',newTotal)
        }

    }
    },[cartItems,hitButton])

    // collapse states and functions
    const [collapses, setCollapses] = React.useState([1]);
    const changeCollapse = (collapse) => {
      if (collapses.includes(collapse)) {
        setCollapses(collapses.filter((prop) => prop !== collapse));
      } else {
        setCollapses([...collapses, collapse]);
      }
    };

    let newTotal;

    return (
        <>
      <div className={"wrapper",classes.scroll}>
        <div className={"main"}>
          <div className={"section"}>
            <Container>
              <Row>
              {tabletSize || mobileSize ? 
                (<div className={classes.header}>
                  <div className={classes.mobileInnerHeader}></div>
                  <div className={classes.outerHeader}>
                    <p className={classes.filterFont}>Filter Mask by Type</p>
                  </div>
                </div>) : null}
                {mobileSize && history.location.pathname !== '/checkout' || tabletSize && history.location.pathname !== '/checkout' ? (
                <div className={classes.fullWidth}>
                  <Button color={match.params.category == "animals" ? "success" : "info"} type="button" className={classes.buttonCenter} value="animals"  onClick={() => history.push('/shopping/animals')}>
                      Animals
                  </Button>
                  <Button color={match.params.category == "flowers" ? "success" : "info"} type="button" className={classes.buttonCenter} value="flowers"  onClick={() => history.push('/shopping/flowers')}>
                      Flowers
                  </Button>
                  <Button color={match.params.category == "people" ? "success" : "info"} type="button" className={classes.buttonCenter} value="people"  onClick={() => history.push('/shopping/people')}>
                      People
                  </Button>
                </div>
                ):(
                  <Col md="3">
                  {!mobileSize ? (<Button color="info" type="button"><Link to="/checkout"><span className={classes.buttonStyle}>Go To Checkout</span></Link></Button>) : null}
                  <div className="collapse-panel">
                    <CardBody>
                      <Card className="card-refine card-plain">
                      <CardTitle tag="h5">
                          Filter Mask by Type{" "}
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
                          <FormGroup tag="fieldset">
                            <FormGroup>
                              <Label>
                                <Input type="radio" defaultChecked={match.params.category == 'flowers' ? true : false} name="radio1" value="flowers" onChange={() => history.push('/shopping/flowers')}></Input>
                                <span className="form-check-sign"></span>
                                Flowers
                              </Label>
                            </FormGroup>
                            <FormGroup>
                              <Label>
                                <Input type="radio" defaultChecked={match.params.category == 'animals' ? true : false} name="radio1" value="animals" onChange={() => history.push('/shopping/animals')}></Input>
                                <span className="form-check-sign"></span>
                                Birds/Butterflies
                              </Label>
                            </FormGroup>
                            <FormGroup>
                              <Label>
                                <Input type="radio" defaultChecked={match.params.category == 'people' ? true : false} name="radio1" value="people" onChange={() => history.push('/shopping/people')}></Input>
                                <span className="form-check-sign"></span>
                                People
                              </Label>
                            </FormGroup>
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
            {masksCategory && masksCategory.map((post,i) =>{
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
                            <img
                              className={classes.clickable}
                              alt="..."
                              src={post.url}
                            />
                        </div>
                        <CardBody>
                            <CardTitle tag="h4">{post.title}</CardTitle>
                            <CardText className="card-description">{post.description}</CardText>
                                <CardTitle className={"card-description",classes.fontPrice}>${post.price}</CardTitle>
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
                                </CardTitle>
                        </CardBody>
                            <CardFooter>
                                <CardText className={classes.paper}>Masks Remaining: </CardText>
                                <CardText className={classes.paper}>{post.quantity == 0 ? 
                                    (<span className={classes.soldOut}>SOLD OUT</span>): 
                                    (<span className={classes.quantityStyle,classes.fontPrice}>{post.quantity}</span>)}
                                </CardText>
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
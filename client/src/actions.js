import axios from 'axios'

export const fetchAllMasks = async (dispatch,type) =>{
  console.log("fetch mask type:")
  console.log(type)
    const res = await axios.post('/fetch-masks',{type});
        dispatch({type:"FETCH_ALL_MASKS",payload:res.data})
    }

export const filterMasks = async (dispatch,value) =>{
        console.log("filter meals:")
        console.log(value)
        
        const res = await axios.post('/filter-masks',{value});
            console.log("fetch order from alerts")
            console.log(res.data)
            dispatch({type:"FETCH_ALL_MASKS",payload:res.data}) 
    }

export const removeItemFromCartDB = async id => {
    console.log(id)
        const res = await axios.post('/remove-item-from-cart-db',{id})
        console.log(res);
}

export const changeLimitReached = async (id,dispatch) => {
    console.log(id)

        const fetchedMasks = await axios.get('/fetch-masks');
        console.log(fetchedMasks);
        dispatch({type:"FETCH_ALL_MASKS",payload:fetchedMasks.data}) 
}

export const removeItemFromInventory = async (cartTotal) => {
    console.log("cartTotal")

    const items = {cartTotal}
    console.log(items)
        const res = await axios.post('/remove-item-from-inventory',cartTotal)
}

export const getPublicStripeKey = options => {
    return window
      .fetch(`/public-key`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          return null;
        }
      })
      .then(data => {
        if (!data || data.error) {
          console.log("API error:", { data });
          throw Error("API Error");
        } else {
          return data.publicKey;
        }
      });
  };

  export const createPaymentIntent = async item => {
    const {actualName,lastName,address,city,province,postal_code,price,cartTotal} = item;
    //   dispatch({type:"CREATE_ORDER",payload:item})
    const options = {
        actualName,
        lastName,
        cartTotal,
        address,
        city,
        province,
        postal_code,
        price,
        currency: "USD"
      };
    const res = await axios.post('/create-payment-intent',options)
      return res.data;
  };
  
  export const createOrder = async (item,dispatch) =>{
    console.log("item:")
    console.log(item)
    const res = await axios.post('/create-order', item);
    console.log("res.data")
    console.log(res.data)
    dispatch({type:"CREATE_CONFIRMATION",payload:res.data})     
}
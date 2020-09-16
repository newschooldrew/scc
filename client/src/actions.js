import axios from 'axios'

export const fetchAllMasks = async (dispatch) =>{
    const res = await axios.get('/fetch-masks');
        console.log("fetch masks response is: ")
        console.log(res.data)
        dispatch({type:"FETCH_ALL_MASKS",payload:res.data})
    }

export const filterMasks = async (value,dispatch) =>{
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
        const res = await axios.post('/change-limit-reached',{id})
        const fetchedMasks = await axios.get('/fetch-masks');
        console.log(fetchedMasks);
        dispatch({type:"FETCH_ALL_MASKS",payload:fetchedMasks.data}) 
}

export const removeItemFromInventory = async (id,count) => {
    console.log(id)
    const items = {id, count}
        const res = await axios.post('/remove-item-from-inventory',{items})
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
    const {username,actualName,address,city,province,postal_code,price,cartTotal} = item;
    //   dispatch({type:"CREATE_ORDER",payload:item})
    const options = {
        username,
        actualName,
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
  
  export const createOrder = async item =>{
    const res = await axios.post('/create-order', item);
        console.log("new order created")        
}
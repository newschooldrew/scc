import {createContext} from 'react'
const AuthContext = createContext({
    allMasks:null,
    toggleCart:false,
    hitCount:0,
    order:null,
    orderConfirmation:null,
    hideStickyUnit:false,
    masksCategory:null,
    duplicateMask:false,
    alert:null
})
export default AuthContext;
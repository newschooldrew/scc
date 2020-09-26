import {createContext} from 'react'
const AuthContext = createContext({
    allMasks:null,
    toggleCart:false,
    hitCount:0,
    order:null,
    confirmation:null,
    hideStickyUnit:false
})
export default AuthContext;
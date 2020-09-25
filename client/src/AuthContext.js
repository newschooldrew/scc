import {createContext} from 'react'
const AuthContext = createContext({
    allMasks:null,
    toggleCart:false,
    hitCount:0,
    order:null,
    confirmation:null
})
export default AuthContext;
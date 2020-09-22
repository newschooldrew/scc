import {createContext} from 'react'
const AuthContext = createContext({
    allMasks:null,
    toggleCart:false,
    hitCount:0
})
export default AuthContext;
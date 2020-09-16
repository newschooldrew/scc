import React, {useReducer, useEffect,useContext} from 'react'
import Reducer from './Reducer'
import AuthContext from './AuthContext'

const AuthProvider = (props) => {
    const INITIAL_STATE = useContext(AuthContext)
    const [state,dispatch] = useReducer(Reducer, INITIAL_STATE)

    return (
        <AuthContext.Provider
            value={{state,dispatch}}
            {...props}
        />
    )
}

export default AuthProvider

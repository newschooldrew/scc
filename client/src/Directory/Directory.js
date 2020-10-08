import React,{useEffect,useContext} from 'react'
import MenuItem from '../MenuItem/MenuItem'
import {withRouter} from 'react-router-dom'
import AuthContext from '../AuthContext'
import './Directory.scss'

const Directory = ({history}) => {
    const {state,dispatch} = useContext(AuthContext)

    useEffect(()=>{
        if(history.location.pathname == '/'){
          dispatch({type:"HIDE_STICKY_UNIT",payload:true})
        }
    },[])
    const categories = [
        {
            title:"Flowers",
            imageUrl:"https://res.cloudinary.com/dzdvrgbjd/image/upload/v1601261791/masks_flowers/IMG_4957_pb8qzx.jpg",
            linkUrl:"shopping/flowers"
        },
        {
            title:"People",
            imageUrl:"https://res.cloudinary.com/dzdvrgbjd/image/upload/a_90/v1601138712/masks_people/IMG_0729_bhjf3x.jpg",
            linkUrl:"shopping/people"
        },
        {
            title:"Animals",
            imageUrl:"https://res.cloudinary.com/dzdvrgbjd/image/upload/a_270/v1601139340/masks_birds_butterflies/IMG_4738_kxur2x.jpg",
            linkUrl:"shopping/animals"
        }
    ]

    return (
        <div className="directory-menu-container">
            <div className='other-divs'></div>
            <div className='directory-menu'>
            {
                categories.map((cat,idx) => {
                    return(
                        <MenuItem key={idx} title={cat.title} imageUrl={cat.imageUrl} linkUrl={cat.linkUrl} />
                        )})
                    }
            </div>
            <div className='other-divs'></div>
        </div>
    )
}

export default withRouter(Directory)
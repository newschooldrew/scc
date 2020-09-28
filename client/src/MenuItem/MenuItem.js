import React from 'react';
import {MenuItemContainer,BackgroundImageContainer,ContentContainer,TitleItem,SubtitleItem} from './MenuItem.jsx'
import {withRouter} from 'react-router-dom'

const MenuItem = ({title, imageUrl,size, history,linkUrl, match}) =>(
    <MenuItemContainer size={size} onClick={()=>history.push(`${match.url}${linkUrl}`)}>
        <BackgroundImageContainer className='background-image' imageUrl={imageUrl} />
            <ContentContainer className='content'>
                <TitleItem>{title.toUpperCase()}</TitleItem>
            </ContentContainer>
    </MenuItemContainer>
)

export default withRouter(MenuItem);
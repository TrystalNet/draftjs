import * as React from 'react'
import { Entity } from 'draft-js'

export interface LinkProps {
    entityKey : string,
    children  : any[]
}

const Link = (props:LinkProps) => {
    const {url} = Entity.get(props.entityKey).getData()
    return <a href={url} style={{color:'#3b5998', textDecoration: 'underline'}}>{props.children}</a>
}

export default Link
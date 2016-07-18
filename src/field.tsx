import * as React from 'react'

const style = {
    borderLeft      : 'black 1px solid',
    borderRight     : 'black 1px solid',
    padding         : '0px 3px',
    backgroundColor : 'gray',
    color           : 'white'
}

export interface FieldProps {
    children  : any[]
}

const Field = (props:FieldProps) => {
    const {children} = props
    return <span style={style}>{children}</span>
}

export default Field

import React, { Component, ReactDOM } from 'react';
import classNames from 'classnames';


class Flex extends React.Component {
    constructor(props) {
        super(props)
     }

    render() {
        return (<div style={{ display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent:'center' }}>
            <div style={{ width: '200px', height: '200px', backgroundColor: 'red' }} />
            <div style={{ width: '100px', height: '200px', backgroundColor: 'green' }} />
            <div style={{ width: '200px', height: '200px', backgroundColor: 'purple' }} />
        </div>)
    }
}

export default Flex;
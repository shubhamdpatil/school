
import React from 'react';

function MyPopper(props) {
    return (<div className="popper" id="popper1" ref={props.refId} style={{display:props.display}}>
        <p className="bold">{props.children}</p>
        <div className="popper__arrow"></div>
    </div>)
}

export default MyPopper;


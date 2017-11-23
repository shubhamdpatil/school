
import React from 'react';

function Hint(props) {
    return (<div className="popper" id="popper1" ref={props.refId} style={{display:props.display}}>
        <div className="bold">
            {props.children}
        </div>
        <div className="popper__arrow"></div>
    </div>)
}

export default Hint;


import React, { Component } from 'react';
import SVG from 'svg.js'
import classNames from 'classnames';


function rect() {
    // initialize SVG.js
    var draw = SVG('drawing')

    // draw pink square
    return draw.rect(100, 100).move(100, 50).fill('#f06')
}

const Arrow = (props) => {
    return (<svg width="600px" height="00px">
        <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="#f00" />
            </marker>
        </defs>

        <line x1="50" y1="100" x2="250" y2="50" stroke="#000" strokeWidth="5" markerEnd="url(#arrow)" />
    </svg>)
 }

class Label extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        /*   var draw = SVG('drawing')
          //draw.rect(5000, 5000).fill('#f06')
          var line = draw.line(0, 50, 500, 50).stroke({ width: 1 }) */
    }

    render() {
        let style = { display: 'flex', flexDirection: 'row', justifyContent: 'space-around' };

        return (
            <div className={classNames('blackBorder')}>
                <Arrow />
            </div>    
        )
        
        // return (<div className={classNames('container')}>
        //     <div className={classNames('sum', 'blackBorder')} style={{ width: '300px' }}>
        //         <div style={style}>
        //             <Arrow />
        //             <div> Divisor </div>
        //         </div>
        //     </div>
        // </div>
        // )
    }
}

export default Label;
/*global MathJax*/

import React from 'react';
import { getRandomIntInclusive, getRandomExcluding } from '../utils/Random';
import styles from './../styles/Globals.css'
import classNames from 'classnames';
const math = require('mathjs');

const QUESTION = 20

function Index(props) {
    return <div className="circle"> {props.index} </div>
}

function Arrow() {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', margin: '0px 20px 0px 20px' }}>
            &#8658;
        </div>
    )
}

class Indices extends React.Component {

    constructor(props) {
        super(props);
        this.k = 0;
        this.showAnswer = false;
        this.indicesMap = [];
        this.generateIndices();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.check) {
            this.showAnswer = true;
        }
        if (nextProps.new) {
            this.showAnswer = false;
            this.indicesMap = [];
            this.generateIndices();
        }
    }

    typesetMathjax() {
        MathJax.Hub.Queue(() => {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, function () {
            }])
        })
    }

    componentDidMount() {
        this.typesetMathjax();
    }

    componentDidUpdate(prevProps, prevState) {
        this.typesetMathjax();
    }

    generateIndices() {
        for (let i = 0; i < QUESTION; i++) {
            let op_index = getRandomIntInclusive(0, 1);
            let obj = {
                base: getRandomIntInclusive(1, 5),
                p1: getRandomIntInclusive(1, 10),
                p2: getRandomIntInclusive(1, 10),
                op_index: op_index,
                op_string: ['\\times', '\\over'][op_index],
                operator: ['+', '-'][op_index]
            }
            this.indicesMap.push(obj);
        }
    }

    Question(obj) {
        let result = (obj.op_index == 0) ? (obj.p1 + obj.p2) : (obj.p1 - obj.p2);

        return (
            <div style={{ display: 'flex', flexDirection: 'row', fontSize: '2em' }}>
                <div>
                    {`$${obj.base} ^ {${obj.p1}} ${obj.op_string} ${obj.base} ^ {${obj.p2}}$`}
                </div>
                {this.showAnswer && <Arrow />}

                {this.showAnswer &&
                    <div>
                        {`$${obj.base} ^ {\(${obj.p1} ${obj.operator} ${obj.p2}\)}$`}
                    </div>
                }

                {this.showAnswer && <Arrow />}

                {this.showAnswer &&
                    <div>
                        {`$${obj.base} ^ {${result}}$`}
                    </div>
                }
            </div >
        )
    }

    render() {
        let items = [];
        const width = this.showAnswer ? '500px' : '200px';
        const align = 'center';
        const flexDir = this.showAnswer ? 'column' : 'row'

        for (let i = 0; i < QUESTION; i++) {
            items.push(<div key={this.k++} style={{ width: `${width}`, margin: '20px', display: 'flex', justifyContent: `${align}` }}
                className={classNames('sum1', 'blueBorder')} >
                <Index index={i + 1} />
                <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
                    {this.Question(this.indicesMap[i])}
                </div>
            </div>);
        }
        return (
            <div style={{ display: 'flex', flexDirection: `${flexDir}`, flexWrap: 'wrap' }}>
                {items}
            </div>
        )
    }
}

export default Indices;

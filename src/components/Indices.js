/*global MathJax*/

import React from 'react';
import { getRandomIntInclusive, getRandomExcluding } from '../utils/Random';
import { Manager, Target, Popper, Arrow } from 'react-popper'
import styles from './../styles/Globals.css'
import classNames from 'classnames';

const math = require('mathjs');
var hash = require('object-hash');

const QUESTION = 20

const LAWS = {
    ADD: 0,
    SUB: 1,
    MUL: 2,
    POWZERO: 3,
    RANDOM: -1
}

/*
DONE: use map
    to show its an expression put it under jax tag
    simplyfy answers
    Topic wise problems
    change the way answer looks

TODO: 
    difficulty level
*/

function Jax(props) {
    return (
        <div style={props.style} >
            {props.children}
        </div>
    )
}

function DisplayBox(props) {
    return (
        <div style={{ fontSize: '2em', display: 'flex', flexDirection: 'row' }}>
            {props.children}
        </ div>
    )
}

function Index(props) {
    return <div className="circle"> {props.index} </div>
}

function RightArrow(props) {
    return (
        <div style={props.style} style={{ margin: 'auto' }}  >
            &#8658;
        </div>
    )
}

function Answer(props) {
    return (
        <div style={{ border: '1px solid green', margin: '10px', padding: '10px' }}>
            {props.children}
        </div>
    )
}

function Button(props) {
    return (
        <div>
            <button style={{
                width: '220px',
                height: '40px',
                margin: '10px',
                backgroundColor: props.active ? 'rgba(0, 255, 0, 0.6)' : 'white',
                // border: ' 1px solid rgba(255, 0, 0, 0.7)'
            }}
                onClick={() => { props.clickHandler(props.id) }}>
                {props.name}
            </button>
        </div>
    )
}

class Indices extends React.Component {

    constructor(props) {
        super(props);
        this.k = 0;
        this.showAnswer = false;
        this.clickHandler = this.clickHandler.bind(this);
        this.currentActive = LAWS.RANDOM;
        this.generateIndices();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.check) {
            this.showAnswer = true;
        }
        if (nextProps.new) {
            this.showAnswer = false;
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

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    generateIndices() {
        this.indiceMap = new Map();
        for (let i = 0; i < 20; i++) {
            let obj = new Object();
            obj.base1 = getRandomIntInclusive(1, 10); // we need at least one  base.
            if (this.currentActive == LAWS.RANDOM)
                obj.op_index = getRandomIntInclusive(0, 3); // the law we are using.
            else
                obj.op_index = this.currentActive

            switch (obj.op_index) {
                case LAWS.ADD:
                    obj.p1 = getRandomIntInclusive(1, 6);
                    obj.p2 = getRandomIntInclusive(1, 6);
                    obj.result = obj.p1 + obj.p2;
                    break;
                case LAWS.SUB:
                    obj.p1 = getRandomIntInclusive(1, 6);
                    obj.p2 = getRandomIntInclusive(1, 6);
                    obj.result = obj.p1 - obj.p2;
                    break;
                case LAWS.MUL:
                    obj.p1 = getRandomIntInclusive(1, 6);
                    obj.p2 = getRandomIntInclusive(1, 6);
                    obj.result = obj.p1 * obj.p2;
                    break;
                case LAWS.POWZERO:
                    obj.result = 0;
                    break;
            }

            let obj_key = hash(obj);
            this.indiceMap.set(obj_key, obj);
        }
    }

    getResult(obj, showAnswer) {
        let arr = [];
        let _style = { border: '1px solid orange', margin: '10px', padding: '10px' };

        if (showAnswer) {
            // arr.push(<Arrow />)
            arr.push(
                <Jax style={_style}>
                    {`$${obj.base1} ^ {${obj.result}}$`}
                </Jax >
            )
            if (obj.result == 0) {
                //arr.push(<Arrow />)
                arr.push(
                    <Jax style={_style}>
                        {`$${1}$`}
                    </Jax>
                )
            }
            else if (obj.result == 1) {
                // arr.push(<Arrow />)
                arr.push(
                    <Jax style={_style}>
                        {`$${obj.base1}$`}
                    </Jax>
                )
            }
            else if (obj.result < 0) {
                // arr.push(<Arrow />)
                arr.push(
                    <Jax style={_style}>
                        {`$${1} \\over {${obj.base1} ^ ${obj.result * -1}}$`}
                    </Jax>
                )
                if (obj.result == -1) {
                    // arr.push(<Arrow />)
                    arr.push(
                        <Jax style={_style}>
                            {`$${1} \\over ${obj.base1}$`}
                        </Jax>
                    )
                    if (obj.base1 == 1) {
                        arr.push(
                            <Jax style={_style}>
                                {`$${obj.base1}$`}
                            </Jax>
                        )
                    }
                }
            }
            return arr;
        }
    }

    generateProblems(obj) {

        var returnValue;
        switch (obj.op_index) {
            case LAWS.ADD:
                returnValue = <DisplayBox >
                    <Jax style={{ margin: 'auto' }}>
                        {`$${obj.base1} ^ {${obj.p1}} \\times ${obj.base1} ^ {${obj.p2}}$`}
                    </Jax>

                    {this.showAnswer &&
                        <RightArrow />
                    }

                    {this.showAnswer &&
                        <Manager>
                            <Target>
                                <Answer>
                                    <Jax style={{ border: '1px solid orange', margin: '10px', padding: '10px' }}>
                                        {`$${obj.base1} ^ {\(${obj.p1} + ${obj.p2}\)}$`}
                                    </Jax>

                                    {this.getResult(obj, this.showAnswer)}
                                </Answer>
                            </Target>
                            <Popper className="popper" placement="right">
                                <Arrow className="popper__arrow" />
                                <div style={{ fontSize: '0.5em' }}>
                                    आधार({obj.base1}) सारखा आहे म्हणून
                                    दोन्ही संख्येच्या घातांकाची({obj.p1} + {obj.p2} = {obj.result}) बेरीज होणार.
                                </div>
                            </Popper>
                        </Manager>
                    }
                </DisplayBox >
                break;

            case LAWS.SUB:
                returnValue = <DisplayBox>
                    <Jax style={{ margin: 'auto' }}>
                        {`$${obj.base1} ^ {${obj.p1}} \\over ${obj.base1} ^ {${obj.p2}}$`}
                    </Jax>

                    {this.showAnswer &&
                        <RightArrow />
                    }

                    {this.showAnswer &&
                        <Manager>
                            <Target>
                                <Answer>
                                    <Jax style={{ border: '1px solid orange', margin: '10px', padding: '10px' }}>
                                        {`$${obj.base1} ^ {\(${obj.p1} - ${obj.p2}\)}$`}
                                    </Jax>

                                    {this.getResult(obj, this.showAnswer)}
                                </Answer>
                            </Target>
                            <Popper className="popper" placement="right">
                                <Arrow className="popper__arrow" />
                                <div style={{ fontSize: '0.5em' }}>
                                    आधार({obj.base1}) सारखा आहे म्हणून
                                    दोन्ही संख्येच्या घातांकाची({obj.p1} - {obj.p2} = {obj.result}) वजाबाकी होणार.
                                </div>
                            </Popper>
                        </Manager>
                    }
                </DisplayBox >
                break;

            case LAWS.MUL:
                returnValue = <DisplayBox>
                    <Jax style={{ margin: 'auto' }}>
                        {`$\(${obj.base1} ^ {${obj.p1}}\) ^ {${obj.p2}}$`}
                    </Jax>

                    {this.showAnswer &&
                        <RightArrow />
                    }

                    {this.showAnswer &&
                        <Manager>
                            <Target>
                                <Answer>
                                    <Jax style={{ border: '1px solid orange', margin: '10px', padding: '10px' }}>
                                        {`$${obj.base1} ^ {\(${obj.p1} \\times ${obj.p2}\)}$`}
                                    </Jax>

                                    {this.getResult(obj, this.showAnswer)}
                                </Answer>
                            </Target>
                            <Popper className="popper" placement="right">
                                <Arrow className="popper__arrow" />
                                <div style={{ fontSize: '0.5em' }}>
                                    घातांकाला({obj.p1}) जर घात({obj.p2}) असेल तेव्हा त्यांचा गुणाकार({obj.p1} * {obj.p2} = {obj.result}) होतो.
                                </div>
                            </Popper>
                        </Manager>
                    }
                </DisplayBox >
                break;

            case LAWS.POWZERO:
                returnValue = <DisplayBox>
                    <Jax style={{ margin: 'auto' }}>
                        {`$${obj.base1} ^ ${obj.result}$`}
                    </Jax>

                    {this.showAnswer &&
                        <RightArrow />
                    }

                    {this.showAnswer &&
                        <Manager>
                            <Target>
                                <Answer>
                                    <Jax style={{ border: '1px solid orange', margin: '10px', padding: '10px' }}>
                                        {`$${1}$`}
                                    </Jax>
                                </Answer>
                            </Target>
                            <Popper className="popper" placement="right">
                                <Arrow className="popper__arrow" />
                                <div style={{ fontSize: '0.5em' }}>
                                    संख्येचा घात जर शून्य असेल तर त्याचे उत्तर {1} असत.
                                </div>
                            </Popper>
                        </Manager>
                    }
                </DisplayBox >
                break;
        }

        return returnValue;
    }

    clickHandler(id) {
        this.setState({});
        this.showAnswer = false;
        this.currentActive = id;
        this.generateIndices();
    }

    formula(lawId) {
        let returnValue;
        let _style = {
            display: 'inline',
            border: '1px solid red',
            margin: '20px',
            padding: '10px'
        }

        switch (lawId) {
            case LAWS.ADD:
                returnValue =
                    <div>
                        <br />
                        <Jax style={_style}>
                            {`$a ^ m \\times a ^ n = a ^ {\(m + n\)}$`}
                        </Jax>
                        <br />
                    </div>
                break;
            case LAWS.SUB:
                returnValue =
                    <div>
                        <br />
                        <Jax style={_style}>
                            {`$a ^ m \\over a ^ n$ = $a ^ {\(m - n\)}$`}
                        </Jax>
                        <br />
                    </div>
                break;
            case LAWS.MUL:
                returnValue =
                    <div>
                        <br />
                        <Jax style={_style}>
                            {`$(a ^ m)  ^ n = a ^ {m \\times n}$`}
                        </Jax>
                        <br />
                    </div>
                break;
            case LAWS.POWZERO:
                returnValue =
                    <div>
                        <br />
                        <Jax style={_style}>
                            {`$a  ^ 0 = 1$`}
                        </Jax>
                        <br />
                    </div>
                break;
            case LAWS.RANDOM:
                returnValue =
                    <Jax></Jax>
                break;
        }
        return (
            <div style={{ color: 'rgba(0, 0, 255, 0.6)', fontSize: '3em' }}>
                {returnValue}
            </div>
        )
    }

    render() {
        let items = [];
        const width = this.showAnswer ? '700px' : '200px';
        const align = this.showAnswer ? 'center' : 'center';
        const flexDir = this.showAnswer ? 'column' : 'row';
        let i = 1;

        for (let obj_key of this.indiceMap.keys()) {
            items.push(<div key={this.k++} style={{ width: `${width}`, margin: '20px', display: 'flex', justifyContent: `${align}` }}
                className={classNames('sum1', 'blueBorder')} >
                <Index index={i++} />
                <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
                    {this.generateProblems(this.indiceMap.get(obj_key))}
                </div>
            </div>);
        }
        return (
            <div>
                <div style={{ display: 'flex', flexDirection: "row", flexWrap: 'wrap' }}>
                    <Button active={this.currentActive == LAWS.ADD} id={LAWS.ADD} name='घातांकाची बेरीज' clickHandler={this.clickHandler} />
                    <Button active={this.currentActive == LAWS.SUB} id={LAWS.SUB} name='घातांकाची वजाबाकी' clickHandler={this.clickHandler} />
                    <Button active={this.currentActive == LAWS.MUL} id={LAWS.MUL} name='घातांकाचा गुणाकार' clickHandler={this.clickHandler} />
                    <Button active={this.currentActive == LAWS.POWZERO} id={LAWS.POWZERO} name='शून्य घात' clickHandler={this.clickHandler} />
                    <Button active={this.currentActive == LAWS.RANDOM} id={LAWS.RANDOM} name='Random Problems' clickHandler={this.clickHandler} />
                </div>
                {this.formula(this.currentActive)}
                < div style={{ display: 'flex', flexDirection: `${flexDir}`, flexWrap: 'wrap', margin: '10px' }}>
                    {items}
                </div >
            </div>
        )
    }
}

export default Indices;

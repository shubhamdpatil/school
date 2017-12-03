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
    DISTRIBUTE_MUL: 4,
    DISTRIBUTE_DIV: 5,
    RANDOM: -1
}

const LEVEL = {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard',
}

/*
DONE: use map
    to show its an expression put it under jax tag
    simplyfy answers
    Topic wise problems
    change the way answer looks

TODO: 
    difficulty level
    
    there should be  function which will simplify the answer.
    like if I pass 1^23 it should give me 1

    add difficulty level changes to  formula
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
                backgroundColor: props.active ? '#e7e7e7' : '#008CBA',
                border: 'none',
                color: props.active ? 'black' : 'white',
                padding: '10px',
                textAlign: 'center',
                width: '150px',
                height: '60px',
                fontSize: '14px',
                margin: '10px'
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
        this.changeHandler = this.changeHandler.bind(this);
        this.currentActive = LAWS.RANDOM;
        this.level = LEVEL.EASY
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
            let powerCount = 0;
            let baseCount = 0;
            obj.powerArray = [];
            obj.baseArray = [];

            obj.baseArray.push(getRandomIntInclusive(1, 9));

            if (this.currentActive == LAWS.RANDOM)
                obj.op_index = getRandomIntInclusive(0, 5); // the law we are using.
            else
                obj.op_index = this.currentActive

            switch (obj.op_index) {
                case LAWS.ADD:
                    powerCount = this.level == LEVEL.EASY ? 2 : getRandomIntInclusive(3, 5);
                    // obj.powerCount = powerCount;
                    obj.result = 0;
                    while (powerCount--) {
                        let p = getRandomIntInclusive(0, 5)
                        obj.powerArray.push(p);
                        obj.result += p
                    }
                    break;

                case LAWS.SUB:
                    let a, b;
                    a = getRandomIntInclusive(1, 9);

                    if (this.level == LEVEL.EASY)
                        b = getRandomIntInclusive(1, a); //easy level: we keep the second number smaller.
                    else
                        b = getRandomIntInclusive(a, 9); //medium level: we keep the second number smaller.

                    obj.result = a - b;
                    obj.powerArray.push(a);
                    obj.powerArray.push(b);
                    break;

                case LAWS.MUL:
                    powerCount = this.level == LEVEL.EASY ? 2 : getRandomIntInclusive(3, 4);
                    obj.result = 1;
                    while (powerCount--) {
                        let p = getRandomIntInclusive(0, 5)
                        if (obj.powerArray.indexOf(p) == -1) {
                            obj.powerArray.push(p);
                            obj.result *= p
                        }
                        else {
                            powerCount++;
                        }
                    }
                    break;

                case LAWS.POWZERO:
                    obj.result = 0;
                    break;

                case LAWS.DISTRIBUTE_MUL:
                case LAWS.DISTRIBUTE_DIV:
                    baseCount = this.level == LEVEL.EASY ? 1 : getRandomIntInclusive(2, 4);
                    while (baseCount--) {
                        let a = getRandomIntInclusive(2, 9);
                        if (obj.baseArray.indexOf(a) == -1) {
                            obj.baseArray.push(a);
                        }
                        else {
                            baseCount++;
                        }
                    }

                    obj.powerArray.push(getRandomIntInclusive(2, 9));
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
            arr.push(
                <Jax style={_style}>
                    {`$${obj.base1} ^ {${obj.result}}$`}
                </Jax >
            )
            if (obj.result == 0 || obj.base1 == 1) {
                arr.push(
                    <Jax style={_style}>
                        {`$${1}$`}
                    </Jax>
                )
            }
            else if (obj.result == 1) {
                arr.push(
                    <Jax style={_style}>
                        {`$${obj.base1}$`}
                    </Jax>
                )
            }
            else if (obj.result < 0) {
                arr.push(
                    <Jax style={_style}>
                        {`$${1} \\over {${obj.base1} ^ ${obj.result * -1}}$`}
                    </Jax>
                )
                if (obj.result == -1) {
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
        let que = '';
        let midSteps = '';

        obj.base1 = obj.baseArray[0];
        switch (obj.op_index) {
            case LAWS.ADD:
                que = '$';

                for (let i = 0; i < obj.powerArray.length; i++) {
                    if (i == obj.powerArray.length - 1) {
                        que += `${obj.base1} ^ {${obj.powerArray[i]}}$`;
                        midSteps += `${obj.powerArray[i]}`
                    }
                    else {
                        que += `${obj.base1} ^ {${obj.powerArray[i]}} \\times `;
                        midSteps += `${obj.powerArray[i]} + `
                    }
                }

                returnValue = <DisplayBox >
                    <Jax style={{ margin: 'auto' }}>
                        {que}
                    </Jax>

                    {this.showAnswer &&
                        <RightArrow />
                    }

                    {this.showAnswer &&
                        <Manager>
                            <Target>
                                <Answer>
                                    <Jax style={{ border: '1px solid orange', margin: '10px', padding: '10px' }}>
                                        {`$${obj.base1} ^ {\(${midSteps}\)}$`}
                                    </Jax>

                                    {this.getResult(obj, this.showAnswer)}
                                </Answer>
                            </Target>
                            <Popper className="popper" placement="right">
                                <Arrow className="popper__arrow" />
                                <div style={{ fontSize: '0.5em' }}>
                                    पाया({obj.base1}) सारखा आहे म्हणून
                                    संख्येच्या घातांकाची({midSteps} = {obj.result}) बेरीज होणार.
                                </div>
                            </Popper>
                        </Manager>
                    }
                </DisplayBox >
                break;

            case LAWS.SUB:
                obj.p1 = obj.powerArray[0];
                obj.p2 = obj.powerArray[1];

                returnValue = <DisplayBox>
                    <Jax style={{ margin: 'auto', fontSize: '1.4em' }}>
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
                                    पाया({obj.base1}) सारखा आहे म्हणून
                                    संख्येच्या घातांकाची({obj.p1} - {obj.p2} = {obj.result}) वजाबाकी होणार.
                                </div>
                            </Popper>
                        </Manager>
                    }
                </DisplayBox >
                break;

            case LAWS.MUL:
                que = '';
                midSteps = '';

                for (let i = 0; i < obj.powerArray.length; i++) {
                    if (i == 0) {
                        que += `${obj.base1} ^ {${obj.powerArray[i]}}`
                        midSteps += obj.powerArray[i]
                    }
                    else {
                        que = `\( ${que} \) ^ {${obj.powerArray[i]}}`
                        midSteps += ' \\times ' + obj.powerArray[i]
                    }
                }
                que = `$${que}$`

                returnValue = <DisplayBox>
                    <Jax style={{ margin: 'auto' }}>
                        {/*`$\(${obj.base1} ^ {${obj.p1}}\) ^ {${obj.p2}}$`*/}
                        {que}
                    </Jax>

                    {this.showAnswer &&
                        <RightArrow />
                    }

                    {this.showAnswer &&
                        <Manager>
                            <Target>
                                <Answer>
                                    <Jax style={{ border: '1px solid orange', margin: '10px', padding: '10px' }}>
                                        {`$${obj.base1} ^ {\(${midSteps}\)}$`}
                                    </Jax>

                                    {this.getResult(obj, this.showAnswer)}
                                </Answer>
                            </Target >
                            <Popper className="popper" placement="right">
                                <Arrow className="popper__arrow" />
                                <div style={{ fontSize: '0.5em' }}>
                                    घातांकाला जर घात असेल तेव्हा त्यांचा गुणाकार {`$\(${midSteps}\) = ${obj.result}$`} होतो.
                                </div>
                            </Popper>
                        </Manager >
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

            case LAWS.DISTRIBUTE_MUL:
                que = '$\(';
                let ans = '$';

                for (let i = 0; i < obj.baseArray.length; i++) {
                    if (i == obj.baseArray.length - 1) {
                        que += `${obj.baseArray[i]}`;
                        ans += `${obj.baseArray[i]} ^ ${obj.powerArray[0]}`;
                    }
                    else {
                        que += `${obj.baseArray[i]} \\times `;
                        ans += `{${obj.baseArray[i]} ^ ${obj.powerArray[0]}} \\times`;
                    }
                }

                que += `\)^ ${obj.powerArray[0]}$`;
                ans += `$`;

                returnValue = <DisplayBox>
                    <Jax style={{ margin: 'auto' }}>
                        {/*`$\(${obj.base1} \\times ${obj.base2}\) ^ ${obj.powerArray[0]}$`*/}
                        {que}
                    </Jax>

                    {this.showAnswer &&
                        <RightArrow />
                    }

                    {this.showAnswer &&
                        <Manager>
                            <Target>
                                <Answer>
                                    <Jax style={{ border: '1px solid orange', margin: '10px', padding: '10px' }}>
                                        {/*`$${obj.base1} ^ ${obj.powerArray[0]} \\times ${obj.base2} ^ ${obj.powerArray[0]}$`*/}
                                        {ans}
                                    </Jax>
                                </Answer>
                            </Target>
                            <Popper className="popper" placement="right">
                                <Arrow className="popper__arrow" />
                                <div style={{ fontSize: '0.5em' }}>
                                    संख्येचा घात जर शsaman असेल तर to distribute hoto.
                                </div>
                            </Popper>
                        </Manager>
                    }
                </DisplayBox>
                break;

            case LAWS.DISTRIBUTE_DIV:
                obj.base2 = obj.baseArray[1];

                returnValue = <DisplayBox>
                    <Jax style={{ margin: 'auto' }}>
                        {`$\({${obj.base1} \\over ${obj.base2}}\) ^ ${obj.powerArray[0]}$`}
                    </Jax>

                    {this.showAnswer &&
                        <RightArrow />
                    }

                    {this.showAnswer &&
                        <Manager>
                            <Target>
                                <Answer>
                                    <Jax style={{ border: '1px solid orange', margin: '10px', padding: '10px' }}>
                                        {`$${obj.base1} ^ ${obj.powerArray[0]} \\over ${obj.base2} ^ ${obj.powerArray[0]}$`}
                                    </Jax>
                                </Answer>
                            </Target>
                            <Popper className="popper" placement="right">
                                <Arrow className="popper__arrow" />
                                <div style={{ fontSize: '0.5em' }}>
                                    संख्येचा घात जर शsaman असेल तर to distribute hoto.
                                </div>
                            </Popper>
                        </Manager>
                    }
                </DisplayBox>
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
            // border: '1px solid red',
            margin: '20px',
            padding: '10px'
        }

        switch (lawId) {
            case LAWS.ADD:
                returnValue =
                    <div>
                        <Jax style={_style}>
                            {`$a ^ m \\times a ^ n = a ^ {\(m + n\)}$`}
                        </Jax>
                        <br />
                    </div>
                break;

            case LAWS.SUB:
                returnValue =
                    <div>
                        <Jax style={_style}>
                            {`$a ^ m \\over a ^ n$ = $a ^ {\(m - n\)}$`}
                        </Jax>
                        <br />
                    </div>
                break;

            case LAWS.MUL:
                returnValue =
                    <div>
                        <Jax style={_style}>
                            {`$(a ^ m)  ^ n = a ^ {m \\times n}$`}
                        </Jax>
                        <br />
                    </div>
                break;

            case LAWS.POWZERO:
                returnValue =
                    <div>
                        <Jax style={_style}>
                            {`$a  ^ 0 = 1$`}
                        </Jax>
                        <Jax style={_style}>
                            {`$1  ^ m = 1$`}
                        </Jax>
                        <br />
                    </div>
                break;

            case LAWS.DISTRIBUTE_MUL:
                returnValue =
                    <div>
                        <Jax style={_style}>
                            {`$\(a \\times b\) ^ m = {a ^ m \\times b ^ m}$`}
                        </Jax>
                        <br />
                    </div>
                break;

            case LAWS.DISTRIBUTE_DIV:
                returnValue =
                    <div>
                        <Jax style={_style}>
                            {`$\({a \\over b}\) ^ m = {a ^ m \\over b ^ m}$`}
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

    changeHandler(event) {
        if (this.level == event.target.value)
            return;

        this.setState({});
        this.showAnswer = false;
        this.level = event.target.value;
        this.generateIndices();
    }

    render() {
        let items = [];
        const width = this.showAnswer ? '1000px' : '1000px';
        const align = this.showAnswer ? 'center' : 'center';
        const flexDir = this.showAnswer ? 'column' : 'column';
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
        let _select_style = {
            backgroundColor: '#555555',
            border: 'none',
            color: 'white',
            padding: '10px',
            textAlign: 'center',
            textDecoration: 'none',
            display: 'inline-block',
            fontSize: '16px',
            margin: '4px 2px'
        }
        return (
            <div>
                <div style={{ display: 'flex', flexDirection: "row", flexWrap: 'wrap' }}>
                    <Button active={this.currentActive == LAWS.ADD} id={LAWS.ADD} name='घातांकाची बेरीज' clickHandler={this.clickHandler} />
                    <Button active={this.currentActive == LAWS.SUB} id={LAWS.SUB} name='घातांकाची वजाबाकी' clickHandler={this.clickHandler} />
                    <Button active={this.currentActive == LAWS.MUL} id={LAWS.MUL} name='घातांकाचा गुणाकार' clickHandler={this.clickHandler} />
                    <Button active={this.currentActive == LAWS.POWZERO} id={LAWS.POWZERO} name='शून्य घात' clickHandler={this.clickHandler} />
                    <Button active={this.currentActive == LAWS.DISTRIBUTE_MUL} id={LAWS.DISTRIBUTE_MUL} name='घातांकाचे विभाजन(गुणाकार)' clickHandler={this.clickHandler} />
                    <Button active={this.currentActive == LAWS.DISTRIBUTE_DIV} id={LAWS.DISTRIBUTE_DIV} name='घातांकाचे विभाजन(भागाकार)' clickHandler={this.clickHandler} />
                    <Button active={this.currentActive == LAWS.RANDOM} id={LAWS.RANDOM} name='Random Problems' clickHandler={this.clickHandler} />
                </div>

                {/* this.formula(this.currentActive) */}

                {([LAWS.ADD, LAWS.SUB, LAWS.MUL, LAWS.DISTRIBUTE_MUL, LAWS.RANDOM].indexOf(this.currentActive) != -1) &&
                    <div>
                        <select value={this.level} style={_select_style} onChange={this.changeHandler}>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            {/* <option value="hard">Hard</option > */}
                        </select>
                    </div>
                }
                < div style={{ display: 'flex', flexDirection: `${flexDir}`, flexWrap: 'wrap', margin: '10px' }}>
                    {items}
                </div >
            </div >
        )
    }
}

export default Indices;

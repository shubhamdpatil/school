/*global MathJax*/

import React from 'react';
import { getRandomIntInclusive, getRandomExcluding } from '../utils/Random';
import { Manager, Target, Popper, Arrow } from 'react-popper'
import styles from './../styles/Globals.css'
import classNames from 'classnames';

var hash = require('object-hash');

/*
    Notes:
        lcm = (a * b)/gcd(a, b)
        gcd = euclidean algo

*/

const OPERATION = {
    FACTOR: 'factor',
    GCD: 'gcd',
    LCM: 'lcm',
    FORMULA: 'formula'
}

function Index(props) {
    return <div className="circle"> {props.index} </div>
}

function Button(props) {
    return (
        <div>
            <button style={{
                backgroundColor: props.active ? 'white' : '#008CBA',
                border: props.active ? '1px solid #008CBA' : 'none',
                color: props.active ? '#008CBA' : 'white',
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

class LCM_GCD extends React.Component {

    constructor(props) {
        super(props);
        this.k = 0;
        this.clickHandler = this.clickHandler.bind(this);
        this.operation = OPERATION.LCM;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.check) {
            ;
        }
        if (nextProps.new) {
            ;
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

    clickHandler(id) {
        this.setState({});
        this.operation = id;
    }

    getFactors(num) {
        let factors = [];
        for (let i = 1; i <= num; i++) {
            if (num % i == 0)
                factors.push(i);
        }
        return factors;
    }

    getFactorMap() {
        let factorMap = new Map();
        for (let i = 1; i <= 20; i++) {
            let key = getRandomIntInclusive(1, 100);
            factorMap.set(key, this.getFactors(key));
        }
        return factorMap;
    }

    getFactorItems() {
        let items = [];
        let i = 1;
        let factorMap = this.getFactorMap();

        for (let mapKey of factorMap.keys()) {
            items.push(<div key={this.k++} style={{ width: '330px', margin: '20px', display: 'flex', justifyContent: 'row' }}
                className={classNames('sum1', 'blueBorder')} >
                <Index index={i++} />
                <div style={{ textAlign: 'center' }}>
                    {mapKey} = {this.getFactors(mapKey).toString()}
                </div>
            </div>);
        }
        return items;
    }

    getLcmGcdObject(p, q) {
        let obj = new Object();
        obj.p = p;
        obj.q = q;
        obj.qArray = [[p, q]];
        obj.lArray = [];
        obj.gcd = 1;
        obj.lcm = 1;

        let primeArray = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
        let i = 0; // for reference of primeArray

        while (true) {
            if (primeArray[i] <= p && primeArray[i] <= q) {
                if (p % primeArray[i] == 0 && q % primeArray[i] == 0) {
                    p = p / primeArray[i];
                    q = q / primeArray[i];
                    obj.qArray.push([p, q]);
                    obj.lArray.push(primeArray[i]);
                    i = 0;
                }
                else {
                    i++;
                }
            }
            else {
                obj.lArray.push(1);
                break;
            }
        }


        let lastIndex = obj.qArray.length - 1;
        for (let j of obj.lArray) {
            obj.gcd *= j;
        }

        obj.lcm = obj.gcd
        for (let j of obj.qArray[lastIndex]) {
            obj.lcm *= j;
        }

        return obj;
    }

    getLcmObject(p, q) {
        let obj = new Object();
        obj.p = p;
        obj.q = q;
        obj.qArray = [[p, q]];
        obj.lArray = [];
        obj.lcm = 1;

        let primeArray = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
        let i = 0; // for reference of primeArray

        while (true) {
            if (primeArray[i] <= p && primeArray[i] <= q) {
                let flag = false;
                if (p % primeArray[i] == 0) {
                    p = p / primeArray[i];
                    flag = true;
                }
                if (q % primeArray[i] == 0) {
                    q = q / primeArray[i];
                    flag = true;
                }
                if (flag) {
                    obj.qArray.push([p, q]);
                    obj.lArray.push(primeArray[i]);
                    i = 0;
                }
                else {
                    i++;
                }
            }
            else {
                obj.lArray.push(1);
                break;
            }
        }


        let lastIndex = obj.qArray.length - 1;
        for (let j of obj.lArray) {
            obj.lcm *= j;
        }

        for (let j of obj.qArray[lastIndex]) {
            obj.lcm *= j;
        }

        return obj;
    }

    getLcmGcdMap() {
        let obj = new Map();
        for (let i = 0; i < 20; i++) {
            let lcmgcdObj = this.getLcmGcdObject(getRandomIntInclusive(1, 50), getRandomIntInclusive(1, 50));
            let key = hash(lcmgcdObj);
            obj.set(key, lcmgcdObj);
        }
        return obj;
    }

    getLcmMap() {
        let obj = new Map();
        for (let i = 0; i < 20; i++) {
            let lcmObj = this.getLcmObject(getRandomIntInclusive(1, 50), getRandomIntInclusive(1, 50));
            let key = hash(lcmObj);
            obj.set(key, lcmObj);
        }
        return obj;
    }

    getLcmGcdItems(operation) {
        let items = [];
        let i = 1;
        let lcmGcdMap;
        if (operation == OPERATION.GCD)
            lcmGcdMap = this.getLcmGcdMap();
        else if (operation == OPERATION.LCM)
            lcmGcdMap = this.getLcmMap();

        for (let mapKey of lcmGcdMap.keys()) {
            let item = [];
            let obj = lcmGcdMap.get(mapKey);
            let j = 0;

            for (j = 0; j < obj.qArray.length; j++) {

                item.push(
                    <div style={{ textDecoration: 'underline' }}>
                        {obj.lArray[j]} | {obj.qArray[j][0]}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{obj.qArray[j][1]}
                    </div>
                )
            }
            item.push(
                <div>&nbsp;&nbsp;&nbsp;| {obj.qArray[j - 1][0]}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{obj.qArray[j - 1][1]}</div >
            )

            items.push(<div key={this.k++} style={{
                width: '500px',
                margin: '20px',
                display: 'flex',
                flexDirection: 'column',
                fontSize: '2em',
            }}
                className={classNames('sum1', 'blueBorder')} >
                <Index index={i++} />
                <div style={{
                    margin: '10px',
                    padding: '10px',
                    textAlign: 'left',
                    borderLeft: '2px solid green',
                    borderBottom: '2px solid red'
                }}>
                    {item}
                </div>
                <div style={{ fontSize: '0.7em' }}>
                    <div style={{ textAlign: 'left' }}>
                        LCM = {obj.lArray.join(' * ')} * {obj.qArray[j - 1][0]} * {obj.qArray[j - 1][1]} = {obj.lcm}
                    </div>

                    {OPERATION.GCD == operation &&
                        <div style={{ textAlign: 'left' }}>
                            GCD = {obj.lArray.join(' * ')} = {obj.gcd}
                        </div>
                    }

                </div>
            </div>);
        }
        return items;
    }

    /* cross check results with mathjs.lcm/gcd */
    getLCMGCD(operation) {
        return (
            <div style={{ alignText: 'left', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', margin: '10px' }}>
                {this.getLcmGcdItems(operation)}
            </div>);
    }

    getFormulaItems() {
        return (
            <div style={{ fontSize: '2em', display: 'flex', flexDirection: 'column', flexWrap: 'wrap', margin: '10px' }}>
                <div>
                    {`$LCM(a, b) = {\(a \\times b\)\\over GCD(a, b)}$`}
                </div>

                <div> <br /> </div>

                <div>
                    {`$GCD(a, b) = {\(a \\times b\)\\over LCM(a, b)}$`}
                </div>
            </div >
        )
    }

    render() {
        let items = [];
        const width = this.showAnswer ? '1000px' : '300px';
        const align = this.showAnswer ? 'center' : 'center';
        // const flexDir = this.showAnswer ? 'column' : 'row';
        let i = 1;

        if (this.operation == OPERATION.FACTOR)
            items = this.getFactorItems();
        else if (this.operation == OPERATION.LCM) {
            items.push(this.getLCMGCD(OPERATION.LCM));
        }
        else if (this.operation == OPERATION.GCD) {
            items.push(this.getLCMGCD(OPERATION.GCD));
        }
        else if (this.operation == OPERATION.FORMULA) {
            items.push(this.getFormulaItems())
        }

        return (
            <div>
                <div style={{ display: 'flex', flexDirection: "row", flexWrap: 'wrap' }}>
                    <Button active={this.currentActive == OPERATION.FACTOR} id={OPERATION.FACTOR} name='factors' clickHandler={this.clickHandler} />
                    <Button active={this.currentActive == OPERATION.GCD} id={OPERATION.GCD} name='gcd' clickHandler={this.clickHandler} />
                    <Button active={this.currentActive == OPERATION.LCM} id={OPERATION.LCM} name='lcm' clickHandler={this.clickHandler} />
                    <Button active={this.currentActive == OPERATION.FORMULA} id={OPERATION.FORMULA} name='Formula' clickHandler={this.clickHandler} />
                </div>

                < div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', margin: '10px' }}>
                    {items}
                </div >
            </div >
        )
    }
}

export default LCM_GCD;
/*global MathJax*/

import React, { Component, ReactDOM } from 'react';
import styles from './../styles/Globals.css'
import classNames from 'classnames';
const math = require('mathjs');

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

function Jax(props) {
    if (props.inline) {
        return (
            <span ref={props.ref} style={{ fontSize: '40px' }}>
                <script type="math/tex">
                    {props.children}`
                </script >
            </span>)
    } else {
        return (
            <span ref={props.ref} style={{ fontSize: '40px' }}>
                <script type="math/tex" mode="display">
                    {props.children}
                </script >
            </span>)
    }
}

function Index(props) {
    return <div className="circle"> {props.index} </div>
}


class Lcm extends React.Component {
    constructor(props) {
        super(props);
        this.showAnswer = false;
        this.k = 0;
        this.generateSums();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.check) {
            this.showAnswer = true;
        }
        if (nextProps.new) {
            this.showAnswer = false;
            this.generateSums();
        }
    }

    componentDidMount() {

    }
    componentDidUpdate(prevProps, prevState) {
        MathJax.Hub.Queue(() => {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, function () {
            }])
        })
    }

    getRandomExcluding(min, max, exclude) {
        let random = exclude;
        do {
            random = getRandomIntInclusive(min, max);
        } while (random === exclude)
        return random;
    }

    key(first, second) {
        let k;
        if (first < second) {
            k = `${first.toString(10)}${second.toString(10)}`
        } else if (first > second) {
            k = `${second.toString(10)}${first.toString(10)}`
        } else {
            k = `${first.toString(10)}${first.toString(10)}`
        }
        return k;
    }

    doesSumExist(sum) {
        const k = this.sumsMap.get(this.key)
    }

    generateSums() {
        const sums = this.sums = [];
        this.sumsMap = new Map();
        for (let i = 0; i < 25; i++) {
            const s = this.sum();
            if (!this.sumsMap.get(s.key)) {
                sums.push(s);
                this.sumsMap.set(s.key, s);
            }
        }
    }

    table(number, lcm) {
        let result = [];
        for (let i = 1; i <= lcm / number; i++) {
            const style = i === lcm / number ? `\\style{ color: green; font - size: 40px }` : ``
            result.push(
                <div key={this.k++} style={{ borderColor: 'coral', borderStyle: 'solid', borderWidth: '2px' }}>
                    <Jax>
                        {`${style}  {${number} \\times ${i} = ${number * i} `}}
                    </Jax>
                </div>)
        }
        return result;
    }


    renderSums() {
        const renderedSums = [];
        const align = this.showAnswer ? 'left' : 'center'
        const width = !this.showAnswer ? '200px' : '900px'
        this.sums.map((sum, i) => {
            if (i === 0) {
                console.log('sum: ' + JSON.stringify(sum))
            }
            const first = sum.first > sum.second ? sum.first : sum.second;
            const second = sum.second < sum.first ? sum.second : sum.first;
            renderedSums.push(<div key={this.k++} style={{ width: `${width}`, margin: '20px', display: 'flex', justifyContent: `${align}` }}
                className={classNames('sum1', 'blueBorder')} >
                <Index index={i + 1} />
                <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
                    <div>
                        <Jax>
                            {sum.first},\ {sum.second}
                        </Jax>
                    </div>
                    {this.showAnswer && <Jax> \ \Rightarrow {`\\style{ color: green; font - size: 40px } { ${sum.lcm} } `} </Jax>}
                    {this.showAnswer && <div style={{ marginLeft: '20px', padding: '20px', display: 'flex', borderColor: 'coral', borderStyle: 'solid', flexDirection: 'column', borderWidth: '2px' }}>
                        {this.showAnswer && <div style={{ display: 'flex' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'top', alignItems: 'top' }} >
                                {this.table(sum.first, sum.lcm)}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '20px' }} >
                                {this.table(sum.second, sum.lcm)}
                            </div>
                        </div>}
                    </div>}
                </div>
            </div>)
        });
        return renderedSums;
    }

    sum() {
        const first = getRandomIntInclusive(5, 12);
        const second = this.getRandomExcluding(5, 12, first);
        const lcm = math.lcm(first, second);
        const key = this.key(first, second)
        return {
            first,
            second,
            lcm,
            key
        }
    }

    render() {
        return <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {this.renderSums()}
        </div>
    }
}

export default Lcm;

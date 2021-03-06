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


class WholeFraction extends React.Component {
    constructor(props) {
        super(props);
        this.showAnswer = false;
        this.k = 0;
        this.sumsMap = new Map();
        console.log('WholeFraction constructor')
        this.generateSums();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.check) {
            this.showAnswer = true;
        }
        if (nextProps.new) {
            this.showAnswer = false;
            console.log('WholeFraction componentWillReceiveProps')
            this.generateSums();
        }
    }

    typesetMathJax() {
        MathJax.Hub.Queue(() => {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, function () {
            }])
        })
    }
    componentDidMount() {
        this.typesetMathJax();
    }

    componentDidUpdate(prevProps, prevState) {
        this.typesetMathJax();
    }

    getRandomExcluding(min, max, exclude) {
        let random = exclude;
        do {
            random = getRandomIntInclusive(min, max);
        } while (random === exclude)
        return random;
    }

    key(first, second) {
        return `${first.toString(10)}${second.toString(10)}`
    }

    generateSums() {
        const sums = this.sums = [];
        for (let i = 0; i < 25; i++) {
            const s = this.sum();
            if (!this.sumsMap.get(s.key)) {
                sums.push(s);
                this.sumsMap.set(s.key, s);
            }
        }
    }

    renderSums() {
        const renderedSums = [];
        const align = this.showAnswer ? 'center' : 'center'
        const width = !this.showAnswer ? '300px' : '300px'
        //this.showAnswer = true;

        this.sums.map((sum, i) => {
            const first = sum.first > sum.second ? sum.first : sum.second;
            const second = sum.second < sum.first ? sum.second : sum.first;
            const showNumerator = sum.numerator > 0 ? true : false;
            renderedSums.push(<div key={this.k++} style={{ width: `${width}`, margin: '20px', display: 'flex', justifyContent: `${align}` }}
                className={classNames('sum1', 'blueBorder')} >
                <Index index={i + 1} />
                <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
                    <div>
                        <Jax>
                            \frac{`{ ${sum.first}`}}{`{${sum.second}`}}
                        </Jax>
                    </div>
                    {this.showAnswer &&
                        <div >
                            <Jax> = </Jax>
                            <span style={{ color: 'green' }}> <Jax>
                                {`${sum.wholeNumber}`}
                            </Jax> </span>
                            {showNumerator && <span style={{ color: 'green' }}>
                                <Jax>
                                    \frac{`{ ${sum.numerator}`}}{`{${sum.second}`}}
                        </Jax>
                            </span>}
                        </div>
                    }
                </div>
            </div>)
        });
        return renderedSums;
    }

    renderImproperSums() {
        const renderedSums = [];
        const align = this.showAnswer ? 'center' : 'center'
        const width = !this.showAnswer ? '300px' : '300px'
        //this.showAnswer = true;

        this.sums.map((sum, i) => {
            const first = sum.first > sum.second ? sum.first : sum.second;
            const second = sum.second < sum.first ? sum.second : sum.first;
            const showNumerator = sum.numerator > 0 ? true : false;
            renderedSums.push(<div key={this.k++} style={{ width: `${width}`, margin: '20px', display: 'flex', justifyContent: `${align}` }}
                className={classNames('sum1', 'blueBorder')} >
                <Index index={i + 1} />
                <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
                    <div >
                        <span> <Jax>
                            {`${sum.wholeNumber}`}
                        </Jax> </span>
                        {showNumerator &&
                            <Jax>
                                \frac{`{ ${sum.numerator}`}}{`{${sum.second}`}}
                        </Jax>
                        }
                    </div>
                    {this.showAnswer &&
                        <div>
                            <Jax> = </Jax>
                            <span style={{ color: 'green' }}>
                                {showNumerator &&
                                    <Jax>
                                        \frac{`{ ${sum.first}`}}{`{${sum.second}`}}
                        </Jax>
                                }
                                {!showNumerator &&
                                    <Jax>
                                        \frac{`{ ${sum.wholeNumber}`}}{`{1`}}
                        </Jax>
                                }
                            </span>
                        </div>
                    }
                </div>
            </div>)
        });
        return renderedSums;
    }

    sum() {
        const first = getRandomIntInclusive(50, 100);
        const second = this.getRandomExcluding(5, 12, first);
        const lcm = math.lcm(first, second);
        const key = this.key(first, second)
        const wholeNumber = Math.floor(first / second);
        const numerator = first - second * wholeNumber;
        return {
            first,
            second,
            lcm,
            key,
            wholeNumber,
            numerator
        }
    }

    render() {
        return <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {this.props.improper ? this.renderImproperSums() : this.renderSums()}
        </div>
    }
}

export default WholeFraction;

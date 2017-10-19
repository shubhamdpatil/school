/*global MathJax*/
import React, { Component, ReactDOM } from 'react';
import classNames from 'classnames';
import { getRandomIntInclusive, NUMBER_RANGE } from './../utils/Random'
const math = require('mathjs');
const MathJax = require('react-mathjax');

function Index(props) {
    return <div className="circle"> {props.index} </div>
}

class Fraction extends React.Component {

    constructor(props) {
        super(props);
        math.config({
            number: 'Fraction'   // Default type of number:
        });
        this.showAnswer = true;
        this.fraction1 = [];
        this.fraction2 = [];;
        this.ne = '\\ne';
        this.eq = '=';
        this.answer = this.ne;
        this.generateFraction();
        this.g = 0;
    }

    getRandomExcluding(exclude) {
        let number;
        do {
            number = getRandomIntInclusive(NUMBER_RANGE[1].min, NUMBER_RANGE[1].max);
        } while (exclude === number)
        return number;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.check) {
            this.showAnswer = true;
        }
        if (nextProps.new) {
            this.generateFraction();
            this.showAnswer = true;
        }
    }

    generateFraction() {
        this.fraction1 = [];
        this.fraction2 = [];
        this.fraction1.push(getRandomIntInclusive(NUMBER_RANGE[1].min, NUMBER_RANGE[1].max));
        this.fraction1.push(getRandomIntInclusive(NUMBER_RANGE[1].min, NUMBER_RANGE[1].max));
        const equal = getRandomIntInclusive(0, 1);
        const multiple = getRandomIntInclusive(NUMBER_RANGE[1].min, NUMBER_RANGE[1].max);
        if (equal) {
            this.fraction2.push(this.fraction1[0] * multiple);
            this.fraction2.push(this.fraction1[1] * multiple);
            this.answer = this.eq;
        } else {
            this.fraction2.push(this.fraction1[0] * multiple);
            this.fraction2.push(this.fraction1[1] * this.getRandomExcluding(multiple));
            this.answer = this.ne;
        }
    }

    renderSum(i, border, anchor, answer) {
        const lhs = `\\frac{${this.fraction1[0]}}{${this.fraction1[1]}}`;
        const rhs = `\\frac{${this.fraction2[0]}}{${this.fraction2[1]}}`;
        const question = '{\\style{color:red;margin:10px}{?}}';
        return (
            <div key={this.g++} className={classNames('sum1', border)} >
                <Index index={anchor} />
                <MathJax.Context>
                    <div>
                        <MathJax.Node inline>
                            {lhs}
                        </MathJax.Node>
                        {!answer && <MathJax.Node inline>{question}</MathJax.Node>}
                        {answer &&
                            <MathJax.Node inline>
                            {this.answer}
                        </MathJax.Node>
                        }
                        <MathJax.Node inline>
                            {rhs}
                        </MathJax.Node>
                    </div>
                </MathJax.Context>
            </div >)
    }

    render() {
        return (
            <div className="sumContainer" style={{ display: 'flex', margin: '20px', flexWrap: 'wrap' }}>
                {this.renderSum(0, 'blueBorder', 0, false)}
                {this.showAnswer && this.renderSum(1, 'greenBorder', 0, true)}
            </div>
        )
    }
}

/* Fraction1.childContextTypes = {
    MathJax: React.PropTypes.object
}; */

export default Fraction;
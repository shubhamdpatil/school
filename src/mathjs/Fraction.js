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
        this.showAnswer = false;
        this.fraction1 = [];
        this.fraction2 = [];;
        this.ne = '\\style{color:red;margin:5px}{\\ne}';
        this.eq = '\\style{color:green;margin:5px}{=}';
        this.g = 0;
        this.generateFraction();
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
            this.showAnswer = false;
        }
    }

    generateFraction() {
        this.fraction1 = [];
        this.fraction2 = [];
        this.fraction1.push(getRandomIntInclusive(NUMBER_RANGE[1].min, NUMBER_RANGE[1].max));
        this.fraction1.push(getRandomIntInclusive(NUMBER_RANGE[1].min, NUMBER_RANGE[1].max));
        const equal = getRandomIntInclusive(0, 1);
        this.multiple = getRandomIntInclusive(NUMBER_RANGE[1].min, NUMBER_RANGE[1].max);
        if (equal) {
            this.fraction2.push(this.fraction1[0] * this.multiple);
            this.fraction2.push(this.fraction1[1] * this.multiple);
            this.answer = this.eq;
        } else {
            this.fraction2.push(this.fraction1[0] * this.multiple);
            this.fraction2.push(this.fraction1[1] * this.getRandomExcluding(this.multiple));
            this.answer = this.ne;
        }
    }

    renderProblem(border, anchor) {
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
                        <MathJax.Node inline>{question}</MathJax.Node>
                        <MathJax.Node inline>
                            {rhs}
                        </MathJax.Node>
                    </div>
                </MathJax.Context>
            </div >)
    }

    renderAnswer(border, anchor) {
        const lhs = `\\frac{${this.fraction1[0]}}{${this.fraction1[1]}}`;
        const rhs = `\\frac{${this.fraction2[0]}}{${this.fraction2[1]}}`;
        const numeratorEquality = this.fraction1[0] * this.multiple === this.fraction2[0] ? this.eq : this.ne;
        const denominatorEquality = this.fraction1[1] * this.multiple === this.fraction2[1] ? this.eq : this.ne;
        const step = `{${this.fraction1[0]} \\times ${this.multiple} ${numeratorEquality} ${this.fraction2[0]} \\over${this.fraction1[1]} \\times ${this.multiple} ${denominatorEquality} ${this.fraction2[1]}}\\Longrightarrow`

        return (
            <div key={this.g++} className={classNames('sum1', border)} >
                <Index index={anchor} />
                <MathJax.Context>
                    <div>
                        <MathJax.Node inline>
                            {step}
                        </MathJax.Node>
                        <MathJax.Node inline>
                            {lhs}
                        </MathJax.Node>
                        <MathJax.Node inline>
                            {this.answer}
                        </MathJax.Node>
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
                {this.renderProblem('blueBorder', 'Q')}
                {this.showAnswer && this.renderAnswer('greenBorder', 'A')}
            </div>
        )
    }
}

export default Fraction;
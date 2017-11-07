/*global MathJax, d3pie*/
/*global */
import React, { Component, ReactDOM } from 'react';
import classNames from 'classnames';
import { getRandomIntInclusive, NUMBER_RANGE } from './../utils/Random'
import { findDOMNode } from 'react-dom';
import MyPopper from './../components/Popper'
import Popper from 'popper.js'
import Pie from './../components/Pie'



function Index(props) {
    return <div className="circle"> {props.index} </div>
}


function Jax(props) {
    if (props.inline) {
        return (
            <span ref={props.ref}>
                <script type="math/tex">
                    {props.children}
                </script >
            </span>)
    } else {
        return (
            <span ref={props.ref}>
                <script type="math/tex" mode="display">
                    {props.children}
                </script >
            </span>)
    }
}

class Fraction extends React.Component {
    constructor(props) {
        super(props);
        this.showAnswer = false;
        this.fraction1 = [];
        this.fraction2 = [];;
        this.ne = '\\style{color:red}{\\ne}';
        this.eq = '\\style{color:green}{=}';
        this.g = 0;
        this.question = '{\\style{color:red;margin:10px}{?}}';
        this.generateFraction();
        this.showPopper = 'block'
        this.popperRefs = [];
        this.sumRefs = [];
        this.poppers = [];
        this.addPopperRef = this.addPopperRef.bind(this);
        this.addSumRef = this.addSumRef.bind(this);
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
            this.sumRefs = [];
            this.generateFraction();
            this.showAnswer = true;
        }
    }

    answerStep() {
        const lhs = `\\frac{${this.fraction1[0]}}{${this.fraction1[1]}}`;
        const rhs = `\\frac{${this.fraction2[0]}}{${this.fraction2[1]}}`;
        this.lhs = `{\\style{color:Violet}{${lhs}}}`;
        this.rhs = `{\\style{color:Tomato}{${rhs}}}`;
        this.step2 = `{${this.lhs}} ${this.answer} {${this.rhs}}`
    }

    exchangeFractions() {
        const temp = [...this.fraction2];
        this.fraction2 = [...this.fraction1];
        this.fraction1 = [...temp];
    }

    generateFraction() {
        this.fraction1 = [];
        this.fraction2 = [];
        this.fraction1.push(getRandomIntInclusive(NUMBER_RANGE[1].min, NUMBER_RANGE[1].max));
        this.fraction1.push(getRandomIntInclusive(NUMBER_RANGE[1].min, NUMBER_RANGE[1].max));
        const equal = getRandomIntInclusive(0, 1);
        this.multiple = getRandomIntInclusive(NUMBER_RANGE[1].min, NUMBER_RANGE[1].max);
        const numeratorEqual = getRandomIntInclusive(0, 1);
        let numeratorEquality = null;
        let denominatorEquality = null;
        const multiplySum = getRandomIntInclusive(0, 1);
        let sign = null;

        if (equal) {
            this.fraction2.push(this.fraction1[0] * this.multiple);
            this.fraction2.push(this.fraction1[1] * this.multiple);
            this.answer = this.eq;
            this.step2Hint = `Fractions are equal`;
            numeratorEquality = this.eq;
            denominatorEquality = this.eq;
            if (multiplySum) {
                sign = '\\times';
                this.step1Hint = `In numerator ${this.fraction2[0]} is ${this.fraction1[0]} times ${this.multiple} and in denominator ${this.fraction2[1]} is ${this.fraction1[1]}  times ${this.multiple}`
            }
            else {
                sign = '\\div';
                this.exchangeFractions();
                this.step1Hint = `In numerator ${this.fraction1[0]} divided by ${this.multiple} is ${this.fraction2[0]} and in denominator ${this.fraction1[1]} divided by ${this.multiple} is ${this.fraction2[1]} `
            }

        } else {
            this.step2Hint = `Fractions are not equal`;
            if (numeratorEqual) {
                this.fraction2.push(this.fraction1[0] * this.multiple);
                this.fraction2.push(this.fraction1[1] * this.getRandomExcluding(this.multiple));
            } else {
                this.fraction2.push(this.fraction1[1] * this.getRandomExcluding(this.multiple));
                this.fraction2.push(this.fraction1[1] * this.multiple);
            }

            if (multiplySum) {
                sign = '\\times';
                if (numeratorEqual) {
                    this.step1Hint = `In numerator ${this.fraction2[0]} is ${this.fraction1[0]} times ${this.multiple}, but in denominator ${this.fraction2[1]} is not ${this.fraction1[1]}  times ${this.multiple}`

                } else {
                    this.step1Hint = `In numerator ${this.fraction2[0]} is not ${this.fraction1[0]} times ${this.multiple}, but in denominator ${this.fraction2[1]} is ${this.fraction1[1]}  times ${this.multiple}`
                }
            } else {
                sign = '\\div';
                this.exchangeFractions();
                if (numeratorEqual) {
                    this.step1Hint = `In numerator ${this.fraction1[0]} divided by ${this.multiple} is ${this.fraction2[0]}, but in denominator ${this.fraction1[1]} divided by ${this.multiple} is not ${this.fraction2[1]}`
                } else {
                    this.step1Hint = `In numerator ${this.fraction1[0]} divided by ${this.multiple} is not ${this.fraction2[0]}, but in denominator ${this.fraction1[1]} divided by ${this.multiple} is ${this.fraction2[1]}`
                }
            }
            numeratorEquality = numeratorEqual ? this.eq : this.ne;
            denominatorEquality = !numeratorEqual ? this.eq : this.ne;
            this.answer = this.ne;

        }
        this.step1 = `{${this.fraction1[0]} ${sign} ${this.multiple} \\over ${this.fraction1[1]} ${sign} ${this.multiple}} {${numeratorEquality} \\over ${denominatorEquality}}{${this.fraction2[0]}  \\over ${this.fraction2[1]}}`
        this.answerStep();
    }

    createAndUpdatePoppers() {

    }

    createPoppers() {
        this.poppers = this.popperRefs.map((p, i) => {
            return new Popper(this.sumRefs[i], p, { placement: 'right' })
        })
    }

    updatePoppers() {
        this.poppers.forEach((p) => {
            p.update();
        })
    }

    componentDidUpdate(prevProps, prevState) {
        this.createPoppers();
        MathJax.Hub.Queue(() => {
            return MathJax.Hub.Process(null, () => {
                this.updatePoppers();
            });
        })
    }

    componentDidMount() {
        this.createPoppers();
        MathJax.Hub.Register.StartupHook("End", () => {
            this.updatePoppers();
            //  d3pie.redraw();
            Pie()
        })
    }

    addPopperRef(ref) {
        if (ref) {
            this.popperRefs.push(ref)
        }
    }

    addSumRef(ref) {
        if (ref) {
            this.sumRefs.push(ref)
        }
    }

    renderProblem(border, anchor) {
        let el1 = null;
        return (
            <div key={this.g++} className={classNames('sum1', border)} ref={this.addSumRef} >
                <Index index={anchor} />
                <MyPopper display={this.showPopper} refId={this.addPopperRef} >
                    {'Are these fractions '}
                    <br>
                    </br>
                    <Jax>
                        {this.eq}
                    </Jax>
                    {' OR '}
                    <Jax>
                        {this.ne}
                    </Jax>
                </MyPopper>
                <Jax>
                    {this.lhs}
                </Jax>
                <Jax inline>{this.question}</Jax>
                <Jax inline>
                    {this.rhs}
                </Jax>
            </div >
        )
    }

    renderAnswer(border, anchor) {
        return (
            <div ref={this.props.ID}>
                <div key={this.g++} className={classNames('sum1', border)} ref={this.addSumRef} >
                    <MyPopper display={this.showPopper} refId={this.addPopperRef} >
                        {this.step1Hint}
                    </MyPopper>
                    <Jax inline>
                        {this.step1}
                    </Jax>
                </div>
                <div key={this.g++} className={classNames('sum1', border)} ref={this.addSumRef} >
                    <MyPopper display={this.showPopper} refId={this.addPopperRef} >
                        {this.step2Hint}
                    </MyPopper>
                    <Jax inline>
                        {this.step2}
                    </Jax>
                </div>
            </div >)
    }

    resetPoppers() {
        this.popperRefs = [];
        this.sumRefs = []
        this.poppers.forEach(p => p.destroy())
        this.poppers = [];
    }

    render() {
        this.resetPoppers();
        return (
            <div id="sum11" ref={el => this.el = el} style={{
                display: 'inline-flex', margin: '20px', flexWrap: 'row wrap',
                flexDirection: 'column', justifyContent: 'center'
            }}>
                {this.renderProblem('blueBorder', 'Q')}
            </div >
        )
    }

    render1() {
        this.resetPoppers();
        return (
            <div style={{
                display: 'inline-flex', margin: '20px', flexWrap: 'row wrap',
                flexDirection: 'column', justifyContent: 'center'
            }}>
                {this.renderProblem('blueBorder', 'Q')}
                {this.showAnswer && this.renderAnswer('greenBorder', 'A')}
            </div>
        )
    }
}

export default Fraction;
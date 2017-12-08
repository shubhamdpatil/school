/*global MathJax*/

import React from 'react';
import classNames from 'classnames';
import Popper from 'popper.js'
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

class Sum extends React.Component {
    constructor(props) {
        super(props);
        this.addPopperRef = this.addPopperRef.bind(this)
        this.k = 0;
    }

    hint1(sum) {
        const first = sum.first.first;
        const second = sum.first.second;
        const third = sum.second.first;
        const fourth = sum.second.second;
        const lhs = `\\frac{${first}}{${second}}`;
        const rhs = `\\frac{${third}}{${fourth}}`;

        if (second !== fourth) {
            return `दोन्ही अपूर्णांकांचे छेद सारखे नाही. दोन्ही छेदांनी भाग जाणारी सर्वात लहान संख्या ${sum.lcm} आहे. दोन्ही अपूर्णांकांचे छेद ${sum.lcm} करा. `
        } else {
            if (second === fourth) {
                return `दोन्ही अपूर्णांकांचा अंश आणि छेद सारखे आहे.म्हणून दोन्ही अपूर्णांक सारखे आहे.`
            } else if (first < third) {
                return <div> <Jax> {lhs} </Jax>
                    <span> चा अंश छोटा म्हणून तो  </span> < Jax > {rhs} </Jax > <span >पेक्षा छोटा आहे. </span>
                </div>
            } else {
                return <div> <Jax> {lhs}  </Jax> <span> चा अंश मोठा म्हणून तो </span> <Jax>{rhs}</Jax> <span> पेक्षा मोठा आहे. </span>  </div>
            }
        }
    }

    hint2(lhs, rhs, sign) {

        if (sign === '=') {
            return `दोन्ही अपूर्णांकांचा अंश आणि छेद सारखे आहे.म्हणून दोन्ही अपूर्णांक सारखे आहे.`
        } else if (sign === '<') {
            return <div> <Jax> {lhs} </Jax>
                <span> चा अंश छोटा म्हणून तो  </span> < Jax > {rhs} </Jax > <span >पेक्षा छोटा आहे. </span>
            </div>
        } else {
            return <div>
                <Jax> {lhs}  </Jax> <span> चा अंश मोठा म्हणून तो </span> <Jax>{rhs}</Jax> <span> पेक्षा मोठा आहे. </span>
            </div>
        }
    }

    hint3(lhs, rhs, sign, denominatorsEqual) {
        if (sign === '=') {
            return `दोन्ही अपूर्णांकांचे अंश आणि छेद सारखे आहे.म्हणून दोन्ही अपूर्णांक सारखे आहे.`
        } else if (sign === '<') {
            if (denominatorsEqual) {
                return <div> <Jax> {lhs} </Jax> <span> चा अंश छोट म्हणून तो  </span> <Jax>  {rhs} </Jax> <span> पेक्षा छोटा आहे. </span>
                </div>
            }
            else {
                return <div> म्हणून <Jax> {lhs} </Jax> हा <Jax> {rhs} </Jax> <span> पेक्षा छोटा आहे. </span>
                </div>
            }
        } else {
            if (denominatorsEqual) {
                return <div> <Jax> {lhs} </Jax> <span> चा अंश मोठा म्हणून तो  </span> <Jax>  {rhs} </Jax> <span> पेक्षा मोठा आहे. </span>
                </div>
            } else {
                return <div> म्हणून <Jax> {lhs} </Jax> हा <Jax> {rhs} </Jax> <span> पेक्षा मोठा आहे. </span>
                </div>
            }
        }
    }


    addPopperRef(ref) {
        if (ref) {
            this.popperRefs.push(ref)
        }
    }

    componentDidMount() {
        if (this.props.showAnswer) {
            //  this.createPoppers();
        }
        this.typesetMathJax();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.showAnswer) {
            //  this.createPoppers();
        }
        this.typesetMathJax();
    }

    updatePoppers() {
        /*  this.poppers.forEach((p) => {
             p.update();
         }) */
    }

    typesetMathJax() {
        MathJax.Hub.Queue(() => {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, () => {
                this.updatePoppers();
            }])
        })
    }


    createPoppers() {
        this.poppers = this.steps.map((p, i) => {
            const placement = i % 2 ? 'right' : 'left';
            return new Popper(this.steps[i], this.popperRefs[i], { placement: placement })
        })
    }

    render() {
        if (!this.props.showAnswer && !this.props.answer) {
            return this.renderQuestion();
        } else {
            if (this.props.answer) {
                return this.renderShortAnswer();
            } else {
                return this.renderDetailedAnswer()
            }
        }
    }

    renderDetaildAnswerForMultiplication() {
        const sum = this.props.sum;
        const first = sum.first.first;
        const second = sum.first.second;
        const third = sum.second.first;
        const fourth = sum.second.second;
        let answerNumerator = first * third;
        let answerDenominator = second * fourth;
        const step1 = `\\frac{${first}\\times${third}}{${second}\\times${fourth}}`
        let answer = `\\frac{${answerNumerator}}{${answerDenominator}}`
        const gcd = math.gcd(answerNumerator, answerDenominator);
        let numAfterGcd = answerNumerator;
        let denAfterGcd = answerDenominator;
        if (gcd !== 1) {
            numAfterGcd = answerNumerator / gcd;
            denAfterGcd = answerDenominator / gcd;
            answer = `\\frac{\\cancel{${answerNumerator}}${numAfterGcd}}{\\cancel{${answerDenominator}}${denAfterGcd}}`
        }
        if (denAfterGcd === 1) {
            answer += `=${numAfterGcd}`
        }
        return <div key={this.k++} style={{ width: `300px`, margin: '20px', display: 'flex', justifyContent: 'center' }}
            className={classNames('sum1', 'greenBorder')} >
            <Index index={this.props.index} />
            <div key={this.k++} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <div key={this.k++} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px', border: '1px solid #000', width: '250px', height: '100px' }}  >
                    <Jax>
                        \frac{`{ ${first}`}}{`{${second}`}}
                                                     \  \times   \ \frac{`{ ${third}`}}{`{${fourth}`}}
                            </Jax>
                </div>
                {<div key={this.k++} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px', border: '1px solid #000', width: '250px', height: '100px' }}  >
                    <Jax>
                        {step1}
                    </Jax>
                </div>}
                {<div key={this.k++} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px', border: '1px solid #000', width: '250px', height: '100px' }}  >
                    <Jax>
                        {answer}
                    </Jax>
                </div>}
            </div>
        </div >
    }

    renderShortAnswerForMultiplication() {
        const sum = this.props.sum;
        const first = sum.first.first;
        const second = sum.first.second;
        const third = sum.second.first;
        const fourth = sum.second.second;
        let answerNumerator = first * third;
        let answerDenominator = second * fourth;
        const gcd = math.gcd(answerNumerator, answerDenominator);
        if (gcd !== 1) {
            answerNumerator /= gcd;
            answerDenominator /= gcd;
        }
        let answer = `\\frac{${answerNumerator}}{${answerDenominator}}`
        if (answerDenominator === 1) {
            answer += `=${answerNumerator}`
        }

        return <div key={this.k++} style={{ width: `300px`, margin: '20px', display: 'flex', justifyContent: 'center' }}
            className={classNames('sum1', 'greenBorder')} >
            <Index index={this.props.index} />
            <div key={this.k++} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <div key={this.k++} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px', border: '1px solid #000', width: '250px', height: '100px' }}  >
                    <Jax>
                        \frac{`{ ${first}`}}{`{${second}`}}
                                                     \  \times   \ \frac{`{ ${third}`}}{`{${fourth}`}}
                            </Jax>
                </div>
                {<div key={this.k++} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px', border: '1px solid #000', width: '250px', height: '100px' }}  >
                    <Jax>
                        {answer}
                    </Jax>
                </div>}
            </div>
        </div >
    }


    renderDetaildAnswerForDivision() {
        const sum = this.props.sum;
        const first = sum.first.first;
        const second = sum.first.second;
        const third = sum.second.first;
        const fourth = sum.second.second;
        let answerNumerator = first * fourth;
        let answerDenominator = second * third;
        const step1 = `\\frac{${first}}{${second}}\\times\\frac{${fourth}}{${third}}`
        //   const step1 = `\\frac{{${first}}{${second}}}\\times{${fourth}\\times${third}}`

        const step2 = `\\frac{${first}\\times${fourth}}{${second}\\times${third}}`
        let answer = `\\frac{${answerNumerator}}{${answerDenominator}}`
        const gcd = math.gcd(answerNumerator, answerDenominator);
        let numAfterGcd = answerNumerator, denAfterGcd = answerDenominator;
        if (gcd !== 1) {
            numAfterGcd = answerNumerator / gcd;
            denAfterGcd = answerDenominator / gcd;
            answer = `\\frac{\\cancel{${answerNumerator}}${numAfterGcd}}{\\cancel{${answerDenominator}}${denAfterGcd}}`
        }
        if (denAfterGcd === 1) {
            answer += `=${numAfterGcd}`
        }
        return <div key={this.k++} style={{ width: `300px`, margin: '20px', display: 'flex', justifyContent: 'center' }}
            className={classNames('sum1', 'greenBorder')} >
            <Index index={this.props.index} />
            <div key={this.k++} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <div key={this.k++} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px', border: '1px solid #000', width: '250px', height: '100px' }}  >
                    <Jax>
                        \frac{`{ ${first}`}}{`{${second}`}}
                                                     \  \div   \ \frac{`{ ${third}`}}{`{${fourth}`}}
                            </Jax>
                </div>
                {<div key={this.k++} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px', border: '1px solid #000', width: '250px', height: '100px' }}  >
                    <Jax>
                        {step1}
                    </Jax>
                </div>}
                {<div key={this.k++} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px', border: '1px solid #000', width: '250px', height: '100px' }}  >
                    <Jax>
                        {step2}
                    </Jax>
                </div>}
                {<div key={this.k++} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px', border: '1px solid #000', width: '250px', height: '100px' }}  >
                    <Jax>
                        {answer}
                    </Jax>
                </div>}
            </div>
        </div >
    }

    renderShortAnswerForDivision() {
        const sum = this.props.sum;
        const first = sum.first.first;
        const second = sum.first.second;
        const third = sum.second.first;
        const fourth = sum.second.second;
        let answerNumerator = first * fourth;
        let answerDenominator = second * third;
        const gcd = math.gcd(answerNumerator, answerDenominator);
        if (gcd !== 1) {
            answerNumerator /= gcd;
            answerDenominator /= gcd;
        }
        let answer = `\\frac{${answerNumerator}}{${answerDenominator}}`
        if (answerDenominator === 1) {
            answer += `=${answerNumerator}`
        }
        return <div key={this.k++} style={{ width: `300px`, margin: '20px', display: 'flex', justifyContent: 'center' }}
            className={classNames('sum1', 'greenBorder')} >
            <Index index={this.props.index} />
            <div key={this.k++} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <div key={this.k++} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px', border: '1px solid #000', width: '250px', height: '100px' }}  >
                    <Jax>
                        \frac{`{ ${first}`}}{`{${second}`}}
                                                     \  \div   \ \frac{`{ ${third}`}}{`{${fourth}`}}
                            </Jax>
                </div>
                {<div key={this.k++} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px', border: '1px solid #000', width: '250px', height: '100px' }}  >
                    <Jax>
                        {answer}
                    </Jax>
                </div>}
            </div>
        </div >
    }

    renderShortAnswer() {
        if (this.props.operation === '*') {
            return this.renderShortAnswerForMultiplication();
        } else if (this.props.operation === '/') {
            return this.renderShortAnswerForDivision();
        }
        const sum = this.props.sum;
        const first = sum.first.first;
        const second = sum.first.second;
        const third = sum.second.first;
        const fourth = sum.second.second;
        const firstMultiple = sum.lcm / second;
        const secondMultiple = sum.lcm / fourth;
        const firstWithMultiple = firstMultiple * first;
        const thirdWithMultiple = secondMultiple * third;
        let answerNumerator;
        if (this.props.operation === '+') {
            answerNumerator = firstWithMultiple + thirdWithMultiple;
        } else if (this.props.operation === '-') {
            answerNumerator = firstWithMultiple - thirdWithMultiple;
        }
        let answer = `\\frac{${answerNumerator}}{${sum.lcm}}`
        const gcd = math.gcd(answerNumerator, sum.lcm)
        let answerNumeratorAfterGcd = answerNumerator;
        let answerDenominatorAfterGcd = sum.lcm;
        if (gcd !== 1) {
            answerNumeratorAfterGcd = answerNumerator / gcd;
            answerDenominatorAfterGcd = sum.lcm / gcd;
            answer = `\\frac{\\cancel{${answerNumerator}}${answerNumeratorAfterGcd}}{\\cancel{${sum.lcm}}${answerDenominatorAfterGcd}}`
        }
        if (answerDenominatorAfterGcd === 1) {
            answer = answer + `=${answerNumeratorAfterGcd}`
        }
        if (answerNumeratorAfterGcd < 0) {
            answerNumeratorAfterGcd *= -1;
            answer += `=-\\frac{${answerNumeratorAfterGcd}}{${answerDenominatorAfterGcd}}`
        }

        this.steps = [];
        this.popperRefs = [];

        return <div key={this.k++} style={{ width: `300px`, margin: '20px', display: 'flex', justifyContent: 'center' }}
            className={classNames('sum1', 'greenBorder')} >
            <Index index={this.props.index} />
            <div key={this.k++} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <div key={this.k++} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px', border: '1px solid #000', width: '250px', height: '100px' }}  >
                    <Jax>
                        \frac{`{ ${first}`}}{`{${second}`}}
                                                     \  {this.props.operation}   \ \frac{`{ ${third}`}}{`{${fourth}`}}
                            </Jax>
                </div>
                {<div key={this.k++} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px', border: '1px solid #000', width: '250px', height: '100px' }}  >
                    <Jax>
                        {answer}
                    </Jax>
                </div>}
            </div>
        </div >
    }

    renderDetailedAnswer() {
        if (this.props.operation === '*') {
            return this.renderDetaildAnswerForMultiplication();
        } else if (this.props.operation === '/') {
            return this.renderDetaildAnswerForDivision();
        }
        const sum = this.props.sum;
        const first = sum.first.first;
        const second = sum.first.second;
        const third = sum.second.first;
        const fourth = sum.second.second;
        const firstMultiple = sum.lcm / second;
        const secondMultiple = sum.lcm / fourth;
        const firstWithMultiple = firstMultiple * first;
        const thirdWithMultiple = secondMultiple * third;
        const firstCommonDenominator = `\\frac{${first} \\times ${firstMultiple}}{${second} \\times ${firstMultiple}}`
        const secondCommonDenominator = `\\frac{${third} \\times ${secondMultiple}}{${fourth} \\times ${secondMultiple}}`
        const firstAfterCommonDenominator = `\\frac{${firstWithMultiple}}{${sum.lcm}}`
        const secondAfterCommonDenominator = `\\frac{${thirdWithMultiple}}{${sum.lcm}}`
        let answerNumerator;
        if (this.props.operation === '+') {
            answerNumerator = firstWithMultiple + thirdWithMultiple;
        } else if (this.props.operation === '-') {
            answerNumerator = firstWithMultiple - thirdWithMultiple;
        }
        let answer = `\\frac{${answerNumerator}}{${sum.lcm}}`
        this.steps = [];
        this.popperRefs = [];
        const denominatorsEqual = second === fourth ? true : false;


        const gcd = math.gcd(answerNumerator, sum.lcm)
        let answerNumeratorAfterGcd = answerNumerator;
        let answerDenominatorAfterGcd = sum.lcm;
        if (gcd !== 1) {
            answerNumeratorAfterGcd = answerNumerator / gcd;
            answerDenominatorAfterGcd = sum.lcm / gcd;
            answer = `\\frac{\\cancel{${answerNumerator}}${answerNumeratorAfterGcd}}{\\cancel{${sum.lcm}}${answerDenominatorAfterGcd}}`
        }
        if (answerDenominatorAfterGcd === 1) {
            answer = answer + `=${answerNumeratorAfterGcd}`
        }

        if (answerNumeratorAfterGcd < 0) {
            answerNumeratorAfterGcd *= -1;
            answer += `=-\\frac{${answerNumeratorAfterGcd}}{${answerDenominatorAfterGcd}}`
        }
        return <div style={{ width: `300px`, margin: '20px', display: 'flex', justifyContent: 'center' }
        }
            className={classNames('sum1', 'greenBorder')} >
            <Index index={this.props.index} />
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px', border: '1px solid #000', width: '250px', height: '100px' }}  >
                    <Jax>
                        \frac{`{ ${first}`}}{`{${second}`}}
                                                     \  {this.props.operation}  \ \frac{`{ ${third}`}}{`{${fourth}`}}
                            </Jax>
                </div>
                {this.props.showAnswer && !denominatorsEqual && <div ref={(el) => this.steps.push(el)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px', border: '1px solid #000', width: '250px', height: '100px' }}>
                    <Jax>
                        {firstCommonDenominator} \ {this.props.operation} \ {secondCommonDenominator}
                    </Jax>
                </div>}
                {this.props.showAnswer && !denominatorsEqual && <div ref={(el) => this.steps.push(el)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px', border: '1px solid #000', width: '250px', height: '100px' }}>
                    <Jax>
                        {firstAfterCommonDenominator} \ {this.props.operation} \ {secondAfterCommonDenominator}
                    </Jax>
                </div>}
                {this.props.showAnswer && <div ref={(el) => this.steps.push(el)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px', border: '1px solid #000', width: '250px', height: '100px' }}  >
                    <Jax>
                        {answer}
                    </Jax>
                </div>}
            </div>
        </div >
    }

    renderQuestion() {
        const sum = this.props.sum;
        const first = sum.first.first;
        const second = sum.first.second;
        const third = sum.second.first;
        const fourth = sum.second.second;
        this.steps = [];
        this.popperRefs = [];
        let operation = this.props.operation;
        if (operation === '*') {
            operation = `\\times`
        } else if (operation === '/') {
            operation = `\\div`
        }

        return <div style={{ width: `300px`, margin: '20px', display: 'flex', justifyContent: 'center' }}
            className={classNames('sum1', 'greenBorder')} >
            <Index index={this.props.index} />
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px', border: '1px solid #000', width: '250px', height: '100px' }}  >
                    <Jax>
                        \frac{`{ ${first}`}}{`{${second}`}}
                                                     \  {operation}  \ \frac{`{ ${third}`}}{`{${fourth}`}}
                            </Jax>
                </div>
            </div>
        </div >
    }
}

class AddFractions extends React.Component {
    constructor(props) {
        super(props);
        this.showAnswer = false;
        this.answer = false;
        this.k = 0;
        this.sumsMap = new Map();
        this.generateSums();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.check) {
            this.showAnswer = true;
            this.answer = false;
        }
        if (nextProps.new) {
            this.showAnswer = false;
            this.answer = false;
            this.generateSums();
        }
        if (nextProps.answer) {
            this.answer = true;
            this.showAnswer = false;
        }
    }

    key(first, second, third, fourth) {
        return `${first.toString(10)}${second.toString(10)}${third.toString(10)}${fourth.toString(10)}`
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
        this.steps = [];
        this.popperRefs = [];

        this.sums.map((sum, i) => {
            sum.steps = [];
            console.log(' this.props.answer ' + this.props.answer)
            return renderedSums.push(<Sum key={i} index={i + 1} operation="/" sum={sum} showAnswer={this.showAnswer} answer={this.answer} />)
        });
        return renderedSums;
    }

    getFraction() {
        const first = getRandomIntInclusive(1, 5);
        const second = getRandomIntInclusive(first, 10);
        return {
            first,
            second
        }
    }

    sum() {
        const first = this.getFraction();
        const second = this.getFraction();
        const lcm = math.lcm(first.second, second.second)
        const key = this.key(first.first, first.second, second.first, second.second);

        return {
            first,
            second,
            key,
            lcm,
        }
    }

    render() {
       //this.showAnswer = true;
        const flexDirection = this.showAnswer ? 'row' : 'row'
        return <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: flexDirection }}>
            {this.renderSums()}
        </div>
    }
}

export default AddFractions;

/*global MathJax*/

import React from 'react';
import classNames from 'classnames';
import Popper from 'popper.js'
import Hint from './../components/Popper'
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
            this.createPoppers();
        }
        this.typesetMathJax();
        console.log('componentDidMount')
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.showAnswer) {
            this.createPoppers();
        }
        this.typesetMathJax();
        console.log('componentDidUpdate')
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
            console.log('renderQuestion')
            return this.renderQuestion();
        } else {
            if (this.props.answer) {
                return this.renderShortAnswer();
            } else {
                return this.renderDetailedAnswer()
            }
        }
    }

    renderShortAnswer() {
        console.log('renderShortAnswer')
        const sum = this.props.sum;
        const first = sum.first.first;
        const second = sum.first.second;
        const third = sum.second.first;
        const fourth = sum.second.second;
        const firstMultiple = sum.lcm / second;
        const secondMultiple = sum.lcm / fourth;
        const firstWithMultiple = firstMultiple * first;
        const thirdWithMultiple = secondMultiple * third;
        const firstFrac = `\\frac{${first}}{${second}}`
        const secondFrac = `\\frac{${third}}{${fourth}}`
        const firstCommonDenominator = `\\frac{${first} \\times ${firstMultiple}}{${second} \\times ${firstMultiple}}`
        const secondCommonDenominator = `\\frac{${third} \\times ${secondMultiple}}{${fourth} \\times ${secondMultiple}}`
        const firstAfterCommonDenominator = `\\frac{${firstWithMultiple}}{${sum.lcm}}`
        const secondAfterCommonDenominator = `\\frac{${thirdWithMultiple}}{${sum.lcm}}`
        this.steps = [];
        this.popperRefs = [];
        const denominatorsEqual = second === fourth ? true : false;

        return <div key={this.k++} style={{ width: `300px`, margin: '20px', display: 'flex', justifyContent: 'center' }}
            className={classNames('sum1', 'greenBorder')} >
            <Index index={this.props.index} />
            <div key={this.k++} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <div key={this.k++} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px', border: '1px solid #000', width: '250px', height: '100px' }}  >
                    <Jax>
                        \frac{`{ ${first}`}}{`{${second}`}}
                                                     \  ?  \ \frac{`{ ${third}`}}{`{${fourth}`}}
                            </Jax>
                </div>
                {<div key={this.k++} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px', border: '1px solid #000', width: '250px', height: '100px' }}  >
                    <Jax>
                        \frac{`{ ${first}`}}{`{${second}`}}
                                                     \  {sum.equal}  \ \frac{`{ ${third}`}}{`{${fourth}`}}
                            </Jax>
                </div>}
            </div>
        </div >
    }

    renderDetailedAnswer() {
        const sum = this.props.sum;
        const first = sum.first.first;
        const second = sum.first.second;
        const third = sum.second.first;
        const fourth = sum.second.second;
        const firstMultiple = sum.lcm / second;
        const secondMultiple = sum.lcm / fourth;
        const firstWithMultiple = firstMultiple * first;
        const thirdWithMultiple = secondMultiple * third;
        const firstFrac = `\\frac{${first}}{${second}}`
        const secondFrac = `\\frac{${third}}{${fourth}}`
        const firstCommonDenominator = `\\frac{${first} \\times ${firstMultiple}}{${second} \\times ${firstMultiple}}`
        const secondCommonDenominator = `\\frac{${third} \\times ${secondMultiple}}{${fourth} \\times ${secondMultiple}}`
        const firstAfterCommonDenominator = `\\frac{${firstWithMultiple}}{${sum.lcm}}`
        const secondAfterCommonDenominator = `\\frac{${thirdWithMultiple}}{${sum.lcm}}`
        this.steps = [];
        this.popperRefs = [];
        const denominatorsEqual = second === fourth ? true : false;

        return <div style={{ width: `300px`, margin: '20px', display: 'flex', justifyContent: 'center' }}
            className={classNames('sum1', 'greenBorder')} >
            <Index index={this.props.index} />
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px', border: '1px solid #000', width: '250px', height: '100px' }}  >
                    <Jax>
                        \frac{`{ ${first}`}}{`{${second}`}}
                                                     \  ?  \ \frac{`{ ${third}`}}{`{${fourth}`}}
                            </Jax>
                </div>
                {this.props.showAnswer && !denominatorsEqual && <div ref={(el) => this.steps.push(el)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px', border: '1px solid #000', width: '250px', height: '100px' }}>
                    <Jax>
                        {firstCommonDenominator} \ ? \ {secondCommonDenominator}
                    </Jax>
                </div>}
                {this.props.showAnswer && !denominatorsEqual && <div ref={(el) => this.steps.push(el)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px', border: '1px solid #000', width: '250px', height: '100px' }}>
                    <Jax>
                        {firstAfterCommonDenominator} \ {sum.equal} \ {secondAfterCommonDenominator}
                    </Jax>
                </div>}
                {/* !denominatorsEqual && */ this.props.showAnswer && <div ref={(el) => this.steps.push(el)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px', border: '1px solid #000', width: '250px', height: '100px' }}  >
                    <Jax>
                        \frac{`{ ${first}`}}{`{${second}`}}
                                                     \  {sum.equal}  \ \frac{`{ ${third}`}}{`{${fourth}`}}
                            </Jax>
                </div>}
                {this.props.showAnswer && !denominatorsEqual && <Hint display={this.showPopper} refId={this.addPopperRef} >
                    {this.hint1(sum)}
                </Hint>}
                {this.props.showAnswer && !denominatorsEqual && < Hint display={this.showPopper} refId={this.addPopperRef} >
                    {this.hint2(firstAfterCommonDenominator, secondAfterCommonDenominator, sum.equal)}
                </Hint>}
                {/* !denominatorsEqual && */ this.props.showAnswer && < Hint display={this.showPopper} refId={this.addPopperRef} >
                    {this.hint3(firstFrac, secondFrac, sum.equal, denominatorsEqual)}
                </Hint>}
            </div>
        </div >
    }

    renderQuestion() {
        const sum = this.props.sum;
        const first = sum.first.first;
        const second = sum.first.second;
        const third = sum.second.first;
        const fourth = sum.second.second;
        const firstMultiple = sum.lcm / second;
        const secondMultiple = sum.lcm / fourth;
        const firstWithMultiple = firstMultiple * first;
        const thirdWithMultiple = secondMultiple * third;
        const firstFrac = `\\frac{${first}}{${second}}`
        const secondFrac = `\\frac{${third}}{${fourth}}`
        const firstCommonDenominator = `\\frac{${first} \\times ${firstMultiple}}{${second} \\times ${firstMultiple}}`
        const secondCommonDenominator = `\\frac{${third} \\times ${secondMultiple}}{${fourth} \\times ${secondMultiple}}`
        const firstAfterCommonDenominator = `\\frac{${firstWithMultiple}}{${sum.lcm}}`
        const secondAfterCommonDenominator = `\\frac{${thirdWithMultiple}}{${sum.lcm}}`
        this.steps = [];
        this.popperRefs = [];
        const denominatorsEqual = second === fourth ? true : false;

        return <div style={{ width: `300px`, margin: '20px', display: 'flex', justifyContent: 'center' }}
            className={classNames('sum1', 'greenBorder')} >
            <Index index={this.props.index} />
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px', border: '1px solid #000', width: '250px', height: '100px' }}  >
                    <Jax>
                        \frac{`{ ${first}`}}{`{${second}`}}
                                                     \  ?  \ \frac{`{ ${third}`}}{`{${fourth}`}}
                            </Jax>
                </div>
            </div>
        </div >
    }
}

class FractionCompare extends React.Component {
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

    renderAnswerSums() {
        const renderedSums = [];
        this.steps = [];
        this.popperRefs = [];

        this.sums.map((sum, i) => {
            sum.steps = [];
            console.log(' this.props.answer ' + this.props.answer)
            return renderedSums.push(<Sum key={i} index={i + 1} sum={sum} showAnswer={this.showAnswer} answer={this.answer} />)
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
        const lhs = `\\frac{${first.first}}{${first.second}}`;
        const rhs = `\\frac{${second.first}}{${second.second}}`;
        const answerLhs = `\\frac{${first.first}}{${lcm}}`;
        const answerRhs = `\\frac{${second.first}}{${lcm}}`;
        let equal = '='
        if ((first.first / first.second) > (second.first / second.second)) {
            equal = '>'
        } else if ((first.first / first.second) < (second.first / second.second)) {
            equal = '<'
        }

        return {
            first,
            second,
            key,
            lcm,
            equal,
            lhs,
            rhs,
            answerLhs,
            answerRhs
        }
    }

    render() {
        // this.showAnswer = true;
        const flexDirection = this.showAnswer ? 'column' : 'row'
        return <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: flexDirection }}>
            {this.renderAnswerSums()}
        </div>
    }
}

export default FractionCompare;

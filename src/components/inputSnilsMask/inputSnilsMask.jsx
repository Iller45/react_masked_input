import React from 'react';
import './inputSnilsMask.scss';

export class InputSnilsMask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            legend: [],
            blink: false,
            mask: props.mask,
            updateData: props.updateData,
            digitIndex: [],
        };
        console.log(props)
    }

    componentDidMount() {
        const {mask, digitIndex} = this.state;
        mask.replace(/9/g, function (match, p) {
            digitIndex.push(p);
            return '_';
        });
        this.inputWrp.style.width = this.inputWrp.getElementsByClassName('inputWidth')[0].offsetWidth + 24 + 'px';
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.mask !== nextProps.mask) {
            this.setState({
                mask: nextProps.mask,
            });
        }
    }

    onFocus = () => {
        this.setState({
            legend: this.getLegend(this.state.value.replace(/\D/g, '').split(('')))
        });

    };

    onBlur = () => {
        this.setState({
            legend: []
        })
    };

    getLegend = (v) => {
        const {mask, digitIndex} = this.state;
        const legendStr = mask.replace(/9/g, '_');
        if (!v) {
            return legendStr;
        }
        const maskedArr = legendStr.split('');
        v.forEach((it, i) => {
            maskedArr[digitIndex[i]] = it;
        });

        return maskedArr;
    };

    onChange = (event) => {
        const {digitIndex, mask, value, updateData} = this.state;
        const inputValue = event.target.value;
        let pureInputValue = inputValue.replace(/\D/g, '');
        const pureInputValueArr = pureInputValue.split('');
        let caretPos = event.target.selectionEnd;
        const char = event.nativeEvent.data;
        let substrIndex = digitIndex[pureInputValue.length - 1];

        if(char && mask[caretPos - 1] === char){
            substrIndex = caretPos-1;
        } else if (!Number(char) && char) {
            this.doBlink();
            return null
        }

        if (inputValue.length < value.length && !digitIndex.includes(caretPos)) {
            let deletedPos = 0;
            let count = 0;
            digitIndex.forEach((it, i) => {
                if (caretPos >= it) {
                    count = it;
                    deletedPos = i;
                }
            });
            caretPos = count;
            pureInputValueArr.splice(deletedPos, 1)
        }

        const legend = this.getLegend(pureInputValueArr);
        const _value =legend.join('').substr(0, substrIndex + 1);
        updateData(_value);
        this.setState({
            value: _value,
            legend: legend,
        }, () => {
            if (inputValue.length !== caretPos) {
                this.inputWrp.querySelector('.maskedInput').setSelectionRange(caretPos, caretPos);
            }
        })

    };

    getClass = (it, i) => {
        if (Number(it)) {
            return 'hidden';
        }
        if (this.state.digitIndex.includes(i)) {
            return 'dumbo'
        }
    };

    doBlink = () => {
        this.setState({
            blink: true
        });
        setTimeout(() => {
            this.setState({
                blink: false
            })
        }, 120)
    };


    render() {
        return <div className={this.state.blink ? 'maskedInput_wrp blink' : 'maskedInput_wrp'}
                    ref={(i) => this.inputWrp = i}>
            <span className={'inputWidth'}>{this.state.mask}</span>
            <input
                className={'maskedInput'}
                type="text"
                maxLength={this.state.mask.length}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                value={this.state.value}
                onChange={this.onChange}
            />
            <span className={'legend'}>{
                this.state.legend.map((it, i) => {
                    return <span key={it + Math.random()} className={this.getClass(it, i)}>
                            <span className={'char'}>
                                {it}
                            </span>
                    </span>
                })
            }</span>

        </div>
    }
}






























































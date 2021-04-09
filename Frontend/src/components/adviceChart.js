import React, { Component, Fragment } from 'react';
import GaugeChart from 'react-gauge-chart'

const chartStyle = {
    height: 150,
    width: "auto"
}


export class AdviceChart extends Component {

    constructor(props) {
        super(props)

        this.state = {
            advice: "",
            value: props.value,
            submit: props.submit,
            validTicker: false,
            has_submitted: false
        }
    }

    componentDidUpdate = () => {
        const { submit, value } = this.props;
        if (submit === true) {
            this.props.update_submit_value(false);
            this.props.update_value("");
            this.handleSubmit(value);

            this.setState({has_submitted: true});
        }        
    }

    handleTickerValueChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(ticker) {
        let res = this.getAdvice(ticker);
        res.then((r) => {
            if (r == null) {
                this.setState({validTicker: false, advice: ""})
                throw new Error("Ticker name not exist");
            }
            this.setState({advice: r, validTicker: true})
        })
        .then(() => {
            this.getAdviceValue();
            document.getElementById('advice-text').innerHTML = "We suggest you to " + this.state.advice + " it.";
        }).catch(e => {
            document.getElementById('advice-text').innerHTML = "This ticker do not exist";
        });
    }

    getAdvice = async (ticker) => {
        let response = await fetch('http://127.0.0.1:5000/'+ticker, {
            headers :{
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json;charset=utf-8',
                'mode': 'no-cors'
            }
        });
        if (response.status === 404) {
            return null;
        }
        return response.json();
    }

    getAdviceValue = () => {
        if (this.state.advice === "buy") {
            return 0.15;
        } else if (this.state.advice === "sell") {
            return 0.85;
        } else {
            return 0.5;
        }
    }

    render() {
        return(
            <Fragment>
                <GaugeChart
                    id="gauge-chart8"
                    style={chartStyle}
                    nrOfLevels={3}
                    colors={['#5BE12C', '#F5CD19', '#EA4228']}
                    textColor="#000000"
                    hideText={!this.state.validTicker}
                    arcWidth={0.3}
                    percent={this.getAdviceValue()} // 0.15, 0.5, 0.85
                    formatTextValue={(value) => {
                        if (value === 15) {
                            return "Buy";
                        } else if (value === 50){
                            return "Hold";
                        } else {
                            return "Sell"
                        }
                    }}
                />
                <div id="advice-text"></div>
            </Fragment>
        );
    }
}
import React, { Component, Fragment } from 'react';
import {Doughnut} from 'react-chartjs-2';

const backgroundColor = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#E9D2F4',
    '#39393A',
    '#084B83',
    '#9EBDAA',
    '#FBE9CA',
    '#A9A5AC'
];

const hoverBackgroundColor = [
    '#ffadbf',
    '#7DC3F2',
    '#FFE299',
    '#F7EFFB',
    '#5B5B5D',
    '#0C6FC0',
    '#BED3C6',
    '#FBE9CA',
    '#A9A5AC'
];

const getStockData = (trades) => {
    let labels = [];
    let data = [];
    Object.keys(trades).forEach(k => {        
        labels.push(k);
        data.push(trades[k].stockValue);
    });
    return {labels: labels, 
        datasets:[{data: data, 
            backgroundColor: backgroundColor.slice(0,data.length), 
            hoverBackgroundColor: hoverBackgroundColor.slice(0,data.length)
        }]
    };
}

/**
 * The chart that shows user's total
 */
export class UserStockChart extends Component {

    constructor(props) {
        super(props);
        this.state = {isLoaded: false}
    }

    componentDidMount(){
        fetch("http://localhost:8080/portfolio/TradeSummary")
        .then(response => response.json())
        .then(data => {
            this.setState(getStockData(data));
            this.setState({
                isLoaded:true
            });
        })
    }

    componentWillMount() {
		setInterval(async () => {
            let trades = await this.getUserStockInfo();
            this.setState(getStockData(trades));
		}, 7000);
    }

    getUserStockInfo = async () => {
        try {
            let response = await fetch("http://localhost:8080/portfolio/TradeSummary",
              { method: 'GET',
                headers: { 'Content-Type': 'application/json' }
              }
            );

            if (response.status === 404) {
                console.log("user portfolio not found");
                return null;
            }
            if (this.state.isLoaded === false) {
                this.setState({isLoaded: true});
            }
            return response.json();

        } catch (e) {
            console.error('Unable to fetch the user portfolio');
            return null;
        }
    }

    render() {
        return(
            <Fragment>
                <h4 id="chart-title">Your total hold trades</h4>
                <Doughnut data={this.state} height={40} options={{ maintainAspectRatio: false }} />
            </Fragment>
        )
    }
}
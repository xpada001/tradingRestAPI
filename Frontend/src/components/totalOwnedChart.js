import React, { Component, Fragment } from 'react';
import {HorizontalBar} from 'react-chartjs-2';

export class TotalOwnedChart extends Component {

    constructor(props) {
        super(props);

        this.state = {
            deposit: 0,
            totalOwned: 0,
            isLoaded: false,
            graphData: {}
        }
    }

    componentDidMount() {
        fetch("http://localhost:8080/portfolio")
        .then(response => response.json())
        .then(data => {
            let trades = data[0].allTrades;
            let totalOwned = Object.keys(trades).map(t => trades[t].stockValue).reduce((sum, d) => { return sum + d }, 0)
            this.setState({deposit: data[0].deposit, totalOwned: totalOwned }, () => {
                this.constructData();
            }, () => {
                this.setState({isLoaded:true})
            });
        });
    }

    constructData() {
        let graphData = {
            labels: ['Deposit', 'Total owned stock value'],
            datasets: [
              {
                label: 'USD',
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: [this.state.deposit, this.state.totalOwned]
              }
            ]
        };
        this.setState({graphData: graphData});
    }

    componentWillMount() {
		setInterval(async () => {
            let portfolio = await this.getUserProperties();
            let trades = portfolio[0].allTrades;
            let totalOwned = Object.keys(trades).map(t => trades[t].stockValue).reduce((sum, d) => { return sum + d }, 0)
            this.setState({deposit: portfolio[0].deposit, totalOwned: totalOwned }, () => {
                this.constructData();
            });
		}, 7000);
    }

    getUserProperties = async () => {
        try {
            let response = await fetch("http://localhost:8080/portfolio",
              { method: 'GET',
                headers: { 'Content-Type': 'application/json' }
              }
            );

            if (response.status === 404) {
                console.log("user portfolio not found");
                return null;
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
                <h4>You owned:</h4>
                <HorizontalBar data={this.state.graphData} width={350}/>
            </Fragment>
        );
    }
}
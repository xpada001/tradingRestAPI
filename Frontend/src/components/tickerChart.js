import React, { Component, Fragment } from 'react';
import {Bar} from 'react-chartjs-2';
import '../styles/chart.css';

const timestamps = (timestampList) => {
    return timestampList.map(timestampConverter);
}

const options = {
    responsive: true,
    tooltips: {
      mode: 'label'
    },
    elements: {
      line: {
        fill: false
      }
    }
    
  };

let emptyData = {
    datasets: [
        {
            type: 'line',
            label: '20d Mean Avg',
            backgroundColor: 'rgba(113, 179, 124,0.4)',
            borderColor: 'rgba(113, 179, 124,1)',
        },{
          type: 'bubble',
          label: 'Upper Band',
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
        },
        {
            type: 'bubble',
            label: 'Lower Band',
            backgroundColor: 'rgba(236, 147, 47,0.4)',
            borderColor: 'rgba(236, 147, 47,1)',
        },{
            type: 'line',
            label: 'Close',
            backgroundColor: 'rgba(255, 99, 132,0.4)',
            borderColor: 'rgba(255, 99, 132,1)',
        }
    ]
}
  

export class TickerChart extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: props.value,
            validTicker: false,
            submit: props.submit,
            has_submitted: false,
            title: "",
            data: {}
        }
    }


    componentDidUpdate = () => {
        const { submit, value } = this.props;
        if (submit === true) {            
            let graphTitle = "20-day SMA of "+ value.toUpperCase();
            this.setState({title: graphTitle});
            this.props.update_submit_value(false);
            this.props.update_value("");
            this.handleSubmit(value);

            this.setState({has_submitted: true});
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({value: nextProps.value});
    }

    handleTickerValueChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(ticker) {
        if (ticker === "") {
            document.getElementById('graph-text').innerHTML = "Please enter a ticker name.";
            this.setState({value: "", validTicker: false})
            return;
        };
        let res = this.getGraphData(ticker);
        
        res.then((r) => {
            if (r == null || !this.graphDataValidation(r)) {
                this.setState({value: "", validTicker: false});
                throw new Error("Ticker name not exist");
            }
            this.setState({validTicker: true});
            this.showGraph(r);
            document.getElementById('graph-text').innerHTML = "";
        }).catch(e => {
            console.error(e)
            document.getElementById('graph-text').innerHTML = "This ticker do not exist.";
        });
        
    }

    graphDataValidation = (graphData) => {
        let cols = graphData.columns;
        if (cols.indexOf("20d mavg") === -1 || cols.indexOf("Upper Band") === -1 || cols.indexOf("Lower Band") === -1 || cols.indexOf("Close") === -1) {
            return false;
        }
        return true;
    }
    
    showGraph = (graphData) => {
        if (this.graphDataValidation(graphData) === true) {
            let allData = [[], [], [], []];
            let a = graphData.data.map(d => {
                allData[0].push(d[0]);
                allData[1].push(d[1]);
                allData[2].push(d[2]);
                allData[3].push(d[3]);
            });
            

            this.constructGraphData(allData[0], allData[1], allData[2], allData[3], graphData.index);
            
        }    
    }

    getGraphData = async (ticker) => {
        try {
            let response =  await fetch(
              'http://localhost:5000/plain/'+ticker+'/2019-12-01',
              { method: 'GET',
                headers: { 'Content-Type': 'application/json' }
              }
            );

            if (response.status === 404) {
                return null;
            }
            
            return response.json();

        } catch (e) {
            
            console.error('Unable to fetch the graph data');
            return null;
        }
    }

    constructGraphData = (mavg, upper, lower, close, timestamp) => {
        let newdata = {
            labels: timestamps(timestamp),
            datasets: [
              {
                type: 'line',
                label: '20 Mean Avg',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(113, 179, 124,0.4)',
                borderColor: 'rgba(113, 179, 124,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(113, 179, 124,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(113, 179, 124,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: mavg
              },
              {
                type: 'bubble',
                label: 'Upper Band',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: upper
              },
              {
                type: 'bubble',
                label: 'Lower Band',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(236, 147, 47,0.4)',
                borderColor: 'rgba(236, 147, 47,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(236, 147, 47,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(236, 147, 47,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: lower
              },            
              {
                type: 'line',
                label: 'Close',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(255, 99, 132,0.4)',
                borderColor: 'rgba(255, 99, 132,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(255, 99, 132,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(255, 99, 132,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: close
              }
            ]
        };
        this.setState({data: newdata});
    }

    render() {
        const graphHeight = 500, graphWidth = 900;
        const { data, has_submitted, title } = this.state;

        return this.state.validTicker && data && title ? (
            <Fragment>
                <div>
                    <div id="graph-text"></div>
                    <div id="graph-title">{title}</div>

                    {this.state.validTicker && has_submitted ? 
                        <Bar width={graphWidth} height={graphHeight} data={data} options={options} />
                    :
                    <Bar width={graphWidth} height={graphHeight} data={emptyData} options={options} />}
                    
                    
                </div>
            </Fragment>
        ) : <Fragment>
                <div id="graph-text"></div>
                <div id="graph-title"></div>
                <Bar width={graphWidth} height={graphHeight} data={emptyData} options={options} />
            </Fragment>
    }
}

function timestampConverter(timestamp) {
    var date = new Date(timestamp * 1000);
    var year = date.getFullYear();
    var month = "0" + (parseInt(date.getMonth()) + 1);
    var day = "0" + date.getDay();

    // Will display time in 2020-02-28 format
    var formattedDate = year + '-' + month.substr(-2) + '-' + day.substr(-2);

    return formattedDate;
}


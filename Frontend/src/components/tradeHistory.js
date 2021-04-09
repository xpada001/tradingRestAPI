import React, { Component, Fragment } from 'react'
import '../styles/tradeHistory.css'
import { Table } from 'reactstrap';

export class TradeHistory extends Component{
    constructor(props){
        super(props);
        this.state={
            isLoaded:false,
            trades:[],
            trades_pending:[],
        }
    }


    async componentDidMount(){
        const apiURL = 'http://localhost:8080/trades';
        await fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            let jsonData = []
            let jsonData_pending = []
            for (var d in data){
                let rowData = {};
                rowData.stockId = data[d].id.timestamp;
                rowData.time = data[d].id.date.slice(0,10)+ " "+data[d].id.date.slice(11,19);
                rowData.stockTicker = data[d].stockTicker;
                rowData.tradeType = data[d].tradeType;
                rowData.stockQuantity = Math.abs(data[d].stockQuantity);
                rowData.stockStatus = data[d].tradeStatus;
                rowData.requestedPrice = data[d].requestedPrice;
                if (data[d].tradeStatus == "FILLED" || data[d].tradeStatus == "REJECTED"){
                    jsonData.push(rowData)
                }else{
                    jsonData_pending.push(rowData)
                }
            }
            this.setState({
                isLoaded:true,
                trades:jsonData,
                trades_pending:jsonData_pending
            })

            console.log(data)
        })
        
    }

    componentWillMount() {
      setInterval(async () => {
        await this.componentDidMount();
      }, 7000);
    }


    getTable = (props)=>{
        let trades = props.products;
        return (
            <Table>
                <thead>
                <tr>
                    <th>
                        Date
                    </th>
                    <th>
                        Ticker
                    </th>
                    <th>
                        Buy/Sell
                    </th>
                    <th>
                        Quantity
                    </th>
                    <th>
                        Requested Price ($)
                    </th>
                    <th>
                        Status
                    </th>
                    </tr>
                </thead>
                <tbody>
                    {trades.map(trade =>(
                        <tr key={trade.stockId}>
                            <td>{trade.time}</td>
                            <td>{trade.stockTicker.toUpperCase()}</td>
                            <td>{trade.tradeType}</td>
                            <td>{trade.stockQuantity}</td>
                            <td>${trade.requestedPrice}</td>
                            <td>{trade.stockStatus}</td>
                        </tr>
                    ))}
                </tbody>
          </Table>
        )
    }


    render(){
        
        var{isLoaded, trades, trades_pending} = this.state;
        
        if (!isLoaded){
            return <div>Loading...</div>;
        }
        else{
            return (
              <Fragment>

                <h5 className='pendingTrades'>Pending Trades</h5>
                <div className="tradeTable">
                    <this.getTable products={trades_pending}/>
                </div>

                <h5 className='completedTrades'>Completed Trades</h5>
                <div className="tradeTable">
                    
                    <this.getTable products={trades} />
                </div>
              </Fragment>
            );
        }

    }
}
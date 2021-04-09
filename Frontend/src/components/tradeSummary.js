// import axios from 'axios'
import React, { Component, Fragment, useState, useMemo } from 'react'
import '../styles/tradeSummary.css'
import { PopupWin } from './popupWin'

export class TradeSummary extends Component{
    constructor(props){
        super(props);
        this.state={
            trades:[],
            deposit:0,
            isLoaded:false,
        }
    }

    async componentDidMount(){
        const apiURL = 'http://localhost:8080/portfolio';
        await fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            let jsonData = []
            let tradeSummary = data[0].allTrades
            for (var d in tradeSummary){
                tradeSummary[d].stockTicker=d
                jsonData.push(tradeSummary[d])
            }
            this.setState({
                isLoaded:true,
                trades:jsonData,
                deposit:data[0].deposit
            })
        })
    }

    componentWillMount() {
      setInterval(async () => {
        await this.componentDidMount();
      }, 7000);
    }

    useSortableData = (trades, config = null) => {
        const [sortConfig, setSortConfig] = useState(config);
      
        const sortedtrades = useMemo(() => {
          let sortabletrades = [...trades];
          if (sortConfig !== null) {
            sortabletrades.sort((a, b) => {
              if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
              }
              if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
              }
              return 0;
            });
          }
          return sortabletrades;
        }, [trades, sortConfig]);
      
        const requestSort = (key) => {
          let direction = 'ascending';
          if (
            sortConfig &&
            sortConfig.key === key &&
            sortConfig.direction === 'ascending'
          ) {
            direction = 'descending';
          }
          setSortConfig({ key, direction });
        };
      
        return { trades: sortedtrades, requestSort, sortConfig };
    }

    summaryTable = (props) => {
        const { trades, requestSort, sortConfig } = this.useSortableData(props.products);
        const getClassNamesFor = (name) => {
          if (!sortConfig) {
            return;
          }
          return sortConfig.key === name ? sortConfig.direction : undefined;
        };
        return (
          <div className="wrap">
          <h4 className="table_title">Investment Summary</h4>
          <table>
            <thead>
              <tr>
                <th>
                  <div
                    type="button"
                    onClick={() => requestSort('stockTicker')}
                    className={getClassNamesFor('stockTicker')}>
                    Stock Ticker
                  </div>
                </th>
                <th>
                  <div
                    type="button"
                    onClick={() => requestSort('stockQuantity')}
                    className={getClassNamesFor('stockQuantity')}>
                    Stock Quantity
                  </div>
                </th>
                <th>
                  <div
                    type="button"
                    onClick={() => requestSort('stockValue')}
                    className={getClassNamesFor('stockValue')}>
                    Stock Value
                  </div>
                </th>
              </tr>
            </thead>
              <tbody className="inner_table">
                  {trades.map(trade =>(
                      <tr key={trade.stockId}>
                          <td>{trade.stockTicker.toUpperCase()}</td>
                          <td>{trade.stockQuantity}</td>
                          <td>$ {trade.stockValue.toFixed(2)}</td>
                      </tr>
                  ))}
              </tbody>
          </table>
        </div>
        );
    }

    passDeposit = (deposit) =>{
      this.setState({
        deposit:deposit
      })
    }

    render(){

        var{isLoaded, trades, deposit} = this.state;

        if (!isLoaded){
            return <div>Loading...</div>;
        }
        else{
            return (
              <Fragment>
                <div className='deposit_container'>
                  <div className='deposit'>
                    <h5>Deposit: { deposit }$</h5>
                  </div>
                  <div className = 'popup'>
                    <PopupWin passDeposit={this.passDeposit} />
                  </div>
                </div>

                <div className="summaryClass">
                  <this.summaryTable
                    products={trades}/>
                </div>

              </Fragment>
            );
        }

    }
}
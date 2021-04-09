import React, { Component, Fragment } from 'react';
import { AdviceChart } from '../components/adviceChart';
import { TickerChart } from '../components/tickerChart';
import '../styles/main.css';
import {WatchList} from '../components/watchlis';
import '../styles/dashboard.css';
import { ChartDownloadButton } from '../components/chartDownloadButton';
import { StockTrade } from '../components/stockTrade';
import Dropdown from  'react-bootstrap/Dropdown';
import DropdownButton from  'react-bootstrap/DropdownButton';

export class Dashboard extends Component {

    static routerProps = {
        name: "Dashboard",
        path: '/',
        exact: true
    }

    constructor(props) {
        super(props);

        this.state = {
            value: "",
            validTicker: false,
            submit: false
        }
    }

    handleTickerValueChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.state.value === "") {
            document.getElementById('graph-text').innerHTML = "Please enter a ticker name.";
            this.setState({value: "", validTicker: false})
            return;
        };
        this.setState({"submit": true});
    }

    update_submit_value = (new_val) => {
        this.setState({
            submit: new_val
        });
    }

    update_value = (new_val) => {
        this.setState({
            value: new_val
        });
    }

    render() {
        return(
            <Fragment>
                <div className="grid">
                    <div className="content">
                        <h3>Trade Bollinger Graph</h3>
                        <p>Please provide a ticker name to check its recent trend.</p>
                        <ChartDownloadButton value={this.state.value} submit={this.state.submit}/>
                        <form>
                            <label>
                                Ticker: <input type="text" name="ticker" value={this.state.value} onChange={(e) => this.handleTickerValueChange(e)} required />
                            </label>
                            <input type="submit" value="Submit" onClick={(e) => this.handleSubmit(e)} />
                        </form>
                        <br />
                        <TickerChart value={this.state.value} submit={this.state.submit} update_submit_value={this.update_submit_value} update_value={this.update_value} />

                    </div>
                            
                    <div className="right-navbar">
                        <div className="flex-top">
                                <WatchList/>
                        </div>
                        <div className="flex-mid">
                            <div className="advice-text">
                                <h3>Buy or Sell?</h3>
                                <p>We can give you advice!</p>
                            </div>                            
                            <div className="trade">                                
                                <StockTrade/>
                            </div>  
                        </div>                                                      
                        <div className="flex-bottom">
                            <div className="advice">
                                <AdviceChart value={this.state.value} submit={this.state.submit} update_submit_value={this.update_submit_value} update_value={this.update_value} />
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }

      
}    
    
   
               
            
     
import React, { Component, Fragment } from 'react';
import { TradeSummary } from '../components/tradeSummary';
import { UserStockChart } from '../components/userStockChart';
import '../styles/portfolio.css';
import { TotalOwnedChart } from '../components/totalOwnedChart';
import {TradeHistory} from '../components/tradeHistory';

export class Portfolio extends Component {

    static routerProps = {
        name: 'Portfolio',
        path: '/portfolio'
    }

    render() {
        return(
            <Fragment>
                <div className="portfolio-content">
                    <div className="left">
                        <div className="flex-top">
                            <div>
                                <h1>Portfolio</h1>
                            </div>
                            <div>
                                <TradeSummary/>
                            </div>
                        </div>                        
                        <div className="flex-bottom">
                            <div className="chart-group">
                                <div>
                                    <UserStockChart />
                                </div>
                                <div id="total-owned-chart">
                                    <TotalOwnedChart />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="right">
                        <TradeHistory />
                    </div>
                </div>
            </Fragment>
        );
    }
}
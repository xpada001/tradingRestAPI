import React, { Component, Fragment } from 'react';
import {StockTrade} from '../components/stockTrade';
import '../styles/trading.css';

export class Trading extends Component {

    static routerProps = {
        name: 'Trading',
        path: '/trading'
    }

    render() {
        return(
            <Fragment>
                <div className="trade-content">                
                    <StockTrade/>
                </div>
            </Fragment>
        );
    }
}
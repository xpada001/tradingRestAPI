import React, { Component, Fragment } from 'react';
import '../styles/watchlis.css';



export class WatchList extends React.Component {


    state = {
        loading: true,
        watchlist: null,
        add: ''

    }



    async componentDidMount() {

        const url = 'http://localhost:8080/portfolio/WatchList';
        const response = await fetch(url);
        const data = await response.json();



        let jsonData = [];
        for (var d in data) {
            jsonData.push(data[d]);
        }

        this.setState({ watchlist: jsonData, loading: false });

    }


    renderTableData() {
        return this.state.watchlist.map((watch, index) => {
            const { symbol, bid, open, previousClose, dayLow, dayHigh, priceAvg50, volume } = watch //destructuring
            return (
                <tr key={symbol}>
                    <td>{symbol}</td>
                    <td>{bid}</td>
                    <td>{open}</td>
                    <td>{previousClose}</td>
                    <td>{dayLow}</td>
                    <td>{dayHigh}</td>
                    <td>{priceAvg50}</td>
                    <td>{volume}</td>

                </tr>
            )
        })
    }

    renderTableHeader() {
        let header = ['sym', 'bid', 'open', 'prev close', 'day low', 'day hi', '50 day price avg', 'vol'];
        return header.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }




    mySubmitHandler = (event) => {

        const requestOptions = {
            method: 'POST',
            body: this.state.add
        }

        fetch('http://localhost:8080/portfolio/WatchList/post', requestOptions);
            // .then(response => console.log(response))

    }


    changeHandler = (e) => {
        this.setState({ add: e.target.value })
    }

    render() {

        const { add } = this.state.add
        return (
            <Fragment>

                <div>
                    {this.state.loading || !this.state.watchlist ? (<div > loading.. </div>)
                        : (
                            <div>
                                <h1 id='title'>Your Watchlist</h1>
                                <div className="dropdown">

                                    <form onSubmit={this.mySubmitHandler}>
                                        <p>Ticker:
                                             <input type="text" name="add" value={add}
                                                onChange={this.changeHandler} />


                                            <button type='submit'> Add </button>
                                        </p>

                                    </form>
                                </div>





                                <table id='watchlistTableData' class='darkTable'>
                                    <thead>{this.renderTableHeader()}</thead>

                                    <tbody>
                                        <tr>{this.renderTableData()}</tr>


                                    </tbody>

                                </table>
                            </div>

                        )}


                </div>
            </Fragment>
        );
    }

}
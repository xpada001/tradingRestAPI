import React, { Component, Fragment } from 'react';

export class ChartDownloadButton extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: props.value,
            submit: props.submit,
            validTicker: false
        }
    }

    componentDidUpdate = () => {
        const { submit, value } = this.props;
        if (submit === true) {
            this.setState({ value: value });
            this.checkTickerValidity(value);
        }
    }

    checkTickerValidity = async (ticker) => {
        let response = await fetch('http://127.0.0.1:5000/check/'+ticker, {
            headers :{
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json;charset=utf-8',
                'mode': 'no-cors'
            }
        });
        if (response.status === 404) {
            this.setState({"validTicker": false, "value": ""});
            return null;
        }
        if (response.ok) {
            this.setState({"validTicker": true}, () => {
                return this.getDownloadableGraph(ticker);
            });
        }
        return false;
    }

    getDownloadableGraph = async (ticker) => {
        let response = await fetch('http://127.0.0.1:5000/download/'+ticker+"/2019-12-01", {
            headers :{
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json;charset=utf-8',
                'mode': 'no-cors'
            }
        });
        if (response.status === 404) {
            return null;
        }
        response.arrayBuffer().then(function(buffer) {
            const url = window.URL.createObjectURL(new Blob([buffer]));
            const link = document.getElementById("download")
            link.href = url;
            link.setAttribute("download", "image.png");
            return url;
        });
        return null;
    }

    render() {
        let { validTicker } = this.state;
        if (validTicker) {
            return (
                <Fragment>
                    <a id="download"><div type="button" value="Download chart">Download chart</div></a>
                </Fragment>
            )
        }
        return(
            <Fragment></Fragment>
        )
    }
}
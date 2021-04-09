import React, { Component, Fragment } from 'react';

export class Error extends Component {

    static routerProps = {
        name: "Error",
        path: '/error'
    }

    render() {
        return(
            <Fragment>
                <div>This page cannot be found.</div>
            </Fragment>
        );
    }
}
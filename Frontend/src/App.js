import React, { Component, Fragment } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import * as Routes from './pages';
import { Error } from './pages/utils/notfound';
import './App.css';
import { Navbar } from './components/navbar';


class App extends Component {

  render() {
    return (
      <Fragment>
        <div className="navbar-div">
          <Navbar />
          <Switch>
            {
              Object.values(Routes).map((Component, key) => (
                <Route {...Component.routerProps} key={key} render={(props) => (
                  <Component {...props} set={this.set} history={this.props.history} />
                )} />
              ))
            }
            {/* route to page not found, if doesn't match any routes */}
            <Route component={Error} />
          </Switch>
        </div>


       

      </Fragment>


    );
  }
}

export default withRouter(App);

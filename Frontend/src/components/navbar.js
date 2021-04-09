import React, { Component, Fragment } from 'react';
import Nav from 'react-bootstrap/Nav';
import '../styles/navbar.css'

export class Navbar extends Component {

    constructor(props) {
        super(props)

        this.state = {
            isHovered: false,
            active: false,
            onPage: "Home"
        }
    }

    render() {
        return(
            <Fragment>
                <Nav defaultActiveKey="/home" className="flex-sm-column" id="navbar">
                    <div className="logo"></div>
                    <Nav.Link href='/' eventKey="dashboard" className={this.state.onPage === "Dashboard" ? "nav-active": null}
                        onClick={() => this.setState({onPage: "Dashboard"})}>Dashboard</Nav.Link>          
                    {/* <Nav.Link href='/trading' eventKey="trading" className={this.state.onPage === "Trading" ? "nav-active": null}
                        onClick={() => this.setState({onPage: "Trading"})}>Trading</Nav.Link>  */}
                    <Nav.Link href='/portfolio' className={this.state.onPage === "Portfolio" ? "nav-active": null}
                        onClick={() => this.setState({onPage: "Portfolio"})}>Portfolio</Nav.Link>            
                </Nav>
            </Fragment>
        )
    }
}
import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import '../styles/popupWin.css'

export class PopupWin extends Component {
    constructor() {
        super();
        this.state = {
            visible : false,
            deposit: 0
        }
    }

    openModal() {
        this.setState({
            visible : true
        });
    }

    closeModal() {
        this.setState({
            visible : false
        });
    }

    async updateDeposit(val){
        await fetch('http://localhost:8080/portfolio/Deposit',
            { method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: val
            }
        )
        .then(response =>response.json())
        .then(data => {
            if (data == -1){
                alert("Insufficient Deposit");
            }
            else{
                this.setState({
                    isLoaded:true,
                    deposit:data
                })
            } 
        })
        this.closeModal()
    }

    render() {
        return (
            <section>
                <input type="button" value="✏️" onClick={() => this.openModal()} />
                <Modal visible={this.state.visible} width="400" height="150" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                    <div>
                        <h4 className='editDeposit'>Edit Deposit Amount</h4>
                        <input id="depositAmount" type="text"/>
                        <button onClick={async () => {
                            await this.updateDeposit(document.getElementById('depositAmount').value)
                            this.props.passDeposit(this.state.deposit)}}
                            className='addDeposit'>Add</button>

                        <button onClick={async () => {
                            await this.updateDeposit(-document.getElementById('depositAmount').value)
                            this.props.passDeposit(this.state.deposit)}}
                            className = "withdrawlDeposit">Withdrawl</button>
                    </div>
                </Modal>
            </section>
        );
    }
}
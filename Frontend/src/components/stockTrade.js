import React, { Component, Fragment } from 'react'
import Modal from 'react-awesome-modal';

export class StockTrade extends Component{
    constructor(props){
        super(props);
        this.state={
            stockTicker: '',
            stockQuantity:'',
            reqPrice: '',
            type: 'BUY',
            isLoaded:false
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
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

     handleSubmit(event){
        event.preventDefault();
        let form = event.target;
        let trade = {}; 
        trade.stockTicker = form.stockTicker.value;
        trade.stockQuantity = form.stockQuantity.value;
        trade.requestedPrice = form.reqPrice.value;
        trade.tradeType = form.type.value;
        trade.tradeStatus = "CREATED"
        
       
        this.tradeStock(trade);
        event.target.reset();
         
        
    }

    handleChange(event){
        this.setState({ [event.target.name]: event.target.value });
     }

    

     tradeStock(trade) {
         fetch('http://localhost:8080/trades', {
                method: "POST",
                headers :{
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(trade)
        })
        .then(data => {
          if(data.status!==200)
          alert('Error:', data.status);
          else
          alert('Success!')
        });
        this.closeModal()
        
        
      }


    
    render() {
        return (
          <section>
                <input type="button" value="Click Here to Trade Now" onClick={() => this.openModal()} />
                <Modal visible={this.state.visible} width="500" height="400" effect="fadeInUp" onClickAway={() => this.closeModal()}>
            <form onSubmit={this.handleSubmit}>
                <br/>
             <label>

          Select the type of trade 
          <select value={this.state.type} name="type" onChange={this.handleChange}>
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
        </label>
        <br/>
        <br/>
            Stock Ticker: 
            <input
              type="text"
              name="stockTicker"
              value={this.state.stockTicker}
              onChange={this.handleChange}
              required
            />
            <br/>
            <br/>
            Stock Quantity: 
            <input
              type="number"
              min ='1'
              name="stockQuantity"
              value={this.state.stockQuantity}
              onChange={this.handleChange}
              required
            />
            <br/>
            <br/>
            Request Price: 
            <input
              type="number"
              min = '1'
              name="reqPrice"
              value={this.state.reqPrice}
              onChange={this.handleChange}
              required
            />
            <br/>
            <br/>
            
            
            <button type="submit" onClick="this.form.reset();">Submit</button>
        
                  
          </form>
          </Modal>
            </section>
        )
      }
    
    
}

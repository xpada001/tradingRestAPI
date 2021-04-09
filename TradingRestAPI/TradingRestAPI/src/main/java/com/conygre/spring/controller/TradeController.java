package com.conygre.spring.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Collection;

import com.conygre.spring.entities.Portfolio;
import com.conygre.spring.entities.Trade;
import com.conygre.spring.service.InsufficientException;
import com.conygre.spring.service.StockNotExistException;
import com.conygre.spring.service.TradeServiceImpl;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * TradeController
 */

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/trades")
public class TradeController {

    @Autowired
    private TradeServiceImpl service;

    @RequestMapping(method = RequestMethod.GET)
    public Collection<Trade> getTrades() {
        return service.getTrades();
    }

    @RequestMapping(method = RequestMethod.GET, value="portfolio")
    public Portfolio getPortfolio(){
        return service.getPortfolio();
    }

    @RequestMapping(method = RequestMethod.GET, value="/{name}")
    public Collection<Trade> getTradesByTicks(@PathVariable String name) {
        return service.getTradesByTicks(name);
    }

    @RequestMapping(method = RequestMethod.POST)
    public String addTrade(@RequestBody Trade trade) throws StockNotExistException, InsufficientException, IOException {
        return service.addTrade(trade);
    }

    @RequestMapping(method=RequestMethod.DELETE, value="/{id}")
    public Collection<Trade> deleteTrade(@PathVariable ObjectId id) {
        return service.deleteTrade(id);
    }
    
    @RequestMapping(method=RequestMethod.DELETE)
    public Boolean deleteAllTrades() {
        return service.deleteAllTrades();
    }

    @RequestMapping(method=RequestMethod.PATCH, value="/{id}")
    public void updateStock(@PathVariable ObjectId id, @RequestBody Trade trade){
        service.updateStock(id, trade);
    }
}
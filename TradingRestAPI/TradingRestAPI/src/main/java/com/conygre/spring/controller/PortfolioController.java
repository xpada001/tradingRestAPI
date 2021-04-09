package com.conygre.spring.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.HashMap;

import com.conygre.spring.entities.Portfolio;
import com.conygre.spring.service.PortfolioServiceImpl;

import yahoofinance.quotes.stock.StockQuote;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/portfolio")
public class PortfolioController {
    @Autowired
    private PortfolioServiceImpl portfolioService;

    @RequestMapping(method=RequestMethod.GET)
    public Collection<Portfolio> getPortfolio() {
        return portfolioService.getPortfolio();
    }

    @RequestMapping(method=RequestMethod.POST)
    public ObjectId addPortfolio(@RequestBody Portfolio portfolio) {
        return portfolioService.addPortfolio(portfolio);
    }

    @RequestMapping(method=RequestMethod.PATCH, value="/Deposit")
    public double updateDeposit(@RequestBody double amount) {
        return portfolioService.updateDeposit(amount);
    }

    @RequestMapping(method=RequestMethod.DELETE)
    public Boolean deleteAllPortfolio() {
        return portfolioService.deleteAllPortfolio();
    }

    @RequestMapping(method=RequestMethod.DELETE, value="/{id}")
    public ObjectId deletePortfolio(@PathVariable ObjectId Id) {
        return portfolioService.deletePortfolioById(Id);
    }

    @RequestMapping(method = RequestMethod.POST, value="WatchList/post")
    public HashMap<String, StockQuote> addToWatchlist(@RequestBody String ticker) throws Exception{
        return portfolioService.addToWatchlist(ticker);
    }

    @RequestMapping(method = RequestMethod.GET, value="/WatchList")
    public HashMap<String, StockQuote> getWatchlist() {
        return portfolioService.getWatchList();
    }


    @RequestMapping(method = RequestMethod.GET, value="/TradeSummary")
    public HashMap<String, HashMap<String, Double>> getTradeSummary(){
        return portfolioService.getTradeSummary();
    }
    
    

}

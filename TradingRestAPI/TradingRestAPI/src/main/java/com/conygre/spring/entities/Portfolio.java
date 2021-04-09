package com.conygre.spring.entities;

import yahoofinance.quotes.stock.StockQuote;

import java.util.HashMap;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document; 

@Document
public class Portfolio {
    @Id
    private ObjectId id;
    private double deposit;
    private double delta;
    private double totalValue;
    private HashMap<String, HashMap<String, Double>> allTrades;
    private HashMap<ObjectId, Integer> seenTrades;
    private HashMap<String, StockQuote> watchlist;

    public Portfolio(double deposit){
        this.deposit = deposit;
        this.delta = 0;
        this.totalValue = 0;
        allTrades = new HashMap<String, HashMap<String, Double>>();
        watchlist = new HashMap<String, StockQuote>();
        seenTrades = new HashMap<ObjectId, Integer>();
    }

    public Portfolio(){
        allTrades = new HashMap<String, HashMap<String, Double>>();
        watchlist = new HashMap<String, StockQuote>();
        seenTrades = new HashMap<ObjectId, Integer>();
    }

    public double getDeposit() {
        return deposit;
    }

    public void setDeposit(double deposit) {
        this.deposit = deposit;
    }

    public double getDelta() {
        return delta;
    }

    public double getTotalValue() {
        return totalValue;
    }

    public ObjectId getId() {
        return id;
    }
    public void setId(ObjectId id) {
        this.id = id;
    }

    public HashMap<String, HashMap<String, Double>> getAllTrades() {
        return allTrades;
    }

    public HashMap<String, StockQuote> getWatchlist() {
        return this.watchlist;
    }

    public void setWatchlist(HashMap<String, StockQuote> newList) {
        this.watchlist = newList;
    }

    public HashMap<ObjectId, Integer> getSeenTrades() {
        return seenTrades;
    }
}

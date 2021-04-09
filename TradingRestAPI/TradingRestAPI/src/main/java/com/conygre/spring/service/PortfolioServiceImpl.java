package com.conygre.spring.service;

import java.util.Collection;
import java.util.HashMap;

import com.conygre.spring.entities.Portfolio;
import com.conygre.spring.repo.PortfolioRepository;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import yahoofinance.Stock;

import yahoofinance.YahooFinance;
import yahoofinance.quotes.stock.StockQuote;

@Service
public class PortfolioServiceImpl {

    @Autowired
    private PortfolioRepository dao;

    public Collection<Portfolio> getPortfolio() {
        return dao.findAll();
    }

    public ObjectId addPortfolio(Portfolio portfolio) {
        dao.insert(portfolio);
        return portfolio.getId();
    }

    public Boolean deleteAllPortfolio() {
        try {
            dao.deleteAll();
            return true;
        } catch (Exception e) {
            throw e;
        }
    }

    public ObjectId deletePortfolioById(ObjectId Id) {
        dao.deleteById(Id);
        return Id;
    }

    public double updateDeposit(double amount) {
        Portfolio portfolio = dao.findAll().stream().findFirst().get();
        double final_deposit = portfolio.getDeposit() + amount;
        if (final_deposit<0) {
            return -1;
        }
        portfolio.setDeposit(final_deposit);
        dao.save(portfolio);
        return portfolio.getDeposit();
    }

    public HashMap<String, HashMap<String, Double>> getTradeSummary() {
        return dao.findAll().stream().findFirst().get().getAllTrades();
    }

    public HashMap<String, StockQuote> addToWatchlist(String stockTicker) throws Exception {
        Stock stock;
        Portfolio portfolio = dao.findAll().stream().findFirst().get();
        HashMap<String, StockQuote> newList = portfolio.getWatchlist();
        try {
            stock = YahooFinance.get(stockTicker);
            StockQuote quote = YahooFinance.get(stockTicker).getQuote();

            if (stock == null) {
                throw new StockNotExistException(stockTicker + " does not exist.");
            }
            newList.put(stockTicker, quote);
            portfolio.setWatchlist(newList);
            dao.save(portfolio);
            return newList;
        } catch (Exception e) {
            throw (e);
        }
    }

    public HashMap<String, StockQuote> getWatchList() {

        Portfolio portfolio = dao.findAll().stream().findFirst().get();

        return portfolio.getWatchlist();

    }

}
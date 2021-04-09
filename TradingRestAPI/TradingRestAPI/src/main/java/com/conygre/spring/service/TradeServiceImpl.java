package com.conygre.spring.service;

import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;

import com.conygre.spring.entities.Portfolio;
import com.conygre.spring.entities.Status;
import com.conygre.spring.entities.Trade;
import com.conygre.spring.entities.Type;
import com.conygre.spring.repo.PortfolioRepository;
import com.conygre.spring.repo.TradingRepository;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import yahoofinance.Stock;
import yahoofinance.YahooFinance;

@Service
public class TradeServiceImpl implements TradeService {

    @Autowired
    private TradingRepository dao;

    @Autowired 
    private PortfolioRepository dao_portfolio;

    public Portfolio getPortfolio(){
        return dao_portfolio.findAll().stream().findFirst().get();
    }
    
    public Collection<Trade> getTrades() {
        return dao.findAll();
    }

    public Collection<Trade> getTradesByTicks(String stockTicker) {
        return dao.findByStockTicker(stockTicker);
    }

    public Collection<Trade> deleteTrade(ObjectId id) {
        Trade trade = dao.findById(id).get();

        if (trade.getTradeStatus() == Status.CREATED) {
            dao.deleteById(id);
            return this.getTrades();
        }

        else {
            System.out.println("Trade cannot be modified!");
            return null;
        }
    }

    public Boolean deleteAllTrades() {
        try {
            dao.deleteAll();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String addTrade(Trade trade) throws RuntimeException {
        Stock stock;
        try {
            stock = YahooFinance.get(trade.getStockTicker());
            if (stock == null) {
                throw new StockNotExistException(trade.getStockTicker() + " does not exist.");
            }
        } catch (IOException e1) {
            e1.printStackTrace();
        }
        try {
            //will check trade entry validity in the UI?
            if (trade.getTradeType() == null) {
                throw new InsufficientException("Please specifiy trade type (buy/sell).");
            }
            Portfolio portfolio = dao_portfolio.findAll().stream().findFirst().get();
            if (trade.getTradeType()==Type.BUY){
                if (portfolio.getDeposit() < trade.getRequestedPrice()){                
                    throw new InsufficientException("Insufficient deposit.");
                }
            } else if (trade.getTradeType() == Type.SELL){
                HashMap<String, HashMap<String, Double>> allTrades = portfolio.getAllTrades();
                String ticker = trade.getStockTicker();
                if (!allTrades.containsKey(ticker) || allTrades.get(ticker).get("stockQuantity")<trade.getStockQuantity()){
                    throw new InsufficientException("Insufficient stocks in your inventory!");            
                }
                trade.setStockQuantity(trade.getStockQuantity()*-1);
            }
            trade.setStockTicker(trade.getStockTicker().toUpperCase());
            dao.insert(trade);
            return trade.getId().toString();
        } catch (Exception e) {
            throw e;
        }
    }

    private double stringToDouble(String s){
        double res = 0;
        for (int i = 0; i < s.length(); i++){
            res += (double)s.charAt(i);
        }
        return res;
    }

    public Portfolio updateTradeSummary(String stockTicker, double stockQuantity, double currentPrice){
        Portfolio portfolio = dao_portfolio.findAll().stream().findFirst().get();
        HashMap<String, HashMap<String, Double>> tradeSummary = portfolio.getAllTrades();
        double totalPrice = stockQuantity*currentPrice;
        if (tradeSummary.containsKey(stockTicker)){
            HashMap<String, Double> currList = tradeSummary.get(stockTicker);
            currList.put("stockQuantity", currList.get("stockQuantity")+stockQuantity);
            currList.put("stockValue", currList.get("stockValue") + totalPrice);
            
            if (currList.get("stockQuantity") == 0) tradeSummary.remove(stockTicker);
        }else{
            HashMap<String, Double> newList = new HashMap<String, Double>();
            newList.put("stockId", stringToDouble(stockTicker));
            newList.put("stockQuantity", stockQuantity);
            newList.put("stockValue", totalPrice);
            tradeSummary.put(stockTicker, newList);
        }
        portfolio.setDeposit(portfolio.getDeposit()-totalPrice);
        return portfolio;
    }

    public Trade updateStock(ObjectId id, Trade trade){
        Trade oldTrade = dao.findById(id).get();
        if(oldTrade.getTradeStatus() == Status.CREATED  ){
            if (trade.getDateCreated() != null) oldTrade.setDateCreated(trade.getDateCreated());
            if (trade.getRequestedPrice() != 0) oldTrade.setRequestedPrice(trade.getRequestedPrice());
            if (trade.getStockQuantity() != 0) oldTrade.setStockQuantity(trade.getStockQuantity());
            if (trade.getStockTicker() != null) oldTrade.setStockTicker(trade.getStockTicker());
            // oldTrade.setTradeStatus(trade.getTradeStatus());
            dao.save(oldTrade);
        }
        else{
            System.out.println("Trade cannot be modified!");
        }
        return oldTrade;
    }

    @Scheduled(fixedRateString = "${scheduleRateMs:8000}")
    public void updatePortfolio() {
        Portfolio portfolio = dao_portfolio.findAll().stream().findFirst().get();
        Collection<Trade> trades = dao.findAll();
        Iterator<Trade> ite = trades.iterator();
        while (ite.hasNext()){
            Trade currTrade = ite.next();
            Status currTradeStatus = currTrade.getTradeStatus();

            if (currTradeStatus == Status.REJECTED || currTradeStatus == Status.FILLED){
                if (!portfolio.getSeenTrades().containsKey(currTrade.getId())){
                    if (currTrade.getTradeStatus() == Status.FILLED){
                        portfolio = updateTradeSummary(currTrade.getStockTicker(), currTrade.getStockQuantity(), currTrade.getRequestedPrice());
                    }
                    portfolio.getSeenTrades().put(currTrade.getId(),1);
                }
            }
        }
        dao_portfolio.save(portfolio);
    }

}
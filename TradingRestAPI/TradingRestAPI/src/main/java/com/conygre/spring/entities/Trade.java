package com.conygre.spring.entities;

import java.util.Date;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class Trade {
    
    @Id
    private ObjectId id;
    private Date dateCreated;
    private String stockTicker;
    private int stockQuantity;
    private double requestedPrice;
    private Status tradeStatus;
    private Type tradeType;

    public Trade(Date dateCreated, String stockTicker, int stockQuantity, double requestedPrice, Status tradeStatus, Type tradeType) {
        this.dateCreated = dateCreated;
        this.stockTicker = stockTicker;
        this.stockQuantity = stockQuantity;
        this.requestedPrice = requestedPrice;
        this.tradeStatus = tradeStatus;
        this.tradeType = tradeType;
    }

    public Trade() {}

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public Date getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }

    public String getStockTicker() {
        return stockTicker;
    }

    public void setStockTicker(String stockTicker) {
        this.stockTicker = stockTicker;
    }

    public int getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(int stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public double getRequestedPrice() {
        return requestedPrice;
    }

    public void setRequestedPrice(double requestedPrice) {
        this.requestedPrice = requestedPrice;
    }

    public Status getTradeStatus() {
        return tradeStatus;
    }

    public void setTradeStatus(Status tradeStatus) {
        this.tradeStatus = tradeStatus;
    }

    public Type getTradeType() {
        return tradeType;
    }

    public void setTradeType(Type tradeType) {
        this.tradeType = tradeType;
    }

}


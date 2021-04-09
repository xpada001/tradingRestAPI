package com.conygre.training.tradesimulator.model;

public enum Status {
    CREATED("CREATED"),
    PROCESSING("PROCESSING"),
    CANCELLED("CANCELLED"),
    REJECTED("REJECTED"),
    FILLED("FILLED"),
    PARTIALLY_FILLED("PARTIALLY_FILLED"),
    ERROR("ERROR");

    private String state;

    private Status(String state) {
        this.state = state;
    }

    public String getState() {
        return this.state;
    } 
}

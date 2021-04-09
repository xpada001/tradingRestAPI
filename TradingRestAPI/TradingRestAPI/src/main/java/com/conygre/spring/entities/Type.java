package com.conygre.spring.entities;

public enum Type {
    SELL("SELL"),
    BUY("BUY");

    private String type;

	public String getType() {
		return type;
	}

	private Type(String type) {
		this.type = type;
    }
}
package com.conygre.spring.service;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND)
public class StockNotExistException extends RuntimeException {

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    public StockNotExistException(String s) {
        System.out.println(s);
    }
}

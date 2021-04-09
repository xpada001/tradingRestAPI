package com.conygre.spring.service;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_ACCEPTABLE)
public class InsufficientException extends RuntimeException {

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    public InsufficientException(String s) {
        System.out.println(s);
    }
}

package com.example.todoapp.global.exception;

public class TodoNotFoundException extends RuntimeException {

    public TodoNotFoundException(String id) {
        super("Devotion not found: " + id);
    }
}

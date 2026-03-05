package com.example.todoapp.global.exception;

public class DuplicateDateException extends RuntimeException {
    public DuplicateDateException(String date) {
        super("해당 날짜에 이미 디보션이 존재합니다: " + date);
    }
}

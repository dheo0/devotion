package com.example.todoapp.domain.auth.dto;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String userId,
        String email,
        boolean confirmationRequired
) {}

package com.example.todoapp.domain.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record SupabaseUser(
        String id,
        String email,
        @JsonProperty("created_at") String createdAt
) {}

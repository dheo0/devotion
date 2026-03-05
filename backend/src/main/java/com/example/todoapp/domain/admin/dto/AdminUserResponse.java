package com.example.todoapp.domain.admin.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record AdminUserResponse(
        String id,
        String email,
        @JsonProperty("created_at") String createdAt
) {}

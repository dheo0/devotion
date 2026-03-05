package com.example.todoapp.domain.admin.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record SupabaseUsersResponse(List<AdminUserResponse> users) {}

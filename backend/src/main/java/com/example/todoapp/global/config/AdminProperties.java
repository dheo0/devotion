package com.example.todoapp.global.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "admin")
public record AdminProperties(String userId) {}

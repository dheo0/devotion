package com.example.todoapp.global.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "supabase")
public record SupabaseProperties(
        String url,
        String serviceRoleKey,
        String anonKey,
        String jwtSecret
) {}

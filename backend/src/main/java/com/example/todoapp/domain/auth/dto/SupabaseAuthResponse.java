package com.example.todoapp.domain.auth.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

// 이메일 확인 OFF → { access_token, refresh_token, user: { id, email } }
// 이메일 확인 ON  → flat user object { id, email, confirmation_sent_at, ... }
@JsonIgnoreProperties(ignoreUnknown = true)
public record SupabaseAuthResponse(
        @JsonProperty("access_token") String accessToken,
        @JsonProperty("refresh_token") String refreshToken,
        SupabaseUser user,

        // 이메일 확인 ON 일 때 top-level 에 직접 노출되는 필드
        String id,
        String email
) {}

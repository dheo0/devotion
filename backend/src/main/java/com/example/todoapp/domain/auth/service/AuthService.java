package com.example.todoapp.domain.auth.service;

import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.todoapp.domain.auth.dto.AuthResponse;
import com.example.todoapp.domain.auth.dto.LoginRequest;
import com.example.todoapp.domain.auth.dto.SignupRequest;
import com.example.todoapp.domain.auth.dto.SupabaseAuthResponse;
import com.example.todoapp.global.config.SupabaseProperties;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final RestTemplate restTemplate;
    private final SupabaseProperties supabaseProperties;

    public AuthResponse signup(SignupRequest request) {
        String url = supabaseProperties.url() + "/auth/v1/signup";
        SupabaseAuthResponse res = callSupabaseAuth(url, request.email(), request.password());

        // 이메일 확인 ON → access_token 없이 flat user 객체 반환
        if (res.accessToken() == null) {
            return new AuthResponse(null, null, res.id(), res.email(), true);
        }

        return toAuthResponse(res, false);
    }

    public AuthResponse login(LoginRequest request) {
        String url = supabaseProperties.url() + "/auth/v1/token?grant_type=password";
        SupabaseAuthResponse res = callSupabaseAuth(url, request.email(), request.password());
        return toAuthResponse(res, false);
    }

    private SupabaseAuthResponse callSupabaseAuth(String url, String email, String password) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("apikey", supabaseProperties.anonKey());

        Map<String, String> body = Map.of("email", email, "password", password);
        HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);

        return restTemplate.postForObject(url, entity, SupabaseAuthResponse.class);
    }

    private AuthResponse toAuthResponse(SupabaseAuthResponse res, boolean confirmationRequired) {
        return new AuthResponse(
                res.accessToken(),
                res.refreshToken(),
                res.user().id(),
                res.user().email(),
                confirmationRequired
        );
    }
}

package com.example.todoapp.domain.admin.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.example.todoapp.domain.admin.dto.AdminUserResponse;
import com.example.todoapp.domain.admin.dto.BulkDevotionRequest;
import com.example.todoapp.domain.admin.dto.BulkDevotionResult;
import com.example.todoapp.domain.admin.dto.SupabaseUsersResponse;
import com.example.todoapp.global.config.SupabaseProperties;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final RestTemplate restTemplate;
    private final SupabaseProperties supabaseProperties;

    private static final String TABLE = "/rest/v1/devotion_todos";

    private static final String ADMINS_TABLE = "/rest/v1/admins";

    @SuppressWarnings("rawtypes")
    public boolean isAdmin(String userId) {
        String url = supabaseProperties.url() + ADMINS_TABLE + "?user_id=eq." + userId + "&select=user_id";
        HttpEntity<Void> entity = new HttpEntity<>(buildHeaders());
        ResponseEntity<java.util.List> response = restTemplate.exchange(url, HttpMethod.GET, entity, java.util.List.class);
        java.util.List<?> body = response.getBody();
        return body != null && !body.isEmpty();
    }

    public List<AdminUserResponse> getUsers() {
        String url = supabaseProperties.url() + "/auth/v1/admin/users?per_page=200";

        HttpEntity<Void> entity = new HttpEntity<>(buildHeaders());
        ResponseEntity<SupabaseUsersResponse> response = restTemplate.exchange(
                url, HttpMethod.GET, entity, SupabaseUsersResponse.class);

        SupabaseUsersResponse body = response.getBody();
        return body != null && body.users() != null ? body.users() : List.of();
    }

    public BulkDevotionResult bulkCreate(BulkDevotionRequest request) {
        int created = 0;
        List<String> skippedUserIds = new ArrayList<>();

        for (String userId : request.userIds()) {
            Map<String, Object> body = new HashMap<>();
            body.put("user_id", userId);
            body.put("date", request.date());
            body.put("bible_verse", request.bibleVerse());

            HttpHeaders headers = buildHeaders();
            headers.set("Prefer", "return=minimal");
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            try {
                restTemplate.exchange(supabaseProperties.url() + TABLE,
                        HttpMethod.POST, entity, Void.class);
                created++;
            } catch (HttpClientErrorException e) {
                if (e.getStatusCode().value() == 409) {
                    skippedUserIds.add(userId);
                } else {
                    throw e;
                }
            }
        }

        return new BulkDevotionResult(created, skippedUserIds.size(), skippedUserIds);
    }

    private HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("apikey", supabaseProperties.serviceRoleKey());
        headers.set("Authorization", "Bearer " + supabaseProperties.serviceRoleKey());
        return headers;
    }
}

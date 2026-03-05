package com.example.todoapp.domain.todo.service;

import java.time.YearMonth;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.todoapp.domain.todo.dto.TodoCreateRequest;
import com.example.todoapp.domain.todo.dto.TodoResponse;
import com.example.todoapp.domain.todo.dto.TodoUpdateRequest;
import com.example.todoapp.domain.todo.entity.Todo;
import com.example.todoapp.global.config.SupabaseProperties;
import com.example.todoapp.global.exception.DuplicateDateException;
import com.example.todoapp.global.exception.TodoNotFoundException;

import org.springframework.web.client.HttpClientErrorException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TodoService {

    private final RestTemplate restTemplate;
    private final SupabaseProperties supabaseProperties;

    private static final String TABLE = "/rest/v1/devotion_todos";

    public List<TodoResponse> getByMonth(String userId, String yearMonth) {
        // yearMonth: "2024-03"
        String startDate = yearMonth + "-01";
        String endDate = yearMonth + "-" + YearMonth.parse(yearMonth).lengthOfMonth();

        String url = supabaseProperties.url() + TABLE
                + "?user_id=eq." + userId
                + "&date=gte." + startDate
                + "&date=lte." + endDate
                + "&order=date.asc";

        HttpEntity<Void> entity = new HttpEntity<>(buildHeaders());
        ResponseEntity<Todo[]> response = restTemplate.exchange(url, HttpMethod.GET, entity, Todo[].class);

        Todo[] todos = response.getBody();
        if (todos == null) return List.of();
        return Arrays.stream(todos)
                .map(TodoResponse::from)
                .toList();
    }

    public TodoResponse getByDate(String userId, String date) {
        String url = supabaseProperties.url() + TABLE
                + "?user_id=eq." + userId
                + "&date=eq." + date;

        HttpEntity<Void> entity = new HttpEntity<>(buildHeaders());
        ResponseEntity<Todo[]> response = restTemplate.exchange(url, HttpMethod.GET, entity, Todo[].class);

        Todo[] todos = response.getBody();
        if (todos == null || todos.length == 0) {
            throw new TodoNotFoundException(date);
        }
        return TodoResponse.from(todos[0]);
    }

    public TodoResponse create(String userId, TodoCreateRequest request) {
        String url = supabaseProperties.url() + TABLE;

        Map<String, Object> body = new HashMap<>();
        body.put("user_id", userId);
        body.put("date", request.date());
        body.put("title", request.title());
        body.put("bible_verse", request.bibleVerse());
        body.put("summary", request.summary());
        body.put("given_word", request.givenWord());
        body.put("about_god", request.aboutGod());
        body.put("about_me", request.aboutMe());
        body.put("action_items", request.actionItems());

        HttpHeaders headers = buildHeaders();
        headers.set("Prefer", "return=representation");
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Todo[]> response = restTemplate.exchange(url, HttpMethod.POST, entity, Todo[].class);
            Todo[] todos = response.getBody();
            if (todos == null || todos.length == 0) {
                throw new RuntimeException("Failed to create devotion");
            }
            return TodoResponse.from(todos[0]);
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode().value() == 409) {
                throw new DuplicateDateException(request.date());
            }
            throw e;
        }
    }

    public TodoResponse update(String userId, String id, TodoUpdateRequest request) {
        String url = supabaseProperties.url() + TABLE
                + "?id=eq." + id
                + "&user_id=eq." + userId;

        Map<String, Object> body = new HashMap<>();
        if (request.date() != null) body.put("date", request.date());
        if (request.title() != null) body.put("title", request.title());
        if (request.bibleVerse() != null) body.put("bible_verse", request.bibleVerse());
        if (request.summary() != null) body.put("summary", request.summary());
        if (request.givenWord() != null) body.put("given_word", request.givenWord());
        if (request.aboutGod() != null) body.put("about_god", request.aboutGod());
        if (request.aboutMe() != null) body.put("about_me", request.aboutMe());
        if (request.actionItems() != null) body.put("action_items", request.actionItems());

        HttpHeaders headers = buildHeaders();
        headers.set("Prefer", "return=representation");
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<Todo[]> response = restTemplate.exchange(url, HttpMethod.PATCH, entity, Todo[].class);
        Todo[] todos = response.getBody();
        if (todos == null || todos.length == 0) {
            throw new TodoNotFoundException(id);
        }
        return TodoResponse.from(todos[0]);
    }

    public void delete(String userId, String id) {
        String url = supabaseProperties.url() + TABLE
                + "?id=eq." + id
                + "&user_id=eq." + userId;

        HttpEntity<Void> entity = new HttpEntity<>(buildHeaders());
        restTemplate.exchange(url, HttpMethod.DELETE, entity, new ParameterizedTypeReference<Void>() {});
    }

    private HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("apikey", supabaseProperties.serviceRoleKey());
        headers.set("Authorization", "Bearer " + supabaseProperties.serviceRoleKey());
        return headers;
    }
}

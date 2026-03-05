package com.example.todoapp.domain.todo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.todoapp.domain.todo.dto.TodoCreateRequest;
import com.example.todoapp.domain.todo.dto.TodoResponse;
import com.example.todoapp.domain.todo.dto.TodoUpdateRequest;
import com.example.todoapp.domain.todo.service.TodoService;
import com.example.todoapp.global.common.ApiResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/todos")
@RequiredArgsConstructor
@Tag(name = "Todo", description = "디보션 CRUD API")
public class TodoController {

    private final TodoService todoService;

    @GetMapping
    @Operation(summary = "월별 디보션 목록 조회", description = "yearMonth: 2024-03 형식")
    public ResponseEntity<ApiResponse<List<TodoResponse>>> getByMonth(
            @RequestParam String yearMonth,
            HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(ApiResponse.ok(todoService.getByMonth(userId, yearMonth)));
    }

    @GetMapping("/date/{date}")
    @Operation(summary = "날짜별 디보션 조회", description = "date: 2024-03-15 형식")
    public ResponseEntity<ApiResponse<TodoResponse>> getByDate(
            @PathVariable String date,
            HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(ApiResponse.ok(todoService.getByDate(userId, date)));
    }

    @PostMapping
    @Operation(summary = "디보션 생성")
    public ResponseEntity<ApiResponse<TodoResponse>> create(
            @Valid @RequestBody TodoCreateRequest createRequest,
            HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(ApiResponse.ok(todoService.create(userId, createRequest)));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "디보션 수정")
    public ResponseEntity<ApiResponse<TodoResponse>> update(
            @PathVariable String id,
            @RequestBody TodoUpdateRequest updateRequest,
            HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(ApiResponse.ok(todoService.update(userId, id, updateRequest)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "디보션 삭제")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable String id,
            HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        todoService.delete(userId, id);
        return ResponseEntity.ok(ApiResponse.ok(null, "삭제되었습니다"));
    }
}

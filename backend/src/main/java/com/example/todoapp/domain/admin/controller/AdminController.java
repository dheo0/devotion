package com.example.todoapp.domain.admin.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.todoapp.domain.admin.dto.AdminUserResponse;
import com.example.todoapp.domain.admin.dto.BulkDevotionRequest;
import com.example.todoapp.domain.admin.dto.BulkDevotionResult;
import com.example.todoapp.domain.admin.service.AdminService;
import com.example.todoapp.global.common.ApiResponse;
import com.example.todoapp.global.exception.UnauthorizedException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "관리자 API")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/check")
    @Operation(summary = "관리자 여부 확인")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> checkAdminStatus(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        boolean isAdmin = adminService.isAdmin(userId);
        return ResponseEntity.ok(ApiResponse.ok(Map.of("isAdmin", isAdmin)));
    }

    @GetMapping("/users")
    @Operation(summary = "전체 유저 목록 조회")
    public ResponseEntity<ApiResponse<List<AdminUserResponse>>> getUsers(HttpServletRequest request) {
        checkAdmin(request);
        return ResponseEntity.ok(ApiResponse.ok(adminService.getUsers()));
    }

    @PostMapping("/devotions")
    @Operation(summary = "다수 유저에게 디보션 일괄 생성")
    public ResponseEntity<ApiResponse<BulkDevotionResult>> bulkCreate(
            @Valid @RequestBody BulkDevotionRequest bulkRequest,
            HttpServletRequest request) {
        checkAdmin(request);
        BulkDevotionResult result = adminService.bulkCreate(bulkRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(result));
    }

    private void checkAdmin(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        if (!adminService.isAdmin(userId)) {
            throw new UnauthorizedException("관리자 권한이 필요합니다");
        }
    }
}

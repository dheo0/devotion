package com.example.todoapp.domain.admin.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

public record BulkDevotionRequest(
        @NotBlank(message = "날짜는 필수입니다") String date,
        String bibleVerse,
        @NotEmpty(message = "유저를 1명 이상 선택해야 합니다") List<String> userIds
) {}

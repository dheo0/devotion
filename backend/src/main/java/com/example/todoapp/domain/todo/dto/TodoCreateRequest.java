package com.example.todoapp.domain.todo.dto;

import jakarta.validation.constraints.NotBlank;

public record TodoCreateRequest(
        @NotBlank(message = "날짜는 필수입니다")
        String date,
        String title,
        String bibleVerse,
        String summary,
        String givenWord,
        String aboutGod,
        String aboutMe,
        String actionItems
) {}

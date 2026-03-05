package com.example.todoapp.domain.todo.dto;

public record TodoUpdateRequest(
        String date,
        String title,
        String bibleVerse,
        String summary,
        String givenWord,
        String aboutGod,
        String aboutMe,
        String actionItems
) {}

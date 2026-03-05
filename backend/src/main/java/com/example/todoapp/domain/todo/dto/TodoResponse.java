package com.example.todoapp.domain.todo.dto;

import com.example.todoapp.domain.todo.entity.Todo;

public record TodoResponse(
        String id,
        String userId,
        String date,
        String title,
        String bibleVerse,
        String summary,
        String givenWord,
        String aboutGod,
        String aboutMe,
        String actionItems,
        String createdAt,
        String updatedAt
) {
    public static TodoResponse from(Todo todo) {
        return new TodoResponse(
                todo.id(),
                todo.userId(),
                todo.date(),
                todo.title(),
                todo.bibleVerse(),
                todo.summary(),
                todo.givenWord(),
                todo.aboutGod(),
                todo.aboutMe(),
                todo.actionItems(),
                todo.createdAt(),
                todo.updatedAt()
        );
    }
}

package com.example.todoapp.domain.todo.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

public record Todo(
        String id,
        @JsonProperty("user_id") String userId,
        String date,
        String title,
        @JsonProperty("bible_verse") String bibleVerse,
        String summary,
        @JsonProperty("given_word") String givenWord,
        @JsonProperty("about_god") String aboutGod,
        @JsonProperty("about_me") String aboutMe,
        @JsonProperty("action_items") String actionItems,
        @JsonProperty("created_at") String createdAt,
        @JsonProperty("updated_at") String updatedAt
) {}

package com.example.todoapp.domain.admin.dto;

import java.util.List;

public record BulkDevotionResult(
        int created,
        int skipped,
        List<String> skippedUserIds
) {}

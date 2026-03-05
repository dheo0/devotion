package com.example.todoapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.example.todoapp.global.config.AdminProperties;
import com.example.todoapp.global.config.SupabaseProperties;

@SpringBootApplication
@EnableConfigurationProperties({ SupabaseProperties.class, AdminProperties.class })
public class TodoAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(TodoAppApplication.class, args);
    }
}

package com.app_turiapp.data.model

data class RegisterRequest(
    val username: String,
    val email: String,
    val password: String,
    val first_name: String,
    val last_name: String,
    val phone: String,
    val avatar_url: String = "https://example.com/avatar.jpg",
    val birth_date: String,
    val role: String = "user"
)

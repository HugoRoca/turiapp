package com.app_turiapp.data.model

data class LoginResponse(
    val token: String,
    val user: User
)

data class User(
    val id: String,
    val email: String,
    val name: String? = null
)

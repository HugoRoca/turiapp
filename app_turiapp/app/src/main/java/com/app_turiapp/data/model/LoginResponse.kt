package com.app_turiapp.data.model

data class LoginResponse(
    val success: Boolean,
    val data: LoginData,
    val message: String
)

data class LoginData(
    val success: Boolean,
    val token: String,
    val user: User,
    val expiresIn: String
)

data class User(
    val id: Int? = null,
    val username: String? = null,
    val email: String? = null,
    val first_name: String? = null,
    val last_name: String? = null,
    val phone: String? = null,
    val avatar_url: String? = null,
    val birth_date: String? = null,
    val is_verified: Int? = null,
    val is_active: Int? = null,
    val role: String? = null,
    val created_at: String? = null,
    val updated_at: String? = null,
    val last_login: String? = null
)

package com.app_turiapp.data.model

data class EmailValidationResponse(
    val success: Boolean,
    val data: UserData?,
    val message: String
)

data class UserData(
    val id: Int,
    val username: String,
    val email: String,
    val password_hash: String,
    val first_name: String,
    val last_name: String,
    val phone: String,
    val avatar_url: String?,
    val birth_date: String?,
    val is_verified: Int,
    val is_active: Int,
    val role: String,
    val created_at: String,
    val updated_at: String,
    val last_login: String?
)

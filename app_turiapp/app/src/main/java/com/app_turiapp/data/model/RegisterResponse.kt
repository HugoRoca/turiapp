package com.app_turiapp.data.model

data class RegisterResponse(
    val success: Boolean,
    val data: RegisterData,
    val message: String
)

data class RegisterData(
    val success: Boolean,
    val token: String,
    val user: User,
    val expiresIn: String
)

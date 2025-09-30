package com.app_turiapp.data.api

import com.app_turiapp.data.model.EmailValidationResponse
import com.app_turiapp.data.model.LoginRequest
import com.app_turiapp.data.model.LoginResponse
import com.app_turiapp.data.model.RegisterRequest
import com.app_turiapp.data.model.RegisterResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Query

interface AuthApiService {
    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>
    
    @POST("api/auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<RegisterResponse>
    
    @GET("api/users/email")
    suspend fun validateEmail(@Query("email") email: String): Response<EmailValidationResponse>
}

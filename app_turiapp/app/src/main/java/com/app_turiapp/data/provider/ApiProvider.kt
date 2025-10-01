package com.app_turiapp.data.provider

import android.content.Context
import android.content.SharedPreferences
import com.app_turiapp.data.api.AuthApiService
import com.app_turiapp.data.model.LoginRequest
import com.app_turiapp.data.model.LoginResponse
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

class ApiProvider(private val context: Context) {
    
    companion object {
        private const val BASE_URL = "http://192.168.0.25:3000/" // Cambia esta IP por la de tu equipo
        private const val PREFS_NAME = "turiapp_prefs"
        private const val TOKEN_KEY = "auth_token"
        private const val USER_FIRST_NAME_KEY = "user_first_name"
        private const val USER_LAST_NAME_KEY = "user_last_name"
        private const val USER_USERNAME_KEY = "user_username"
    }
    
    private val sharedPreferences: SharedPreferences = 
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    
    private val authInterceptor = Interceptor { chain ->
        val token = getToken()
        val request = if (token != null) {
            chain.request().newBuilder()
                .addHeader("Authorization", "Bearer $token")
                .build()
        } else {
            chain.request()
        }
        chain.proceed(request)
    }
    
    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }
    
    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(authInterceptor)
        .addInterceptor(loggingInterceptor)
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()
    
    private val retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .client(okHttpClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
    
    val authApiService: AuthApiService = retrofit.create(AuthApiService::class.java)
    
    // Token management
    fun saveToken(token: String) {
        sharedPreferences.edit().putString(TOKEN_KEY, token).apply()
    }
    
    fun getToken(): String? {
        return sharedPreferences.getString(TOKEN_KEY, null)
    }
    
    fun clearToken() {
        sharedPreferences.edit().remove(TOKEN_KEY).apply()
    }
    
    fun isLoggedIn(): Boolean {
        return getToken() != null
    }
    
    fun saveUserInfo(firstName: String?, lastName: String?, username: String?) {
        val editor = sharedPreferences.edit()
        editor.putString(USER_FIRST_NAME_KEY, firstName)
        editor.putString(USER_LAST_NAME_KEY, lastName)
        editor.putString(USER_USERNAME_KEY, username)
        editor.apply()
    }
    
    fun getUserFirstName(): String? {
        return sharedPreferences.getString(USER_FIRST_NAME_KEY, null)
    }
    
    fun getUserLastName(): String? {
        return sharedPreferences.getString(USER_LAST_NAME_KEY, null)
    }
    
    fun getUsername(): String? {
        return sharedPreferences.getString(USER_USERNAME_KEY, null)
    }
    
    fun getDisplayName(): String {
        val firstName = getUserFirstName()
        val lastName = getUserLastName()
        val username = getUsername()
        
        return when {
            !firstName.isNullOrEmpty() && !lastName.isNullOrEmpty() -> "$firstName $lastName"
            !firstName.isNullOrEmpty() -> firstName
            !username.isNullOrEmpty() -> username
            else -> "Usuario"
        }
    }
}

package com.app_turiapp

import android.content.Intent
import android.os.Bundle
import android.widget.EditText
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.lifecycle.lifecycleScope
import com.app_turiapp.data.model.LoginRequest
import com.app_turiapp.data.provider.ApiProvider
import kotlinx.coroutines.launch

class LoginActivity : AppCompatActivity() {
    
    private lateinit var emailInput: EditText
    private lateinit var passwordInput: EditText
    private lateinit var loginButton: LinearLayout
    private lateinit var backButton: ImageView
    private lateinit var apiProvider: ApiProvider
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_login)
        
        // Configurar insets del sistema
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }
        
        // Inicializar provider
        apiProvider = ApiProvider(this)
        
        // Inicializar vistas
        initializeViews()
        
        // Configurar listeners
        setupClickListeners()
    }
    
    private fun initializeViews() {
        emailInput = findViewById(R.id.email_input)
        passwordInput = findViewById(R.id.password_input)
        loginButton = findViewById(R.id.login_button)
        backButton = findViewById(R.id.back_button)
    }
    
    private fun setupClickListeners() {
        // Botón de login
        loginButton.setOnClickListener {
            val email = emailInput.text.toString().trim()
            val password = passwordInput.text.toString().trim()
            
            if (isValidEmail(email) && password.isNotEmpty()) {
                performLogin(email, password)
            } else {
                showToast("Por favor, completa todos los campos correctamente")
            }
        }
        
        // Botón de regreso
        backButton.setOnClickListener {
            finish() // Regresa a la pantalla anterior
        }
    }
    
    private fun isValidEmail(email: String): Boolean {
        return android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()
    }
    
    private fun performLogin(email: String, password: String) {
        lifecycleScope.launch {
            try {
                showToast("Iniciando sesión...")
                
                val loginRequest = LoginRequest(
                    identifier = email,
                    password = password
                )
                
                val response = apiProvider.authApiService.login(loginRequest)
                
                if (response.isSuccessful) {
                    val loginResponse = response.body()
                    if (loginResponse != null) {
                        // Guardar token
                        apiProvider.saveToken(loginResponse.token)
                        
                        showToast("¡Login exitoso! Bienvenido ${loginResponse.user.name ?: loginResponse.user.email}")
                        
                        // Aquí podrías navegar a la pantalla principal
                        // val intent = Intent(this@LoginActivity, MainActivity::class.java)
                        // startActivity(intent)
                        // finish()
                        
                    } else {
                        showToast("Error: Respuesta vacía del servidor")
                    }
                } else {
                    when (response.code()) {
                        401 -> showToast("Credenciales incorrectas")
                        400 -> showToast("Datos de entrada inválidos")
                        500 -> showToast("Error del servidor")
                        else -> showToast("Error de conexión: ${response.code()}")
                    }
                }
                
            } catch (e: Exception) {
                showToast("Error de conexión: ${e.message}")
            }
        }
    }
    
    private fun showToast(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }
}

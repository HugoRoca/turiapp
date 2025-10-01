package com.app_turiapp

import android.app.ProgressDialog
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
import com.app_turiapp.data.model.User
import com.app_turiapp.data.provider.ApiProvider
import kotlinx.coroutines.launch
import retrofit2.Response

class LoginActivity : AppCompatActivity() {
    
    private lateinit var emailInput: EditText
    private lateinit var passwordInput: EditText
    private lateinit var loginButton: LinearLayout
    private lateinit var backButton: ImageView
    private lateinit var apiProvider: ApiProvider
    private var progressDialog: ProgressDialog? = null
    
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
        
        // Pre-cargar email si viene del intent
        preloadEmailFromIntent()
        
        // Configurar listeners
        setupClickListeners()
    }
    
    private fun initializeViews() {
        emailInput = findViewById(R.id.email_input)
        passwordInput = findViewById(R.id.password_input)
        loginButton = findViewById(R.id.login_button)
        backButton = findViewById(R.id.back_button)
    }
    
    private fun preloadEmailFromIntent() {
        val emailFromIntent = intent.getStringExtra("email")
        if (!emailFromIntent.isNullOrEmpty()) {
            emailInput.setText(emailFromIntent)
            // En login no bloqueamos el email, solo lo pre-cargamos
            // El usuario puede cambiarlo si quiere
        }
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
                // Mostrar ProgressDialog
                showProgressDialog("Iniciando sesión...")
                
                val loginRequest = LoginRequest(
                    identifier = email,
                    password = password
                )
                
                val response = apiProvider.authApiService.login(loginRequest)
                
                if (response.isSuccessful) {
                    val loginResponse = response.body()
                    if (loginResponse != null && loginResponse.success) {
                        // Guardar token e información del usuario
                        apiProvider.saveToken(loginResponse.data.token)
                        val user = loginResponse.data.user
                        apiProvider.saveUserInfo(
                            firstName = user?.first_name,
                            lastName = user?.last_name,
                            username = user?.username
                        )
                        val welcomeMessage = if (user?.first_name != null && user.last_name != null) {
                            "¡${loginResponse.message}! Bienvenido ${user.first_name} ${user.last_name}"
                        } else if (user?.username != null) {
                            "¡${loginResponse.message}! Bienvenido ${user.username}"
                        } else {
                            "¡${loginResponse.message}!"
                        }
                        showToast(welcomeMessage)
                        
                        // Aquí podrías navegar a la pantalla principal
                        // val intent = Intent(this@LoginActivity, MainActivity::class.java)
                        // startActivity(intent)
                        // finish()
                        
                    } else {
                        showToast("Error: ${loginResponse?.message ?: "Respuesta inválida del servidor"}")
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
            } finally {
                // Ocultar ProgressDialog
                hideProgressDialog()
            }
        }
    }
    
    private fun showProgressDialog(message: String) {
        progressDialog = ProgressDialog(this).apply {
            setMessage(message)
            setCancelable(false)
            setCanceledOnTouchOutside(false)
            show()
        }
    }
    
    private fun hideProgressDialog() {
        progressDialog?.dismiss()
        progressDialog = null
    }
    
    private fun showToast(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }
    
    override fun onDestroy() {
        super.onDestroy()
        // Asegurar que el ProgressDialog se cierre si la actividad se destruye
        hideProgressDialog()
    }
}

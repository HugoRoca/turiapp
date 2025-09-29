package com.app_turiapp

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class MainActivity : AppCompatActivity() {
    
    private lateinit var emailInput: EditText
    private lateinit var registerButton: LinearLayout
    private lateinit var googleButton: LinearLayout
    private lateinit var facebookButton: LinearLayout
    private lateinit var icloudButton: LinearLayout
    private lateinit var loginLink: TextView
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)
        
        // Configurar insets del sistema
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }
        
        // Inicializar vistas
        initializeViews()
        
        // Configurar listeners
        setupClickListeners()
    }
    
    private fun initializeViews() {
        emailInput = findViewById(R.id.email_input)
        registerButton = findViewById(R.id.register_button)
        googleButton = findViewById(R.id.google_button)
        facebookButton = findViewById(R.id.facebook_button)
        icloudButton = findViewById(R.id.icloud_button)
        loginLink = findViewById(R.id.login_link)
    }
    
    private fun setupClickListeners() {
        // Botón de registro con email
        registerButton.setOnClickListener {
            val email = emailInput.text.toString().trim()
            if (isValidEmail(email)) {
                registerWithEmail(email)
            } else {
                showToast("Por favor, ingresa un email válido")
            }
        }
        
        // Botón de registro con Google
        googleButton.setOnClickListener {
            registerWithGoogle()
        }
        
        // Botón de registro con Facebook
        facebookButton.setOnClickListener {
            registerWithFacebook()
        }
        
        // Botón de registro con iCloud
        icloudButton.setOnClickListener {
            registerWithiCloud()
        }
        
        // Enlace para iniciar sesión
        loginLink.setOnClickListener {
            showToast("Funcionalidad de login próximamente")
        }
    }
    
    private fun isValidEmail(email: String): Boolean {
        return android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()
    }
    
    private fun registerWithEmail(email: String) {
        showToast("Registro con email: $email")
        // Aquí implementarías la lógica de registro con email
    }
    
    private fun registerWithGoogle() {
        showToast("Registro con Google")
        // Aquí implementarías la integración con Google Sign-In
    }
    
    private fun registerWithFacebook() {
        showToast("Registro con Facebook")
        // Aquí implementarías la integración con Facebook Login
    }
    
    private fun registerWithiCloud() {
        showToast("Registro con iCloud")
        // Aquí implementarías la integración con Apple Sign-In
    }
    
    private fun showToast(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }
}
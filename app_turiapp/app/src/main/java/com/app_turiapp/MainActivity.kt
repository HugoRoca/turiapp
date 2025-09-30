package com.app_turiapp

import android.app.ProgressDialog
import android.content.Intent
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
import androidx.lifecycle.lifecycleScope
import com.app_turiapp.data.provider.ApiProvider
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {
    
    private lateinit var emailInput: EditText
    private lateinit var registerButton: LinearLayout
    private lateinit var googleButton: LinearLayout
    private lateinit var facebookButton: LinearLayout
    private lateinit var icloudButton: LinearLayout
    private lateinit var loginLink: TextView
    private lateinit var apiProvider: ApiProvider
    private var progressDialog: ProgressDialog? = null
    
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
        
        // Inicializar API provider
        apiProvider = ApiProvider(this)
        
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
            if (email.isEmpty()) {
                showToast("Por favor ingresa tu email")
                return@setOnClickListener
            }
            if (!isValidEmail(email)) {
                showToast("Por favor ingresa un email válido")
                return@setOnClickListener
            }
            validateEmailAndProceed(email)
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
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
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
    
    private fun validateEmailAndProceed(email: String) {
        lifecycleScope.launch {
            try {
                // Mostrar ProgressDialog
                showProgressDialog("Validando email...")
                
                val response = apiProvider.authApiService.validateEmail(email)
                
                if (response.isSuccessful) {
                    val emailResponse = response.body()
                    if (emailResponse != null && emailResponse.success && emailResponse.data != null) {
                        // Email existe - mostrar mensaje para que se loguee
                        showToast("Este email ya está registrado. Por favor inicia sesión.")
                        // Opcional: navegar directamente a LoginActivity
                        val intent = Intent(this@MainActivity, LoginActivity::class.java)
                        intent.putExtra("email", email)
                        startActivity(intent)
                    } else {
                        // Email no existe - ir a registro
                        val intent = Intent(this@MainActivity, RegisterActivity::class.java)
                        intent.putExtra("email", email)
                        startActivity(intent)
                    }
                } else {
                    when (response.code()) {
                        404 -> {
                            // Email no encontrado - ir a registro
                            val intent = Intent(this@MainActivity, RegisterActivity::class.java)
                            intent.putExtra("email", email)
                            startActivity(intent)
                        }
                        400 -> showToast("Email inválido")
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
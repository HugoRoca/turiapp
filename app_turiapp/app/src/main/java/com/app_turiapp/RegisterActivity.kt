package com.app_turiapp

import android.app.DatePickerDialog
import android.app.ProgressDialog
import android.content.Intent
import android.os.Bundle
import android.widget.CheckBox
import android.widget.EditText
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.lifecycle.lifecycleScope
import com.app_turiapp.data.model.RegisterRequest
import com.app_turiapp.data.model.User
import com.app_turiapp.data.provider.ApiProvider
import kotlinx.coroutines.launch
import retrofit2.Response
import java.util.Calendar

class RegisterActivity : AppCompatActivity() {
    
    private lateinit var usernameInput: EditText
    private lateinit var emailInput: EditText
    private lateinit var passwordInput: EditText
    private lateinit var firstNameInput: EditText
    private lateinit var lastNameInput: EditText
    private lateinit var dateOfBirthInput: EditText
    private lateinit var phoneNumberInput: EditText
    private lateinit var termsCheckbox: CheckBox
    private lateinit var registerButton: LinearLayout
    private lateinit var backButton: ImageView
    private lateinit var apiProvider: ApiProvider
    private var progressDialog: ProgressDialog? = null
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_register)
        
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
        usernameInput = findViewById(R.id.username_input)
        emailInput = findViewById(R.id.email_input)
        passwordInput = findViewById(R.id.password_input)
        firstNameInput = findViewById(R.id.first_name_input)
        lastNameInput = findViewById(R.id.last_name_input)
        dateOfBirthInput = findViewById(R.id.date_of_birth_input)
        phoneNumberInput = findViewById(R.id.phone_number_input)
        termsCheckbox = findViewById(R.id.terms_checkbox)
        registerButton = findViewById(R.id.register_button)
        backButton = findViewById(R.id.back_button)
    }
    
    private fun preloadEmailFromIntent() {
        val emailFromIntent = intent.getStringExtra("email")
        if (!emailFromIntent.isNullOrEmpty()) {
            emailInput.setText(emailFromIntent)
            emailInput.isEnabled = false
            emailInput.isFocusable = false
            emailInput.alpha = 0.6f // Hacer el campo visualmente deshabilitado
        }
    }
    
    private fun setupClickListeners() {
        // Botón de registro
        registerButton.setOnClickListener {
            if (validateForm()) {
                performRegister()
            }
        }
        
        // Botón de regreso
        backButton.setOnClickListener {
            finish()
        }
        
        // Campo de fecha de nacimiento
        dateOfBirthInput.setOnClickListener {
            showDatePicker()
        }
        
        // Hacer el campo no editable para forzar el uso del DatePicker
        dateOfBirthInput.isFocusable = false
        dateOfBirthInput.isClickable = true
    }
    
    private fun validateForm(): Boolean {
        val username = usernameInput.text.toString().trim()
        val email = emailInput.text.toString().trim()
        val password = passwordInput.text.toString().trim()
        val firstName = firstNameInput.text.toString().trim()
        val lastName = lastNameInput.text.toString().trim()
        val dateOfBirth = dateOfBirthInput.text.toString().trim()
        val phoneNumber = phoneNumberInput.text.toString().trim()
        
        if (username.isEmpty()) {
            showToast("El nombre de usuario es requerido")
            return false
        }
        
        if (email.isEmpty() || !isValidEmail(email)) {
            showToast("Ingresa un email válido")
            return false
        }
        
        if (password.isEmpty() || password.length < 6) {
            showToast("La contraseña debe tener al menos 6 caracteres")
            return false
        }
        
        if (firstName.isEmpty()) {
            showToast("El nombre es requerido")
            return false
        }
        
        if (lastName.isEmpty()) {
            showToast("El apellido es requerido")
            return false
        }
        
        if (dateOfBirth.isEmpty()) {
            showToast("La fecha de nacimiento es requerida")
            return false
        }
        
        if (phoneNumber.isEmpty()) {
            showToast("El número de celular es requerido")
            return false
        }
        
        if (!termsCheckbox.isChecked) {
            showToast("Debes aceptar los términos y condiciones")
            return false
        }
        
        return true
    }
    
    private fun isValidEmail(email: String): Boolean {
        return android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()
    }
    
    private fun performRegister() {
        lifecycleScope.launch {
            try {
                // Mostrar ProgressDialog
                showProgressDialog("Registrando usuario...")
                
                val registerRequest = RegisterRequest(
                    username = usernameInput.text.toString().trim(),
                    email = emailInput.text.toString().trim(),
                    password = passwordInput.text.toString().trim(),
                    first_name = firstNameInput.text.toString().trim(),
                    last_name = lastNameInput.text.toString().trim(),
                    phone = phoneNumberInput.text.toString().trim(),
                    birth_date = formatDateForAPI(dateOfBirthInput.text.toString().trim())
                )
                
                val response = apiProvider.authApiService.register(registerRequest)
                
                if (response.isSuccessful) {
                    val registerResponse = response.body()
                    if (registerResponse != null && registerResponse.success) {
                        // Guardar token
                        apiProvider.saveToken(registerResponse.data.token)
                        
                        val user = registerResponse.data.user
                        val welcomeMessage = if (user?.first_name != null && user.last_name != null) {
                            "¡${registerResponse.message}! Bienvenido ${user.first_name} ${user.last_name}"
                        } else if (user?.username != null) {
                            "¡${registerResponse.message}! Bienvenido ${user.username}"
                        } else {
                            "¡${registerResponse.message}!"
                        }
                        showToast(welcomeMessage)
                        
                        // Navegar a la primera pantalla de bienvenida
                        val intent = Intent(this@RegisterActivity, WelcomeActivity1::class.java)
                        startActivity(intent)
                        finish()
                        
                    } else {
                        showToast("Error: ${registerResponse?.message ?: "Respuesta inválida del servidor"}")
                    }
                } else {
                    when (response.code()) {
                        400 -> showToast("Datos de entrada inválidos")
                        409 -> showToast("El usuario ya existe")
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
    
    private fun formatDateForAPI(dateString: String): String {
        // Convertir de DD/MM/YYYY a YYYY-MM-DD
        return try {
            val parts = dateString.split("/")
            if (parts.size == 3) {
                val day = parts[0].padStart(2, '0')
                val month = parts[1].padStart(2, '0')
                val year = parts[2]
                "$year-$month-$day"
            } else {
                dateString // Retornar tal como está si no se puede parsear
            }
        } catch (e: Exception) {
            dateString // Retornar tal como está en caso de error
        }
    }
    
    private fun showDatePicker() {
        val calendar = Calendar.getInstance()
        val year = calendar.get(Calendar.YEAR)
        val month = calendar.get(Calendar.MONTH)
        val day = calendar.get(Calendar.DAY_OF_MONTH)
        
        val datePickerDialog = DatePickerDialog(
            this,
            { _, selectedYear, selectedMonth, selectedDay ->
                // Formatear la fecha como DD/MM/YYYY
                val formattedDate = String.format("%02d/%02d/%04d", selectedDay, selectedMonth + 1, selectedYear)
                dateOfBirthInput.setText(formattedDate)
            },
            year - 18, // Establecer edad por defecto a 18 años
            month,
            day
        )
        
        // Establecer fecha máxima (hoy) y mínima (100 años atrás)
        val maxDate = Calendar.getInstance()
        val minDate = Calendar.getInstance()
        minDate.set(Calendar.YEAR, year - 100)
        
        datePickerDialog.datePicker.maxDate = maxDate.timeInMillis
        datePickerDialog.datePicker.minDate = minDate.timeInMillis
        
        datePickerDialog.show()
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

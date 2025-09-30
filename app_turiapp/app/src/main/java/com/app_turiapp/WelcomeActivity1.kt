package com.app_turiapp

import android.content.Intent
import android.os.Bundle
import android.widget.LinearLayout
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class WelcomeActivity1 : AppCompatActivity() {
    
    private lateinit var nextButton: LinearLayout
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_welcome_1)
        
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
        nextButton = findViewById(R.id.next_button)
    }
    
    private fun setupClickListeners() {
        nextButton.setOnClickListener {
            val intent = Intent(this, WelcomeActivity2::class.java)
            startActivity(intent)
        }
    }
}

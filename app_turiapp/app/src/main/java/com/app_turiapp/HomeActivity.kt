package com.app_turiapp

import android.app.ProgressDialog
import android.os.Bundle
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.app_turiapp.data.model.Place
import com.app_turiapp.data.provider.ApiProvider
import kotlinx.coroutines.launch
import retrofit2.Response

class HomeActivity : AppCompatActivity() {
    
    private lateinit var welcomeText: TextView
    private lateinit var placesRecyclerView: RecyclerView
    private lateinit var placesAdapter: PlacesAdapter
    private lateinit var apiProvider: ApiProvider
    private var progressDialog: ProgressDialog? = null
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_home)
        
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
        
        // Configurar RecyclerView
        setupRecyclerView()
        
        // Cargar lugares
        loadPlaces()
    }
    
    private fun initializeViews() {
        welcomeText = findViewById(R.id.welcome_text)
        placesRecyclerView = findViewById(R.id.places_recycler_view)
        
        // Configurar mensaje de bienvenida
        val userName = getUserName()
        welcomeText.text = "¡Bienvenido, $userName!"
    }
    
    private fun setupRecyclerView() {
        placesAdapter = PlacesAdapter()
        placesRecyclerView.apply {
            layoutManager = LinearLayoutManager(this@HomeActivity, LinearLayoutManager.HORIZONTAL, false)
            adapter = placesAdapter
            // Asegurar que el RecyclerView mantenga su tamaño
            setHasFixedSize(true)
        }
    }
    
    private fun loadPlaces() {
        lifecycleScope.launch {
            try {
                // Mostrar ProgressDialog
                showProgressDialog("Cargando lugares...")
                
                val response = apiProvider.authApiService.getPlaces(isActive = true, limit = 4)
                
                if (response.isSuccessful) {
                    val placesResponse = response.body()
                    if (placesResponse != null && placesResponse.success) {
                        placesAdapter.updatePlaces(placesResponse.data)
                    } else {
                        showToast("Error al cargar lugares")
                    }
                } else {
                    when (response.code()) {
                        400 -> showToast("Solicitud inválida")
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
    
    private fun getUserName(): String {
        return apiProvider.getDisplayName()
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

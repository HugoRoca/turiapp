package com.app_turiapp

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.app_turiapp.data.model.Place
import com.bumptech.glide.Glide

class PlacesAdapter : RecyclerView.Adapter<PlacesAdapter.PlaceViewHolder>() {
    
    private var places: List<Place> = emptyList()
    
    fun updatePlaces(newPlaces: List<Place>) {
        places = newPlaces
        notifyDataSetChanged()
    }
    
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PlaceViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_place_card, parent, false)
        return PlaceViewHolder(view)
    }
    
    override fun onBindViewHolder(holder: PlaceViewHolder, position: Int) {
        holder.bind(places[position])
    }
    
    override fun getItemCount(): Int = places.size
    
    class PlaceViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val placeImage: ImageView = itemView.findViewById(R.id.place_image)
        private val placeName: TextView = itemView.findViewById(R.id.place_name)
        private val placeLocation: TextView = itemView.findViewById(R.id.place_location)
        private val placeRating: TextView = itemView.findViewById(R.id.place_rating)
        private val placeReviews: TextView = itemView.findViewById(R.id.place_reviews)
        
        fun bind(place: Place) {
            placeName.text = place.name.uppercase()
            placeLocation.text = place.address
            
            // Formatear rating
            val rating = place.average_rating.toFloatOrNull() ?: 0f
            val reviewsCount = place.total_reviews
            
            placeRating.text = String.format("%.1f", rating)
            placeReviews.text = "(${formatReviewCount(reviewsCount)})"
            
            // Cargar imagen con Glide
            if (place.images.isNotEmpty()) {
                Glide.with(itemView.context)
                    .load(place.images[0])
                    .placeholder(R.drawable.placeholder_image)
                    .error(R.drawable.placeholder_image)
                    .into(placeImage)
            } else {
                placeImage.setImageResource(R.drawable.placeholder_image)
            }
        }
        
        private fun formatReviewCount(count: Int): String {
            return when {
                count >= 1000 -> "${count / 1000}.${(count % 1000) / 100}k"
                else -> count.toString()
            }
        }
    }
}

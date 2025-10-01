package com.app_turiapp.data.model

data class PlacesResponse(
    val success: Boolean,
    val data: List<Place>,
    val message: String
)

data class Place(
    val id: Int,
    val name: String,
    val description: String,
    val short_description: String,
    val address: String,
    val latitude: String,
    val longitude: String,
    val phone: String?,
    val email: String?,
    val website: String?,
    val price_range: String,
    val opening_hours: OpeningHours,
    val amenities: List<String>,
    val images: List<String>,
    val is_verified: Int,
    val is_active: Int,
    val is_featured: Int,
    val average_rating: String,
    val total_reviews: Int,
    val total_visits: Int,
    val created_by: Int,
    val created_at: String,
    val updated_at: String
)

data class OpeningHours(
    val monday: String?,
    val tuesday: String?,
    val wednesday: String?,
    val thursday: String?,
    val friday: String?,
    val saturday: String?,
    val sunday: String?
)

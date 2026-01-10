const express = require("express");
const protect = require("../middleware/protect");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

// Cache duration in days
const CACHE_DURATION_DAYS = 3;

/**
 * GET /recommendations
 * Returns cached recommendations if valid, otherwise fetches fresh from ML backend
 */
router.get(
    "/",
    protect,
    asyncHandler(async (req, res) => {
        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }

        // Check if cache is valid (within CACHE_DURATION_DAYS)
        const now = new Date();
        const cacheExpiry = CACHE_DURATION_DAYS * 24 * 60 * 60 * 1000; // Convert days to milliseconds
        const isCacheValid =
            user.recommendationsUpdatedAt &&
            now - user.recommendationsUpdatedAt < cacheExpiry &&
            user.recommendations?.based_on_similar_age_group?.length > 0;

        if (isCacheValid) {
            // Return cached recommendations
            return res.json({
                recommendations: user.recommendations,
                cached: true,
                updatedAt: user.recommendationsUpdatedAt,
            });
        }

        // Cache expired or empty - fetch fresh recommendations from ML backend
        try {
            const mlBackendUrl = process.env.ML_BACKEND_URL || "http://localhost:5001";
            const mlResponse = await fetch(
                `${mlBackendUrl}/recommend_cities?id=${user._id}`
            );

            if (!mlResponse.ok) {
                // If ML backend fails but we have old cache, return it with warning
                if (user.recommendations?.based_on_similar_age_group?.length > 0) {
                    return res.json({
                        recommendations: user.recommendations,
                        cached: true,
                        stale: true,
                        updatedAt: user.recommendationsUpdatedAt,
                        message: "ML backend unavailable, returning stale cache",
                    });
                }
                throw new Error("ML backend unavailable and no cached recommendations");
            }

            const mlData = await mlResponse.json();
            const newRecommendations = mlData.user.recommendations;

            // Update user with new recommendations
            user.recommendations = newRecommendations;
            user.recommendationsUpdatedAt = now;
            await user.save();

            res.json({
                recommendations: newRecommendations,
                cached: false,
                updatedAt: now,
            });
        } catch (error) {
            console.error("Error fetching from ML backend:", error);

            // Fallback to old cache if available
            if (user.recommendations?.based_on_similar_age_group?.length > 0) {
                return res.json({
                    recommendations: user.recommendations,
                    cached: true,
                    stale: true,
                    updatedAt: user.recommendationsUpdatedAt,
                    message: "ML backend error, returning stale cache",
                });
            }

            res.status(503);
            throw new Error("Unable to fetch recommendations");
        }
    })
);

module.exports = router;

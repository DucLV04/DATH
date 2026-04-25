import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, size = 16, color = '#ffbf00' }) => {
    const stars = [];
    const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5 (though we mostly use full stars for display simplicity or full/half if needed. Let's keep it simple full stars for now or verify props)

    // Checking existing implementation in RatingInfo.jsx, it uses full stars count.
    // We will simply render 5 stars, filling them based on rating.

    for (let i = 1; i <= 5; i++) {
        stars.push(
            <Star
                key={i}
                size={size}
                fill={i <= roundedRating ? color : 'none'}
                color={i <= roundedRating ? color : '#ccc'}
                style={{ marginRight: '2px' }}
            />
        );
    }

    return <div style={{ display: 'flex', alignItems: 'center' }}>{stars}</div>;
};

export default StarRating;

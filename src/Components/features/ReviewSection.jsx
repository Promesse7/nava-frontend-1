import React, { useState } from 'react';
import { Star, Bell, Clock, Download, Printer } from 'lucide-react';
import { Button } from '../common';

// ReviewSection Component
const ReviewSection = () => {
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Review submitted:', newReview);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold mb-4">Reviews</h3>
      
      {/* Review Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex items-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-6 h-6 cursor-pointer ${
                star <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              }`}
              onClick={() => setNewReview({ ...newReview, rating: star })}
            />
          ))}
        </div>
        <textarea
          className="w-full p-3 border rounded-lg mb-4"
          placeholder="Write your review..."
          value={newReview.comment}
          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
          rows="4"
        />
        <Button type="submit">Submit Review</Button>
      </form>

      {/* Review List */}
      <div className="space-y-4">
        {[
          { user: 'John D.', rating: 4, comment: 'Great service!', date: '2024-01-10' },
          { user: 'Sarah M.', rating: 5, comment: 'Excellent experience', date: '2024-01-09' }
        ].map((review, index) => (
          <div key={index} className="border-b pb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <span className="font-semibold mr-2">{review.user}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-sm text-gray-500">{review.date}</span>
            </div>
            <p className="text-gray-600">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection ;
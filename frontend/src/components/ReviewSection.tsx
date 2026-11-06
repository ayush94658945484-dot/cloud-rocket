import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, MessageSquarePlus, Sparkles, Check } from 'lucide-react';
import { Review } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const ReviewSection: React.FC = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const fetchReviews = async () => {
    try {
      const res = await api.getReviews();
      if (res.success && res.reviews) {
        setReviews(res.reviews);
      }
    } catch (err) {
      console.warn('Could not fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await api.addReview({
        rating,
        comment,
        user_name: user ? user.name : userName || 'Happy Foodie',
      });
      setSubmitted(true);
      setComment('');
      fetchReviews();
      setTimeout(() => {
        setSubmitted(false);
        setShowReviewForm(false);
      }, 2500);
    } catch (err) {
      console.error('Failed to submit review:', err);
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-t border-slate-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-orange-600 font-extrabold text-xs tracking-widest uppercase bg-orange-100/80 px-3 py-1 rounded-full">
              Verified Foodie Feedback
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
              Loved by 25,000+ Gourmet Connoisseurs
            </h2>
            <p className="text-slate-500 text-sm mt-2 max-w-xl">
              See what our foodies say about our aromatic dum biryanis, slow-simmered gravies, and lightning-fast WhatsApp delivery.
            </p>
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="self-start md:self-auto flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl border border-slate-200 shadow-xs transition-colors cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4 text-orange-600" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Review Submission Form Drawer / Card */}
        {showReviewForm && (
          <div className="mb-12 bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-xl animate-in slide-in-from-top-4 duration-200 max-w-2xl mx-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Share Your Food Experience</h3>
            <p className="text-xs text-slate-500 mb-4">Your honest feedback inspires our master chefs every single day.</p>

            {submitted ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-center text-sm font-bold flex items-center justify-center gap-2">
                <Check className="w-5 h-5 text-emerald-600" />
                <span>Thank you! Your review has been published.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {!user && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="e.g. Divya Nair"
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-6 h-6 ${
                          star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`} />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-600 ml-2">{rating} Star{rating > 1 ? 's' : ''}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Review</label>
                  <textarea
                    required
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about the flavor, temperature, packaging, and delivery speed..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-orange-500"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div 
              key={rev.id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author & Verification */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{rev.user_name}</h4>
                  <span className="text-[10px] text-slate-400">Verified Dine-At-Home Order</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center" title="Verified Customer">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


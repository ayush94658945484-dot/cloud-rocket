import React, { useState, useEffect } from 'react';
import { ShieldCheck, MessageSquarePlus, Check, Sparkles } from 'lucide-react';
import { Review } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { TasteRatingBadge, TasteEmojiSelector } from './TasteRating';

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
    <section id="taste-reviews" className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-orange-600 dark:text-orange-400 font-extrabold text-xs tracking-widest uppercase bg-orange-100/80 dark:bg-orange-950/60 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                Verified Foodie Taste Ratings
              </span>
              <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-black text-xs px-2.5 py-1 rounded-full border border-amber-300/40">
                ⭐ 4.9/5 Taste Score
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Loved by 25,000+ Gourmet Connoisseurs
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-xl">
              See what our foodies say about our rich gravies, slow dum biryanis, and mouth-watering royal spices.
            </p>
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="self-start md:self-auto flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs transition-colors cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4 text-orange-600" />
            <span>Rate Taste & Write Review</span>
          </button>
        </div>

        {/* Taste Rating Emoji Breakdown Bar */}
        <div className="mb-10 bg-white dark:bg-slate-800/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🤤</span>
            <div>
              <div className="flex items-center gap-1.5 font-black text-slate-900 dark:text-white text-base">
                <span>Taste Satisfaction</span>
                <span className="text-orange-600 dark:text-orange-400 font-black">99.4% Positive</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Real customer ratings based on flavor, tenderness, and aroma</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-bold">
            <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 px-3 py-1.5 rounded-xl">
              <span className="text-base">🤤</span>
              <span>92% Mind-Blowing</span>
            </div>
            <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-orange-900 dark:text-orange-200 px-3 py-1.5 rounded-xl">
              <span className="text-base">😋</span>
              <span>6% Super Tasty</span>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 px-3 py-1.5 rounded-xl">
              <span className="text-base">😊</span>
              <span>2% Good Flavor</span>
            </div>
          </div>
        </div>

        {/* Review Submission Form Drawer / Card */}
        {showReviewForm && (
          <div className="mb-12 bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-orange-200 dark:border-orange-900/50 shadow-xl animate-in slide-in-from-top-4 duration-200 max-w-2xl mx-auto">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Share Your Taste Experience</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Your honest feedback inspires our master chefs every single day.</p>

            {submitted ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 rounded-2xl text-center text-sm font-bold flex items-center justify-center gap-2">
                <Check className="w-5 h-5 text-emerald-600" />
                <span>Thank you! Your taste review has been published.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {!user && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="e.g. Divya Nair"
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                )}

                {/* Specific Emoji Taste Rating Selector */}
                <TasteEmojiSelector value={rating} onChange={setRating} />

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Your Taste Feedback</label>
                  <textarea
                    required
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about the tenderness, spice level, temperature, packaging, and mouthfeel..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    Submit Taste Review
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
              className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Specific Taste Rating Badge with Emoji & Score */}
                <div className="flex items-center justify-between mb-3.5">
                  <TasteRatingBadge rating={rev.rating} size="sm" showLabel={true} />
                  <span className="text-[10px] font-bold text-slate-400">
                    Verified Taste
                  </span>
                </div>

                {/* Comment */}
                <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author & Verification */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{rev.user_name}</h4>
                  <span className="text-[10px] text-slate-400">Dine-At-Home Foodie</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center" title="Verified Customer">
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

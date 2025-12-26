"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Play, Bookmark, Share2, Heart, Bell, BellOff, Star, Clock, Calendar,
  User, Clapperboard, Building2, Lock, CreditCard, CheckCircle, Loader2,
  ThumbsUp, Eye, Globe, ChevronDown, ChevronUp, AlertCircle
} from "lucide-react";
import ShareModal from "@/components/ShareModal";
import { MdVerified } from "react-icons/md";
import { BelowPlayerAd, ArticleAd } from "@/components/ads/DetailPageAds";
import Image from "next/image";
import Link from "next/link";
import VideoPlayer from "./VideoPlayer";
import RecommandedMovies from "./RecommandedMovies";
import RelatedForYou from "./RelatedForYou";
import PaymentSuccessAnimation from "./PaymentSuccessAnimation";
import {
  useGetWatchVideoByIdQuery,
  useCheckVideoAccessQuery,
  useCreateVideoPaymentOrderMutation,
  useLazyVerifyVideoPaymentQuery,
  useSubscribeToChannelMutation,
  useUnsubscribeFromChannelMutation,
  useCheckSubscriptionQuery,
  useToggleVideoLikeMutation,
  useCheckLikeStatusQuery,
  useUpdateWatchProgressMutation,
  useGetVideoReviewsQuery,
  useAddVideoReviewMutation,
} from "../../../store/watchVideosApi";
import {
  useAddToWatchlistMutation,
  useRemoveFromWatchlistMutation,
  useCheckWatchlistStatusQuery,
} from "../../../store/watchlistApi";

// Format duration from seconds
const formatDuration = (seconds) => {
  if (!seconds) return "N/A";
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
};

// Format date
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

// Get user's country code (simplified - in production use geolocation API)
const getUserCountry = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userCountry') || 'IN';
  }
  return 'IN';
};

// Get user ID from localStorage
const getUserId = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        return JSON.parse(user)?._id || null;
      } catch {
        return null;
      }
    }
  }
  return null;
};

const WatchMovieDetails = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const videoId = searchParams.get('id');
  
  const [userId, setUserId] = useState(null);
  const [countryCode, setCountryCode] = useState('IN');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [selectedSeason, setSelectedSeason] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const [optimisticLiked, setOptimisticLiked] = useState(false);
  const [optimisticLikeCount, setOptimisticLikeCount] = useState(0);
  const [optimisticSaved, setOptimisticSaved] = useState(false);
  const [optimisticSubscribed, setOptimisticSubscribed] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // Initialize user data and Razorpay SDK
  useEffect(() => {
    setUserId(getUserId());
    setCountryCode(getUserCountry());
    
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Fetch video data - skip if no videoId, pass userId only if available
  const { data: video, isLoading, isError, refetch } = useGetWatchVideoByIdQuery(
    { id: videoId, userId: userId || undefined, countryCode },
    { skip: !videoId }
  );

  // Check video access
  const { data: accessData } = useCheckVideoAccessQuery(
    { videoId, userId },
    { skip: !videoId || !userId }
  );

  // Check subscription status
  const { data: subscriptionData } = useCheckSubscriptionQuery(
    { channelId: video?.channelId?._id, userId },
    { skip: !video?.channelId?._id || !userId }
  );

  // Check like status
  const { data: likeData } = useCheckLikeStatusQuery(
    { videoId, userId },
    { skip: !videoId || !userId }
  );

  // Check watchlist status
  const { data: watchlistData } = useCheckWatchlistStatusQuery(
    { itemType: 'watch-video', itemId: videoId },
    { skip: !videoId || !userId }
  );

  // Fetch reviews
  const { data: reviewsData } = useGetVideoReviewsQuery(
    { videoId, page: 1, limit: 10 },
    { skip: !videoId }
  );

  // Mutations
  const [createPaymentOrder] = useCreateVideoPaymentOrderMutation();
  const [verifyPayment] = useLazyVerifyVideoPaymentQuery();
  const [subscribeToChannel] = useSubscribeToChannelMutation();
  const [unsubscribeFromChannel] = useUnsubscribeFromChannelMutation();
  const [toggleLike] = useToggleVideoLikeMutation();
  const [updateProgress] = useUpdateWatchProgressMutation();
  const [addReview] = useAddVideoReviewMutation();
  const [addToWatchlist] = useAddToWatchlistMutation();
  const [removeFromWatchlist] = useRemoveFromWatchlistMutation();

  const canWatch = video?.isFree || video?.canWatch || accessData?.hasAccess;
  
  // Use optimistic state if server data has loaded, otherwise show server data
  const isSubscribed = subscriptionData !== undefined ? optimisticSubscribed : false;
  const isLiked = likeData !== undefined ? optimisticLiked : false;
  const isSaved = watchlistData !== undefined ? optimisticSaved : false;
  const displayLikeCount = optimisticLikeCount || video?.likeCount || 0;

  // Sync optimistic states with server data
  useEffect(() => {
    if (likeData?.liked !== undefined) {
      setOptimisticLiked(likeData.liked);
    }
  }, [likeData]);

  useEffect(() => {
    if (video?.likeCount !== undefined) {
      setOptimisticLikeCount(video.likeCount);
    }
  }, [video?.likeCount]);

  useEffect(() => {
    if (watchlistData?.inWatchlist !== undefined) {
      setOptimisticSaved(watchlistData.inWatchlist);
    }
  }, [watchlistData]);

  useEffect(() => {
    if (subscriptionData?.isSubscribed !== undefined) {
      setOptimisticSubscribed(subscriptionData.isSubscribed);
    }
  }, [subscriptionData]);

  // Handle payment
  const handlePurchase = async () => {
    if (!userId) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search));
      return;
    }

    if (!window.Razorpay) {
      alert('Payment system is loading. Please try again in a moment.');
      return;
    }

    setPaymentLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const result = await createPaymentOrder({
        videoId,
        orderData: {
          userId,
          purchaseType: 'buy',
          countryCode,
          customerDetails: {
            name: user.name || 'User',
            email: user.email || '',
            phone: user.phone || '',
          },
        }
      }).unwrap();

      if (result.data?.razorpayOrder) {
        initiateRazorpayPayment(result.data.razorpayOrder, user);
      } else {
        alert('Failed to create payment order');
        setPaymentLoading(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment. Please try again.');
      setPaymentLoading(false);
    }
  };

  // Razorpay payment integration
  const initiateRazorpayPayment = async (razorpayOrder, user) => {
    const options = {
      key: razorpayOrder.keyId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: video.title,
      description: `Purchase ${video.title}`,
      order_id: razorpayOrder.orderId,
      prefill: {
        name: user.name || 'User',
        email: user.email || '',
        contact: user.phone || '',
      },
      theme: {
        color: '#ec4899',
      },
      handler: async function (response) {
        // Payment successful - verify on backend
        await handlePaymentVerification({
          orderId: response.razorpay_order_id,
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
        });
      },
      modal: {
        ondismiss: function() {
          setPaymentLoading(false);
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  // Verify payment on backend
  const handlePaymentVerification = async (paymentData) => {
    try {
      const verifyResult = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/watch-videos/payment/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const result = await verifyResult.json();
      
      if (result.success) {
        setShowSuccessAnimation(true);
        refetch();
        setPaymentLoading(false);
      } else {
        alert('Payment verification failed');
        setPaymentLoading(false);
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert('Payment verification failed');
      setPaymentLoading(false);
    }
  };

  // Check payment status on page load
  useEffect(() => {
    const orderId = searchParams.get('order_id');
    if (orderId) {
      verifyPayment(orderId).then((result) => {
        if (result.data?.paymentStatus === 'completed') {
          refetch();
        }
      });
    }
  }, [searchParams, verifyPayment, refetch]);

  // Handle subscription toggle
  const handleSubscriptionToggle = async () => {
    if (!userId) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search));
      return;
    }

    const previousState = optimisticSubscribed;
    setOptimisticSubscribed(!previousState);

    try {
      if (previousState) {
        await unsubscribeFromChannel({ channelId: video.channelId._id, userId }).unwrap();
      } else {
        await subscribeToChannel({ channelId: video.channelId._id, userId }).unwrap();
      }
    } catch (error) {
      setOptimisticSubscribed(previousState);
      console.error('Subscription error:', error);
      if (error?.data?.message) {
        alert(error.data.message);
      }
    }
  };

  // Handle like toggle
  const handleLikeToggle = async () => {
    if (!userId) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search));
      return;
    }

    const previousLiked = optimisticLiked;
    const previousCount = optimisticLikeCount;
    
    setOptimisticLiked(!previousLiked);
    setOptimisticLikeCount(previousLiked ? Math.max(0, previousCount - 1) : previousCount + 1);

    try {
      const result = await toggleLike({ videoId, userId }).unwrap();
      if (result?.data?.likeCount !== undefined) {
        setOptimisticLikeCount(result.data.likeCount);
      }
    } catch (error) {
      setOptimisticLiked(previousLiked);
      setOptimisticLikeCount(previousCount);
      console.error('Like error:', error);
    }
  };

  // Handle save toggle
  const handleSaveToggle = async () => {
    if (!userId) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search));
      return;
    }

    const previousState = optimisticSaved;
    setOptimisticSaved(!previousState);

    try {
      if (previousState) {
        await removeFromWatchlist({ itemType: 'watch-video', itemId: videoId }).unwrap();
      } else {
        await addToWatchlist({ itemType: 'watch-video', itemId: videoId }).unwrap();
      }
    } catch (error) {
      setOptimisticSaved(previousState);
      console.error('Save error:', error);
      if (error?.data?.message) {
        alert(error.data.message);
      }
    }
  };

  // Handle watch progress update
  const handleProgressUpdate = useCallback(async (progressData) => {
    if (!userId) return;
    await updateProgress({
      videoId,
      progressData: { userId, ...progressData }
    });
  }, [videoId, userId, updateProgress]);

  // Handle review submit
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      router.push('/login');
      return;
    }

    try {
      await addReview({
        videoId,
        reviewData: { userId, rating: reviewRating, reviewText }
      });
      setShowReviewForm(false);
      setReviewText('');
    } catch (error) {
      console.error('Review error:', error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
      </section>
    );
  }

  // Error state
  if (isError || !video) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center text-white">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Video Not Found</h1>
        <p className="text-gray-400 mb-4">The video you're looking for doesn't exist.</p>
        <Link href="/watch-movies" className="px-6 py-2 bg-pink-600 rounded-lg hover:bg-pink-700">
          Browse Videos
        </Link>
      </section>
    );
  }

  const channel = video.channelId;

  return (
    <>
      <PaymentSuccessAnimation 
        isOpen={showSuccessAnimation}
        videoTitle={video?.title}
        onClose={() => setShowSuccessAnimation(false)}
      />
      
      <section>
      <div className="max-w-6xl mx-auto">
        <div className="min-h-screen text-white">
          {/* Back Button */}
          <div className="px-4 py-3">
            <Link
              href="/watch-movies"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition"
            >
              ← Back to Videos
            </Link>
          </div>

          {/* Video Player Section */}
          <div className="px-4">
            {canWatch ? (
              <VideoPlayer
                videoUrl={video.videoUrl || video.trailerUrl}
                posterUrl={video.posterUrl || video.thumbnailUrl}
                title={video.title}
                onProgress={handleProgressUpdate}
                canWatch={canWatch}
              />
            ) : (
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <img
                  src={video.posterUrl || video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover filter blur-sm"
                />
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                  <Lock className="w-16 h-16 text-yellow-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Premium Content</h3>
                  <p className="text-gray-300 mb-4 text-center px-4">
                    Purchase this video for {video.userCurrency} {video.userPrice} to start watching
                  </p>
                  <button
                    onClick={handlePurchase}
                    disabled={paymentLoading}
                    className="px-8 py-3 bg-gradient-to-r from-pink-600 to-red-600 rounded-lg font-semibold flex items-center gap-2 hover:from-pink-700 hover:to-red-700 transition disabled:opacity-50"
                  >
                    {paymentLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <CreditCard className="w-5 h-5" />
                    )}
                    Buy Now - {video.userCurrency} {video.userPrice}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Google AdSense - Below Player */}
          <BelowPlayerAd className="px-4 mt-4" />

          {/* Video Info */}
          <div className="px-4 mt-6">
            {/* Title & Meta */}
            <h1 className="text-2xl md:text-3xl font-bold">{video.title}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-gray-400 text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(video.releaseDate)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDuration(video.duration)}
              </span>
              {video.averageRating > 0 && (
                <span className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-4 h-4 fill-yellow-400" />
                  {video.averageRating.toFixed(1)}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {video.viewCount?.toLocaleString()} views
              </span>
              <span className="px-2 py-0.5 bg-gray-700 rounded text-xs">{video.ageRating}</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                video.videoType === 'series' ? 'bg-purple-600' : 'bg-blue-600'
              }`}>
                {video.videoType === 'series' ? '📺 Series' : '🎬 Movie'}
              </span>
              {video.genres?.map((genre, idx) => (
                <span key={idx} className="px-3 py-1 rounded-full bg-white/10 text-xs">
                  {genre}
                </span>
              ))}
              {video.languages?.map((lang, idx) => (
                <span key={idx} className="px-3 py-1 rounded-full bg-white/10 text-xs">
                  {lang}
                </span>
              ))}
              {video.isFree ? (
                <span className="px-3 py-1 rounded-full bg-green-600 text-xs font-medium">
                  ✓ Free
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-600 to-orange-600 text-xs font-medium">
                  💎 Premium
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <button
                onClick={handleLikeToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
                  isLiked 
                    ? 'bg-pink-600 text-white hover:bg-pink-700' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-white' : ''}`} />
                {displayLikeCount}
              </button>
              <button 
                onClick={handleSaveToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
                  isSaved
                    ? 'bg-pink-600 text-white hover:bg-pink-700'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-white' : ''}`} />
                {isSaved ? 'Saved' : 'Save'}
              </button>
              <button 
                onClick={() => setShareOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>

              {/* Share Modal */}
              <ShareModal
                isOpen={shareOpen}
                onClose={() => setShareOpen(false)}
                title={video.title}
                description={video.description || `Watch ${video.title} on Movie Mart`}
                imageUrl={video.posterUrl || video.thumbnailUrl}
                url={typeof window !== "undefined" ? window.location.href : ""}
                contentType="video"
              />
            </div>

            {/* Channel Info */}
            {channel && (
              <div className="flex items-center justify-between mt-6 p-4 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <img
                    src={channel.logoUrl || "/assets/img/default-channel.png"}
                    alt={channel.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold flex items-center gap-1">
                      {channel.name}
                      {channel.isVerified && <MdVerified className="text-blue-500" />}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {channel.subscriberCount?.toLocaleString()} subscribers
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSubscriptionToggle}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium transition ${
                    isSubscribed
                      ? 'bg-gray-600 hover:bg-gray-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {isSubscribed ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                  {isSubscribed ? 'Subscribed' : 'Subscribe'}
                </button>
              </div>
            )}

            {/* Description */}
            <div className="mt-6">
              <div 
                className={`text-gray-300 ${showDescription ? '' : 'line-clamp-3'}`}
              >
                {video.description}
              </div>
              {video.description?.length > 200 && (
                <button
                  onClick={() => setShowDescription(!showDescription)}
                  className="text-pink-400 text-sm mt-2 flex items-center gap-1"
                >
                  {showDescription ? 'Show less' : 'Show more'}
                  {showDescription ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              )}
            </div>

            {/* Crew Details */}
            {(video.director || video.producer) && (
              <div className="mt-6 p-4 bg-white/5 rounded-xl">
                <h2 className="text-lg font-semibold mb-3">Crew Details</h2>
                <div className="space-y-2">
                  {video.director && (
                    <div className="flex items-center gap-3">
                      <Clapperboard className="w-5 h-5 text-blue-400" />
                      <p className="text-gray-300 text-sm">
                        <span className="font-medium text-white">Director:</span> {video.director}
                      </p>
                    </div>
                  )}
                  {video.producer && (
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-pink-500" />
                      <p className="text-gray-300 text-sm">
                        <span className="font-medium text-white">Producer:</span> {video.producer}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Episodes Section (for Series) */}
          {video.videoType === 'series' && video.seasons?.length > 0 && (
            <div className="px-4 mt-8">
              <h2 className="text-xl font-semibold mb-4">Episodes</h2>
              
              {/* Season Selector */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {video.seasons.map((season, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSeason(idx)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                      selectedSeason === idx
                        ? 'bg-pink-600 text-white'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    Season {season.seasonNumber}
                  </button>
                ))}
              </div>

              {/* Episodes List */}
              <div className="space-y-3">
                {video.seasons[selectedSeason]?.episodes?.map((episode, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition cursor-pointer"
                  >
                    <div className="relative w-32 h-20 flex-shrink-0">
                      <img
                        src={episode.thumbnailUrl || video.thumbnailUrl}
                        alt={episode.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                      <span className="absolute bottom-1 right-1 bg-black/80 text-xs px-1 rounded">
                        {formatDuration(episode.duration)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">
                        E{episode.episodeNumber}. {episode.title}
                      </h4>
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {episode.description || "No description available"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cast Section */}
          {video.cast?.length > 0 && (
            <div className="px-4 mt-8">
              <h2 className="text-lg font-semibold mb-3">Cast</h2>
              <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
                {video.cast.map((person, idx) => (
                  <div key={idx} className="w-24 flex-shrink-0 text-center">
                    <img
                      src={person.image || "/assets/img/default-avatar.png"}
                      alt={person.name}
                      className="w-20 h-20 rounded-full object-cover mx-auto"
                    />
                    <p className="mt-2 text-sm font-medium truncate">{person.name}</p>
                    <p className="text-xs text-gray-400 truncate">{person.role || "Actor"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Crew Section */}
          {video.crew?.length > 0 && (
            <div className="px-4 mt-6">
              <h2 className="text-lg font-semibold mb-3">Crew</h2>
              <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
                {video.crew.map((person, idx) => (
                  <div key={idx} className="w-24 flex-shrink-0 text-center">
                    <img
                      src={person.image || "/assets/img/default-avatar.png"}
                      alt={person.name}
                      className="w-20 h-20 rounded-full object-cover mx-auto"
                    />
                    <p className="mt-2 text-sm font-medium truncate">{person.name}</p>
                    <p className="text-xs text-gray-400 truncate">{person.designation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="px-4 mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Reviews ({reviewsData?.meta?.total || 0})</h2>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="text-sm text-pink-400 hover:text-pink-300"
              >
                Write a Review
              </button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="mb-6 p-4 bg-white/5 rounded-xl">
                <div className="mb-4">
                  <label className="block text-sm mb-2">Your Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setReviewRating(num)}
                        className={`w-8 h-8 rounded ${
                          num <= reviewRating ? 'bg-yellow-500' : 'bg-gray-600'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your thoughts about this video..."
                  className="w-full p-3 bg-white/10 rounded-lg text-white placeholder-gray-400 resize-none"
                  rows={3}
                />
                <button
                  type="submit"
                  className="mt-3 px-6 py-2 bg-pink-600 rounded-lg hover:bg-pink-700 transition"
                >
                  Submit Review
                </button>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              {reviewsData?.reviews?.map((review, idx) => (
                <div key={idx} className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={review.userId?.image || "/assets/img/default-avatar.png"}
                      alt={review.userId?.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{review.userId?.name || "Anonymous"}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="flex items-center gap-1 text-yellow-400">
                          <Star className="w-3 h-3 fill-yellow-400" />
                          {review.rating}/10
                        </span>
                        {review.isVerified && (
                          <span className="text-green-400 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Verified Purchase
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300">{review.reviewText}</p>
                </div>
              ))}
              {(!reviewsData?.reviews || reviewsData.reviews.length === 0) && (
                <p className="text-gray-400 text-center py-8">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>

          {/* Google AdSense - In Article */}
          <ArticleAd className="px-4" />

          {/* Recommended Videos / Episodes */}
          <RecommandedMovies 
            currentVideoId={videoId} 
            currentVideo={video}
            currentSeason={selectedSeason + 1}
            currentEpisode={1}
          />

          {/* Related For You Section */}
          <RelatedForYou 
            currentVideoId={videoId}
            currentVideo={video}
          />
        </div>
      </div>
    </section>
    </>
  );
};

export default WatchMovieDetails;

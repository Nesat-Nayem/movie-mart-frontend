"use client";

import { useEffect, useState } from "react";
import { FaCheckCircle, FaPlay } from "react-icons/fa";

const PaymentSuccessAnimation = ({ isOpen, videoTitle, onClose }) => {
  const [fireworks, setFireworks] = useState([]);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      // Show content after brief delay
      setTimeout(() => setShowContent(true), 300);
      
      // Generate fireworks
      const fireworkInterval = setInterval(() => {
        const newFirework = {
          id: Math.random(),
          left: Math.random() * 100,
          delay: Math.random() * 0.5,
        };
        setFireworks(prev => [...prev, newFirework]);
        
        // Remove firework after animation
        setTimeout(() => {
          setFireworks(prev => prev.filter(f => f.id !== newFirework.id));
        }, 2000);
      }, 200);

      // Auto close after 4 seconds
      const autoCloseTimer = setTimeout(() => {
        onClose();
      }, 4000);

      return () => {
        clearInterval(fireworkInterval);
        clearTimeout(autoCloseTimer);
        document.body.style.overflow = 'unset';
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md">
      {/* Fireworks */}
      {fireworks.map((firework) => (
        <div
          key={firework.id}
          className="firework"
          style={{
            left: `${firework.left}%`,
            animationDelay: `${firework.delay}s`,
          }}
        >
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="firework-particle"
              style={{
                transform: `rotate(${i * 45}deg)`,
              }}
            />
          ))}
        </div>
      ))}

      {/* Success Content */}
      <div
        className={`relative z-10 text-center transition-all duration-500 ${
          showContent ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`}
      >
        {/* Success Icon with Pulse */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 rounded-full blur-3xl animate-ping opacity-75"></div>
            <div className="relative bg-gradient-to-br from-green-400 to-green-600 rounded-full p-8 shadow-2xl animate-bounce-slow">
              <FaCheckCircle className="text-white text-7xl" />
            </div>
          </div>
        </div>

        {/* Success Text */}
        <div className="space-y-4 animate-fade-in-up">
          <h1 className="text-5xl font-bold text-white mb-2 animate-text-glow">
            Payment Successful! 🎉
          </h1>
          <p className="text-2xl text-green-400 font-semibold">
            Enjoy Your Video!
          </p>
          <p className="text-gray-300 text-lg max-w-md mx-auto">
            {videoTitle}
          </p>
          
          {/* Play Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={onClose}
              className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-bold text-lg text-white shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 hover:scale-110 flex items-center gap-3"
            >
              <FaPlay className="group-hover:scale-125 transition-transform" />
              Start Watching Now
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse"></div>
            </button>
          </div>
        </div>

        {/* Confetti Emojis */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="confetti-emoji"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {['🎉', '🎊', '✨', '🌟', '💫', '🎆'][Math.floor(Math.random() * 6)]}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes firework-burst {
          0% {
            opacity: 1;
            transform: translateY(0) scale(0);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(-150px) scale(1);
          }
        }

        @keyframes particle-burst {
          0% {
            height: 0;
            opacity: 1;
          }
          100% {
            height: 100px;
            opacity: 0;
          }
        }

        @keyframes confetti-fall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes text-glow {
          0%, 100% {
            text-shadow: 0 0 20px rgba(34, 197, 94, 0.5),
                         0 0 40px rgba(34, 197, 94, 0.3);
          }
          50% {
            text-shadow: 0 0 30px rgba(34, 197, 94, 0.8),
                         0 0 60px rgba(34, 197, 94, 0.5),
                         0 0 80px rgba(34, 197, 94, 0.3);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .firework {
          position: absolute;
          top: 60%;
          width: 4px;
          height: 4px;
          animation: firework-burst 1.5s ease-out forwards;
        }

        .firework-particle {
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          background: linear-gradient(
            to bottom,
            #fbbf24,
            #f59e0b,
            #ec4899,
            #8b5cf6,
            #3b82f6
          );
          animation: particle-burst 1s ease-out forwards;
        }

        .confetti-emoji {
          position: absolute;
          font-size: 2rem;
          animation: confetti-fall linear forwards;
          pointer-events: none;
        }

        .animate-text-glow {
          animation: text-glow 2s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        /* Shimmer effect on success icon */
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .animate-shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccessAnimation;

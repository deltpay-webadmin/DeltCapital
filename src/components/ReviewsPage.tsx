import { Star, ChevronLeft, ChevronRight, X, Calculator } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface ReviewsPageProps {
  onClose: () => void;
  onCalculatorClick?: () => void;
}

interface Review {
  id: number;
  rating: 5;
  quote: string;
  name: string;
  initials: string;
  businessType: string;
  monthlySavings: number;
  bgColor: string;
}

const reviews: Review[] = [
  {
    id: 1,
    rating: 5,
    quote: "Saved over $5K in the first year. Couldn't be happier.",
    name: "Robert M.",
    initials: "RM",
    businessType: "Auto Shop Owner",
    monthlySavings: 5230,
    bgColor: "#4945ff"
  },
  {
    id: 2,
    rating: 5,
    quote: "Best decision we made for our business this year.",
    name: "Lisa K.",
    initials: "LK",
    businessType: "Spa Owner",
    monthlySavings: 2980,
    bgColor: "#4945ff"
  },
  {
    id: 3,
    rating: 5,
    quote: "Their cash discount program is a game changer.",
    name: "James D.",
    initials: "JD",
    businessType: "Convenience Store",
    monthlySavings: 6740,
    bgColor: "#4945ff"
  },
  {
    id: 4,
    rating: 5,
    quote: "Fast approval and funding made all the difference for my expansion.",
    name: "Maria S.",
    initials: "MS",
    businessType: "Restaurant Owner",
    monthlySavings: 4150,
    bgColor: "#4945ff"
  },
  {
    id: 5,
    rating: 5,
    quote: "The team was professional and transparent throughout the entire process.",
    name: "David L.",
    initials: "DL",
    businessType: "Retail Store",
    monthlySavings: 3820,
    bgColor: "#4945ff"
  },
  {
    id: 6,
    rating: 5,
    quote: "Got funded in 48 hours when my bank said no. Incredible service!",
    name: "Sarah P.",
    initials: "SP",
    businessType: "Salon Owner",
    monthlySavings: 2640,
    bgColor: "#4945ff"
  },
  {
    id: 7,
    rating: 5,
    quote: "Their calculator helped me understand exactly what I'd pay. No hidden fees.",
    name: "Michael T.",
    initials: "MT",
    businessType: "Construction",
    monthlySavings: 7200,
    bgColor: "#4945ff"
  },
  {
    id: 8,
    rating: 5,
    quote: "Applied on Monday, had funds by Wednesday. Saved my inventory order!",
    name: "Jennifer R.",
    initials: "JR",
    businessType: "Boutique Owner",
    monthlySavings: 1890,
    bgColor: "#4945ff"
  }
];

export function ReviewsPage({ onClose, onCalculatorClick }: ReviewsPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, slidesToShow]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => {
      if (prev === 0) {
        return reviews.length - slidesToShow;
      }
      return prev - 1;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      if (prev >= reviews.length - slidesToShow) {
        return 0;
      }
      return prev + 1;
    });
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const totalDots = reviews.length - slidesToShow + 1;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-7xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-12 h-12 bg-white hover:bg-gray-100 rounded-full shadow-2xl flex items-center justify-center z-10 transition-all hover:scale-110"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-16 relative overflow-hidden">
          {/* Gradient Background Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#4945ff]/5 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10">
            {/* Badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 bg-[#4945ff]/10 text-[#4945ff] px-4 py-2 rounded-full text-sm font-medium border border-[#4945ff]/20">
                <Star className="w-4 h-4 fill-[#4945ff]" />
                Trusted by 2,850+ merchants
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-[#041E42] text-center mb-4">
              Real Merchants, Real Savings
            </h1>

            {/* Rating */}
            <div className="flex items-center justify-center gap-2 mb-12">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-[#52606D] text-lg ml-2">4.9/5 from 500+ reviews</span>
            </div>

            {/* Carousel */}
            <div className="relative px-12">
              {/* Previous Button */}
              <button
                onClick={handlePrevious}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-[#041E42]/10 hover:bg-[#041E42]/20 rounded-full flex items-center justify-center transition-all hover:scale-110 backdrop-blur-sm"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6 text-[#041E42]" />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-[#041E42]/10 hover:bg-[#041E42]/20 rounded-full flex items-center justify-center transition-all hover:scale-110 backdrop-blur-sm"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6 text-[#041E42]" />
              </button>

              {/* Slider Container */}
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-out"
                  style={{ 
                    transform: `translateX(-${(currentIndex * 100) / slidesToShow}%)` 
                  }}
                >
                  {reviews.map((review) => (
                    <div 
                      key={review.id} 
                      className="flex-shrink-0 px-3"
                      style={{ width: `${100 / slidesToShow}%` }}
                    >
                      <div className="bg-[#F7F8FC] border border-gray-100 rounded-2xl p-6 h-full">
                        {/* Stars */}
                        <div className="flex gap-1 mb-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>

                        {/* Quote */}
                        <p className="text-[#041E42] text-lg mb-6 min-h-[60px]">
                          "{review.quote}"
                        </p>

                        {/* User Info */}
                        <div className="flex items-center gap-3 mb-4">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm"
                            style={{ backgroundColor: review.bgColor }}
                          >
                            {review.initials}
                          </div>
                          <div>
                            <div className="text-[#041E42] font-semibold">{review.name}</div>
                            <div className="text-[#52606D] text-sm">{review.businessType}</div>
                          </div>
                        </div>

                        {/* Savings Badge */}
                        <div className="bg-[#4945ff] text-white px-4 py-2 rounded-xl flex items-center justify-between">
                          <span className="font-semibold text-sm">Monthly Savings</span>
                          <span className="font-bold text-lg">${review.monthlySavings.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dots Navigation */}
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalDots }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentIndex === index 
                        ? 'bg-[#4945ff] w-6' 
                        : 'bg-[#CBD2D9] hover:bg-[#52606D]'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Calculator CTA */}
            {onCalculatorClick && (
              <div className="mt-12 text-center">
                <p className="text-[#52606D] mb-4 text-lg">
                  Want to see your potential savings? Calculate your costs now.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    setTimeout(() => {
                      onCalculatorClick();
                    }, 100);
                  }}
                  className="bg-[#4945ff] hover:bg-[#3b38d9] text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
                >
                  <Calculator className="w-5 h-5" />
                  Calculate Your Costs
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
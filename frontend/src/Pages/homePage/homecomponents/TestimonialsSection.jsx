import { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";

const TrustedClients = () => {
  const [isVisible, setIsVisible] = useState(false);
  const headingRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (headingRef.current) {
      observer.observe(headingRef.current);
    }

    return () => {
      if (headingRef.current) {
        observer.unobserve(headingRef.current);
      }
    };
  }, []);

  const reviews = [
    {
      id: 1,
      name: "Kshtij Sharma",
      designation: "Business Owner",
      time: "04 June 2024",
      rating: 5,
      avatar: "KS",
      review:
        "I had a fantastic experience with Incentum. The loan application process was straightforward, and their team was incredibly helpful in guiding me through every step. I received my loan approval quickly and at competitive interest rates. The transparency they offer is commendable—no hidden fees or surprises.",
      loanType: "Business Loan",
      amount: "₹25 Lakhs"
    },
    {
      id: 2,
      name: "Armen Sargsyan",
      designation: "Software Engineer",
      time: "04 June 2024",
      rating: 5,
      avatar: "AS",
      review:
        "Incentum made securing a loan stress-free. The agents were professional and responsive, answering all my questions promptly. While the interest rates were slightly higher than expected, the service quality and fast processing made up for it. It&apos;s a trustworthy platform that I&apos;d use again if needed.",
      loanType: "Personal Loan",
      amount: "₹8 Lakhs"
    },
    {
      id: 3,
      name: "Nisha Nair",
      designation: "Marketing Manager",
      time: "15 May 2024",
      rating: 4,
      avatar: "NN",
      review:
        "The process was mostly smooth, and I appreciate the support I received from the team. They answered all my queries patiently and ensured I had all the information I needed. The approval time was slightly longer than expected, but the transparency and professionalism made up for it.",
      loanType: "Home Loan",
      amount: "₹45 Lakhs"
    },
    {
      id: 4,
      name: "Nivaan Bhosole",
      designation: "Entrepreneur",
      time: "10 April 2024",
      rating: 5,
      avatar: "NB",
      review:
        "Exceptional service from start to finish! Incentum made what could have been a stressful process very manageable. I was impressed with the user-friendly application process and the quick responses from their team. The interest rates were competitive, and the terms were explained clearly.",
      loanType: "Vehicle Loan",
      amount: "₹12 Lakhs"
    },
    {
      id: 5,
      name: "Priya Mehta",
      designation: "Doctor",
      time: "28 March 2024",
      rating: 5,
      avatar: "PM",
      review:
        "Outstanding experience! The team at Incentum understood my requirements perfectly and provided tailored solutions. The documentation process was seamless, and I received my loan approval within 48 hours. Highly recommend their services for anyone looking for reliable financial assistance.",
      loanType: "Professional Loan",
      amount: "₹18 Lakhs"
    },
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${
          index < rating ? "text-banking-gold" : "text-banking-silver/30"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="bg-slate-800 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16" ref={headingRef}>
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              What Our <span className="bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">Clients Say</span>
            </h2>
            <p className="font-banking text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Don&apos;t just take our word for it. Here&apos;s what our satisfied customers have to say about their experience with our loan services.
            </p>
          </div>
          
          {/* Stats */}
          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-slate-700/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/30">
              <div className="text-3xl font-bold text-blue-400 mb-2">4.8/5</div>
              <div className="text-gray-200 text-sm">Average Rating</div>
            </div>
            <div className="bg-slate-700/80 backdrop-blur-sm rounded-2xl p-6 border border-yellow-400/30">
              <div className="text-3xl font-bold text-yellow-400 mb-2">1,000+</div>
              <div className="text-gray-200 text-sm">Happy Customers</div>
            </div>
            <div className="bg-slate-700/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
              <div className="text-3xl font-bold text-blue-500 mb-2">98%</div>
              <div className="text-gray-200 text-sm">Satisfaction Rate</div>
            </div>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Swiper
            spaceBetween={30}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            modules={[Autoplay]}
            loop={true}
            slidesPerView={3}
            centeredSlides={true}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 25 },
              1024: { slidesPerView: 3, spaceBetween: 30 },
            }}
          >
            {reviews.map((review, index) => (
              <SwiperSlide key={review.id}>
                <div
                  className={`relative transition-all duration-500 ${
                    activeIndex === index 
                      ? "scale-105 z-10" 
                      : "opacity-80 scale-95"
                  }`}
                >
                  <div className="bg-slate-700/90 backdrop-blur-sm rounded-3xl p-8 border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 group h-full">
                    
                    {/* Quote Icon */}
                    <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                      <svg className="w-12 h-12 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                      </svg>
                    </div>

                    {/* Header */}
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {review.avatar}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-lg">{review.name}</h3>
                        <p className="text-gray-200 text-sm">{review.designation}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                    </div>

                    {/* Review Content */}
                    <div className="mb-6">
                      <p className="text-gray-200 leading-relaxed text-sm line-clamp-4">
                        &ldquo;{review.review}&rdquo;
                      </p>
                    </div>

                    {/* Loan Details */}
                    <div className="flex items-center justify-between pt-4 border-t border-blue-400/30">
                      <div>
                        <div className="text-blue-400 font-semibold text-sm">{review.loanType}</div>
                        <div className="text-gray-300 text-xs">{review.time}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-yellow-400 font-bold text-lg">{review.amount}</div>
                        <div className="text-gray-300 text-xs">Loan Amount</div>
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-400/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-slate-700/80 backdrop-blur-sm rounded-3xl p-8 border border-blue-400/30 max-w-4xl mx-auto">
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to Join Our <span className="text-blue-400">Success Stories?</span>
            </h3>
            <p className="text-gray-200 mb-8 leading-relaxed">
              Experience the same level of service and satisfaction. Start your loan application today and become our next success story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/home-loan-application"
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Start Your Application</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="/contact-us"
                className="bg-transparent border-2 border-blue-400 text-white font-semibold px-8 py-4 rounded-xl hover:bg-blue-400 hover:text-slate-900 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Talk to Expert</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedClients;

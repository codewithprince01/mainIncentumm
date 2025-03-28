import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";

const TrustedClients = () => {
  const [isVisible, setIsVisible] = useState(false);
  const headingRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.8 }
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
      name: "Kshtij ",
      time: "04 June 2024",
      rating: 5,
      review:
        "I had a fantastic experience with incentum, The loan application process was straightforward, and their team was incredibly helpful in guiding me through every step. I received my loan approval quickly and at competitive interest rates. The transparency they offer is commendable—no hidden fees or surprises. I highly recommend their services to anyone looking for reliable financial",
    },
    {
      id: 2,
      name: "Armen Sargsyan",
      time: "04 June 2024",
      rating: 5,
      review:
        "Incentum made securing a loan stress-free. The agents were professional and responsive, answering all my questions promptly. While the interest rates were slightly higher than expected, the service quality and fast processing made up for it. It’s a trustworthy platform that I’d use again if needed best company i ever visit .",
    },
    {
      id: 3,
      name: "Monika Nair",
      time: "15 May 2024",
      rating: 4,
      review:
        "The process was mostly smooth, and I appreciate the support I received from the team. They answered all my queries patiently and ensured I had all the information I needed. The approval time was slightly longer than expected, but the transparency and professionalism made up for it. Overall, a reliable service for loan seekers.",
    },
    {
      id: 4,
      name: "Gourav Bhsole",
      time: "10 April 2024",
      rating: 5,
      review:
        "Exceptional service from start to finish! Incentum made what could have been a stressful process very manageable. I was impressed with the user-friendly application process and the quick responses from their team. The interest rates were competitive, and the terms were explained clearly. Highly recommend this platform for anyone looking for financial assistance.",
    },
  ];

  return (
    <section className="py-10 bg-white">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Heading with Animated Underline */}
        <div className="relative text-center mb-8" ref={headingRef}>
  <div className="inline-block relative">
    <h1 className="text-3xl sm:text-5xl font-bold tracking-wide leading-snug bg-gradient-to-r from-black via-blue-500 to-blue-700 text-transparent bg-clip-text drop-shadow-lg">
      Our Trusted Clients
    </h1>
    {/* Animated Underline */}
    <span
      className={`absolute left-0 bottom-[-8px] h-1 bg-gradient-to-r from-blue-500 to-green-400 rounded-full transition-all duration-1000 ease-in-out ${
        isVisible ? "w-full" : "w-0"
      }`}
    ></span>
  </div>
</div>

        {/* Swiper for Reviews */}
        <Swiper
          spaceBetween={20} // Space between slides
          autoplay={{
            delay: 3000, // 3 seconds per slide
            disableOnInteraction: false,
          }}
          modules={[Autoplay]} // Add Autoplay as a module
          loop={true} // Enable infinite looping
          breakpoints={{
            320: { slidesPerView: 1 }, // 1 slide for small screens
            768: { slidesPerView: 2 }, // 2 slides for tablets and above
          }}
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <div className="border border-gray-200 rounded-lg p-6 shadow-sm bg-gray-50">
                <div className="flex items-center mb-4">
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold">
                      {review.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {review.time}
                    </p>
                    <p className="text-lg sm:text-xl text-yellow-500">
                      {"★".repeat(review.rating)}
                    </p>
                  </div>
                </div>
                <p className="text-sm sm:text-base font-light text-gray-700 leading-relaxed">
                  {review.review}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* See All Reviews Link */}
        {/* <div className="text-center md:text-right mt-6">
          <a href="#" className="text-blue-600 hover:underline">
            See all reviews
          </a>
        </div> */}
      </div>
    </section>
  );
};

export default TrustedClients;
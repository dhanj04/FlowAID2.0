import React, { useRef } from 'react';
import { useIntersectionObserver } from '../hooks';
import Slider from 'react-slick';
import { motion } from 'framer-motion';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar: string;
  company?: string;
}

export default function Testimonials() {
  const { ref: titleRef, isVisible: isTitleVisible } = useIntersectionObserver();
  const { ref: contentRef, isVisible: isContentVisible } = useIntersectionObserver({ threshold: 0.1 });
  const sliderRef = useRef<Slider>(null);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Operations Director',
      company: 'Healthcare Inc.',
      content: 'The website redesign has completely transformed our online presence. We\'ve seen a 40% increase in user engagement and a significant boost in conversions. The attention to detail and responsive design really sets this work apart.',
      avatar: 'https://randomuser.me/api/portraits/women/40.jpg',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'CTO',
      company: 'FinTech Solutions',
      content: "Working with this developer was incredibly smooth. The attention to detail and technical expertise made our complex project a success. I was impressed by how quickly they understood our requirements and delivered exactly what we needed.",
      avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      role: 'Marketing Manager',
      company: 'Retail Brand',
      content: 'The responsive design works flawlessly across all devices. Our mobile conversion rate has doubled since the new website launched. The feedback from our customers has been overwhelmingly positive about the new user experience.',
      avatar: 'https://randomuser.me/api/portraits/women/25.jpg',
    },
    {
      id: 4,
      name: 'David Wilson',
      role: 'Founder & CEO',
      company: 'Startup Innovations',
      content: 'From concept to launch, the entire process was professional and efficient. The final product exceeded our expectations and has helped us establish a strong online presence in a competitive market.',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      id: 5,
      name: 'Jessica Park',
      role: 'Product Manager',
      company: 'Tech Solutions',
      content: 'The custom features developed for our platform perfectly addressed our unique business needs. The code quality and documentation were excellent, making it easy for our internal team to maintain and build upon.',
      avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
    },
  ];

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 6000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const goToNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const goToPrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  return (
    <section id="testimonials" className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          ref={titleRef as React.RefObject<HTMLDivElement>}
          initial={{ opacity: 0, y: -20 }}
          animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 relative inline-block">
            What My Clients Say
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mt-4">
            Feedback from people I've worked with on various projects
          </p>
        </motion.div>

        <div 
          ref={contentRef as React.RefObject<HTMLDivElement>}
          className={`relative mt-16 ${isContentVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}
        >
          <div className="absolute left-0 right-0 top-0 h-40 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/20 dark:to-transparent -z-10 rounded-3xl"></div>
          
          <div className="hidden md:flex absolute left-0 z-10 top-1/2 -translate-y-1/2 -translate-x-4">
            <button 
              onClick={goToPrev} 
              className="bg-white dark:bg-gray-700 p-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Previous testimonial"
            >
              <ChevronLeftIcon className="h-6 w-6 text-gray-800 dark:text-white" />
            </button>
          </div>
          
          <Slider ref={sliderRef} {...sliderSettings} className="mx-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="px-4 py-6">
                <motion.div 
                  whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 h-full flex flex-col transition-all duration-300"
                >
                  <div className="mb-6">
                    <div className="flex mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 italic text-lg leading-relaxed">
                      "{testimonial.content}"
                    </p>
                  </div>
                  <div className="mt-auto flex items-center">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700" 
                    />
                    <div className="ml-4">
                      <h3 className="font-bold text-gray-800 dark:text-white text-lg">
                        {testimonial.name}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {testimonial.role}{testimonial.company && `, ${testimonial.company}`}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>
          
          <div className="hidden md:flex absolute right-0 z-10 top-1/2 -translate-y-1/2 translate-x-4">
            <button 
              onClick={goToNext} 
              className="bg-white dark:bg-gray-700 p-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Next testimonial"
            >
              <ChevronRightIcon className="h-6 w-6 text-gray-800 dark:text-white" />
            </button>
          </div>

          <div className="mt-12 flex justify-center md:hidden">
            <button 
              onClick={goToPrev} 
              className="mx-2 bg-white dark:bg-gray-700 p-2 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Previous testimonial"
            >
              <ChevronLeftIcon className="h-5 w-5 text-gray-800 dark:text-white" />
            </button>
            <button 
              onClick={goToNext} 
              className="mx-2 bg-white dark:bg-gray-700 p-2 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Next testimonial"
            >
              <ChevronRightIcon className="h-5 w-5 text-gray-800 dark:text-white" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
} 
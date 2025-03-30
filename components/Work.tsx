import React, { useRef } from 'react';
import { useIntersectionObserver } from '../hooks';
import Slider from 'react-slick';
import { motion } from 'framer-motion';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  image: string;
  results: string[];
}

export default function Work() {
  const { ref: titleRef, isVisible: isTitleVisible } = useIntersectionObserver();
  const { ref: projectsRef, isVisible: isProjectsVisible } = useIntersectionObserver({ threshold: 0.1 });
  const sliderRef = useRef<Slider>(null);

  const projects: Project[] = [
    {
      id: 1,
      title: 'City General Hospital',
      description: 'Implemented flowAID to optimize emergency department queue management, resulting in significant reduction in patient wait times and improved staff allocation.',
      tags: ['Emergency Department', 'Large Hospital', 'Queue Optimization'],
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      results: ['32% reduction in average wait times', 'Staff satisfaction increased by 45%', '22% increase in patient throughput']
    },
    {
      id: 2,
      title: 'Riverside Medical Center',
      description: 'Deployed flowAID to manage outpatient clinic scheduling, enabling smart prioritization and optimized resource allocation across multiple departments.',
      tags: ['Outpatient Clinic', 'Multi-department', 'Resource Allocation'],
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      results: ['41% improvement in resource utilization', 'Patient satisfaction scores up by 37%', '28% reduction in no-shows']
    },
    {
      id: 3,
      title: 'Central Urgent Care Network',
      description: 'Implemented flowAID across a network of urgent care facilities, enabling load balancing between locations and real-time wait time updates for patients.',
      tags: ['Urgent Care', 'Multi-location', 'Load Balancing'],
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      results: ['25% better distribution of patients between locations', '18 minute average reduction in wait times', '52% increase in positive reviews']
    },
    {
      id: 4,
      title: 'Children\'s Health Specialists',
      description: 'Customized flowAID implementation for pediatric services, creating child-friendly interfaces and specialized triage algorithms for children with different needs.',
      tags: ['Pediatrics', 'Specialized Care', 'Custom Implementation'],
      image: 'https://images.unsplash.com/photo-1581056771107-24247a5b574f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      results: ['35% reduction in children\'s waiting room time', 'Increased parental satisfaction by 49%', 'Staff reported 31% less stress']
    },
    {
      id: 5,
      title: 'Memorial Healthcare System',
      description: 'Enterprise-wide implementation of flowAID across a major healthcare system, integrating with existing EHR systems and providing system-wide analytics.',
      tags: ['Enterprise', 'EHR Integration', 'Analytics Dashboard'],
      image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80',
      results: ['$2.1M annual savings in operational costs', '27% reduction in system-wide wait times', '33% improvement in resource allocation']
    },
    {
      id: 6,
      title: 'Community Health Clinic',
      description: 'Scaled flowAID for resource-constrained community health settings, enabling efficient patient prioritization and maximizing limited staff resources.',
      tags: ['Community Health', 'Limited Resources', 'Cost-Effective'],
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1473&q=80',
      results: ['Serving 29% more patients with same staff', 'Average visit time reduced by 24 minutes', '41% improvement in patient satisfaction']
    },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100 
      } 
    }
  };

  return (
    <section id="work" className="py-24 bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          ref={titleRef as React.RefObject<HTMLDivElement>}
          initial={{ opacity: 0, y: -20 }}
          animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 relative inline-block">
            Case Studies
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mt-4">
            See how flowAID has transformed patient experiences in healthcare facilities
          </p>
        </motion.div>

        <div 
          ref={projectsRef as React.RefObject<HTMLDivElement>}
          className={`relative ${isProjectsVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}
        >
          <button 
            onClick={goToPrev} 
            className="absolute left-0 z-10 top-1/2 -translate-y-1/2 -translate-x-4 bg-white dark:bg-gray-700 p-2 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="h-6 w-6 text-gray-800 dark:text-white" />
          </button>
          
          <Slider ref={sliderRef} {...sliderSettings} className="mx-4">
            {projects.map((project) => (
              <div key={project.id} className="px-4 pb-6 pt-1">
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden h-full transform transition-all duration-300 hover:shadow-2xl"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                      <h3 className="text-xl font-bold text-white p-6">
                        {project.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {project.description}
                    </p>
                    <div className="mb-4">
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Key Results:</h4>
                      <ul className="space-y-1">
                        {project.results.map((result, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            <span className="text-gray-600 dark:text-gray-300 text-sm">{result}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, tagIndex) => (
                        <span 
                          key={tagIndex}
                          className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>
          
          <button 
            onClick={goToNext} 
            className="absolute right-0 z-10 top-1/2 -translate-y-1/2 translate-x-4 bg-white dark:bg-gray-700 p-2 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="h-6 w-6 text-gray-800 dark:text-white" />
          </button>
        </div>
      </div>
    </section>
  );
} 
import React from 'react';
import { useIntersectionObserver } from '../hooks';

export default function Display() {
  const { ref: titleRef, isVisible: isTitleVisible } = useIntersectionObserver();
  const { ref: contentRef, isVisible: isContentVisible } = useIntersectionObserver({ threshold: 0.1 });
  const { ref: imgRef, isVisible: isImgVisible } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section id="display" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div 
          ref={titleRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-16 ${isTitleVisible ? 'animate-fade-in' : 'opacity-0'}`}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            My Design Process
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            I follow a structured approach to ensure each project meets client expectations
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between space-y-12 md:space-y-0 md:space-x-12">
          <div 
            ref={imgRef as React.RefObject<HTMLDivElement>}
            className={`w-full md:w-1/2 ${isImgVisible ? 'animate-slide-right' : 'opacity-0'}`}
          >
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 shadow-lg">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          </div>

          <div 
            ref={contentRef as React.RefObject<HTMLDivElement>}
            className={`w-full md:w-1/2 ${isContentVisible ? 'animate-slide-left' : 'opacity-0'}`}
            style={{ animationDelay: '0.2s' }}
          >
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    Discovery & Research
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Understanding your business goals, target audience, and project requirements.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    Design & Prototyping
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Creating wireframes and interactive prototypes for a visual understanding of the final product.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    Development & Testing
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Building the website with clean, optimized code and rigorous testing for quality assurance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
import { useState, useEffect, useRef, RefObject } from 'react';

interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

interface UseIntersectionObserverReturn {
  ref: RefObject<any>;
  isVisible: boolean;
}

const useIntersectionObserver = (options: IntersectionObserverOptions = {}): UseIntersectionObserverReturn => {
  const { root = null, rootMargin = '0px', threshold = 0 } = options;
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<Element>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { root, rootMargin, threshold }
    );

    const currentElement = ref.current;
    observer.observe(currentElement);

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [root, rootMargin, threshold]);

  return { ref, isVisible };
};

export default useIntersectionObserver;

import { useEffect, useState, useRef, useCallback } from 'react';

interface IntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
  triggerOnce?: boolean;
  skip?: boolean;
  onIntersect?: (entry: IntersectionObserverEntry) => void;
}

// Create a map to store and reuse observers
const observers = new Map<string, IntersectionObserver>();

export default function useIntersectionObserver(
  options: IntersectionObserverOptions = {}
) {
  const { 
    threshold = 0.1, 
    rootMargin = '0px',
    root = null,
    triggerOnce = true,
    skip = false,
    onIntersect
  } = options;
  
  const [isVisible, setIsVisible] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const ref = useRef<HTMLElement | null>(null);
  const callback = useRef(onIntersect);

  // Update callback ref when onIntersect changes
  useEffect(() => {
    callback.current = onIntersect;
  }, [onIntersect]);

  const getObserverKey = useCallback(() => {
    // Create a unique key for this observer configuration
    return `${threshold.toString()}_${rootMargin}_${root?.nodeName || 'null'}`;
  }, [threshold, rootMargin, root]);

  useEffect(() => {
    if (skip || !ref.current) return;

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      setEntry(entry);
      setIsVisible(entry.isIntersecting);
      
      if (entry.isIntersecting) {
        // Call the callback if provided
        if (callback.current) {
          callback.current(entry);
        }
        
        // If triggerOnce is true, unobserve after it becomes visible
        if (triggerOnce && ref.current) {
          const key = getObserverKey();
          const observer = observers.get(key);
          if (observer) {
            observer.unobserve(ref.current);
          }
        }
      }
    };

    const observerKey = getObserverKey();
    let observer = observers.get(observerKey);
    
    if (!observer) {
      observer = new IntersectionObserver(handleIntersect, {
        threshold,
        rootMargin,
        root
      });
      observers.set(observerKey, observer);
    }

    observer.observe(ref.current);

    return () => {
      if (ref.current && observer) {
        observer.unobserve(ref.current);
      }
      
      // Clean up the observer from the map if it's not observing anything
      if (observer && !observer.takeRecords().length) {
        observers.delete(observerKey);
      }
    };
  }, [threshold, rootMargin, root, skip, triggerOnce, getObserverKey]);

  return { ref, isVisible, entry };
} 
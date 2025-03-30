import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ModernButton from './ui/ModernButton';
import ModernCard from './ui/ModernCard';
import ModernBadge from './ui/ModernBadge';
import Link from 'next/link';
import {
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon,
  BeakerIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  SparklesIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';

const ModernHomepage: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  // Handle scroll for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation controls for sections
  const featureControls = useAnimation();
  const statsControls = useAnimation();
  const testimonialsControls = useAnimation();

  // Intersection observers for sections
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [statsRef, statsInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [testimonialsRef, testimonialsInView] = useInView({ threshold: 0.1, triggerOnce: true });

  // Animate sections when they come into view
  useEffect(() => {
    if (featuresInView) {
      featureControls.start('visible');
    }
    if (statsInView) {
      statsControls.start('visible');
    }
    if (testimonialsInView) {
      testimonialsControls.start('visible');
    }
  }, [featuresInView, statsInView, testimonialsInView, featureControls, statsControls, testimonialsControls]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  // Features data
  const features = [
    {
      title: 'AI-Powered Queue Optimization',
      description: 'Our advanced algorithms predict patient flow and optimize resource allocation in real-time.',
      icon: <BoltIcon className="h-6 w-6" />,
      color: 'primary',
    },
    {
      title: 'Reduced Wait Times',
      description: 'Decrease patient wait times by up to 60% with intelligent scheduling and prioritization.',
      icon: <ClockIcon className="h-6 w-6" />,
      color: 'secondary',
    },
    {
      title: 'Resource Allocation',
      description: 'Optimize staff and facility resources based on real-time demand and historical patterns.',
      icon: <UserGroupIcon className="h-6 w-6" />,
      color: 'accent',
    },
    {
      title: 'Predictive Analytics',
      description: 'Forecast patient volume and resource needs with machine learning models.',
      icon: <ChartBarIcon className="h-6 w-6" />,
      color: 'success',
    },
    {
      title: 'Secure & Compliant',
      description: 'HIPAA-compliant platform with enterprise-grade security for patient data protection.',
      icon: <ShieldCheckIcon className="h-6 w-6" />,
      color: 'warning',
    },
    {
      title: 'ML Model Training',
      description: 'Continuously improving algorithms that adapt to your facility's unique patterns.',
      icon: <BeakerIcon className="h-6 w-6" />,
      color: 'danger',
    },
  ];

  // Stats data
  const stats = [
    { label: 'Wait Time Reduction', value: '60%', icon: <ClockIcon className="h-6 w-6" /> },
    { label: 'Efficiency Increase', value: '42%', icon: <BoltIcon className="h-6 w-6" /> },
    { label: 'Patient Satisfaction', value: '94%', icon: <CheckCircleIcon className="h-6 w-6" /> },
    { label: 'Facilities Using flowAID', value: '500+', icon: <BuildingOffice2Icon className="h-6 w-6" /> },
  ];

  // Testimonials data
  const testimonials = [
    {
      quote: "flowAID has transformed our emergency department's efficiency. Wait times are down by 45% and staff morale has improved significantly.",
      author: "Dr. Sarah Johnson",
      role: "Chief of Emergency Medicine, Metro General Hospital",
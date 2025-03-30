import React from 'react';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = 'h-10 w-auto' }: LogoProps) {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="flowAID Logo"
    >
      {/* Hexagon Frame - Green Layers */}
      <path
        d="M60 5L106.7 31.5V84.5L60 111L13.3 84.5V31.5L60 5Z"
        fill="#9AE6B4"
        fillOpacity="0.2"
      />
      <path
        d="M60 16L96.5 36.5V77.5L60 98L23.5 77.5V36.5L60 16Z"
        fill="#68D391"
        fillOpacity="0.4"
      />
      <path
        d="M60 26L89 43V77L60 94L31 77V43L60 26Z"
        fill="#38A169"
        fillOpacity="0.6"
      />
      
      {/* Blue Inner Layer */}
      <path
        d="M60 38L78 48.5V69.5L60 80L42 69.5V48.5L60 38Z"
        fill="#4299E1"
        fillOpacity="0.8"
      />
      
      {/* Flow Lines */}
      <path
        d="M42 48.5L60 59L78 48.5"
        stroke="#3182CE"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M60 59L60 80"
        stroke="#3182CE"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M42 48.5L42 69.5"
        stroke="#3182CE"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M78 48.5L78 69.5"
        stroke="#3182CE"
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Outer Border */}
      <path
        d="M60 5L106.7 31.5V84.5L60 111L13.3 84.5V31.5L60 5Z"
        stroke="#2F855A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
} 
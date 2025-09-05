import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function OxfordLogo({ className = '', size = 'md' }: LogoProps) {
  // Size mappings
  const sizeClasses = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-11 w-11'
  };
  
  return (
    <div className={`${sizeClasses[size]} flex items-center justify-center ${className}`}>
      <svg 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        {/* Minimalist logo based on lmp.vc style */}
        <rect 
          x="4" 
          y="4" 
          width="32" 
          height="32" 
          rx="2"
          className="fill-primary"
        />
        <path 
          d="M10 15 L17 15 M10 20 L17 20 M10 25 L17 25"
          stroke="white" 
          strokeWidth="2" 
          strokeLinecap="round"
        />
        <path 
          d="M23 15 L30 15 M23 20 L30 20 M23 25 L30 25"
          stroke="white" 
          strokeWidth="2" 
          strokeLinecap="round"
        />
        <rect 
          x="19" 
          y="10" 
          width="2" 
          height="20"
          fill="white"
        />
      </svg>
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';

interface ModernAvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'square' | 'rounded';
  status?: 'online' | 'offline' | 'away' | 'busy' | 'none';
  statusPosition?: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left';
  border?: boolean;
  borderColor?: string;
  className?: string;
  animate?: boolean;
  fallback?: React.ReactNode;
  onClick?: () => void;
}

const ModernAvatar: React.FC<ModernAvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  shape = 'circle',
  status = 'none',
  statusPosition = 'bottom-right',
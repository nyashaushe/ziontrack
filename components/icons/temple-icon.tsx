import React from 'react'

interface TempleIconProps {
  className?: string
  size?: number
}

export const TempleIcon: React.FC<TempleIconProps> = ({ 
  className = "", 
  size = 24 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Temple base/foundation */}
      <rect x="2" y="18" width="20" height="4" fill="currentColor" opacity="0.8" />
      
      {/* Left wing */}
      <rect x="2" y="12" width="6" height="6" fill="currentColor" opacity="0.9" />
      <rect x="3" y="13" width="1" height="2" fill="currentColor" opacity="0.6" />
      <rect x="5" y="13" width="1" height="2" fill="currentColor" opacity="0.6" />
      <rect x="7" y="13" width="1" height="2" fill="currentColor" opacity="0.6" />
      
      {/* Right wing */}
      <rect x="16" y="12" width="6" height="6" fill="currentColor" opacity="0.9" />
      <rect x="17" y="13" width="1" height="2" fill="currentColor" opacity="0.6" />
      <rect x="19" y="13" width="1" height="2" fill="currentColor" opacity="0.6" />
      <rect x="21" y="13" width="1" height="2" fill="currentColor" opacity="0.6" />
      
      {/* Central building */}
      <rect x="8" y="10" width="8" height="8" fill="currentColor" />
      
      {/* Central entrance */}
      <rect x="10" y="14" width="4" height="4" fill="currentColor" opacity="0.7" />
      <rect x="11" y="15" width="2" height="3" fill="currentColor" opacity="0.4" />
      
      {/* Central tower base */}
      <rect x="10" y="6" width="4" height="4" fill="currentColor" />
      
      {/* Spire sections */}
      <rect x="11" y="4" width="2" height="2" fill="currentColor" />
      <rect x="11.25" y="2" width="1.5" height="2" fill="currentColor" />
      <rect x="11.5" y="1" width="1" height="1" fill="currentColor" />
      
      {/* Angel Moroni silhouette at top */}
      <circle cx="12" cy="0.5" r="0.5" fill="currentColor" />
      
      {/* Windows on central building */}
      <rect x="9" y="11" width="1" height="1.5" fill="currentColor" opacity="0.5" />
      <rect x="14" y="11" width="1" height="1.5" fill="currentColor" opacity="0.5" />
      
      {/* Decorative elements */}
      <rect x="10" y="9.5" width="4" height="0.5" fill="currentColor" opacity="0.6" />
      <rect x="8" y="9.5" width="8" height="0.5" fill="currentColor" opacity="0.4" />
    </svg>
  )
}

export default TempleIcon

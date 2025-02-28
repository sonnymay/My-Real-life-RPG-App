import React, { useState, useEffect, useRef } from 'react';
import { 
  getCharacterImagePath, 
  DEFAULT_CHARACTER_IMAGE,
  preloadNextJobImage
} from '../utils/characterImages';
import '../styles/CharacterImage.css';

/**
 * Component that displays character image based on job with enhanced features:
 * - Error handling with fallback images
 * - Image transitions/animations
 * - Preloading of next job image
 */
const CharacterImage = ({ 
  job, 
  jobClass,
  level, 
  className = "h-56 max-w-full object-contain mb-16",
  showLevel = false,
  enableAnimation = true
}) => {
  const [imageSrc, setImageSrc] = useState(getCharacterImagePath(job));
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevJobRef = useRef(job);
  
  // Reset image and error state when job changes
  useEffect(() => {
    if (prevJobRef.current !== job) {
      // Start transition
      setIsTransitioning(true);
      
      // Short delay before changing the image
      setTimeout(() => {
        setImageSrc(getCharacterImagePath(job));
        setError(false);
        setIsLoading(true);
      }, 150);
      
      // If we have jobClass info, preload the next job image
      if (jobClass) {
        preloadNextJobImage(job, jobClass);
      }
      
      prevJobRef.current = job;
    }
  }, [job, jobClass]);
  
  // Handle image load completion
  const handleImageLoad = () => {
    setIsLoading(false);
    setIsTransitioning(false);
  };

  const handleImageError = () => {
    console.error(`Failed to load character image for job: ${job}`);
    console.log(`Attempted to load: ${imageSrc}`);
    setError(true);
    setImageSrc(DEFAULT_CHARACTER_IMAGE);
    setIsLoading(false);
    setIsTransitioning(false);
  };

  // Combine the classNames based on state
  const imageClasses = [
    className,
    'character-image',
    isTransitioning ? 'character-image-enter' : '',
    enableAnimation && !isTransitioning ? 'character-float-animation' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className="character-image-container">
      <img
        src={imageSrc}
        alt={job || 'Character'}
        className={imageClasses}
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ 
          opacity: isLoading ? 0 : 1,
          objectFit: 'contain',
          objectPosition: '50% 40%', // Move focus slightly upward to show head
          maxHeight: '100%',
          maxWidth: '100%'
        }}
      />
      
      {error && (
        <div className="character-image-error">
          Image for {job} not found
        </div>
      )}
      
      {showLevel && level && (
        <div className="character-level-indicator">
          LVL {level}
        </div>
      )}
    </div>
  );
};

export default CharacterImage;

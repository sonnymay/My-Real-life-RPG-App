/**
 * Formats job name for image filename
 * @param {string} job - Character job title
 * @returns {string} - Formatted job name for image path
 */
export const formatJobForImagePath = (job) => {
  if (!job) return 'novice';
  return job.toLowerCase().replace(/\s+/g, '-');
};

/**
 * Gets character image path based on job
 * @param {string} job - Character job title
 * @returns {string} - Full image path
 */
export const getCharacterImagePath = (job) => {
  const formattedJob = formatJobForImagePath(job);
  return `/images/characters/${formattedJob}.png`;
};

// Available jobs and their image paths - expanded catalog
export const JOB_IMAGES = {
  // Novice
  novice: '/images/characters/novice.png',
  
  // Swordsman tree
  swordsman: '/images/characters/swordsman.png',
  knight: '/images/characters/knight.png',
  'lord-knight': '/images/characters/lord-knight.png',
  'rune-knight': '/images/characters/rune-knight.png',
  'eternal-knight': '/images/characters/eternal-knight.png',
  
  // Archer tree
  archer: '/images/characters/archer.png',
  hunter: '/images/characters/hunter.png',
  sniper: '/images/characters/sniper.png',
  'falcon-ranger': '/images/characters/falcon-ranger.png',
  'eternal-marksman': '/images/characters/eternal-marksman.png',
  
  // Mage tree
  mage: '/images/characters/mage.png',
  wizard: '/images/characters/wizard.png',
  'high-wizard': '/images/characters/high-wizard.png',
  archmage: '/images/characters/archmage.png',
  'eternal-sorcerer': '/images/characters/eternal-sorcerer.png',
  
  // Thief tree
  thief: '/images/characters/thief.png',
  assassin: '/images/characters/assassin.png',
  'guillotine-cross': '/images/characters/guillotine-cross.png',
  'shadow-reaper': '/images/characters/shadow-reaper.png',
  'eternal-phantom': '/images/characters/eternal-phantom.png',
  
  // Acolyte tree
  acolyte: '/images/characters/acolyte.png',
  priest: '/images/characters/priest.png',
  'high-priest': '/images/characters/high-priest.png',
  'divine-cleric': '/images/characters/divine-cleric.png',
  'eternal-saint': '/images/characters/eternal-saint.png',
  
  // Merchant tree
  merchant: '/images/characters/merchant.png',
  blacksmith: '/images/characters/blacksmith.png',
  whitesmith: '/images/characters/whitesmith.png',
  'titan-forgemaster': '/images/characters/titan-forgemaster.png',
  'eternal-tycoon': '/images/characters/eternal-tycoon.png',
};

// Default fallback image if job image isn't found
export const DEFAULT_CHARACTER_IMAGE = '/images/characters/novice.png';

/**
 * Get next job in the progression based on current job and class
 * @param {string} currentJob - Current character job
 * @param {string} jobClass - Character's class path (Swordsman, Archer, etc)
 * @returns {string|null} - Next job or null if at max level
 */
export const getNextJobInProgression = (currentJob, jobClass) => {
  const jobProgressions = {
    Swordsman: ['novice', 'swordsman', 'knight', 'lord-knight', 'rune-knight', 'eternal-knight'],
    Archer: ['novice', 'archer', 'hunter', 'sniper', 'falcon-ranger', 'eternal-marksman'],
    Mage: ['novice', 'mage', 'wizard', 'high-wizard', 'archmage', 'eternal-sorcerer'],
    Thief: ['novice', 'thief', 'assassin', 'guillotine-cross', 'shadow-reaper', 'eternal-phantom'],
    Acolyte: ['novice', 'acolyte', 'priest', 'high-priest', 'divine-cleric', 'eternal-saint'],
    Merchant: ['novice', 'merchant', 'blacksmith', 'whitesmith', 'titan-forgemaster', 'eternal-tycoon']
  };
  
  const progression = jobProgressions[jobClass] || jobProgressions.Swordsman;
  const formattedCurrentJob = formatJobForImagePath(currentJob);
  const currentIndex = progression.indexOf(formattedCurrentJob);
  
  if (currentIndex >= 0 && currentIndex < progression.length - 1) {
    return progression[currentIndex + 1];
  }
  
  return null;
};

/**
 * Preload images for specified jobs
 * @param {string[]} jobs - Array of job names to preload
 */
export const preloadImages = (jobs) => {
  jobs.forEach(job => {
    const img = new Image();
    img.src = getCharacterImagePath(job);
  });
};

/**
 * Preload the next job image in the progression
 * @param {string} currentJob - Current job
 * @param {string} jobClass - Character class
 */
export const preloadNextJobImage = (currentJob, jobClass) => {
  const nextJob = getNextJobInProgression(currentJob, jobClass);
  if (nextJob) {
    preloadImages([nextJob]);
    console.log(`Preloaded next job image: ${nextJob}`);
  }
};

export const getColorFromScheme = (scheme: string): { primary: string; secondary: string } => {
  // Extract colors from Tailwind-like gradient schemes
  const colorMap: { [key: string]: { primary: string; secondary: string } } = {
    'from-blue-200 to-indigo-400': { primary: '#93C5FD', secondary: '#818CF8' },
    'from-purple-200 to-pink-500': { primary: '#C4B5FD', secondary: '#EC4899' },
    'from-green-200 to-teal-500': { primary: '#86EFAC', secondary: '#14B8A6' },
    'from-yellow-200 to-amber-400': { primary: '#FDE047', secondary: '#FBBF24' },
    'from-pink-200 to-rose-500': { primary: '#FBCFE8', secondary: '#F43F5E' },
    'from-green-200 to-emerald-500': { primary: '#86EFAC', secondary: '#10B981' },
    'from-teal-200 to-cyan-500': { primary: '#5EEAD4', secondary: '#06B6D4' },
    'from-indigo-200 to-blue-500': { primary: '#A5B4FC', secondary: '#3B82F6' },
    'from-purple-200 to-violet-500': { primary: '#C4B5FD', secondary: '#8B5CF6' },
    'from-orange-200 to-red-500': { primary: '#FED7AA', secondary: '#EF4444' },
    'from-amber-200 to-yellow-500': { primary: '#FDE68A', secondary: '#EAB308' },
    'from-cyan-200 to-blue-500': { primary: '#67E8F9', secondary: '#3B82F6' },
    'from-violet-200 to-purple-500': { primary: '#DDD6FE', secondary: '#A855F7' },
  };

  return colorMap[scheme] || { primary: '#93C5FD', secondary: '#818CF8' };
};


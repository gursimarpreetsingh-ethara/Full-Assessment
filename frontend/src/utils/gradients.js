export const getProjectGradient = (id) => {
  const gradients = [
    'from-purple-500 to-blue-500',
    'from-blue-500 to-cyan-500',
    'from-cyan-500 to-green-500',
    'from-green-500 to-amber-500',
    'from-amber-500 to-pink-500',
    'from-pink-500 to-purple-500'
  ];
  return gradients[(id || 0) % gradients.length];
};

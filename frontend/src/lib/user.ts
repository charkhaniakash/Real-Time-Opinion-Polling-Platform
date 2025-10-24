// Generate a unique user ID for the session
export const generateUserId = (): string => {
  // Check if user ID already exists in localStorage
  if (typeof window !== 'undefined') {
    const existingId = localStorage.getItem('quickpoll_user_id');
    if (existingId) {
      return existingId;
    }
  }

  // Generate a new user ID
  const userId = 'user_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  
  // Store it in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('quickpoll_user_id', userId);
  }
  
  return userId;
};

export const getUserId = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('quickpoll_user_id') || generateUserId();
  }
  return generateUserId();
};

import { initializeClerk, updateClerkAppearance } from './clerk.js';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme functionality
  const toggleButton = document.getElementById('theme');
  const body = document.body;
  const header = document.querySelector('header');
  const statCards = document.querySelectorAll('.stat-card');
  const gameCards = document.querySelectorAll('.game-card');

  if (toggleButton) {  // Check if theme toggle button exists
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      const isDarkMode = savedTheme === 'dark';
      body.classList.toggle('dark-mode', isDarkMode);
      header.classList.toggle('dark-mode', isDarkMode);
      statCards.forEach(card => {
        card.classList.toggle('dark-mode', isDarkMode);
      });
      gameCards.forEach(card => {
        card.classList.toggle('dark-mode', isDarkMode);
      });
      updateClerkAppearance();
    }

    // Toggle theme on button click
    toggleButton.addEventListener('click', () => {
      const isDarkMode = body.classList.toggle('dark-mode');
      header.classList.toggle('dark-mode', isDarkMode);
      statCards.forEach(card => {
        card.classList.toggle('dark-mode', isDarkMode);
      });
      gameCards.forEach(card => {
        card.classList.toggle('dark-mode', isDarkMode);
      });
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
      updateClerkAppearance();
    });
  }

  // Initialize Clerk when the script is loaded
  const clerkScript = document.querySelector('script[data-clerk-publishable-key]');
  if (clerkScript) {
    clerkScript.addEventListener('load', initializeClerk);
  } else {
    console.warn('Clerk script not found');
  }

  // Handle video previews
  gameCards.forEach(card => {
      const video = card.querySelector('video');
      
      if (video) {
          card.addEventListener('mouseenter', () => {
              video.play().catch(err => {
                  console.warn('Video autoplay failed:', err);
              });
          });
          
          card.addEventListener('mouseleave', () => {
              video.pause();
              video.currentTime = 0;
          });
      }
  });
});

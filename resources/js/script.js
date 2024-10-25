const toggleButton = document.getElementById('theme');
const body = document.body;
const header = document.querySelector('header');
const statCards = document.querySelectorAll('.stat-card');


// Check if the user has a previously saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  body.classList.toggle('dark-mode', savedTheme === 'dark');
  header.classList.toggle('dark-mode', savedTheme === 'dark');
  // Loop through all stat cards and apply dark mode
  statCards.forEach(card => {
    card.classList.toggle('dark-mode', savedTheme === 'dark');
  });
}

// Toggle theme on button click
toggleButton.addEventListener('click', () => {
  const isDarkMode = body.classList.toggle('dark-mode');
  header.classList.toggle('dark-mode', isDarkMode);
  // Loop through all stat cards and toggle dark mode
  statCards.forEach(card => {
    card.classList.toggle('dark-mode', isDarkMode);
  });
  
  // Save the user's preference in localStorage
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
});

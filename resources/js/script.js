const toggleButton = document.getElementById('theme');
const body = document.body;

// Check if the user has a previously saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  body.classList.toggle('dark-mode', savedTheme === 'dark');
}

// Toggle theme on button click
toggleButton.addEventListener('click', () => {
  const isDarkMode = body.classList.toggle('dark-mode');
  
  // Save the user's preference in localStorage
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
});

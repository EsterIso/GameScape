//clerk.js 
import { db } from './firebase-config.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

let clerkLoaded = false;
let clerkLoadedCallbacks = [];

function onClerkLoaded(callback) {
    if (clerkLoaded) {
        callback();
    } else {
        clerkLoadedCallbacks.push(callback);
    }
}


// Helper function to get current page
function getCurrentPage() {
  const path = window.location.pathname;
  if (path.includes('signin.html')) return 'signin';
  if (path.endsWith('/') || path.endsWith('/index.html')) return 'index';
  return 'other';
}

// Helper function to get base URL
function getBaseUrl() {

  return '/';
}

// Helper function to store and get return URL
function storeReturnUrl() {
    const returnUrl = window.location.pathname;
    if (!returnUrl.includes('signin.html')) {  // Changed from 'signin' to 'signin.html'
        localStorage.setItem('returnUrl', returnUrl);
        console.log('Stored return URL:', returnUrl);
    }
}

function getReturnUrl() {
    const returnUrl = localStorage.getItem('returnUrl');
    console.log('Retrieved return URL:', returnUrl);
    return returnUrl || '/';
}

// Function to get clerk appearance based on theme
function getClerkAppearance(isDark) {
  return {
      baseTheme: isDark ? 'dark' : 'light',
      elements: {
          rootBox: {
              boxShadow: 'none',
          },
          card: {
              backgroundColor: isDark ? '#8b5cf6' : '#ffffff',
              border: isDark ? '1px solid #333' : '1px solid #e5e5e5',
          },
          headerTitle: {
              color: isDark ? '#ffffff' : '#000000',
          },
          headerSubtitle: {
              color: isDark ? '#a0a0a0' : '#666666',
          },
          dividerLine: {
              backgroundColor: isDark ? '#333' : '#e5e5e5',
          },
          formButtonPrimary: {
              backgroundColor: isDark ? '#4a90e2' : '#2563eb',
              '&:hover': {
                  backgroundColor: isDark ? '#357abd' : '#1d4ed8',
              },
          },
          menuItem: {
              '&:hover': {
                  backgroundColor: isDark ? '#2d2d2d' : '#7c3aed',
              },
          },
          userPreviewTextContainer: {
              color: isDark ? '#ffffff' : '#000000',
          },
      },
      variables: {
          colorBackground: isDark ? '#1a1a1a' : '#ffffff',
          colorInputBackground: isDark ? '#2d2d2d' : '#ffffff',
          colorInputText: isDark ? '#ffffff' : '#000000',
          colorText: isDark ? '#ffffff' : '#000000',
          colorPrimary: isDark ? '#4a90e2' : '#2563eb',
      },
  };
}

// Function to update Clerk appearance
function updateClerkAppearance() {
  const isDarkMode = document.body.classList.contains('dark-mode');
  if (typeof Clerk !== 'undefined' && Clerk.user) {
      const userButton = document.getElementById('user-button');
      if (userButton) {
          Clerk.mountUserButton(userButton, {
              afterSignOutUrl: '/index.html',
              appearance: getClerkAppearance(isDarkMode),
          });
      }
  }
}

// Initialize Clerk authentication
async function initializeClerk() {
    try {
        const currentPage = getCurrentPage();
        const signInContainer = document.getElementById('sign-in-container');
        const signInButton = document.getElementById('sign-in-button');
        const userButton = document.getElementById('user-button');
        
        // Wait for Clerk to be available
        if (typeof Clerk === 'undefined') {
            console.warn('Clerk not loaded yet, waiting...');
            return;
        }
  
        await Clerk.load();
  
        // Add sign-out listener
        Clerk.addListener(({ user }) => {
            if (!user && currentPage !== 'index' && currentPage !== 'signin' && Clerk.lastSignOutAt) {
                window.location.href = '/';
            }
        });
  
        const isDarkMode = document.body.classList.contains('dark-mode');
  
        if (currentPage === 'signin' && signInContainer) {
            Clerk.mountSignIn(signInContainer, {
                afterSignIn: (result) => {
                    const returnUrl = getReturnUrl();
                    localStorage.removeItem('returnUrl');
                    window.location.href = returnUrl;
                },
                signUpUrl: '/signin.html',
                appearance: getClerkAppearance(isDarkMode),
            });
        } else {
            if (Clerk.user) {
                if (userButton) {
                    Clerk.mountUserButton(userButton, {
                        afterSignOutUrl: '/',
                        appearance: getClerkAppearance(isDarkMode),
                    });
                }
                if (signInButton) {
                    signInButton.style.display = 'none';
                }
            } else {
                if (signInButton) {
                    signInButton.style.display = 'block';
                    signInButton.replaceWith(signInButton.cloneNode(true));
                    const newSignInButton = document.getElementById('sign-in-button');
                    newSignInButton.addEventListener('click', () => {
                        storeReturnUrl();
                        window.location.href = '/signin.html';
                    });
                }
                if (userButton) {
                    userButton.style.display = 'none';
                }
            }
        }
    } catch (error) {
        console.error('Error initializing Clerk:', error);
    }
  }

// Export functions for use in main script
export {
  initializeClerk,
  updateClerkAppearance,
  onClerkLoaded
};
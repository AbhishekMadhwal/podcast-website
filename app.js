// Data Store
const podcasts = [
  {
    id: 1,
    title: "Tech Innovators",
    description: "Deep dives into emerging technologies with industry leaders.",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&auto=format&fit=crop",
    category: "Technology",
    author: "Sarah Chen",
    rating: 4.8,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "Mindful Moments",
    description: "Daily meditation practices for busy professionals.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop",
    category: "Health",
    author: "Dr. Michael Park",
    rating: 4.9,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "Business Breakthrough",
    description: "Strategies from successful entrepreneurs.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop",
    category: "Business",
    author: "James Wilson",
    rating: 4.6,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    id: 4,
    title: "Creative Minds",
    description: "Conversations with artists and designers.",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&auto=format&fit=crop",
    category: "Arts",
    author: "Emma Rodriguez",
    rating: 4.7,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  }
];

const episodes = [
  {
    id: 101,
    title: "The Future of AI",
    duration: "42:15",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop",
    date: "Jan 15"
  },
  {
    id: 102,
    title: "5-Minute Meditation",
    duration: "05:32",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop",
    date: "Jan 14"
  },
  {
    id: 103,
    title: "Startup Scaling",
    duration: "38:22",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop",
    date: "Jan 13"
  },
  {
    id: 104,
    title: "Digital Art Revolution",
    duration: "51:08",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&auto=format&fit=crop",
    date: "Jan 12"
  }
];

const categories = [
  { name: "Technology", icon: "💻" },
  { name: "Business", icon: "💼" },
  { name: "Health", icon: "🧘" },
  { name: "Science", icon: "🔬" },
  { name: "Arts", icon: "🎨" },
  { name: "Comedy", icon: "😄" }
];

// State
const state = {
  favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
  currentTrack: null,
  isPlaying: false,
  theme: localStorage.getItem('theme') || 'light'
};

// DOM Elements
const elements = {
  loader: document.getElementById('app-loader'),
  player: document.getElementById('audioPlayer'),
  audio: document.getElementById('audioElement'),
  playBtn: document.getElementById('playPauseBtn'),
  progressFill: document.getElementById('progressFill'),
  progressSlider: document.getElementById('progressSlider'),
  currentTime: document.getElementById('currentTime'),
  duration: document.getElementById('duration'),
  playerImage: document.getElementById('playerImage'),
  playerTitle: document.getElementById('playerTitle'),
  playerAuthor: document.getElementById('playerAuthor'),
  favCount: document.getElementById('favCount'),
  toastContainer: document.getElementById('toastContainer')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderPodcasts();
  renderEpisodes();
  renderCategories();
  animateCounters();
  setupEventListeners();
  
  // Hide loader
  setTimeout(() => {
    elements.loader.classList.add('hidden');
  }, 800);
});

// Theme Manager
function initTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  updateThemeIcon();
}

function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem('theme', state.theme);
  updateThemeIcon();
}

function updateThemeIcon() {
  const btn = document.getElementById('themeToggle');
  btn.textContent = state.theme === 'light' ? '🌙' : '☀️';
}

// Rendering
function renderPodcasts() {
  const grid = document.getElementById('podcastsGrid');
  grid.innerHTML = podcasts.map(pod => `
    <article class="podcast-card" data-id="${pod.id}">
      <img src="${pod.image}" alt="${pod.title}" loading="lazy">
      <div class="podcast-card-content">
        <h3>${pod.title}</h3>
        <p>${pod.description}</p>
        <div class="card-actions">
          <button class="btn btn-primary btn-sm" onclick="playPodcast(${pod.id})">▶ Play</button>
          <button class="btn-icon" onclick="toggleFavorite(${pod.id})" style="color: ${state.favorites.includes(pod.id) ? '#ef4444' : 'inherit'}">
            ${state.favorites.includes(pod.id) ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    </article>
  `).join('');
  
  updateFavCount();
}

function renderEpisodes() {
  const carousel = document.getElementById('episodesCarousel');
  carousel.innerHTML = episodes.map(ep => `
    <article class="episode-card">
      <img src="${ep.image}" alt="${ep.title}" loading="lazy">
      <div class="episode-card-content">
        <h4>${ep.title}</h4>
        <div class="episode-meta">
          <span>${ep.date}</span>
          <span>${ep.duration}</span>
        </div>
      </div>
    </article>
  `).join('');
}

function renderCategories() {
  const grid = document.getElementById('categoriesGrid');
  grid.innerHTML = categories.map(cat => `
    <div class="category-card" onclick="filterCategory('${cat.name}')">
      <div class="category-icon">${cat.icon}</div>
      <div class="category-name">${cat.name}</div>
    </div>
  `).join('');
}

// Audio Player
function playPodcast(id) {
  const podcast = podcasts.find(p => p.id === id);
  if (!podcast) return;
  
  state.currentTrack = podcast;
  elements.audio.src = podcast.audioUrl;
  elements.playerImage.src = podcast.image;
  elements.playerTitle.textContent = podcast.title;
  elements.playerAuthor.textContent = podcast.author;
  
  elements.player.classList.add('active');
  elements.audio.play();
  state.isPlaying = true;
  updatePlayButton();
  
  showToast(`Playing: ${podcast.title}`, 'info');
}

function togglePlay() {
  if (!state.currentTrack) return;
  
  if (state.isPlaying) {
    elements.audio.pause();
  } else {
    elements.audio.play();
  }
  state.isPlaying = !state.isPlaying;
  updatePlayButton();
}

function updatePlayButton() {
  elements.playBtn.textContent = state.isPlaying ? '⏸' : '▶';
}

// Progress
elements.audio.addEventListener('timeupdate', () => {
  const progress = (elements.audio.currentTime / elements.audio.duration) * 100;
  elements.progressFill.style.width = `${progress}%`;
  elements.progressSlider.value = progress || 0;
  elements.currentTime.textContent = formatTime(elements.audio.currentTime);
  elements.duration.textContent = formatTime(elements.audio.duration || 0);
});

elements.progressSlider.addEventListener('input', (e) => {
  const time = (e.target.value / 100) * elements.audio.duration;
  elements.audio.currentTime = time;
});

// Favorites
function toggleFavorite(id) {
  const index = state.favorites.indexOf(id);
  if (index > -1) {
    state.favorites.splice(index, 1);
    showToast('Removed from favorites', 'info');
  } else {
    state.favorites.push(id);
    showToast('Added to favorites', 'success');
  }
  localStorage.setItem('favorites', JSON.stringify(state.favorites));
  renderPodcasts();
}

function updateFavCount() {
  const count = state.favorites.length;
  elements.favCount.textContent = count;
  elements.favCount.style.display = count > 0 ? 'block' : 'none';
}

// Utilities
function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  elements.toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    const increment = target / 50;
    let current = 0;
    
    const update = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.floor(current).toLocaleString();
        requestAnimationFrame(update);
      } else {
        counter.textContent = target.toLocaleString() + '+';
      }
    };
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        update();
        observer.disconnect();
      }
    });
    observer.observe(counter);
  });
}

function filterCategory(category) {
  showToast(`Filtering: ${category}`, 'info');
  // Implement filter logic here
}

// Event Listeners
function setupEventListeners() {
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  document.getElementById('mobileMenuToggle').addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.toggle('active');
  });
  
  elements.playBtn.addEventListener('click', togglePlay);
  
  document.getElementById('closePlayer').addEventListener('click', () => {
    elements.player.classList.remove('active');
    elements.audio.pause();
    state.isPlaying = false;
  });
  
  document.getElementById('startListeningBtn').addEventListener('click', () => {
    playPodcast(1);
  });
  
  document.getElementById('exploreBtn').addEventListener('click', () => {
    document.getElementById('podcasts').scrollIntoView({ behavior: 'smooth' });
  });
  
  // Search
  const searchInput = document.getElementById('globalSearch');
  searchInput?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll('.podcast-card').forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(term) ? '' : 'none';
    });
  });
}
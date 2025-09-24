// AI Mood-Based Playlist Generator - JavaScript Implementation

class MoodPlaylistGenerator {
    constructor() {
        this.musicDatabase = [
            {
                "id": 1,
                "title": "Blinding Lights",
                "artist": "The Weeknd",
                "album": "After Hours",
                "genre": "Synthpop",
                "duration": "3:20",
                "valence": 0.7,
                "energy": 0.8,
                "danceability": 0.9,
                "mood": ["happy", "energetic", "nostalgic"],
                "albumArt": "https://via.placeholder.com/150/FF6B6B/ffffff?text=BL"
            },
            {
                "id": 2,
                "title": "Watermelon Sugar",
                "artist": "Harry Styles",
                "album": "Fine Line",
                "genre": "Pop",
                "duration": "2:54",
                "valence": 0.9,
                "energy": 0.6,
                "danceability": 0.7,
                "mood": ["happy", "cheerful", "summer"],
                "albumArt": "https://via.placeholder.com/150/4ECDC4/ffffff?text=WS"
            },
            {
                "id": 3,
                "title": "Someone You Loved",
                "artist": "Lewis Capaldi",
                "album": "Divinely Uninspired",
                "genre": "Pop Ballad",
                "duration": "3:02",
                "valence": 0.2,
                "energy": 0.3,
                "danceability": 0.2,
                "mood": ["sad", "melancholy", "heartbreak"],
                "albumArt": "https://via.placeholder.com/150/95A5A6/ffffff?text=SYL"
            },
            {
                "id": 4,
                "title": "Levitating",
                "artist": "Dua Lipa",
                "album": "Future Nostalgia",
                "genre": "Disco Pop",
                "duration": "3:23",
                "valence": 0.8,
                "energy": 0.9,
                "danceability": 0.95,
                "mood": ["happy", "dancing", "confident"],
                "albumArt": "https://via.placeholder.com/150/E74C3C/ffffff?text=LEV"
            },
            {
                "id": 5,
                "title": "The Night We Met",
                "artist": "Lord Huron",
                "album": "Strange Trails",
                "genre": "Indie Folk",
                "duration": "3:28",
                "valence": 0.3,
                "energy": 0.4,
                "danceability": 0.3,
                "mood": ["nostalgic", "melancholy", "reflective"],
                "albumArt": "https://via.placeholder.com/150/F39C12/ffffff?text=TNWM"
            },
            {
                "id": 6,
                "title": "Good 4 U",
                "artist": "Olivia Rodrigo",
                "album": "Sour",
                "genre": "Pop Rock",
                "duration": "2:58",
                "valence": 0.4,
                "energy": 0.8,
                "danceability": 0.6,
                "mood": ["angry", "empowered", "breakup"],
                "albumArt": "https://via.placeholder.com/150/9B59B6/ffffff?text=G4U"
            },
            {
                "id": 7,
                "title": "Heat Waves",
                "artist": "Glass Animals",
                "album": "Dreamland",
                "genre": "Indie Pop",
                "duration": "3:58",
                "valence": 0.6,
                "energy": 0.5,
                "danceability": 0.6,
                "mood": ["dreamy", "chill", "summer"],
                "albumArt": "https://via.placeholder.com/150/3498DB/ffffff?text=HW"
            },
            {
                "id": 8,
                "title": "Industry Baby",
                "artist": "Lil Nas X",
                "album": "Montero",
                "genre": "Hip Hop",
                "duration": "3:32",
                "valence": 0.8,
                "energy": 0.9,
                "danceability": 0.8,
                "mood": ["confident", "energetic", "party"],
                "albumArt": "https://via.placeholder.com/150/E67E22/ffffff?text=IB"
            },
            {
                "id": 9,
                "title": "Shivers",
                "artist": "Ed Sheeran",
                "album": "=",
                "genre": "Pop",
                "duration": "3:27",
                "valence": 0.7,
                "energy": 0.7,
                "danceability": 0.7,
                "mood": ["love", "happy", "romantic"],
                "albumArt": "https://via.placeholder.com/150/16A085/ffffff?text=SHI"
            },
            {
                "id": 10,
                "title": "Stay",
                "artist": "The Kid LAROI & Justin Bieber",
                "album": "F*ck Love 3",
                "genre": "Pop",
                "duration": "2:21",
                "valence": 0.6,
                "energy": 0.8,
                "danceability": 0.8,
                "mood": ["yearning", "love", "energetic"],
                "albumArt": "https://via.placeholder.com/150/8E44AD/ffffff?text=STAY"
            }
        ];

        this.genreMapping = {
            "happy": ["Pop", "Disco Pop", "Synthpop"],
            "sad": ["Pop Ballad", "Indie Folk", "Alternative"],
            "energetic": ["Hip Hop", "Electronic", "Pop Rock"],
            "calm": ["Indie Folk", "Ambient", "Jazz"],
            "angry": ["Pop Rock", "Alternative Rock", "Punk"],
            "nostalgic": ["Synthpop", "Indie Folk", "Classic Rock"],
            "romantic": ["Pop", "R&B", "Soul"]
        };

        this.moodKeywords = {
            "happy": ["joy", "excited", "cheerful", "upbeat", "positive", "elated"],
            "sad": ["down", "blue", "melancholy", "heartbroken", "crying", "depressed"],
            "energetic": ["pumped", "hyper", "active", "workout", "dancing", "party"],
            "calm": ["peaceful", "relaxed", "zen", "chill", "tranquil", "serene"],
            "angry": ["mad", "frustrated", "rage", "annoyed", "furious", "heated"],
            "nostalgic": ["memories", "past", "reminiscing", "throwback", "old", "yesterday"],
            "romantic": ["love", "romance", "crush", "date", "intimate", "passionate"]
        };

        this.currentPlaylist = [];
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 0;

        this.init();
    }

    init() {
        this.bindEvents();
        this.loadStoredData();
        this.updateEmptyStates();
    }

    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchSection(e.target.dataset.section));
        });

        // Mood input and generation
        document.getElementById('generate-btn').addEventListener('click', () => this.generatePlaylist());
        document.getElementById('mood-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) this.generatePlaylist();
        });

        // Player controls
        document.getElementById('play-pause-btn').addEventListener('click', () => this.togglePlayPause());
        document.getElementById('prev-btn').addEventListener('click', () => this.previousTrack());
        document.getElementById('next-btn').addEventListener('click', () => this.nextTrack());

        // Playlist actions
        document.getElementById('save-playlist-btn').addEventListener('click', () => this.savePlaylist());
        document.getElementById('shuffle-btn').addEventListener('click', () => this.shufflePlaylist());

        // FAB
        document.getElementById('fab').addEventListener('click', () => {
            this.switchSection('home');
            document.getElementById('mood-input').focus();
        });

        // History and favorites management
        document.getElementById('clear-history-btn').addEventListener('click', () => this.clearHistory());
        document.getElementById('clear-favorites-btn').addEventListener('click', () => this.clearFavorites());
    }

    switchSection(section) {
        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Update sections
        document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
        document.getElementById(`${section}-section`).classList.add('active');

        // Show/hide FAB
        const fab = document.getElementById('fab');
        if (section === 'home') {
            fab.classList.add('hidden');
        } else {
            fab.classList.remove('hidden');
        }
    }

    async generatePlaylist() {
        const moodText = document.getElementById('mood-input').value.trim();
        if (!moodText) {
            this.showToast('Please describe your mood first!', 'error');
            return;
        }

        // Show loading state
        this.showLoadingState();

        try {
            // Simulate AI processing with realistic delays
            await this.simulateAIProcessing();

            // Analyze mood
            const analysis = this.analyzeMood(moodText);

            // Generate playlist
            const playlist = this.createPlaylist(analysis);

            // Show results
            this.displayMoodAnalysis(analysis);
            this.displayPlaylist(playlist, analysis);

            // Save to history
            this.saveToHistory(moodText, analysis, playlist);

            this.showToast('Playlist generated successfully!', 'success');
        } catch (error) {
            this.showToast('Failed to generate playlist. Please try again.', 'error');
            console.error('Playlist generation error:', error);
        } finally {
            this.hideLoadingState();
        }
    }

    async simulateAIProcessing() {
        const steps = document.querySelectorAll('.step');
        const delays = [1000, 1500, 1200, 800]; // Different delays for each step

        for (let i = 0; i < steps.length; i++) {
            await new Promise(resolve => setTimeout(resolve, delays[i]));
            
            // Remove active from previous step
            if (i > 0) steps[i - 1].classList.remove('active');
            
            // Add active to current step
            steps[i].classList.add('active');
        }
    }

    analyzeMood(text) {
        const lowercaseText = text.toLowerCase();
        const detectedMoods = {};
        let totalScore = 0;

        // Analyze each mood category
        Object.entries(this.moodKeywords).forEach(([mood, keywords]) => {
            let score = 0;
            keywords.forEach(keyword => {
                const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
                const matches = (lowercaseText.match(regex) || []).length;
                score += matches;
            });

            // Add bonus for direct mood mentions
            const directMoodRegex = new RegExp(`\\b${mood}\\b`, 'gi');
            const directMatches = (lowercaseText.match(directMoodRegex) || []).length;
            score += directMatches * 2;

            if (score > 0) {
                detectedMoods[mood] = score;
                totalScore += score;
            }
        });

        // If no specific moods detected, default to happy
        if (totalScore === 0) {
            detectedMoods.happy = 1;
            totalScore = 1;
        }

        // Get primary mood (highest score)
        const primaryMood = Object.entries(detectedMoods)
            .sort(([,a], [,b]) => b - a)[0][0];

        // Calculate confidence
        const maxScore = Math.max(...Object.values(detectedMoods));
        const confidence = Math.min(Math.round((maxScore / Math.max(totalScore, 1)) * 100), 99);

        // Determine energy level
        const energeticScore = (detectedMoods.energetic || 0) + (detectedMoods.happy || 0);
        const calmScore = (detectedMoods.calm || 0) + (detectedMoods.sad || 0);
        
        let energyLevel;
        if (energeticScore > calmScore * 1.5) energyLevel = 'High';
        else if (calmScore > energeticScore * 1.5) energyLevel = 'Low';
        else energyLevel = 'Medium';

        // Get suggested genres
        const suggestedGenres = [...new Set(
            Object.keys(detectedMoods)
                .flatMap(mood => this.genreMapping[mood] || [])
        )].slice(0, 3);

        return {
            originalText: text,
            primaryMood,
            detectedMoods,
            energyLevel,
            confidence,
            suggestedGenres,
            timestamp: new Date().toISOString()
        };
    }

    createPlaylist(analysis) {
        const { primaryMood, detectedMoods, energyLevel } = analysis;
        
        // Score each track based on mood analysis
        const scoredTracks = this.musicDatabase.map(track => {
            let score = 0;

            // Primary mood matching
            if (track.mood.includes(primaryMood)) score += 10;

            // Secondary mood matching
            Object.keys(detectedMoods).forEach(mood => {
                if (track.mood.includes(mood)) {
                    score += detectedMoods[mood] * 2;
                }
            });

            // Genre matching
            analysis.suggestedGenres.forEach(genre => {
                if (track.genre === genre) score += 5;
            });

            // Energy level matching
            const trackEnergy = track.energy;
            if (energyLevel === 'High' && trackEnergy > 0.7) score += 3;
            else if (energyLevel === 'Low' && trackEnergy < 0.4) score += 3;
            else if (energyLevel === 'Medium' && trackEnergy >= 0.4 && trackEnergy <= 0.7) score += 3;

            return { ...track, score };
        });

        // Sort by score and select top tracks
        const selectedTracks = scoredTracks
            .sort((a, b) => b.score - a.score)
            .slice(0, 12)
            .map(track => {
                const { score, ...trackData } = track;
                return trackData;
            });

        // Add some variety by shuffling if all scores are similar
        const avgScore = selectedTracks.reduce((sum, track) => sum + scoredTracks.find(t => t.id === track.id).score, 0) / selectedTracks.length;
        const scoreVariance = selectedTracks.some(track => 
            Math.abs(scoredTracks.find(t => t.id === track.id).score - avgScore) > 2
        );

        if (!scoreVariance) {
            this.shuffleArray(selectedTracks);
        }

        return selectedTracks;
    }

    generatePlaylistName(analysis) {
        const { primaryMood, energyLevel } = analysis;
        const names = {
            happy: ['Sunshine Vibes', 'Feel Good Hits', 'Happy Place', 'Positive Energy'],
            sad: ['Melancholy Moments', 'Blue Hours', 'Rainy Day Feels', 'Heartbreak Hotel'],
            energetic: ['High Energy', 'Pump It Up', 'Workout Warriors', 'Dance Floor'],
            calm: ['Chill Zone', 'Peaceful Moments', 'Zen Garden', 'Relaxation Station'],
            angry: ['Rage Mode', 'Angry Anthems', 'Frustration Station', 'Mad Music'],
            nostalgic: ['Memory Lane', 'Throwback Vibes', 'Yesterday\'s Hits', 'Nostalgic Nights'],
            romantic: ['Love Songs', 'Romantic Vibes', 'Date Night', 'Heartstrings']
        };

        const moodNames = names[primaryMood] || names.happy;
        const baseName = moodNames[Math.floor(Math.random() * moodNames.length)];
        
        return `${baseName} - ${energyLevel} Energy`;
    }

    displayMoodAnalysis(analysis) {
        document.getElementById('primary-emotion').textContent = 
            analysis.primaryMood.charAt(0).toUpperCase() + analysis.primaryMood.slice(1);
        document.getElementById('energy-level').textContent = analysis.energyLevel;
        document.getElementById('suggested-genres').textContent = analysis.suggestedGenres.join(', ');
        document.getElementById('confidence-score').textContent = `${analysis.confidence}%`;

        document.getElementById('mood-analysis').classList.remove('hidden');
    }

    displayPlaylist(tracks, analysis) {
        this.currentPlaylist = tracks;
        const playlistTitle = this.generatePlaylistName(analysis);
        
        document.getElementById('playlist-title').textContent = playlistTitle;
        document.getElementById('playlist-description').textContent = 
            `${tracks.length} songs • Generated from: "${analysis.originalText.substring(0, 50)}${analysis.originalText.length > 50 ? '...' : ''}"`;

        const tracksContainer = document.getElementById('playlist-tracks');
        tracksContainer.innerHTML = '';

        tracks.forEach((track, index) => {
            const trackElement = this.createTrackElement(track, index);
            tracksContainer.appendChild(trackElement);
        });

        document.getElementById('playlist-section').classList.remove('hidden');
    }

    createTrackElement(track, index) {
        const trackEl = document.createElement('div');
        trackEl.className = 'track-item';
        trackEl.dataset.index = index;

        trackEl.innerHTML = `
            <div class="track-number">${index + 1}</div>
            <img src="${track.albumArt}" alt="${track.album}" class="track-artwork">
            <div class="track-info">
                <div class="track-title">${track.title}</div>
                <div class="track-artist">${track.artist}</div>
            </div>
            <div class="track-duration">${track.duration}</div>
            <div class="track-actions">
                <button class="track-action-btn" onclick="app.playTrack(${index})" title="Play">▶️</button>
                <button class="track-action-btn" onclick="app.addToFavorites(${track.id})" title="Add to favorites">⭐</button>
            </div>
        `;

        trackEl.addEventListener('click', () => this.playTrack(index));
        return trackEl;
    }

    playTrack(index) {
        this.currentTrackIndex = index;
        const track = this.currentPlaylist[index];
        
        // Update UI
        document.querySelectorAll('.track-item').forEach(el => el.classList.remove('playing'));
        document.querySelector(`[data-index="${index}"]`).classList.add('playing');

        // Update player
        this.updatePlayerDisplay(track);
        this.showPlayer();
        this.isPlaying = true;
        this.updatePlayButton();

        // Simulate playback
        this.simulatePlayback(track);
    }

    updatePlayerDisplay(track) {
        document.getElementById('player-artwork').src = track.albumArt;
        document.getElementById('player-title').textContent = track.title;
        document.getElementById('player-artist').textContent = track.artist;
        document.getElementById('total-time').textContent = track.duration;
    }

    showPlayer() {
        document.getElementById('audio-player').classList.remove('hidden');
    }

    togglePlayPause() {
        this.isPlaying = !this.isPlaying;
        this.updatePlayButton();
        
        if (this.isPlaying && this.currentPlaylist.length > 0) {
            this.simulatePlayback(this.currentPlaylist[this.currentTrackIndex]);
        }
    }

    updatePlayButton() {
        const btn = document.getElementById('play-pause-btn');
        btn.textContent = this.isPlaying ? '⏸️' : '▶️';
    }

    previousTrack() {
        if (this.currentTrackIndex > 0) {
            this.playTrack(this.currentTrackIndex - 1);
        }
    }

    nextTrack() {
        if (this.currentTrackIndex < this.currentPlaylist.length - 1) {
            this.playTrack(this.currentTrackIndex + 1);
        }
    }

    simulatePlayback(track) {
        const [minutes, seconds] = track.duration.split(':').map(Number);
        this.duration = minutes * 60 + seconds;
        this.currentTime = 0;

        const updateProgress = () => {
            if (!this.isPlaying) return;

            this.currentTime += 0.1;
            const progress = (this.currentTime / this.duration) * 100;
            
            document.getElementById('progress-bar').style.width = `${progress}%`;
            document.getElementById('current-time').textContent = this.formatTime(this.currentTime);

            if (this.currentTime >= this.duration) {
                this.nextTrack();
                return;
            }

            setTimeout(updateProgress, 100);
        };

        setTimeout(updateProgress, 100);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    savePlaylist() {
        if (this.currentPlaylist.length === 0) {
            this.showToast('No playlist to save!', 'error');
            return;
        }

        const favorites = this.getFavorites();
        const playlistData = {
            id: Date.now(),
            title: document.getElementById('playlist-title').textContent,
            description: document.getElementById('playlist-description').textContent,
            tracks: this.currentPlaylist,
            createdAt: new Date().toISOString()
        };

        favorites.push(playlistData);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        
        this.showToast('Playlist saved to favorites!', 'success');
        this.updateFavoritesList();
    }

    shufflePlaylist() {
        if (this.currentPlaylist.length === 0) return;

        this.shuffleArray(this.currentPlaylist);
        this.displayPlaylist(this.currentPlaylist, { 
            originalText: 'Shuffled playlist',
            primaryMood: 'mixed',
            energyLevel: 'Varied'
        });
        
        this.showToast('Playlist shuffled!', 'success');
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    showLoadingState() {
        document.getElementById('generate-btn').classList.add('loading');
        document.getElementById('loading-screen').classList.remove('hidden');
        document.getElementById('mood-analysis').classList.add('hidden');
        document.getElementById('playlist-section').classList.add('hidden');
    }

    hideLoadingState() {
        document.getElementById('generate-btn').classList.remove('loading');
        document.getElementById('loading-screen').classList.add('hidden');
        
        // Reset loading steps
        document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
        document.querySelector('.step[data-step="1"]').classList.add('active');
    }

    saveToHistory(moodText, analysis, playlist) {
        const history = this.getHistory();
        const historyItem = {
            id: Date.now(),
            moodText,
            analysis,
            playlist,
            createdAt: new Date().toISOString()
        };

        history.unshift(historyItem); // Add to beginning
        if (history.length > 20) history.pop(); // Keep only latest 20

        localStorage.setItem('history', JSON.stringify(history));
        this.updateHistoryList();
    }

    getHistory() {
        return JSON.parse(localStorage.getItem('history') || '[]');
    }

    getFavorites() {
        return JSON.parse(localStorage.getItem('favorites') || '[]');
    }

    updateHistoryList() {
        const history = this.getHistory();
        const container = document.getElementById('history-list');
        
        if (history.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📜</div>
                    <p>No playlist history yet. Generate your first mood-based playlist!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = history.map(item => `
            <div class="history-item" onclick="app.loadFromHistory('${item.id}')">
                <div class="item-header">
                    <h4 class="item-title">
                        ${this.generatePlaylistName(item.analysis)}
                    </h4>
                    <span class="item-date">${new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                <div class="item-mood">"${item.moodText.substring(0, 100)}${item.moodText.length > 100 ? '...' : ''}"</div>
                <div class="item-tracks">${item.playlist.length} tracks • ${item.analysis.primaryMood} mood</div>
            </div>
        `).join('');
    }

    updateFavoritesList() {
        const favorites = this.getFavorites();
        const container = document.getElementById('favorites-list');
        
        if (favorites.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">⭐</div>
                    <p>No favorite playlists yet. Save some playlists to your favorites!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = favorites.map(item => `
            <div class="favorite-item" onclick="app.loadFromFavorites('${item.id}')">
                <div class="item-header">
                    <h4 class="item-title">${item.title}</h4>
                    <span class="item-date">${new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                <div class="item-tracks">${item.tracks.length} tracks</div>
            </div>
        `).join('');
    }

    loadFromHistory(id) {
        const history = this.getHistory();
        const item = history.find(h => h.id.toString() === id);
        if (!item) return;

        this.switchSection('home');
        document.getElementById('mood-input').value = item.moodText;
        this.displayMoodAnalysis(item.analysis);
        this.displayPlaylist(item.playlist, item.analysis);
        this.showToast('Playlist loaded from history!', 'success');
    }

    loadFromFavorites(id) {
        const favorites = this.getFavorites();
        const item = favorites.find(f => f.id.toString() === id);
        if (!item) return;

        this.switchSection('home');
        this.currentPlaylist = item.tracks;
        
        document.getElementById('playlist-title').textContent = item.title;
        document.getElementById('playlist-description').textContent = item.description;
        
        const tracksContainer = document.getElementById('playlist-tracks');
        tracksContainer.innerHTML = '';
        
        item.tracks.forEach((track, index) => {
            const trackElement = this.createTrackElement(track, index);
            tracksContainer.appendChild(trackElement);
        });
        
        document.getElementById('playlist-section').classList.remove('hidden');
        this.showToast('Favorite playlist loaded!', 'success');
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear all playlist history?')) {
            localStorage.removeItem('history');
            this.updateHistoryList();
            this.showToast('History cleared!', 'success');
        }
    }

    clearFavorites() {
        if (confirm('Are you sure you want to clear all favorite playlists?')) {
            localStorage.removeItem('favorites');
            this.updateFavoritesList();
            this.showToast('Favorites cleared!', 'success');
        }
    }

    addToFavorites(trackId) {
        // This would typically add individual tracks to a favorites list
        // For now, we'll just show a toast
        this.showToast('Track added to favorites!', 'success');
    }

    loadStoredData() {
        this.updateHistoryList();
        this.updateFavoritesList();
    }

    updateEmptyStates() {
        this.updateHistoryList();
        this.updateFavoritesList();
    }

    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        container.appendChild(toast);

        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                if (container.contains(toast)) {
                    container.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new MoodPlaylistGenerator();
});

// Make app globally accessible for inline event handlers
window.app = app;
document.addEventListener('DOMContentLoaded', () => {
    // 设置当前导航的 Active 状态
    const path = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === path.split('/').pop() || (path.endsWith('/') && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
    });

    // 终端打字机逻辑 (如果有对应的 DOM 元素)
    const terminalLines = [
        { text: 'initializing jpop.terminal...', delay: 0 },
        { text: 'loading audio modules...', delay: 800 },
        { text: 'connecting to tokyo servers...', delay: 1600 },
        { text: 'system online. welcome to the grid.', delay: 2400 }
    ];

    const terminalBody = document.getElementById('terminal-lines');
    const heroContent = document.getElementById('hero-content');

    if (terminalBody) {
        terminalLines.forEach((line, index) => {
            setTimeout(() => {
                const lineDiv = document.createElement('div');
                lineDiv.className = 'mt-2';
                lineDiv.innerHTML = `<span class="text-cyan">></span> <span>${line.text}</span>`;
                
                // 移除旧的闪烁光标
                const oldCursor = document.querySelector('.cursor-blink');
                if (oldCursor) oldCursor.remove();

                // 如果是最后一行，添加光标
                if (index === terminalLines.length - 1) {
                    lineDiv.innerHTML += `<span class="cursor-blink">_</span>`;
                    
                    // 终端打字完成后显示主内容区
                    setTimeout(() => {
                        if (heroContent) {
                            heroContent.style.opacity = '1';
                            heroContent.style.transform = 'translateY(0)';
                        }
                    }, 500);
                }
                
                terminalBody.appendChild(lineDiv);
            }, line.delay);
        });
    }

    // Music page: track 01 uses local audio, other buttons keep external links.
    const playbackButtons = document.querySelectorAll('.cover-play, .track-action');
    const activeAudios = new Map();

    const updateTrackButtons = (trackId, isPlaying) => {
        document.querySelectorAll(`[data-track-id="${trackId}"]`).forEach(button => {
            button.textContent = isPlaying ? '❚❚' : '▶';
            button.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
        });
    };

    playbackButtons.forEach(btn => {
        const audioPath = btn.getAttribute('data-audio');
        const trackId = btn.getAttribute('data-track-id');
        const url = btn.getAttribute('data-spotify');

        if (audioPath && trackId) {
            btn.setAttribute('aria-pressed', 'false');

            btn.addEventListener('click', async () => {
                let audio = activeAudios.get(trackId);

                if (!audio) {
                    audio = new Audio(audioPath);
                    activeAudios.set(trackId, audio);

                    audio.addEventListener('play', () => updateTrackButtons(trackId, true));
                    audio.addEventListener('pause', () => updateTrackButtons(trackId, false));
                    audio.addEventListener('ended', () => updateTrackButtons(trackId, false));
                }

                if (audio.paused) {
                    try {
                        await audio.play();
                    } catch (error) {
                        console.error('Audio playback failed:', error);
                    }
                    return;
                }

                audio.pause();
            });

            return;
        }

        if (url) {
            btn.addEventListener('click', () => {
                window.open(url, '_blank', 'noopener,noreferrer');
            });
        }
    });

    // Recommend page: make genre chips selectable and keep selected values for form submit.
    const genreChips = document.querySelectorAll('.genre-field .chip');
    const selectedGenresInput = document.getElementById('selected-genres');

    if (genreChips.length > 0) {
        const updateSelectedGenres = () => {
            const selectedGenres = Array.from(genreChips)
                .filter(chip => chip.classList.contains('active'))
                .map(chip => chip.textContent.trim());

            if (selectedGenresInput) {
                selectedGenresInput.value = selectedGenres.join(', ');
            }
        };

        genreChips.forEach(chip => {
            chip.setAttribute('aria-pressed', 'false');

            chip.addEventListener('click', () => {
                chip.classList.toggle('active');
                chip.setAttribute('aria-pressed', chip.classList.contains('active') ? 'true' : 'false');
                updateSelectedGenres();
            });
        });

        updateSelectedGenres();
    }
});
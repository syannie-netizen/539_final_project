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
});
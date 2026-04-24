// ── CLOCK & WIDGETS ──
function updateClock() {
    const now = new Date();
    let h = now.getHours(), m = now.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    document.getElementById('clock').textContent =
        `${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()]} ${h}:${String(m).padStart(2, '0')} ${ampm}`;

    // Update Widget Time
    const wTime = document.getElementById('widget-time');
    if (wTime) {
        wTime.textContent = `${h}:${String(m).padStart(2, '0')}`;
    }
    const wDate = document.getElementById('widget-date');
    if (wDate) {
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        wDate.textContent = now.toLocaleDateString(undefined, options);
    }
}
updateClock(); setInterval(updateClock, 1000);

// ── CALENDAR WIDGET ──
function renderCalendar() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const calMonthYear = document.getElementById('calendar-month-year');
    if (calMonthYear) calMonthYear.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const grid = document.getElementById('calendar-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // Empty slots
    for (let i = 0; i < firstDay; i++) {
        grid.innerHTML += `<div class="calendar-day empty"></div>`;
    }

    // Days
    const today = date.getDate();
    for (let i = 1; i <= daysInMonth; i++) {
        const isToday = (i === today) ? ' today' : '';
        grid.innerHTML += `<div class="calendar-day${isToday}">${i}</div>`;
    }
}
document.addEventListener('DOMContentLoaded', renderCalendar);
renderCalendar();

// ── OS SELECTOR & THEMING ──
const svgMac = `<svg viewBox="0 0 170 170" width="15" height="15" fill="currentColor"><path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.92.21-9.84-1.96-14.74-6.53-3.13-2.73-7.1-7.43-11.92-14.1-5.04-6.93-9.56-15.35-13.53-25.26-4.14-10.22-6.2-20.37-6.2-30.45 0-12.57 2.92-23.49 8.75-32.74 5.91-9.33 14.18-14.65 24.8-15.96 4.79-.53 9.94.88 15.46 4.23 5.51 3.36 9.42 5.04 11.75 5.04 2.12 0 6.66-1.93 13.6-5.8 7.37-4.04 14.19-5.63 20.45-4.78 8.1.91 15.1 3.51 21 7.82 5.09 3.65 9.06 8.35 11.92 14.1-10.15 6.03-15.13 14.47-14.94 25.32.18 9.97 3.86 18.25 11.05 24.84 2.87 2.65 6.23 4.93 10.08 6.84-2.44 6.78-5.46 12.83-9.06 18.17zM110.13 26.66c-.66 7.42-3.8 14.53-9.43 21.32-6.17 7.4-13.67 11.66-22.5 12.78-1.07-7.7 2.4-15.3 10.4-22.95 5.58-5.32 12.44-8.8 19.38-9.98.05.28.09.56.09.83h2.06z"/></svg>`;
const svgWin = `<svg viewBox="0 0 88 88" width="18" height="18"><rect x="0" y="0" width="40" height="40" fill="#0078d4" rx="2"/><rect x="44" y="0" width="40" height="40" fill="#0078d4" rx="2"/><rect x="0" y="44" width="40" height="40" fill="#0078d4" rx="2"/><rect x="44" y="44" width="40" height="40" fill="#0078d4" rx="2"/></svg>`;
const svgLinux = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><circle cx="5" cy="5" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="12" cy="19" r="2"/><circle cx="19" cy="19" r="2"/></svg>`;
function showOSSelector() {
    closeAppleMenu();
    document.getElementById('os-selector-overlay').classList.add('show');
}

function setTheme(osName, initLoad = false) {
    document.body.className = 'theme-' + osName;
    localStorage.setItem('portfolio_os', osName);
    document.getElementById('os-selector-overlay').classList.remove('show');

    const osBtn = document.getElementById('apple-btn');
    if (osName === 'windows') {
        osBtn.innerHTML = svgWin;
        osBtn.title = 'Start Menu';
    } else if (osName === 'linux') {
        osBtn.innerHTML = svgLinux;
        osBtn.title = 'Activities';
    } else {
        osBtn.innerHTML = svgMac;
        osBtn.title = 'Apple Menu';
    }

    if (!initLoad) {
        showNotif('🔄 System Updated', `Experience changed to ${osName.toUpperCase()}`);
    }
}

// Initial Check
const savedOs = localStorage.getItem('portfolio_os');
if (!savedOs) {
    setTimeout(showOSSelector, 200);
} else {
    setTheme(savedOs, true);
}

// ── WINDOW MANAGEMENT ──
let zTop = 500;
const windows = {};

function openWindow(id) {
    closeAppleMenu();
    const el = document.getElementById('win-' + id);
    if (!el) return;
    el.classList.add('active');
    el.classList.remove('minimized');
    el.style.zIndex = ++zTop;
    if (id === 'skills') setTimeout(animateSkillBars, 100);
    // boot terminal
    if (id === 'terminal') bootTerminal();
    // fetch music
    if (id === 'music') fetchMusic();
    // bring to front on click
    el.addEventListener('mousedown', () => { el.style.zIndex = ++zTop; }, { once: false });
}

function closeWindow(id) {
    const el = document.getElementById('win-' + id);
    if (!el) return;
    el.style.animation = 'none';
    el.style.transition = 'transform 0.2s, opacity 0.2s';
    el.style.transform = 'scale(0.85)'; el.style.opacity = '0';
    setTimeout(() => {
        el.classList.remove('active');
        el.style.transform = ''; el.style.opacity = '';
    }, 200);
}

function minWindow(id) {
    document.getElementById('win-' + id).classList.remove('active');
}

function maxWindow(id) {
    const el = document.getElementById('win-' + id);
    if (el.dataset.maxed === '1') {
        el.style.width = el.dataset.ow; el.style.height = el.dataset.oh;
        el.style.top = el.dataset.ot; el.style.left = el.dataset.ol;
        el.dataset.maxed = '0';
    } else {
        el.dataset.ow = el.style.width; el.dataset.oh = el.style.height;
        el.dataset.ot = el.style.top; el.dataset.ol = el.style.left;
        el.style.width = '100vw'; el.style.height = 'calc(100vh - 108px)';
        el.style.top = '28px'; el.style.left = '0';
        el.dataset.maxed = '1';
    }
}

// ── DRAG WINDOWS ──
document.querySelectorAll('.window-titlebar').forEach(bar => {
    let ox, oy, win;

    function startDrag(e) {
        if (e.target.classList.contains('tl')) return;
        win = bar.closest('.window');
        win.style.zIndex = ++zTop;
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        ox = clientX - win.offsetLeft;
        oy = clientY - win.offsetTop;

        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag, { passive: false });

        const stopDrag = () => {
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchend', stopDrag);
        };
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchend', stopDrag);
    }

    function drag(e) {
        if (e.type.includes('touch')) e.preventDefault(); /* Prevent scrolling */
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        win.style.left = (clientX - ox) + 'px';
        win.style.top = Math.max(28, clientY - oy) + 'px';
    }

    bar.addEventListener('mousedown', startDrag);
    bar.addEventListener('touchstart', startDrag, { passive: false });
});

// ── RESIZE WINDOWS ──
document.querySelectorAll('.window-resize').forEach(handle => {
    let sx, sy, sw, sh, win;

    function startResize(e) {
        e.preventDefault();
        win = handle.closest('.window');
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        sx = clientX; sy = clientY;
        sw = win.offsetWidth; sh = win.offsetHeight;

        document.addEventListener('mousemove', resize);
        document.addEventListener('touchmove', resize, { passive: false });

        const stopResize = () => {
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('touchmove', resize);
            document.removeEventListener('mouseup', stopResize);
            document.removeEventListener('touchend', stopResize);
        };
        document.addEventListener('mouseup', stopResize);
        document.addEventListener('touchend', stopResize);
    }

    function resize(e) {
        if (e.type.includes('touch')) e.preventDefault();
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        win.style.width = Math.max(320, sw + clientX - sx) + 'px';
        win.style.height = Math.max(200, sh + clientY - sy) + 'px';
    }

    handle.addEventListener('mousedown', startResize);
    handle.addEventListener('touchstart', startResize, { passive: false });
});

// ── SKILL BARS ──
function animateSkillBars() {
    document.querySelectorAll('.skill-bar-fill').forEach(b => {
        b.style.width = b.dataset.w + '%';
    });
}

// ── APPLE / START MENU ──
document.getElementById('apple-btn').addEventListener('click', e => {
    e.stopPropagation();
    const isWindows = document.body.classList.contains('theme-windows');
    if (isWindows) {
        document.getElementById('apple-menu').classList.remove('show');
        document.getElementById('windows-start-menu').classList.toggle('show');
    } else {
        document.getElementById('windows-start-menu').classList.remove('show');
        document.getElementById('apple-menu').classList.toggle('show');
    }
});

function closeAppleMenu() {
    document.getElementById('apple-menu').classList.remove('show');
    document.getElementById('windows-start-menu').classList.remove('show');
}

document.addEventListener('click', closeAppleMenu);
document.getElementById('apple-menu').addEventListener('click', e => e.stopPropagation());
document.getElementById('windows-start-menu').addEventListener('click', e => e.stopPropagation());

// ── NOTIFICATIONS ──
let notifTimer;
function showNotif(title, body) {
    closeAppleMenu();
    const old = document.querySelector('.notif');
    if (old) old.remove();
    const el = document.createElement('div');
    el.className = 'notif';
    el.innerHTML = `<div class="notif-title">${title}</div><div class="notif-body">${body}</div>`;
    document.body.appendChild(el);
    clearTimeout(notifTimer);
    notifTimer = setTimeout(() => {
        el.style.transition = 'opacity 0.3s, transform 0.3s';
        el.style.opacity = '0'; el.style.transform = 'translateX(100%)';
        setTimeout(() => el.remove(), 300);
    }, 3500);
}

// ── SPOTLIGHT ──
const spotlightItems = [
    { label: '👤 About Me', action: () => openWindow('about') },
    { label: '⚙️ Skills', action: () => openWindow('skills') },
    { label: '🗂️ Projects', action: () => openWindow('projects') },
    { label: '📬 Contact', action: () => openWindow('contact') },
    { label: '📄 Resume', action: () => openWindow('resume') },
    { label: '🖥️ Terminal', action: () => openWindow('terminal') },
    { label: '🤖 Suraj AI', action: () => openWindow('messages') },
    { label: '🐙 GitHub', action: () => showNotif('GitHub', 'github.com/surajshrestha7') },
    { label: '💼 LinkedIn', action: () => showNotif('LinkedIn', 'linkedin.com/in/surajshrestha') },
];
let spotlightSel = 0;

function showSpotlight() {
    closeAppleMenu();
    document.getElementById('spotlight-overlay').classList.add('show');
    setTimeout(() => document.getElementById('spotlight-input').focus(), 100);
    renderSpotlight('');
}
function hideSpotlight(e) {
    document.getElementById('spotlight-overlay').classList.remove('show');
    document.getElementById('spotlight-input').value = '';
}
function spotlightSearch(q) {
    renderSpotlight(q.toLowerCase());
}
function renderSpotlight(q) {
    const res = spotlightItems.filter(i => !q || i.label.toLowerCase().includes(q));
    spotlightSel = 0;
    document.getElementById('spotlight-results').innerHTML = res.length ? res.map((r, i) =>
        `<div class="spotlight-result${i === 0 ? ' active' : ''}" onclick="spotlightRun(${spotlightItems.indexOf(r)})">${r.label}</div>`
    ).join('') : `<div class="spotlight-result" style="opacity:0.4;pointer-events:none">No results</div>`;
}
function spotlightRun(idx) {
    hideSpotlight();
    spotlightItems[idx].action();
}
function spotlightKey(e) {
    const results = document.querySelectorAll('.spotlight-result');
    if (e.key === 'ArrowDown') { spotlightSel = Math.min(spotlightSel + 1, results.length - 1); }
    else if (e.key === 'ArrowUp') { spotlightSel = Math.max(spotlightSel - 1, 0); }
    else if (e.key === 'Enter') {
        const q = document.getElementById('spotlight-input').value.toLowerCase();
        const items = spotlightItems.filter(i => !q || i.label.toLowerCase().includes(q));
        if (items[spotlightSel]) { hideSpotlight(); items[spotlightSel].action(); }
        return;
    } else if (e.key === 'Escape') { hideSpotlight(); return; }
    results.forEach((r, i) => r.classList.toggle('active', i === spotlightSel));
}

// ── TERMINAL ──
let terminalBooted = false;
const cmds = {
    help: `<span style="color:#5ac8fa">Available commands:</span><br>  whoami &nbsp;· about &nbsp;· skills &nbsp;· projects &nbsp;· contact &nbsp;· ai &nbsp;· clear &nbsp;· ls &nbsp;· date &nbsp;· uname`,
    whoami: `<span style="color:#30d158">Suraj Shrestha</span> — Full-Stack Developer from Nepal 🇳🇵`,
    about: `Hi! I'm Suraj, a passionate coder who loves building things on the web.<br>Currently open to work. Type <span style="color:#ff9f0a">contact</span> to reach me.`,
    skills: `<span style="color:#ff9f0a">Frontend:</span> HTML, CSS, JS, React, Next.js, Tailwind<br><span style="color:#ff9f0a">Backend:</span> Node.js, Python, MongoDB, PostgreSQL<br><span style="color:#ff9f0a">Tools:</span> Git, Docker, Figma, AWS`,
    projects: `📦 E-Commerce Platform<br>🤖 AI Chat Assistant<br>📊 Analytics Dashboard<br>📱 Task Manager App<br>🌐 This Portfolio!`,
    contact: `<i class="fa-solid fa-envelope" style="color:#ea4335"></i> suraj7.21@proton.me<br><i class="fa-solid fa-phone" style="color:#34a853"></i> 9765408063<br><i class="fa-brands fa-github" style="color:#fff"></i> github.com/surajshrestha7<br><i class="fa-brands fa-linkedin" style="color:#0077b5"></i> linkedin.com/in/surajshrestha`,
    ai: `🤖 <span style="color:#5ac8fa">Suraj AI Assistant:</span> Always ready to help! Open the "Suraj AI" app on your desktop for a full chat experience.`,
    ls: `<span style="color:#5ac8fa">Desktop/</span>&nbsp; About_Me.folder &nbsp;Skills.folder &nbsp;Projects.folder &nbsp;Resume.pdf &nbsp;Contact.folder &nbsp;Terminal.app`,
    date: new Date().toString(),
    uname: `Darwin MacBook-Suraj.local 23.0.0 Darwin Kernel arm64`,
    clear: '__clear__',
};

function bootTerminal() {
    if (terminalBooted) return;
    terminalBooted = true;
    const out = document.getElementById('terminal-output');
    out.innerHTML = `<div style="color:#5ac8fa;margin-bottom:8px;">Last login: ${new Date().toDateString()} on ttys000</div>
<div style="color:#30d158;margin-bottom:4px;">Welcome to <strong>Suraz OS</strong> — Portfolio Edition</div>
<div style="color:var(--text-dim);margin-bottom:8px;font-size:12px;">Type <span style="color:#ff9f0a">help</span> to see available commands</div>`;
    const input = document.getElementById('terminal-input');
    input.addEventListener('keydown', e => {
        if (e.key !== 'Enter') return;
        const cmd = input.value.trim().toLowerCase();
        input.value = '';
        const res = cmds[cmd];
        if (res === '__clear__') { out.innerHTML = ''; return; }
        const line = document.createElement('div');
        line.style.marginBottom = '8px';
        line.innerHTML = `<span style="color:#5ac8fa">suraz@macbook</span>:<span style="color:#ff9f0a">~</span>$ ${cmd}<br>` +
            (res ? `<span>${res}</span>` : `<span style="color:#ff375f">bash: ${cmd}: command not found</span>`);
        out.appendChild(line);
        const body = document.getElementById('terminal-body');
        body.scrollTop = body.scrollHeight;
    });
}

// ── KEYBOARD SHORTCUTS ──
document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === ' ') { e.preventDefault(); showSpotlight(); }
    if (e.key === 'Escape') { hideSpotlight(); closeAppleMenu(); }
});

// ── WELCOME NOTIFICATION ──
setTimeout(() => showNotif('👋 Welcome!', 'Double-click desktop icons or use the dock below to explore.'), 800);

// ── DESKTOP & DOCK ICON CLICK ──
document.querySelectorAll('.desktop-icon, .dock-item').forEach(icon => {
    let clicks = 0, timer;
    icon.addEventListener('click', () => {
        // On mobile devices, open on single click
        if (window.innerWidth <= 768 && icon.ondblclick) {
            icon.ondblclick();
            return;
        }
        clicks++;
        clearTimeout(timer);
        timer = setTimeout(() => { clicks = 0; }, 300);
        if (clicks === 2) { clicks = 0; icon.ondblclick && icon.ondblclick(); }
    });
});

// ── BOOT SCREEN ──
window.addEventListener('load', () => {
    setTimeout(() => {
        const bs = document.getElementById('boot-screen');
        if (bs) {
            bs.style.opacity = '0';
            setTimeout(() => bs.remove(), 800);
        }
    }, 2000); // 2 second mock loading
});

// ── MUSIC APP (iTunes API) ──
let musicFetched = false;
async function fetchMusic() {
    if (musicFetched) return;
    musicFetched = true;
    const list = document.getElementById('music-list');
    if (!list) return;
    try {
        const res = await fetch('https://itunes.apple.com/search?term=lofi&limit=10&media=music');
        const data = await res.json();
        list.innerHTML = '';
        data.results.forEach(track => {
            const item = document.createElement('div');
            item.className = 'music-item';
            item.innerHTML = `
                <img src="${track.artworkUrl100}" alt="cover">
                <div class="music-item-info">
                    <div class="music-item-title">${track.trackName}</div>
                    <div class="music-item-artist">${track.artistName}</div>
                </div>
            `;
            item.onclick = () => playMusic(track);
            list.appendChild(item);
        });
    } catch (e) {
        list.innerHTML = '<div style="text-align:center; padding: 40px; color:var(--text-dim);">Failed to load music.</div>';
    }
}

function playMusic(track) {
    document.getElementById('music-title').textContent = track.trackName;
    document.getElementById('music-artist').textContent = track.artistName;
    const cover = document.getElementById('music-cover');
    cover.src = track.artworkUrl100;
    cover.style.display = 'block';
    const audio = document.getElementById('audio-player');
    audio.src = track.previewUrl;
    audio.play();
}

// ── SURAJ AI ASSISTANT ──
const portfolioData = {
    name: "Suraj Shrestha",
    role: "Full-Stack Developer & Creative Coder",
    location: "Kathmandu, Nepal",
    education: "B.Sc. Computer Science from Tribhuvan University, Nepal (2020–2024)",
    experience: [
        "Junior Developer @ TechNepal (Jan 2024 – Present): Building scalable web apps and REST APIs.",
        "Freelance Developer (2022 – 2024): Delivered 15+ client projects across e-commerce, portfolios, and dashboards."
    ],
    skills: {
        frontend: "HTML/CSS (95%), JavaScript/TypeScript (88%), React.js/Next.js (85%), Tailwind CSS (90%)",
        backend: "Node.js/Express (82%), Python/Django (75%), MongoDB/PostgreSQL (78%)",
        tools: "Git/GitHub, Docker, Figma, VS Code, REST APIs, GraphQL, AWS/Vercel, Linux, Firebase"
    },
    projects: [
        "E-Commerce Platform: Full-stack store with React, Node.js, and MongoDB.",
        "AI Chat Assistant: Next.js powered chatbot with OpenAI API.",
        "Analytics Dashboard: Real-time data visualization with React and D3.js.",
        "Task Manager App: React Native productivity app.",
        "Portfolio Website: The macOS-inspired site you're currently exploring!"
    ],
    contact: {
        email: "suraz7.21@proton.me",
        phone: "+977 9765408063",
        linkedin: "linkedin.com/in/surajshrestha",
        github: "github.com/surajshrestha7",
        website: "surajshrestha7.com.np"
    },
    achievements: [
        "1st Place — TechFest Nepal 2023 Hackathon",
        "Open Source Contributor — 200+ GitHub stars",
        "AWS Certified Cloud Practitioner"
    ]
};

function getAIResponse(input) {
    const query = input.toLowerCase();

    if (query.includes("who") || query.includes("name") || query.includes("you")) {
        return `I'm Suraj AI, a virtual representation of Suraj Shrestha. He's a ${portfolioData.role} based in ${portfolioData.location}.`;
    }
    if (query.includes("skill") || query.includes("tech") || query.includes("stack") || query.includes("know")) {
        return `Suraj is proficient in: \n• Frontend: ${portfolioData.skills.frontend}\n• Backend: ${portfolioData.skills.backend}\n• Tools: ${portfolioData.skills.tools}`;
    }
    if (query.includes("project") || query.includes("work") || query.includes("build") || query.includes("done")) {
        return `Here are some of Suraj's key projects:\n${portfolioData.projects.map(p => "• " + p).join("\n")}`;
    }
    if (query.includes("contact") || query.includes("email") || query.includes("hire") || query.includes("reach") || query.includes("message")) {
        return `You can reach Suraj at ${portfolioData.contact.email} or call him at ${portfolioData.contact.phone}. He's also active on LinkedIn: ${portfolioData.contact.linkedin}`;
    }
    if (query.includes("experience") || query.includes("job") || query.includes("where")) {
        return `Suraj's experience includes:\n${portfolioData.experience.map(e => "• " + e).join("\n")}`;
    }
    if (query.includes("education") || query.includes("study") || query.includes("college") || query.includes("university")) {
        return `Suraj graduated with a ${portfolioData.education}.`;
    }
    if (query.includes("achievement") || query.includes("award") || query.includes("hackathon")) {
        return `Some of Suraj's achievements: \n${portfolioData.achievements.map(a => "• " + a).join("\n")}`;
    }
    if (query.includes("hi") || query.includes("hello") || query.includes("hey")) {
        return "Hello! How can I help you today? I can tell you about Suraj's skills, projects, or how to contact him.";
    }

    return "That's interesting! I'm specifically trained to talk about Suraj's portfolio. Try asking about his skills, projects, or experience!";
}

const chatForm = document.getElementById('chat-form');
if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if (!text) return;

        const history = document.getElementById('chat-history');

        // Add User Message
        const sentBubble = document.createElement('div');
        sentBubble.className = 'chat-bubble sent';
        sentBubble.textContent = text;
        history.appendChild(sentBubble);
        input.value = '';
        history.scrollTop = history.scrollHeight;

        // Add Typing Indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        history.appendChild(typingIndicator);
        history.scrollTop = history.scrollHeight;

        setTimeout(() => {
            // Remove Typing Indicator
            typingIndicator.remove();

            // Add AI Response
            const responseText = getAIResponse(text);
            const replyBubble = document.createElement('div');
            replyBubble.className = 'chat-bubble received ai-special';
            replyBubble.style.whiteSpace = 'pre-line'; // Respect newlines
            replyBubble.textContent = responseText;
            history.appendChild(replyBubble);
            history.scrollTop = history.scrollHeight;
        }, 1200);
    });
}
// ── CONTACT FORM HANDLER ──
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('.submit-btn');
        const originalBtnText = btn.innerHTML;

        // Show loading state
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';
        btn.style.opacity = '0.7';
        btn.disabled = true;

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        /* 
           To save messages to Excel (Google Sheets):
           1. Go to https://web3forms.com/ and get a FREE Access Key using your email suraz.shrestha.00.00@gmail.com
           2. Replace 'YOUR_ACCESS_KEY_HERE' below with your actual key.
           3. In Web3Forms dashboard, you can enable "Google Sheets" integration with 1 click.
        */

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    access_key: "08e41b26-a4de-4e2e-8366-85a1ef802e0f", // REPLACE WITH YOUR KEY
                    subject: "New Portfolio Message from " + data.name,
                    from_name: "Portfolio Contact Form",
                    ...data
                })
            });

            const result = await response.json();
            if (response.status === 200) {
                showNotif('🚀 Message Sent!', 'Thanks ' + data.name + ', your message is now in my Excel!');
                contactForm.reset();
            } else {
                showNotif('❌ Error', result.message || 'Submission failed.');
            }
        } catch (error) {
            showNotif('📬 Message Recorded!', 'Submission simulated. Connect your Web3Forms key for real Excel sync.');
            console.log('Submission simulated:', data);
            contactForm.reset();
        } finally {
            btn.innerHTML = originalBtnText;
            btn.style.opacity = '1';
            btn.disabled = false;
        }
    });
}

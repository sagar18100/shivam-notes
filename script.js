document.addEventListener('DOMContentLoaded', () => {
    const main = document.getElementById('main-content');

    // Icons (using FontAwesome classes or unicode, here using simple text for now or we can use SVG)
    // Actually, I'll use simple SVGs for icons in render functions

    // Theme Toggle
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Check saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        enableLightMode();
    }

    themeBtn.addEventListener('click', () => {
        if (body.classList.contains('light-mode')) {
            disableLightMode();
        } else {
            enableLightMode();
        }
    });

    function enableLightMode() {
        body.classList.add('light-mode');
        themeBtn.innerHTML = '🌙'; // Moon icon for light mode (to switch back to dark)
        localStorage.setItem('theme', 'light');
    }

    function disableLightMode() {
        body.classList.remove('light-mode');
        themeBtn.innerHTML = '☀️'; // Sun icon for dark mode
        localStorage.setItem('theme', 'dark');
    }

    // Router
    function handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        const parts = hash.split('/');

        main.innerHTML = '';
        main.className = 'fade-in';

        if (hash === '/') {
            renderHome();
        } else if (parts[0] === 'class') {
            const classId = parts[1];
            if (parts.length === 2) {
                renderClass(classId);
            } else if (parts.length === 3) {
                const subjectId = parts[2];
                renderSubject(classId, subjectId);
            } else if (parts.length === 4) {
                const subjectId = parts[2];
                const chapterId = parts[3];
                renderNote(classId, subjectId, chapterId);
            }
        }
    }

    window.addEventListener('hashchange', handleRoute);
    handleRoute(); // Initial load

    function renderHome() {
        main.innerHTML = '';
        const hero = document.createElement('div');
        hero.className = 'hero fade-in';
        hero.innerHTML = `
            <h1>Shivam's Notes</h1>
            <p>Comprehensive notes for Physics, Chemistry, and Biology from Class 8th to 12th.</p>
            <a href="#about" class="btn btn-primary">Learn More</a>
        `;

        const grid = document.createElement('div');
        grid.className = 'grid fade-in';

        Object.keys(appData.classes).forEach(classId => {
            const cls = appData.classes[classId];
            const card = document.createElement('a');
            card.href = `#class/${classId}`;
            card.className = 'card';
            card.style.display = 'block'; // Anchor needs block to behave like card
            card.style.textDecoration = 'none';
            card.style.color = 'inherit';
            card.innerHTML = `
                <div class="card-icon">📚</div>
                <h3>${cls.title}</h3>
                <p>${cls.description}</p>
            `;
            grid.appendChild(card);
        });

        main.appendChild(hero);
        main.appendChild(grid);
    }

    function renderClass(classId) {
        const cls = appData.classes[classId];
        if (!cls) return renderError('Class not found');

        main.innerHTML = '';
        const header = document.createElement('div');
        header.className = 'hero fade-in';
        header.innerHTML = `
            <h2>${cls.title}</h2>
            <p>Select a subject to start learning.</p>
            <a href="#" class="btn btn-outline">← Back to Home</a>
        `;

        const grid = document.createElement('div');
        grid.className = 'grid subjects-grid fade-in';

        Object.keys(cls.subjects).forEach(subjectKey => {
            const subject = cls.subjects[subjectKey];
            const card = document.createElement('a');
            card.href = `#class/${classId}/${subjectKey}`;
            card.className = 'card subject-card';
            card.style.display = 'block';
            card.style.textDecoration = 'none';
            card.style.color = 'inherit';
            card.innerHTML = `
                <div class="card-icon">
                    ${subject.icon === 'atom' ? '⚛️' : subject.icon === 'flask' ? '🧪' : '🧬'}
                </div>
                <h3>${subject.title}</h3>
                <p>${subject.chapters.length} Chapters</p>
            `;
            grid.appendChild(card);
        });

        main.appendChild(header);
        main.appendChild(grid);
    }

    function renderSubject(classId, subjectId) {
        const cls = appData.classes[classId];
        const subject = cls?.subjects[subjectId];
        if (!subject) return renderError('Subject not found');

        main.innerHTML = '';
        const header = document.createElement('div');
        header.className = 'hero fade-in';
        header.innerHTML = `
            <h2>${subject.title} - ${cls.title}</h2>
            <p>Select a chapter to read detailed notes.</p>
            <a href="#class/${classId}" class="btn btn-outline">← Back to Class</a>
        `;

        const list = document.createElement('div');
        list.className = 'grid fade-in';

        subject.chapters.forEach(chapter => {
            const card = document.createElement('a');
            card.href = `#class/${classId}/${subjectId}/${chapter.id}`;
            card.className = 'card';
            card.style.display = 'block';
            card.style.textDecoration = 'none';
            card.style.color = 'inherit';
            card.innerHTML = `
                <h3>Chapter ${chapter.id}</h3>
                <p>${chapter.title}</p>
                <div style="margin-top: 1rem; color: var(--primary); font-weight: 600;">Read Notes →</div>
            `;
            list.appendChild(card);
        });

        main.appendChild(header);
        main.appendChild(list);
    }

    function renderNote(classId, subjectId, chapterId) {
        const cls = appData.classes[classId];
        const subject = cls?.subjects[subjectId];
        const chapter = subject?.chapters.find(c => c.id == chapterId);

        if (!chapter) return renderError('Chapter not found');

        main.innerHTML = '';
        const container = document.createElement('div');
        container.className = 'container fade-in';

        container.innerHTML = `
            <div style="margin-bottom: 2rem;">
                <a href="#class/${classId}/${subjectId}" class="btn btn-outline">← Back to Chapters</a>
            </div>
            <div class="card" style="cursor: default; min-height: 60vh; padding: 3rem;">
                <span style="color: var(--primary); font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">${subject.title} / Chapter ${chapter.id}</span>
                <h1 style="font-size: 2.5rem; margin: 1rem 0 2rem;">${chapter.title}</h1>
                <div style="font-size: 1.1rem; color: var(--text-color); line-height: 1.8;">
                    <p style="margin-bottom: 1.5rem;">${chapter.content}</p>
                    <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid var(--primary);">
                        <h4 style="margin-bottom: 0.5rem; color: var(--secondary);">Key Concepts</h4>
                        <ul style="list-style-type: disc; padding-left: 1.5rem; color: var(--text-muted);">
                            <li>Definition and basic principles</li>
                            <li>Formulas and derivations</li>
                            <li>Real-world applications</li>
                            <li>Important diagrams (to be added)</li>
                        </ul>
                    </div>
                    <p style="margin-top: 1.5rem;">(Full chapter content would be populated here from the database...)</p>
                </div>
            </div>
        `;

        main.appendChild(container);
    }

    function renderError(msg) {
        main.innerHTML = `<h2 style="text-align:center; margin-top: 4rem;">${msg}</h2><p style="text-align:center;"><a href="#" class="btn btn-primary">Go Home</a></p>`;
    }
});

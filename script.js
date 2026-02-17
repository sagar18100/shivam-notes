document.addEventListener('DOMContentLoaded', () => {
    const main = document.getElementById('main-content');
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') enableLightMode();

    themeBtn.addEventListener('click', () => {
        body.classList.contains('light-mode') ? disableLightMode() : enableLightMode();
    });

    function enableLightMode() {
        body.classList.add('light-mode');
        themeBtn.innerHTML = '🌙';
        localStorage.setItem('theme', 'light');
    }

    function disableLightMode() {
        body.classList.remove('light-mode');
        themeBtn.innerHTML = '☀️';
        localStorage.setItem('theme', 'dark');
    }

    function handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        const parts = hash.split('/');
        main.innerHTML = '';
        main.className = 'fade-in';

        if (hash === '/') {
            renderHome();
        } else if (parts[0] === 'class') {
            const classId = parts[1];
            if (parts.length === 2) renderClass(classId);
            else if (parts.length === 3) renderSubject(classId, parts[2]);
            else if (parts.length === 4) renderNote(classId, parts[2], parts[3]);
        }
    }

    window.addEventListener('hashchange', handleRoute);
    handleRoute();

    function renderHome() {
        main.innerHTML = `<div class="hero"><h1>Shivam's Notes</h1><p>Physics, Chemistry, and Biology (Class 8-12)</p></div>`;
        const grid = document.createElement('div');
        grid.className = 'grid';
        Object.keys(appData.classes).forEach(id => {
            const cls = appData.classes[id];
            grid.innerHTML += `<a href="#class/${id}" class="card"><h3>${cls.title}</h3><p>${cls.description}</p></a>`;
        });
        main.appendChild(grid);
    }

    function renderClass(classId) {
        const cls = appData.classes[classId];
        main.innerHTML = `<div class="hero"><h2>${cls.title}</h2><a href="#" class="btn-outline">← Back Home</a></div>`;
        const grid = document.createElement('div');
        grid.className = 'grid';
        Object.keys(cls.subjects).forEach(s => {
            const sub = cls.subjects[s];
            grid.innerHTML += `<a href="#class/${classId}/${s}" class="card"><h3>${sub.title}</h3><p>${sub.chapters.length} Chapters</p></a>`;
        });
        main.appendChild(grid);
    }

    function renderSubject(classId, subId) {
        const sub = appData.classes[classId].subjects[subId];
        main.innerHTML = `<div class="hero"><h2>${sub.title}</h2><a href="#class/${classId}" class="btn-outline">← Back</a></div>`;
        const grid = document.createElement('div');
        grid.className = 'grid';
        sub.chapters.forEach(ch => {
            grid.innerHTML += `<a href="#class/${classId}/${subId}/${ch.id}" class="card"><h3>Chapter ${ch.id}</h3><p>${ch.title}</p><div style="color:var(--primary)">${ch.pdf ? '📄 View PDF' : 'Read Notes →'}</div></a>`;
        });
        main.appendChild(grid);
    }

    function renderNote(classId, subId, chId) {
        const ch = appData.classes[classId].subjects[subId].chapters.find(c => c.id == chId);
        let content = ch.pdf ? `<iframe src="notes/${ch.pdf}" width="100%" height="600px" style="border:none;margin-top:20px;"></iframe>` : `<p>${ch.content}</p>`;
        main.innerHTML = `<div class="container"><a href="#class/${classId}/${subId}" class="btn-outline">← Back</a><div class="card" style="margin-top:20px;"><h1>${ch.title}</h1>${content}</div></div>`;
    }
});

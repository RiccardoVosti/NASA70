// --- Populate Skeleton Loading Grid ---
const skeletonBg = document.getElementById('skeleton-bg');
for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    el.className = 'skeleton-card';
    el.style.animationDelay = `${Math.random() * 1.5}s`;
    skeletonBg.appendChild(el);
}

// --- Interactive NASA Logo Generator ---
function initNasaLogo(containerId) {
    const sequences = [
        '111101101', '010111101', '011010110', '010111101', '111011100', '111101111'
    ];
    
    const container = document.getElementById(containerId);
    if (!container) return;

    sequences.forEach(seq => {
        const letterGrid = document.createElement('div');
        letterGrid.className = 'logo-letter';
        for (let char of seq) {
            const block = document.createElement('div');
            block.className = 'logo-block';
            if (char === '1') block.classList.add('is-white');
            letterGrid.appendChild(block);
        }
        container.appendChild(letterGrid);
    });

    const whiteBlocks = Array.from(container.querySelectorAll('.logo-block.is-white'));
    let snakeIndex = 0;

    function runSnake() {
        if (snakeIndex < whiteBlocks.length) {
            whiteBlocks[snakeIndex].classList.add('is-snake');
            if (snakeIndex > 0) whiteBlocks[snakeIndex - 1].classList.remove('is-snake');
            snakeIndex++;
            setTimeout(runSnake, 60); 
        } else {
            whiteBlocks[snakeIndex - 1].classList.remove('is-snake');
            setTimeout(() => {
                snakeIndex = 0;
                runSnake();
            }, 2500); 
        }
    }
    setTimeout(runSnake, 1000);
}

initNasaLogo('nav-nasa-logo');
initNasaLogo('intro-nasa-logo');

// --- Flow Control: Intro -> Tutorial -> Skeleton (1s) -> Main Grid ---
document.getElementById('btn-next-tutorial').addEventListener('click', () => {
    document.getElementById('intro-screen').classList.add('hidden');
    document.getElementById('tutorial-screen').classList.remove('hidden');
});

document.getElementById('btn-start-tutorial').addEventListener('click', () => {
    document.getElementById('tutorial-screen').classList.add('hidden');
    
    const skeleton = document.getElementById('skeleton-screen');
    skeleton.classList.remove('hidden');
    
    setTimeout(() => {
        skeleton.classList.add('hidden');
    }, 1000);
});

// --- App Logic ---
let tuttiIProgetti = [];
let currentGridItems = [];
let currentSearch = '';
let currentFilters = [];
let sortAzAsc = true;
let isDateNewest = true;

const viewport = document.getElementById('viewport');
const grid = document.getElementById('projects-grid');
const sidePanel = document.getElementById('side-panel');
const closeSidebarBtn = document.getElementById('close-sidebar');
const tagsContainer = document.getElementById('sp-tags');

// --- Idle Timer Logic ---
let idleTimer;
function resetIdleTimer() {
    document.body.classList.remove('is-idle');
    clearTimeout(idleTimer);
    
    if (!document.body.classList.contains('is-dragging')) {
        idleTimer = setTimeout(() => {
            document.body.classList.add('is-idle');
        }, 2000); 
    }
}

window.addEventListener('mousemove', resetIdleTimer);
window.addEventListener('mousedown', resetIdleTimer);
window.addEventListener('touchstart', resetIdleTimer, {passive: true});
window.addEventListener('touchmove', resetIdleTimer, {passive: false});
window.addEventListener('wheel', resetIdleTimer, {passive: false});
window.addEventListener('keydown', resetIdleTimer);
resetIdleTimer();

// --- Dynamically Recalculate Wave Animation ---
function applyWaveDelays() {
    const cards = Array.from(grid.querySelectorAll('.square-card'));
    
    let gridTemplateCols = window.getComputedStyle(grid).gridTemplateColumns;
    let colsCount = gridTemplateCols.split(' ').length;
    if (colsCount === 0) colsCount = 1;

    cards.forEach((card, index) => {
        let gridX = index % colsCount;
        let gridY = Math.floor(index / colsCount);
        let pulse = card.querySelector('.wave-pulse');
        
        if (pulse) {
            pulse.style.animationDelay = `${(gridX + gridY) * 0.1}s`;
        }
    });
}

function executeGridPush() {
    const activeCard = document.querySelector('.square-card.active-card');
    if (!activeCard) return;

    const sidebarWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width')) || 500;
    const gap = 12;

    const cardLeftScreen = tPanX + (activeCard.offsetLeft * tScale);
    const cardRightScreen = cardLeftScreen + (activeCard.offsetWidth * cScale);

    const safeRight = viewport.clientWidth - sidebarWidth - 15 - gap; 
    const safeLeft = 15; 
    
    if (cardRightScreen > safeRight) {
        tPanX -= (cardRightScreen - safeRight); 
    } else if (cardLeftScreen < safeLeft) {
        tPanX += (safeLeft - cardLeftScreen); 
    }
    
    clampPan();
}

function closeSidebar() {
    document.body.classList.remove('sidebar-open');
    document.querySelectorAll('.square-card').forEach(c => c.classList.remove('active-card'));
    tSidebarX = 120;
}
closeSidebarBtn.addEventListener('click', closeSidebar);

// -- Dropdowns & Search --
const customSelect = document.getElementById('custom-select');
const customSelectTrigger = customSelect.querySelector('.custom-select-trigger');
const customOptionsContainer = document.getElementById('custom-options');

customSelectTrigger.addEventListener('click', (e) => {
    e.preventDefault(); e.stopPropagation(); 
    customSelect.classList.toggle('open');
});

window.addEventListener('click', (e) => {
    if (!e.target.closest('#custom-select')) customSelect.classList.remove('open');
});

customOptionsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('tag-pill')) {
        const val = e.target.getAttribute('data-value');
        if (val === 'all') currentFilters = [];
        else toggleFilterTag(val, false);
        updatePillUI(); applyFilters();
    }
});

function toggleFilterTag(tag, runFilter = true) {
    const index = currentFilters.indexOf(tag);
    if (index > -1) currentFilters.splice(index, 1);
    else currentFilters.push(tag);
    if(runFilter) { updatePillUI(); applyFilters(); }
}

function updatePillUI() {
    document.querySelectorAll('#sp-tags .tag-pill').forEach(pill => {
        if(currentFilters.includes(pill.textContent.toLowerCase())) pill.classList.add('active');
        else pill.classList.remove('active');
    });
    document.querySelectorAll('#custom-options .tag-pill').forEach(pill => {
        const val = pill.getAttribute('data-value');
        if(currentFilters.includes(val)) pill.classList.add('active');
        else pill.classList.remove('active');
    });

    const selectText = document.getElementById('custom-select-text');
    if (currentFilters.length === 0) {
        selectText.textContent = "All categories";
        customSelectTrigger.classList.remove('active');
    } else if (currentFilters.length === 1) {
        selectText.textContent = currentFilters[0];
        customSelectTrigger.classList.add('active');
    } else {
        selectText.textContent = `${currentFilters.length} tags`;
        customSelectTrigger.classList.add('active');
    }
}

// -- Sorting logic --
document.getElementById('btn-sort-az').addEventListener('click', (e) => {
    sortAzAsc = !sortAzAsc;
    e.currentTarget.textContent = sortAzAsc ? 'Sort A-Z' : 'Sort Z-A';
    currentGridItems.sort((a, b) => {
        const tA = (a.titolo || '').toLowerCase();
        const tB = (b.titolo || '').toLowerCase();
        return sortAzAsc ? tA.localeCompare(tB) : tB.localeCompare(tA);
    });
    reorderDOM();
});

document.getElementById('btn-sort-date').addEventListener('click', () => {
    isDateNewest = !isDateNewest;
    document.getElementById('date-sort-text').textContent = isDateNewest ? 'Newest' : 'Oldest';
    currentGridItems.sort((a, b) => {
        const dA = a.data ? new Date(a.data.anno, (a.data.mese||1)-1, a.data.giorno||1).getTime() : 0;
        const dB = b.data ? new Date(b.data.anno, (b.data.mese||1)-1, b.data.giorno||1).getTime() : 0;
        return isDateNewest ? dB - dA : dA - dB;
    });
    reorderDOM();
});

function reorderDOM() {
    currentGridItems.forEach(item => {
        if(item.domElement) grid.appendChild(item.domElement);
    });
    applyWaveDelays();
}

// --- Physics Sync Engine Variables ---
let tScale = 1, tPanX = 0, tPanY = 0;
let cScale = 1, cPanX = 0, cPanY = 0;
let isPanningGrid = false, hasDragged = false;
let startX = 0, startY = 0, initialPanX = 0, initialPanY = 0;
let lastMoveEvent = null, vX = 0, vY = 0; 
let isRandomAnimationActive = false; 

let tSidebarX = 120;
let cSidebarX = 120;

function clampPan() {
    if (isRandomAnimationActive) return;
    const isSidebarOpen = document.body.classList.contains('sidebar-open');
    const sidebarWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width')) || 500;
    const sidebarOffset = sidebarWidth + 15; 

    const gridW = viewport.clientWidth;
    const gridH = viewport.clientHeight;
    const scaledW = gridW * tScale;
    const scaledH = gridH * tScale;

    let minX = gridW - scaledW;
    let maxX = 0;

    if (isSidebarOpen) {
        minX = minX - sidebarOffset; 
    }

    if (scaledW <= gridW && !isSidebarOpen) { 
        tPanX = (gridW - scaledW) / 2; 
    } else { 
        tPanX = Math.max(minX, Math.min(maxX, tPanX)); 
    }

    if (scaledH <= gridH) { tPanY = (gridH - scaledH) / 2; } 
    else { tPanY = Math.max(gridH - scaledH, Math.min(0, tPanY)); }
}

function renderLoop() {
    clampPan(); 
    
    cPanX += (tPanX - cPanX) * 0.04;
    cPanY += (tPanY - cPanY) * 0.04;
    cScale += (tScale - cScale) * 0.04;
    cSidebarX += (tSidebarX - cSidebarX) * 0.04;

    if (Math.abs(tPanX - cPanX) < 0.1) cPanX = tPanX;
    if (Math.abs(tPanY - cPanY) < 0.1) cPanY = tPanY;
    if (Math.abs(tScale - cScale) < 0.001) cScale = tScale;
    if (Math.abs(tSidebarX - cSidebarX) < 0.1) cSidebarX = tSidebarX;

    grid.style.transform = `translate3d(${cPanX}px, ${cPanY}px, 0) scale(${cScale})`;
    
    if (window.innerWidth > 768) {
        sidePanel.style.transform = `translate3d(${cSidebarX}%, 0, 0)`;
    }

    if (cScale >= 1.5) {
        document.body.classList.add('zoomed-in');
        document.getElementById('btn-sort-az').classList.remove('disabled');
        document.getElementById('btn-sort-date').classList.remove('disabled');
    } else {
        document.body.classList.remove('zoomed-in');
        document.getElementById('btn-sort-az').classList.add('disabled');
        document.getElementById('btn-sort-date').classList.add('disabled');
    }

    requestAnimationFrame(renderLoop);
}
requestAnimationFrame(renderLoop);

function handleZoom(delta, clientX, clientY) {
    isRandomAnimationActive = false; 
    const zoomIntensity = 0.002;
    const minZoom = 1.0;
    let newScale = tScale * Math.exp(delta * zoomIntensity);
    newScale = Math.max(minZoom, Math.min(newScale, 4.0));

    const rect = viewport.getBoundingClientRect();
    const relX = (clientX - rect.left);
    const relY = (clientY - rect.top);

    tPanX = relX - (relX - tPanX) * (newScale / tScale);
    tPanY = relY - (relY - tPanY) * (newScale / tScale);
    tScale = newScale;
    clampPan();
}

viewport.addEventListener('wheel', (e) => {
    e.preventDefault(); handleZoom(-e.deltaY, e.clientX, e.clientY);
}, { passive: false });

function startPan(clientX, clientY) {
    isPanningGrid = true; hasDragged = false; isRandomAnimationActive = false; 
    vX = 0; vY = 0; startX = clientX; startY = clientY;
    initialPanX = tPanX; initialPanY = tPanY;
    lastMoveEvent = { clientX, clientY, time: Date.now() };
    document.body.classList.add('is-dragging');
}

function movePan(clientX, clientY) {
    if (isPanningGrid) {
        hasDragged = true;
        tPanX = initialPanX + (clientX - startX);
        tPanY = initialPanY + (clientY - startY);
        
        const now = Date.now();
        const dt = now - lastMoveEvent.time;
        if (dt > 0) {
            vX = Math.max(-5, Math.min(5, (clientX - lastMoveEvent.clientX) / dt));
            vY = Math.max(-5, Math.min(5, (clientY - lastMoveEvent.clientY) / dt));
        }
        lastMoveEvent = { clientX, clientY, time: now };
        clampPan();
    }
}

function endPan() {
    if (isPanningGrid) {
        isPanningGrid = false;
        document.body.classList.remove('is-dragging');
        tPanX += vX * 350; tPanY += vY * 350;
        clampPan(); 
        resetIdleTimer();
    }
}

viewport.addEventListener('mousedown', (e) => {
    if (e.button !== 0 || e.target.closest('iframe')) return;
    startPan(e.clientX, e.clientY);
});
window.addEventListener('mousemove', (e) => movePan(e.clientX, e.clientY));
window.addEventListener('mouseup', endPan);

viewport.addEventListener('touchstart', (e) => {
    if(e.touches.length === 1) startPan(e.touches[0].clientX, e.touches[0].clientY);
}, {passive: true});
window.addEventListener('touchmove', (e) => {
    if(e.touches.length === 1) movePan(e.touches[0].clientX, e.touches[0].clientY);
}, {passive: false});
window.addEventListener('touchend', endPan);

viewport.addEventListener('click', (e) => {
    if (hasDragged && e.target.closest('a')) e.preventDefault();
});
viewport.addEventListener('dragstart', (e) => {
    if (e.target.closest('a')) e.preventDefault();
});

function displayInSidePanel(p) {
    document.getElementById('sp-title').textContent = p.titolo || 'Senza Titolo';
    const authorStr = p.autore || 'Autore sconosciuto';
    
    const d = p.data;
    let dateStr = '00.00.0000';
    if (d && d.anno) {
        const day = String(d.giorno || 1).padStart(2, '0');
        const month = String(d.mese || 1).padStart(2, '0');
        dateStr = `${day}.${month}.${d.anno}`;
    }
    
    document.getElementById('sp-author').textContent = authorStr;
    document.getElementById('sp-year').textContent = `[ ${dateStr} ]`;
    document.getElementById('sp-desc').textContent = p.descrizione || 'Nessuna descrizione disponibile.';

  const imgPlaceholder = document.getElementById('image-placeholder');
    if (p.immagine && p.immagine.length > 0) {
        // UPDATED PATH: now points directly to the imgs/ folder
        imgPlaceholder.innerHTML = `<img src="imgs/${p.immagine[0]}" alt="${p.titolo}">`;
        imgPlaceholder.style.border = 'none';
    } else {
        imgPlaceholder.innerHTML = '<span>No Image</span>';
        imgPlaceholder.style.border = '1px solid var(--border-color)';
    }

    tagsContainer.innerHTML = '';
    if (p.tags && Array.isArray(p.tags)) {
        p.tags.forEach(tag => {
            const tagLower = tag.toLowerCase();
            const pill = document.createElement('div');
            pill.className = 'tag-pill';
            if(currentFilters.includes(tagLower)) pill.classList.add('active');
            pill.textContent = tagLower;
            pill.title = `Toggle filter: ${tagLower}`;
            
            pill.addEventListener('click', () => { toggleFilterTag(tagLower); });
            tagsContainer.appendChild(pill);
        });
    }

    const magicBtn = document.getElementById('sp-link');
    if (p.url && p.url !== '#') {
        magicBtn.style.display = 'flex';
        magicBtn.href = p.url;
    } else {
        magicBtn.style.display = 'none';
    }
}

function calculateSidebarWidth(cols, colW, gap) {
    let numSideCols = 4;
    if (cols <= 4) numSideCols = Math.max(1, cols - 1);
    return (numSideCols * colW) + ((numSideCols - 1) * gap);
}

function initializeDOMGrid(progetti) {
    grid.innerHTML = '';

    const targetW = viewport.clientWidth;
    const targetH = viewport.clientHeight;
    const viewRatio = targetW / targetH;
    const baseTotal = progetti.length;

    let cols = Math.ceil(Math.sqrt(baseTotal * viewRatio));
    cols = Math.max(1, cols);
    let rows = Math.ceil(baseTotal / cols);

    const gridPaddingTotal = 30; 
    const gap = 12;
    const colWidth = (targetW - gridPaddingTotal - (cols - 1) * gap) / cols;
    
    const exactSidebarW = calculateSidebarWidth(cols, colWidth, gap);
    document.documentElement.style.setProperty('--sidebar-width', `${exactSidebarW}px`);

    const neededItems = cols * rows;
    currentGridItems = [];
    for (let i = 0; i < neededItems; i++) {
        currentGridItems.push({ ...progetti[i % baseTotal] });
    }

    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    grid.style.gap = `${gap}px`; 

    currentGridItems.forEach((p, index) => {
        const card = document.createElement('a');
        card.href = p.url || '#';
        card.className = 'square-card';

        card.innerHTML = `
            <div class="wave-wrapper">
                <div class="wave-pulse"></div>
            </div>
            <div class="card-icon"></div>
            <div class="card-content">
                <div class="card-title">${p.titolo || 'Senza Titolo'}</div>
                <div class="card-meta">${p.autore || 'Autore Sconosciuto'}</div>
            </div>
        `;

        card.addEventListener('click', (e) => {
            e.preventDefault();
            if (hasDragged) return;

            if (card.classList.contains('active-card')) {
                closeSidebar();
            } else {
                document.body.classList.add('sidebar-open');
                document.querySelectorAll('.square-card').forEach(c => c.classList.remove('active-card'));
                card.classList.add('active-card');
                displayInSidePanel(p);
                
                tSidebarX = 0;
                executeGridPush(); 
            }
        });

        grid.appendChild(card);
        p.domElement = card; 
    });

    tScale = 1.0; tPanX = 0; tPanY = 0;
    cScale = tScale; cPanX = tPanX; cPanY = tPanY;
    clampPan(); applyFilters();
    
    applyWaveDelays();
}

function applyFilters() {
    const searchStr = currentSearch.toLowerCase().trim();

    currentGridItems.forEach(p => {
        let isMatch = true;
        if (currentSearch) {
            isMatch = (p.titolo && p.titolo.toLowerCase().includes(searchStr)) ||
                (p.autore && p.autore.toLowerCase().includes(searchStr));
        }
        if (currentFilters.length > 0) {
            const hasTag = p.tags && Array.isArray(p.tags) && currentFilters.some(f => p.tags.map(t=>t.toLowerCase()).includes(f));
            if (!hasTag) isMatch = false;
        }

        if (isMatch) p.domElement.classList.remove('dimmed-card');
        else p.domElement.classList.add('dimmed-card');
    });
    
    applyWaveDelays();
}

document.getElementById('search-bar').addEventListener('input', (e) => {
    currentSearch = e.target.value;
    applyFilters();
});

const btnRandom = document.getElementById('btn-random');
btnRandom.addEventListener('click', () => {
    btnRandom.classList.add('clicked-effect');
    setTimeout(() => btnRandom.classList.remove('clicked-effect'), 200);

    let availableCards = Array.from(document.querySelectorAll('.square-card:not(.dimmed-card)'));
    
    if (availableCards.length > 1) {
        availableCards = availableCards.filter(c => !c.classList.contains('active-card'));
    }
    if (availableCards.length === 0) return;

    document.querySelectorAll('.random-highlight').forEach(c => c.classList.remove('random-highlight'));
    let randCard = availableCards[Math.floor(Math.random() * availableCards.length)];

    randCard.click(); 
    randCard.classList.add('random-highlight');

    const gridW = viewport.clientWidth;
    const gridH = viewport.clientHeight;
    
    let cardLeft = randCard.offsetLeft;
    let cardTop = randCard.offsetTop;
    let cardWidth = randCard.offsetWidth;
    let cardHeight = randCard.offsetHeight;

    isRandomAnimationActive = true;
    tScale = 2.5; 
    
    let idealPanX = (gridW / 2) - ((cardLeft + cardWidth / 2) * tScale);
    let idealPanY = (gridH / 2) - ((cardTop + cardHeight / 2) * tScale);

    const scaledW = gridW * tScale;
    const scaledH = gridH * tScale;

    if (scaledW <= gridW) { idealPanX = (gridW - scaledW) / 2; } 
    else { idealPanX = Math.max(gridW - scaledW, Math.min(0, idealPanX)); }

    if (scaledH <= gridH) { idealPanY = (gridH - scaledH) / 2; } 
    else { idealPanY = Math.max(gridH - scaledH, Math.min(0, idealPanY)); }

    tPanX = idealPanX;
    tPanY = idealPanY;

    setTimeout(() => {
        randCard.classList.remove('random-highlight');
        isRandomAnimationActive = false; 
    }, 3000);
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generateProceduralProjects(count) {
    const mockCategories = ['2D', '3D', 'Apollo', 'Astronomy', 'Audio', 'Climate', 'Science', 'Data visualization', 'Earth', 'Planets', 'Educational', 'Game', 'History', 'Archive', 'Robot', 'Space'];
    let data = [];
    for (let i = 0; i < count; i++) {
        const cat = mockCategories[Math.floor(Math.random() * mockCategories.length)];
        data.push({
            "titolo": `Mock Project ${i + 1}`,
            "descrizione": "Mock data generato perché data.json non è stato trovato.",
            "immagine": [],
            "url": "#",
            "data": { 
                "giorno": Math.floor(Math.random() * 28) + 1, 
                "mese": Math.floor(Math.random() * 12) + 1, 
                "anno": 1958 + Math.floor(Math.random() * 70) 
            },
            "autore": "Riccardo Vosti",
            "tags": [cat]
        });
    }
    return data;
}

async function loadData() {
    let baseData = [];
    
    try {
       
        const response = await fetch('assets/data.json');
        baseData = await response.json();
    } catch (err) {
        console.warn("Could not load data.json. Falling back to procedural generation.");
        baseData = generateProceduralProjects(10);
    }

    if (baseData.length > 0) {
        let duplicated = [];
        while (duplicated.length < 100) {
            let clones = baseData.map(item => JSON.parse(JSON.stringify(item)));
            duplicated = duplicated.concat(clones);
        }
        tuttiIProgetti = duplicated.slice(0, 100);
        shuffleArray(tuttiIProgetti);
    }

    const fixedTags = [
        '2D', '3D', 'Apollo', 'Astronomy', 'Audio', 'Climate', 
        'Science', 'Data visualization', 'Earth', 'Planets', 
        'Educational', 'Game', 'History', 'Archive', 'Robot', 'Space'
    ];
    
    fixedTags.forEach(tag => {
        const div = document.createElement('div');
        div.className = 'tag-pill'; 
        div.setAttribute('data-value', tag.toLowerCase());
        div.textContent = tag.toLowerCase(); 
        customOptionsContainer.appendChild(div);
    });

    initializeDOMGrid(tuttiIProgetti);
}

window.addEventListener('resize', () => {
    if (tuttiIProgetti.length > 0) {
        initializeDOMGrid(tuttiIProgetti);
    }
});

loadData();
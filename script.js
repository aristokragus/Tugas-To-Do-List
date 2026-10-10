// ==========================================================================
// Catatan Tugas • Dual-Pane Productivity Desk Engine
// Architecture: Linear / Routine Inspired Productivity Workspace
// Storage: LocalStorage • Google Calendar Web Intent (Option A) • Zero XSS
// ==========================================================================

const STORAGE_KEY_TASKS = 'todo_tasks_v2';
const STORAGE_KEY_CATEGORIES = 'todo_categories_v2';

// Default starter categories
const DEFAULT_CATEGORIES = [
    { id: 'kuliah', name: 'Kuliah STIKOM', color: '#3B82F6' },
    { id: 'proyek', name: 'Proyek & Coding', color: '#10B981' },
    { id: 'freelance', name: 'Freelance & Kerja', color: '#8B5CF6' },
    { id: 'pribadi', name: 'Pribadi', color: '#F59E0B' }
];

// App State
let tasks = [];
let categories = [];
let activeFilter = 'all'; // 'all' | 'today' | 'important' | 'upcoming' | 'completed'
let selectedCategory = '';
let searchQuery = '';
let currentSort = 'default';
let activeTaskId = null;
let taskToDeleteId = null;

// Calendar State
let calCurrentYear = new Date().getFullYear();
let calCurrentMonth = new Date().getMonth(); // 0-11
let calFilteredDate = null; // 'YYYY-MM-DD' or null

// Month Names in Indonesian
const MONTH_NAMES = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

// ==========================================================================
// DOM Elements
// ==========================================================================

// Header & Controls
const globalSearchInput = document.getElementById('globalSearchInput');
const topActiveCountText = document.getElementById('topActiveCountText');
const filterPills = document.querySelectorAll('.filter-pill');
const badgeToday = document.getElementById('badgeToday');
const badgeImportant = document.getElementById('badgeImportant');
const badgeUpcoming = document.getElementById('badgeUpcoming');
const badgeCompleted = document.getElementById('badgeCompleted');
const categoryFilterSelect = document.getElementById('categoryFilterSelect');
const sortSelect = document.getElementById('sortSelect');
const btnAddCategoryBtn = document.getElementById('btnAddCategoryBtn');

// Mobile Tabs
const tabBtnAgenda = document.getElementById('tabBtnAgenda');
const tabBtnCalendar = document.getElementById('tabBtnCalendar');
const workspaceLayout = document.querySelector('.workspace-layout');

// Composer
const composerInput = document.getElementById('composerInput');
const btnComposerSubmit = document.getElementById('btnComposerSubmit');
const composerDueDate = document.getElementById('composerDueDate');
const composerCategorySelect = document.getElementById('composerCategorySelect');
const composerPriorityBtn = document.getElementById('composerPriorityBtn');

// Stream Lists
const groupOverdue = document.getElementById('groupOverdue');
const listOverdue = document.getElementById('listOverdue');
const countOverdue = document.getElementById('countOverdue');
const groupActive = document.getElementById('groupActive');
const listActive = document.getElementById('listActive');
const countActive = document.getElementById('countActive');
const activeGroupHeading = document.getElementById('activeGroupHeading');
const groupCompleted = document.getElementById('groupCompleted');
const listCompleted = document.getElementById('listCompleted');
const completedAccordionBtn = document.getElementById('completedAccordionBtn');
const completedChevron = document.getElementById('completedChevron');
const completedCountBadge = document.getElementById('completedCountBadge');

// Calendar Desk
const calMonthYear = document.getElementById('calMonthYear');
const calPrevMonth = document.getElementById('calPrevMonth');
const calNextMonth = document.getElementById('calNextMonth');
const calTodayBtn = document.getElementById('calTodayBtn');
const calDaysGrid = document.getElementById('calDaysGrid');
const calFilterBanner = document.getElementById('calFilterBanner');
const calBannerDate = document.getElementById('calBannerDate');
const btnClearCalFilter = document.getElementById('btnClearCalFilter');

// Inspector Desk
const taskInspectorCard = document.getElementById('taskInspectorCard');
const inspectorEmptyState = document.getElementById('inspectorEmptyState');
const inspectorContent = document.getElementById('inspectorContent');
const metricTotalTasks = document.getElementById('metricTotalTasks');
const metricDueToday = document.getElementById('metricDueToday');
const metricCompletionRate = document.getElementById('metricCompletionRate');

// Inspector Active Elements
const inspectorStatusBadge = document.getElementById('inspectorStatusBadge');
const inspectorCheckBtn = document.getElementById('inspectorCheckBtn');
const inspectorStatusText = document.getElementById('inspectorStatusText');
const inspectorStarBtn = document.getElementById('inspectorStarBtn');
const btnCloseInspector = document.getElementById('btnCloseInspector');
const inspectorTitleInput = document.getElementById('inspectorTitleInput');
const btnGCalIntentAction = document.getElementById('btnGCalIntentAction');
const inspectorDueDate = document.getElementById('inspectorDueDate');
const inspectorDueTime = document.getElementById('inspectorDueTime');
const inspectorCategorySelect = document.getElementById('inspectorCategorySelect');
const inspectorSubtaskRatio = document.getElementById('inspectorSubtaskRatio');
const subtaskProgressFill = document.getElementById('subtaskProgressFill');
const inspectorSubtaskList = document.getElementById('inspectorSubtaskList');
const inspectorNewSubtaskInput = document.getElementById('inspectorNewSubtaskInput');
const inspectorNotesTextarea = document.getElementById('inspectorNotesTextarea');
const inspectorCreatedInfo = document.getElementById('inspectorCreatedInfo');
const btnInspectorDelete = document.getElementById('btnInspectorDelete');

// Modals
const categoryModal = document.getElementById('categoryModal');
const modalCategoryInput = document.getElementById('modalCategoryInput');
const catModalCancel = document.getElementById('catModalCancel');
const catModalConfirm = document.getElementById('catModalConfirm');

const deleteModal = document.getElementById('deleteModal');
const deleteModalCancel = document.getElementById('deleteModalCancel');
const deleteModalConfirm = document.getElementById('deleteModalConfirm');

// ==========================================================================
// Helpers
// ==========================================================================

function uid() {
    return 't_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
}

function getTodayString() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDateIndo(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    const today = getTodayString();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

    if (dateStr === today) return 'Hari Ini';
    if (dateStr === tomorrowStr) return 'Besok';

    return d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
}

// ==========================================================================
// Storage Operations
// ==========================================================================

function loadData() {
    // 1. Categories
    try {
        const storedCats = localStorage.getItem(STORAGE_KEY_CATEGORIES);
        if (storedCats) {
            categories = JSON.parse(storedCats);
        } else {
            categories = [...DEFAULT_CATEGORIES];
            saveCategories();
        }
    } catch (e) {
        categories = [...DEFAULT_CATEGORIES];
    }

    // 2. Tasks
    try {
        const storedTasks = localStorage.getItem(STORAGE_KEY_TASKS);
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
        } else {
            // Seed starter tasks
            tasks = [
                {
                    id: uid(),
                    text: 'Integrasikan arsitektur produktivitas Dual-Pane Desk',
                    completed: true,
                    completedAt: Date.now() - 3600000,
                    important: true,
                    dueDate: getTodayString(),
                    dueTime: '09:00',
                    category: 'proyek',
                    notes: 'Memisahkan agenda stream di kiri dan kalender interaktif serta task inspector di kanan.',
                    subtasks: [
                        { id: uid(), text: 'Rancang top command bar minimalis', completed: true },
                        { id: uid(), text: 'Tata layout grid 2-kolom responsif', completed: true },
                        { id: uid(), text: 'Hubungkan sinkronisasi state inspector', completed: true }
                    ],
                    createdAt: Date.now() - 7200000
                },
                {
                    id: uid(),
                    text: 'Uji sinkronisasi Google Calendar Web Intent (Opsi A)',
                    completed: false,
                    completedAt: null,
                    important: true,
                    dueDate: getTodayString(),
                    dueTime: '14:30',
                    category: 'kuliah',
                    notes: 'Buka agenda ini lalu klik tombol "Tambah ke GCal" di panel kanan untuk menguji intent template.',
                    subtasks: [
                        { id: uid(), text: 'Periksa format tanggal & jam ISO UTC', completed: false },
                        { id: uid(), text: 'Verifikasi checklist langkah ikut tersalin ke deskripsi acara', completed: false }
                    ],
                    createdAt: Date.now()
                },
                {
                    id: uid(),
                    text: 'Siapkan laporan kemajuan tugas kuliah STIKOM',
                    completed: false,
                    completedAt: null,
                    important: false,
                    dueDate: getTodayString(),
                    dueTime: '17:00',
                    category: 'kuliah',
                    notes: 'Kumpulkan catatan praktikum dan pastikan daftar repositori GitHub sudah rapi.',
                    subtasks: [
                        { id: uid(), text: 'Audit file tugas', completed: false }
                    ],
                    createdAt: Date.now()
                }
            ];
            saveTasks();
        }
    } catch (e) {
        tasks = [];
    }
}

function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
        updateStatsAndBadges();
    } catch (e) {
        console.error('Gagal menyimpan tugas ke localStorage:', e);
    }
}

function saveCategories() {
    try {
        localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
    } catch (e) {
        console.error('Gagal menyimpan kategori ke localStorage:', e);
    }
}

// ==========================================================================
// Category Rendering & Select Options
// ==========================================================================

function renderCategories() {
    categoryFilterSelect.replaceChildren();
    composerCategorySelect.replaceChildren();
    inspectorCategorySelect.replaceChildren();

    // Default "Semua Kategori" option
    const optAllFilter = document.createElement('option');
    optAllFilter.value = '';
    optAllFilter.textContent = 'Semua Kategori';
    categoryFilterSelect.appendChild(optAllFilter);

    const optNoneComp = document.createElement('option');
    optNoneComp.value = '';
    optNoneComp.textContent = 'Pilih Kategori...';
    composerCategorySelect.appendChild(optNoneComp);

    const optNoneInsp = document.createElement('option');
    optNoneInsp.value = '';
    optNoneInsp.textContent = 'Tanpa Kategori';
    inspectorCategorySelect.appendChild(optNoneInsp);

    categories.forEach(cat => {
        // Filter option
        const optF = document.createElement('option');
        optF.value = cat.id;
        optF.textContent = cat.name;
        categoryFilterSelect.appendChild(optF);

        // Composer option
        const optC = document.createElement('option');
        optC.value = cat.id;
        optC.textContent = cat.name;
        composerCategorySelect.appendChild(optC);

        // Inspector option
        const optI = document.createElement('option');
        optI.value = cat.id;
        optI.textContent = cat.name;
        inspectorCategorySelect.appendChild(optI);
    });

    categoryFilterSelect.value = selectedCategory;
}

// ==========================================================================
// Stats, Badges, and Summary Metrics
// ==========================================================================

function updateStatsAndBadges() {
    const todayStr = getTodayString();
    const activeTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);

    const dueTodayCount = activeTasks.filter(t => t.dueDate === todayStr).length;
    const importantCount = activeTasks.filter(t => t.important).length;
    const upcomingCount = activeTasks.filter(t => Boolean(t.dueDate)).length;

    // Badges in filter strip
    if (badgeToday) badgeToday.textContent = dueTodayCount;
    if (badgeImportant) badgeImportant.textContent = importantCount;
    if (badgeUpcoming) badgeUpcoming.textContent = upcomingCount;
    if (badgeCompleted) badgeCompleted.textContent = completedTasks.length;

    // Top command bar active count
    if (topActiveCountText) {
        topActiveCountText.textContent = `${activeTasks.length} Tugas Aktif`;
    }

    // Inspector empty desk metrics
    if (metricTotalTasks) metricTotalTasks.textContent = tasks.length;
    if (metricDueToday) metricDueToday.textContent = dueTodayCount;
    if (metricCompletionRate) {
        const rate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
        metricCompletionRate.textContent = `${rate}%`;
    }
}

// ==========================================================================
// Filtering & Sorting
// ==========================================================================

function getFilteredTasks() {
    const todayStr = getTodayString();
    let result = [...tasks];

    // 1. Calendar date filter (if user clicked a date in calendar widget)
    if (calFilteredDate) {
        result = result.filter(t => t.dueDate === calFilteredDate);
    }

    // 2. Filter Pills
    if (activeFilter === 'today') {
        result = result.filter(t => t.dueDate === todayStr);
    } else if (activeFilter === 'important') {
        result = result.filter(t => t.important);
    } else if (activeFilter === 'upcoming') {
        result = result.filter(t => Boolean(t.dueDate) && !t.completed);
    } else if (activeFilter === 'completed') {
        result = result.filter(t => t.completed);
    }

    // 3. Category Filter
    if (selectedCategory) {
        result = result.filter(t => t.category === selectedCategory);
    }

    // 4. Global Search Query
    if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        result = result.filter(t =>
            t.text.toLowerCase().includes(q) ||
            (t.notes && t.notes.toLowerCase().includes(q)) ||
            (t.subtasks && t.subtasks.some(s => s.text.toLowerCase().includes(q)))
        );
    }

    // 5. Sorting
    return result.sort((a, b) => {
        if (currentSort === 'dueDate') {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return a.dueDate.localeCompare(b.dueDate);
        } else if (currentSort === 'alpha') {
            return a.text.localeCompare(b.text);
        }
        // Default: Important first, then newest createdAt
        if (a.important && !b.important) return -1;
        if (!a.important && b.important) return 1;
        return (b.createdAt || 0) - (a.createdAt || 0);
    });
}

// ==========================================================================
// DOM Creation: Task Card (Linear Style)
// ==========================================================================

function createTaskCardElement(task) {
    const li = document.createElement('li');
    li.className = 'task-item-card' + (task.completed ? ' is-completed' : '') + (task.id === activeTaskId ? ' is-active-selected' : '');
    li.dataset.id = task.id;

    // Checkbox button
    const checkBtn = document.createElement('button');
    checkBtn.type = 'button';
    checkBtn.className = 'card-checkbox';
    checkBtn.title = task.completed ? 'Tandai belum selesai' : 'Tandai selesai';
    checkBtn.innerHTML = '<i class="fas fa-check"></i>';
    checkBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleCompleteTask(task.id);
    });
    li.appendChild(checkBtn);

    // Body content area
    const bodyArea = document.createElement('div');
    bodyArea.className = 'card-body-area';

    const titleText = document.createElement('span');
    titleText.className = 'card-title-text';
    titleText.textContent = task.text;
    bodyArea.appendChild(titleText);

    // Meta tags
    const metaTags = document.createElement('div');
    metaTags.className = 'card-meta-tags';

    const todayStr = getTodayString();

    // Due Date Tag
    if (task.dueDate) {
        const isOverdue = !task.completed && task.dueDate < todayStr;
        const isToday = task.dueDate === todayStr;

        const tag = document.createElement('span');
        tag.className = 'tag-badge' + (isOverdue ? ' due-overdue' : isToday ? ' due-today' : '');
        tag.innerHTML = `<i class="fas fa-calendar-day"></i> <span>${formatDateIndo(task.dueDate)}${task.dueTime ? ' ' + task.dueTime : ''}</span>`;
        metaTags.appendChild(tag);
    }

    // Category Tag
    if (task.category) {
        const cat = categories.find(c => c.id === task.category);
        if (cat) {
            const catPill = document.createElement('span');
            catPill.className = 'tag-badge category-pill';
            catPill.textContent = cat.name;
            metaTags.appendChild(catPill);
        }
    }

    // Subtask count tag
    if (task.subtasks && task.subtasks.length > 0) {
        const done = task.subtasks.filter(s => s.completed).length;
        const subStat = document.createElement('span');
        subStat.className = 'tag-badge subtask-stat';
        subStat.innerHTML = `<i class="fas fa-list-check"></i> <span>${done}/${task.subtasks.length}</span>`;
        metaTags.appendChild(subStat);
    }

    // Notes indicator
    if (task.notes && task.notes.trim() !== '') {
        const noteTag = document.createElement('span');
        noteTag.className = 'tag-badge';
        noteTag.innerHTML = '<i class="fas fa-align-left" title="Catatan terlampir"></i>';
        metaTags.appendChild(noteTag);
    }

    bodyArea.appendChild(metaTags);
    li.appendChild(bodyArea);

    // Priority star button
    const starBtn = document.createElement('button');
    starBtn.type = 'button';
    starBtn.className = 'card-priority-btn' + (task.important ? ' is-important' : '');
    starBtn.title = task.important ? 'Hapus prioritas' : 'Tandai prioritas';
    starBtn.innerHTML = task.important ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
    starBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleImportantTask(task.id);
    });
    li.appendChild(starBtn);

    // Card click selects task into right inspector
    li.addEventListener('click', () => {
        selectTask(task.id);
    });

    return li;
}

// ==========================================================================
// Stream Rendering
// ==========================================================================

function renderAgendaStream() {
    listOverdue.replaceChildren();
    listActive.replaceChildren();
    listCompleted.replaceChildren();

    const todayStr = getTodayString();
    const filtered = getFilteredTasks();

    if (activeFilter === 'completed') {
        groupOverdue.style.display = 'none';
        groupActive.style.display = 'none';
        groupCompleted.style.display = 'flex';
        completedAccordionBtn.style.display = 'none'; // not needed in completed-only tab
        listCompleted.style.display = 'flex';

        if (filtered.length === 0) {
            const empty = document.createElement('li');
            empty.className = 'empty-stream-notice';
            empty.innerHTML = `
                <i class="fas fa-circle-check"></i>
                <h3>Belum Ada Tugas Selesai</h3>
                <p>Tugas yang telah selesai dikerjakan akan diarsipkan di sini.</p>
            `;
            listCompleted.appendChild(empty);
        } else {
            filtered.forEach(t => listCompleted.appendChild(createTaskCardElement(t)));
        }
        return;
    }

    // Standard view split
    const overdueTasks = filtered.filter(t => !t.completed && t.dueDate && t.dueDate < todayStr);
    const activeTasks = filtered.filter(t => !t.completed && (!t.dueDate || t.dueDate >= todayStr));
    const completedTasks = filtered.filter(t => t.completed);

    // 1. Overdue Group
    if (overdueTasks.length > 0) {
        groupOverdue.style.display = 'flex';
        countOverdue.textContent = overdueTasks.length;
        overdueTasks.forEach(t => listOverdue.appendChild(createTaskCardElement(t)));
    } else {
        groupOverdue.style.display = 'none';
    }

    // 2. Active Group
    groupActive.style.display = 'flex';
    countActive.textContent = activeTasks.length;
    if (activeTasks.length === 0 && overdueTasks.length === 0) {
        const empty = document.createElement('li');
        empty.className = 'empty-stream-notice';
        empty.innerHTML = `
            <i class="fas fa-inbox"></i>
            <h3>Tidak Ada Agenda Aktif</h3>
            <p>Fokus Anda sedang kosong. Tulis agenda baru pada kotak di atas.</p>
        `;
        listActive.appendChild(empty);
    } else {
        activeTasks.forEach(t => listActive.appendChild(createTaskCardElement(t)));
    }

    // 3. Completed Accordion
    if (completedTasks.length > 0) {
        groupCompleted.style.display = 'flex';
        completedAccordionBtn.style.display = 'flex';
        completedCountBadge.textContent = completedTasks.length;
        completedTasks.forEach(t => listCompleted.appendChild(createTaskCardElement(t)));
    } else {
        groupCompleted.style.display = 'none';
    }

    updateStatsAndBadges();
    renderCalendarWidget();
}

// ==========================================================================
// Task Actions: Create, Complete, Priority, Delete
// ==========================================================================

function handleCreateTask() {
    const text = composerInput.value.trim();
    if (text === '') return;

    const newTask = {
        id: uid(),
        text: text,
        completed: false,
        completedAt: null,
        important: composerPriorityBtn.classList.contains('active'),
        dueDate: composerDueDate.value || (activeFilter === 'today' ? getTodayString() : null),
        dueTime: null,
        category: composerCategorySelect.value || selectedCategory || '',
        notes: '',
        subtasks: [],
        createdAt: Date.now()
    };

    tasks.unshift(newTask);
    saveTasks();
    renderAgendaStream();

    // Select the new task automatically
    selectTask(newTask.id);

    // Reset composer form
    composerInput.value = '';
    composerDueDate.value = '';
    composerCategorySelect.value = '';
    composerPriorityBtn.classList.remove('active');
    composerPriorityBtn.querySelector('i').className = 'far fa-star';
    composerInput.focus();
}

function toggleCompleteTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    task.completed = !task.completed;
    task.completedAt = task.completed ? Date.now() : null;

    saveTasks();
    renderAgendaStream();
    if (activeTaskId === id) syncInspector(task);
}

function toggleImportantTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    task.important = !task.important;

    saveTasks();
    renderAgendaStream();
    if (activeTaskId === id) syncInspector(task);
}

// ==========================================================================
// Right Pane: Task Inspector Desk Synchronization
// ==========================================================================

function selectTask(taskId) {
    activeTaskId = taskId;
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        inspectorEmptyState.style.display = 'flex';
        inspectorContent.style.display = 'none';
        document.querySelectorAll('.task-item-card').forEach(el => el.classList.remove('is-active-selected'));
        return;
    }

    // Highlight card
    document.querySelectorAll('.task-item-card').forEach(el => {
        el.classList.toggle('is-active-selected', el.dataset.id === taskId);
    });

    syncInspector(task);
    inspectorEmptyState.style.display = 'none';
    inspectorContent.style.display = 'flex';

    // On mobile screens, automatically show context hub pane when task is selected
    if (window.innerWidth <= 1024) {
        workspaceLayout.classList.add('show-calendar-pane');
        tabBtnAgenda.classList.remove('active');
        tabBtnCalendar.classList.add('active');
    }
}

function deselectTask() {
    activeTaskId = null;
    inspectorEmptyState.style.display = 'flex';
    inspectorContent.style.display = 'none';
    document.querySelectorAll('.task-item-card').forEach(el => el.classList.remove('is-active-selected'));
}

function syncInspector(task) {
    // Status button & text
    inspectorCheckBtn.classList.toggle('is-checked', task.completed);
    inspectorStatusText.textContent = task.completed ? 'Selesai' : 'Belum Selesai';

    // Priority star
    inspectorStarBtn.className = 'btn-star-inspector' + (task.important ? ' is-important' : '');
    inspectorStarBtn.innerHTML = task.important ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';

    // Title
    inspectorTitleInput.value = task.text;

    // Due Date & Time
    inspectorDueDate.value = task.dueDate || '';
    inspectorDueTime.value = task.dueTime || '';

    // Category
    inspectorCategorySelect.value = task.category || '';

    // Notes
    inspectorNotesTextarea.value = task.notes || '';

    // Created Date
    const d = new Date(task.createdAt || Date.now());
    inspectorCreatedInfo.textContent = `Dibuat ${d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}`;

    // Subtasks
    renderInspectorSubtasks(task);
}

function renderInspectorSubtasks(task) {
    inspectorSubtaskList.replaceChildren();
    if (!task.subtasks) task.subtasks = [];

    const total = task.subtasks.length;
    const done = task.subtasks.filter(s => s.completed).length;

    inspectorSubtaskRatio.textContent = `${done}/${total}`;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    subtaskProgressFill.style.width = `${pct}%`;

    task.subtasks.forEach(sub => {
        const li = document.createElement('li');
        li.className = 'inspector-subtask-item' + (sub.completed ? ' is-completed' : '');

        const chk = document.createElement('button');
        chk.type = 'button';
        chk.className = 'subtask-chk';
        chk.innerHTML = '<i class="fas fa-check"></i>';
        chk.addEventListener('click', () => {
            sub.completed = !sub.completed;
            saveTasks();
            renderAgendaStream();
            renderInspectorSubtasks(task);
        });

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'subtask-input-field';
        input.value = sub.text;
        input.addEventListener('change', () => {
            sub.text = input.value.trim();
            saveTasks();
            renderAgendaStream();
        });

        const del = document.createElement('button');
        del.type = 'button';
        del.className = 'btn-remove-subtask';
        del.innerHTML = '<i class="fas fa-xmark"></i>';
        del.addEventListener('click', () => {
            task.subtasks = task.subtasks.filter(s => s.id !== sub.id);
            saveTasks();
            renderAgendaStream();
            renderInspectorSubtasks(task);
        });

        li.appendChild(chk);
        li.appendChild(input);
        li.appendChild(del);
        inspectorSubtaskList.appendChild(li);
    });
}

function handleAddSubtask() {
    if (!activeTaskId) return;
    const task = tasks.find(t => t.id === activeTaskId);
    if (!task) return;

    const val = inspectorNewSubtaskInput.value.trim();
    if (val === '') return;

    if (!task.subtasks) task.subtasks = [];
    task.subtasks.push({
        id: uid(),
        text: val,
        completed: false
    });

    saveTasks();
    renderAgendaStream();
    renderInspectorSubtasks(task);
    inspectorNewSubtaskInput.value = '';
    inspectorNewSubtaskInput.focus();
}

// ==========================================================================
// Google Calendar Web Intent Generator (Option A)
// ==========================================================================

function triggerGoogleCalendarIntent(task) {
    if (!task.dueDate) {
        alert('Tentukan batas waktu (tanggal deadline) terlebih dahulu pada tugas ini sebelum menambahkannya ke Google Calendar.');
        inspectorDueDate.focus();
        return;
    }

    const title = encodeURIComponent(task.text);
    let datesParam = '';
    const cleanDate = task.dueDate.replace(/-/g, '');

    if (task.dueTime) {
        // Specific time: convert local date+time to ISO UTC string
        const startLocal = new Date(task.dueDate + 'T' + task.dueTime + ':00');
        const startIso = startLocal.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

        // 1 hour duration
        const endLocal = new Date(startLocal.getTime() + 60 * 60 * 1000);
        const endIso = endLocal.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

        datesParam = `${startIso}/${endIso}`;
    } else {
        // All-day event: start day to next day in YYYYMMDD
        const parts = task.dueDate.split('-');
        const nextDay = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]) + 1);
        const nextDayStr = `${nextDay.getFullYear()}${String(nextDay.getMonth() + 1).padStart(2, '0')}${String(nextDay.getDate()).padStart(2, '0')}`;
        datesParam = `${cleanDate}/${nextDayStr}`;
    }

    // Construct event description
    let details = `Catatan Tugas Agenda\nStatus: ${task.completed ? 'Selesai' : 'Belum Selesai'}\n`;
    if (task.notes && task.notes.trim() !== '') {
        details += `\nDeskripsi / Catatan:\n${task.notes}\n`;
    }
    if (task.subtasks && task.subtasks.length > 0) {
        details += `\nDaftar Sub-tugas:\n`;
        task.subtasks.forEach(s => {
            details += `${s.completed ? '☑' : '☐'} ${s.text}\n`;
        });
    }

    const detailsEncoded = encodeURIComponent(details);
    const intentUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${datesParam}&details=${detailsEncoded}`;

    // Open Google Calendar in new tab
    window.open(intentUrl, '_blank', 'noopener,noreferrer');
}

// ==========================================================================
// Interactive Calendar Widget Desk
// ==========================================================================

function renderCalendarWidget() {
    calMonthYear.textContent = `${MONTH_NAMES[calCurrentMonth]} ${calCurrentYear}`;
    calDaysGrid.replaceChildren();

    const firstDayIndex = new Date(calCurrentYear, calCurrentMonth, 1).getDay(); // 0 = Sun
    const totalDaysInMonth = new Date(calCurrentYear, calCurrentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(calCurrentYear, calCurrentMonth, 0).getDate();

    const todayStr = getTodayString();

    // Map tasks by date
    const taskDateMap = {};
    tasks.forEach(t => {
        if (t.dueDate) {
            if (!taskDateMap[t.dueDate]) taskDateMap[t.dueDate] = [];
            taskDateMap[t.dueDate].push(t);
        }
    });

    // 1. Prev month days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
        const cell = document.createElement('div');
        cell.className = 'cal-cell is-other-month';
        cell.textContent = prevMonthDays - i;
        calDaysGrid.appendChild(cell);
    }

    // 2. Current month days
    for (let day = 1; day <= totalDaysInMonth; day++) {
        const dateStr = `${calCurrentYear}-${String(calCurrentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const cell = document.createElement('div');
        cell.className = 'cal-cell';
        if (dateStr === todayStr) cell.classList.add('is-today');
        if (dateStr === calFilteredDate) cell.classList.add('is-active-filter');

        const numSpan = document.createElement('span');
        numSpan.textContent = day;
        cell.appendChild(numSpan);

        // Task dots
        const dayTasks = taskDateMap[dateStr] || [];
        if (dayTasks.length > 0) {
            const dotsWrap = document.createElement('div');
            dotsWrap.className = 'cal-dots';
            const count = Math.min(dayTasks.length, 3);
            for (let d = 0; d < count; d++) {
                const dot = document.createElement('span');
                dot.className = 'cal-dot' + (dayTasks[d].important ? ' has-important' : '');
                dotsWrap.appendChild(dot);
            }
            cell.appendChild(dotsWrap);
        }

        // Click on date filters agenda stream
        cell.addEventListener('click', () => {
            if (calFilteredDate === dateStr) {
                clearCalendarFilter();
            } else {
                setCalendarFilter(dateStr);
            }
        });

        calDaysGrid.appendChild(cell);
    }
}

function setCalendarFilter(dateStr) {
    calFilteredDate = dateStr;
    calFilterBanner.style.display = 'flex';
    calBannerDate.textContent = formatDateIndo(dateStr);
    renderAgendaStream();
}

function clearCalendarFilter() {
    calFilteredDate = null;
    calFilterBanner.style.display = 'none';
    renderAgendaStream();
}

// ==========================================================================
// Modals & Handlers
// ==========================================================================

function openCategoryModal() {
    modalCategoryInput.value = '';
    categoryModal.classList.add('active');
    modalCategoryInput.focus();
}

function closeCategoryModal() {
    categoryModal.classList.remove('active');
}

function confirmAddCategory() {
    const name = modalCategoryInput.value.trim();
    if (name === '') return;

    const newId = 'cat_' + Date.now().toString(36);
    categories.push({
        id: newId,
        name: name,
        color: '#3B82F6'
    });

    saveCategories();
    renderCategories();
    closeCategoryModal();

    // Select the newly created category
    selectedCategory = newId;
    categoryFilterSelect.value = newId;
    renderAgendaStream();
}

function openDeleteModal(taskId) {
    taskToDeleteId = taskId;
    deleteModal.classList.add('active');
}

function closeDeleteModal() {
    deleteModal.classList.remove('active');
    taskToDeleteId = null;
}

function confirmDeleteTask() {
    if (taskToDeleteId) {
        tasks = tasks.filter(t => t.id !== taskToDeleteId);
        saveTasks();
        if (activeTaskId === taskToDeleteId) {
            deselectTask();
        }
        renderAgendaStream();
    }
    closeDeleteModal();
}

// ==========================================================================
// Event Listeners Binding
// ==========================================================================

function initEventListeners() {
    // 1. Top Search
    globalSearchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderAgendaStream();
    });

    // 2. Filter Pills
    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            activeFilter = pill.dataset.filter;
            renderAgendaStream();
        });
    });

    // 3. Category Filter Select
    categoryFilterSelect.addEventListener('change', (e) => {
        selectedCategory = e.target.value;
        renderAgendaStream();
    });

    // 4. Sort Select
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderAgendaStream();
    });

    // 5. Add Category Button
    btnAddCategoryBtn.addEventListener('click', openCategoryModal);
    catModalCancel.addEventListener('click', closeCategoryModal);
    catModalConfirm.addEventListener('click', confirmAddCategory);
    modalCategoryInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') confirmAddCategory();
    });

    // 6. Composer Submit
    btnComposerSubmit.addEventListener('click', handleCreateTask);
    composerInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleCreateTask();
        }
    });

    // Priority Toggle in Composer
    composerPriorityBtn.addEventListener('click', () => {
        const isAct = composerPriorityBtn.classList.toggle('active');
        composerPriorityBtn.querySelector('i').className = isAct ? 'fas fa-star' : 'far fa-star';
    });

    // 7. Completed Accordion Toggle
    completedAccordionBtn.addEventListener('click', () => {
        const isShow = listCompleted.style.display !== 'none';
        listCompleted.style.display = isShow ? 'none' : 'flex';
        completedChevron.classList.toggle('rotate', !isShow);
    });

    // 8. Calendar Widget Controls
    calPrevMonth.addEventListener('click', () => {
        calCurrentMonth--;
        if (calCurrentMonth < 0) {
            calCurrentMonth = 11;
            calCurrentYear--;
        }
        renderCalendarWidget();
    });

    calNextMonth.addEventListener('click', () => {
        calCurrentMonth++;
        if (calCurrentMonth > 11) {
            calCurrentMonth = 0;
            calCurrentYear++;
        }
        renderCalendarWidget();
    });

    calTodayBtn.addEventListener('click', () => {
        const d = new Date();
        calCurrentYear = d.getFullYear();
        calCurrentMonth = d.getMonth();
        setCalendarFilter(getTodayString());
        renderCalendarWidget();
    });

    btnClearCalFilter.addEventListener('click', clearCalendarFilter);

    // 9. Inspector Events
    btnCloseInspector.addEventListener('click', deselectTask);

    inspectorCheckBtn.addEventListener('click', () => {
        if (activeTaskId) toggleCompleteTask(activeTaskId);
    });

    inspectorStarBtn.addEventListener('click', () => {
        if (activeTaskId) toggleImportantTask(activeTaskId);
    });

    inspectorTitleInput.addEventListener('change', () => {
        if (!activeTaskId) return;
        const task = tasks.find(t => t.id === activeTaskId);
        if (task) {
            task.text = inspectorTitleInput.value.trim() || task.text;
            saveTasks();
            renderAgendaStream();
        }
    });

    inspectorDueDate.addEventListener('change', () => {
        if (!activeTaskId) return;
        const task = tasks.find(t => t.id === activeTaskId);
        if (task) {
            task.dueDate = inspectorDueDate.value || null;
            saveTasks();
            renderAgendaStream();
        }
    });

    inspectorDueTime.addEventListener('change', () => {
        if (!activeTaskId) return;
        const task = tasks.find(t => t.id === activeTaskId);
        if (task) {
            task.dueTime = inspectorDueTime.value || null;
            saveTasks();
            renderAgendaStream();
        }
    });

    inspectorCategorySelect.addEventListener('change', () => {
        if (!activeTaskId) return;
        const task = tasks.find(t => t.id === activeTaskId);
        if (task) {
            task.category = inspectorCategorySelect.value || '';
            saveTasks();
            renderAgendaStream();
        }
    });

    inspectorNotesTextarea.addEventListener('change', () => {
        if (!activeTaskId) return;
        const task = tasks.find(t => t.id === activeTaskId);
        if (task) {
            task.notes = inspectorNotesTextarea.value;
            saveTasks();
            renderAgendaStream();
        }
    });

    inspectorNewSubtaskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSubtask();
        }
    });

    // Google Calendar Action Button
    btnGCalIntentAction.addEventListener('click', () => {
        if (!activeTaskId) return;
        const task = tasks.find(t => t.id === activeTaskId);
        if (task) {
            triggerGoogleCalendarIntent(task);
        }
    });

    // Delete Task in Inspector
    btnInspectorDelete.addEventListener('click', () => {
        if (activeTaskId) openDeleteModal(activeTaskId);
    });

    // Delete Modal Actions
    deleteModalCancel.addEventListener('click', closeDeleteModal);
    deleteModalConfirm.addEventListener('click', confirmDeleteTask);

    // 10. Mobile Pane Switcher
    tabBtnAgenda.addEventListener('click', () => {
        workspaceLayout.classList.remove('show-calendar-pane');
        tabBtnAgenda.classList.add('active');
        tabBtnCalendar.classList.remove('active');
    });

    tabBtnCalendar.addEventListener('click', () => {
        workspaceLayout.classList.add('show-calendar-pane');
        tabBtnCalendar.classList.add('active');
        tabBtnAgenda.classList.remove('active');
    });

    // 11. Global Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (categoryModal.classList.contains('active')) closeCategoryModal();
            else if (deleteModal.classList.contains('active')) closeDeleteModal();
            else if (globalSearchInput === document.activeElement) {
                globalSearchInput.value = '';
                searchQuery = '';
                globalSearchInput.blur();
                renderAgendaStream();
            } else if (activeTaskId) {
                deselectTask();
            }
        } else if (e.key === '/' && document.activeElement !== globalSearchInput && document.activeElement !== composerInput && document.activeElement !== inspectorNotesTextarea && document.activeElement !== inspectorTitleInput && document.activeElement !== inspectorNewSubtaskInput) {
            e.preventDefault();
            globalSearchInput.focus();
        }
    });
}

// ==========================================================================
// Initialization
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderCategories();
    initEventListeners();
    renderAgendaStream();

    // Select first active task if available
    const firstTask = tasks.find(t => !t.completed);
    if (firstTask) {
        selectTask(firstTask.id);
    } else {
        deselectTask();
    }
});

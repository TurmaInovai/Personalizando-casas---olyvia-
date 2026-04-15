document.addEventListener('DOMContentLoaded', () => {
    // --- Data ---
    const catalogData = {
        build: [
            { type: 'icon-door', name: 'Porta', baseScale: 1.2 },
            { type: 'icon-window', name: 'Janela', baseScale: 1.5 }
        ],
        kitchen: [
            { type: 'icon-fridge', name: 'Geladeira', baseScale: 1.4 },
            { type: 'icon-sink', name: 'Pia', baseScale: 1.3 },
            { type: 'icon-stove', name: 'Fogão', baseScale: 1.2 },
            { type: 'icon-cabinet', name: 'Armário', baseScale: 1.5 },
            { type: 'icon-glasses', name: 'Copos', baseScale: 0.7 },
            { type: 'icon-cutlery', name: 'Talheres', baseScale: 0.7 }
        ],
        living: [
            { type: 'icon-sofa', name: 'Sofá', baseScale: 1.8 },
            { type: 'icon-bed', name: 'Cama', baseScale: 2.0 },
            { type: 'icon-tv', name: 'Televisão', baseScale: 1.5 },
            { type: 'icon-rug', name: 'Tapete', baseScale: 2.0 },
            { type: 'icon-table', name: 'Mesa', baseScale: 1.4 },
            { type: 'icon-lamp', name: 'Abajur', baseScale: 1.2 },
            { type: 'icon-plant', name: 'Planta', baseScale: 1.2 }
        ],
        garden: [
            { type: 'icon-grass', name: 'Grama', baseScale: 1.0 },
            { type: 'icon-flower', name: 'Rosa', baseScale: 1.0 },
            { type: 'icon-flower icon-flower-blue', name: 'Flor Azul', baseScale: 1.0 },
            { type: 'icon-flower icon-flower-white', name: 'Margarida', baseScale: 1.0 },
            { type: 'icon-tree', name: 'Árvore', baseScale: 1.0 },
            { type: 'icon-bench', name: 'Banco', baseScale: 1.0 }
        ]
    };

    const housePresets = {
        compact: () => {
             const room1 = createRoom('floor-1', 'Sala & Quarto', 300, 200, 400, 400, "url('https://www.transparenttextures.com/patterns/wood-pattern.png'), linear-gradient(#e1b182, #c89564)");
             const garden = createRoom('floor-1', 'Jardim', 50, 150, 250, 500, "#2ecc71");
             placeItem(room1, getCatalogItem('build', 'icon-door'), 0, 200, 1.2, -90);
        },
        comfort: () => {
            const living = createRoom('floor-1', 'Sala', 300, 100, 400, 300, "white");
            const bed = createRoom('floor-1', 'Quarto', 300, 400, 400, 300, "#74b9ff");
            const garden = createRoom('floor-1', 'Jardim Frontal', 50, 100, 250, 600, "#27ae60");
            placeItem(living, getCatalogItem('build', 'icon-door'), 0, 150, 1.2, -90);
            placeItem(living, getCatalogItem('build', 'icon-door'), 200, 300, 1.2, 0);
        },
        garden: () => {
            const hall = createRoom('floor-1', 'Hall', 400, 300, 200, 200, "white");
            const l = createRoom('floor-1', 'Sala', 200, 100, 300, 300, "white");
            const r = createRoom('floor-1', 'Quarto', 500, 100, 300, 300, "white");
            const g1 = createRoom('floor-1', 'Jardim Esq', 50, 50, 150, 700, "#27ae60");
            const g2 = createRoom('floor-1', 'Jardim Dir', 800, 50, 150, 700, "#27ae60");
            placeItem(hall, getCatalogItem('build', 'icon-door'), 100, 200, 1.2, 0);
        }
    };

    // --- State ---
    let activeFloor = 'floor-1';
    let selectedNode = null;
    let draggedItemData = null;
    let roomCount = 0;
    let isTourMode = false;
    let character = null;

    // --- References ---
    const f1 = document.getElementById('floor-1');
    const f2 = document.getElementById('floor-2');
    const noSelection = document.getElementById('no-selection');
    const selectionProps = document.getElementById('selection-props');
    const propName = document.getElementById('prop-name');
    const scaleSlider = document.getElementById('prop-scale');
    const rotateSlider = document.getElementById('prop-rotate');
    const scaleVal = document.getElementById('scale-val');
    const rotateVal = document.getElementById('rotate-val');
    const propWallColorContainer = document.querySelector('.room-only');
    const wallColorInput = document.getElementById('prop-wall-color');
    const btnDelete = document.getElementById('btn-delete-item');

    // --- Initialize UI ---
    populateCatalog('catalog-build', catalogData.build);
    populateCatalog('catalog-kitchen', catalogData.kitchen);
    populateCatalog('catalog-living', catalogData.living);
    populateCatalog('catalog-garden', catalogData.garden);
    
    // --- Autoload initial house ---
    loadHouse('comfort');

    function loadHouse(type) {
        f1.innerHTML = '';
        f2.innerHTML = '';
        roomCount = 0;
        isTourMode = false;
        if(character) character.remove();
        character = null;
        document.getElementById('start-tour-btn').innerHTML = '<i class="fa-solid fa-person-walking"></i> Iniciar Passeio';

        if(housePresets[type]) {
            housePresets[type]();
        }
    }

    function populateCatalog(containerId, items) {
        const container = document.getElementById(containerId);
        items.forEach(item => {
            const el = document.createElement('div');
            el.className = 'catalog-item';
            el.draggable = true;
            el.innerHTML = `
                <div class="item-icon-preview ${item.type}"></div>
                <div class="item-label">${item.name}</div>
            `;
            el.addEventListener('dragstart', (e) => {
                draggedItemData = item;
            });
            container.appendChild(el);
        });
    }

    function getCatalogItem(category, type) {
        return catalogData[category].find(i => i.type === type);
    }

    function buildInitialHouse() {
        // TÉRREO
        const livingRoom = createRoom('floor-1', 'Sala de Estar', 50, 50, 350, 450, "url('https://www.transparenttextures.com/patterns/marble.png'), white");
        placeItem(livingRoom, getCatalogItem('living', 'icon-rug'), 175, 225, 2.5, 0);
        placeItem(livingRoom, getCatalogItem('living', 'icon-sofa'), 175, 300, 1.8, 180);
        placeItem(livingRoom, getCatalogItem('living', 'icon-tv'), 175, 50, 1.5, 0);
        placeItem(livingRoom, getCatalogItem('living', 'icon-table'), 175, 200, 1.2, 0);
        placeItem(livingRoom, getCatalogItem('living', 'icon-plant'), 50, 60, 1.2, 0);
        placeItem(livingRoom, getCatalogItem('build', 'icon-door'), 175, 450, 1.2, 0); // front door
        placeItem(livingRoom, getCatalogItem('build', 'icon-window'), 300, 0, 1.5, 0);

        const kitchen = createRoom('floor-1', 'Cozinha', 400, 50, 350, 450, "repeating-conic-gradient(#bdc3c7 0% 25%, #ecf0f1 0% 50%) 50% / 40px 40px");
        placeItem(kitchen, getCatalogItem('kitchen', 'icon-sink'), 100, 40, 1.4, 0);
        placeItem(kitchen, getCatalogItem('kitchen', 'icon-stove'), 200, 40, 1.2, 0);
        placeItem(kitchen, getCatalogItem('kitchen', 'icon-cabinet'), 280, 40, 1.5, 0);
        placeItem(kitchen, getCatalogItem('kitchen', 'icon-glasses'), 280, 40, 0.7, 0);
        placeItem(kitchen, getCatalogItem('kitchen', 'icon-fridge'), 50, 150, 1.4, 90);
        placeItem(kitchen, getCatalogItem('living', 'icon-table'), 180, 250, 2, 0); // dining table
        placeItem(kitchen, getCatalogItem('build', 'icon-door'), 0, 150, 1.2, -90); // door connecting to living room

        // 2º ANDAR
        const bedroom = createRoom('floor-2', 'Quarto', 100, 50, 400, 400, "url('https://www.transparenttextures.com/patterns/pinstriped-suit.png'), #74b9ff");
        placeItem(bedroom, getCatalogItem('living', 'icon-rug'), 200, 200, 2.5, 0);
        placeItem(bedroom, getCatalogItem('living', 'icon-bed'), 200, 100, 2, 0);
        placeItem(bedroom, getCatalogItem('living', 'icon-lamp'), 100, 70, 1.5, 0);
        placeItem(bedroom, getCatalogItem('living', 'icon-lamp'), 300, 70, 1.5, 0);
        placeItem(bedroom, getCatalogItem('kitchen', 'icon-cabinet'), 50, 250, 2, 90); // wardrobe
        placeItem(bedroom, getCatalogItem('build', 'icon-window'), 200, 0, 1.5, 0);

        // Make sure no selection at start
        deselectAll();
    }

    // --- Tabs ---
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
            if(btn.dataset.tab === 'props' && !selectedNode) {
                noSelection.classList.remove('hidden');
                selectionProps.classList.add('hidden');
            }
        });
    });

    // --- House Selection ---
    document.querySelectorAll('.house-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.house-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadHouse(btn.dataset.house);
        });
    });

    // --- Tour Mode ---
    document.getElementById('start-tour-btn').addEventListener('click', (e) => {
        isTourMode = !isTourMode;
        const btn = e.currentTarget;
        
        if(isTourMode) {
            btn.innerHTML = '<i class="fa-solid fa-stop"></i> Parar Passeio';
            btn.style.background = '#e74c3c';
            deselectAll();
            spawnCharacter();
        } else {
            btn.innerHTML = '<i class="fa-solid fa-person-walking"></i> Iniciar Passeio';
            btn.style.background = '#f39c12';
            if(character) character.remove();
            character = null;
        }
    });

    function spawnCharacter() {
        if(character) character.remove();
        character = document.createElement('div');
        character.className = 'character-sprite';
        // Start at a default position (e.g., inside first room or center)
        character.style.left = '400px';
        character.style.top = '400px';
        document.getElementById(activeFloor).appendChild(character);
    }

    // --- Floors ---

    // --- Textures ---
    document.querySelectorAll('.texture-swatch').forEach(sw => {
        sw.style.background = sw.dataset.bg;
        sw.addEventListener('click', () => {
            if (selectedNode && selectedNode.classList.contains('room-node')) {
                selectedNode.style.background = sw.dataset.bg;
            }
        });
    });

    // --- Canvas Drag & Drop ---
    const canvasContainers = document.querySelectorAll('.floor-layout');
    canvasContainers.forEach(canvas => {
        canvas.addEventListener('dragover', e => e.preventDefault());
        canvas.addEventListener('drop', e => {
            e.preventDefault();
            if(!draggedItemData || isTourMode) return;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Allow dropping onto rooms directly
            let targetContainer = canvas;
            let targetX = x;
            let targetY = y;

            if (e.target.closest('.room-node')) {
                targetContainer = e.target.closest('.room-node');
                const roomRect = targetContainer.getBoundingClientRect();
                targetX = e.clientX - roomRect.left;
                targetY = e.clientY - roomRect.top;
            }

            placeItem(targetContainer, draggedItemData, targetX, targetY);
            draggedItemData = null;
        });

        canvas.addEventListener('mousedown', (e) => {
            if(isTourMode && character) {
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Move character
                character.style.left = `${x}px`;
                character.style.top = `${y}px`;
                
                // Create ping
                const ping = document.createElement('div');
                ping.className = 'dest-ping';
                ping.style.left = `${x}px`;
                ping.style.top = `${y}px`;
                canvas.appendChild(ping);
                setTimeout(() => ping.remove(), 1000);
                return;
            }
            if(e.target === canvas) deselectAll();
        });
    });

    // --- Create Custom Rooms ---
    document.getElementById('add-room-btn').addEventListener('click', () => {
        const room = createRoom(activeFloor, `Cômodo Novo`, 50, 50, 300, 300, `url('https://www.transparenttextures.com/patterns/wood-pattern.png'), linear-gradient(#e1b182, #c89564)`);
        selectNode(room);
    });

    function createRoom(floorId, name, x, y, w, h, bg) {
        roomCount++;
        const canvas = document.getElementById(floorId);
        const room = document.createElement('div');
        room.className = 'room-node';
        room.style.width = `${w}px`;
        room.style.height = `${h}px`;
        room.style.left = `${x}px`;
        room.style.top = `${y}px`;
        room.style.background = bg;
        room.dataset.name = name;
        
        const label = document.createElement('div');
        label.className = 'room-label';
        label.innerText = name;
        room.appendChild(label);

        // Clear label after interaction
        room.addEventListener('mousedown', () => {
            label.style.display = 'none';
        }, { once: true });

        makeDraggableBlock(room);
        canvas.appendChild(room);
        return room;
    }

    // --- Placed Item logic ---
    function placeItem(container, data, x, y, scale = data.baseScale, rotate = 0) {
        const item = document.createElement('div');
        item.className = `placed-item ${data.type}`;
        if(data.type === 'icon-window' || data.type === 'icon-door') {
           item.classList.add('window-item'); 
        }
        
        item.dataset.scale = scale;
        item.dataset.rotate = rotate;
        item.dataset.name = data.name;
        
        updateTransform(item);
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;

        makeDraggableItem(item, container);
        container.appendChild(item);
        selectNode(item);
    }

    function updateTransform(el) {
        const s = el.dataset.scale || 1;
        const r = el.dataset.rotate || 0;
        el.style.transform = `translate(-50%, -50%) scale(${s}) rotate(${r}deg)`;
    }

    // --- Interaction / Selection ---
    function selectNode(node) {
        deselectAll();
        selectedNode = node;
        node.classList.add('selected');
        openPropsTab();
        
        if(node.classList.contains('room-node')) {
            propName.innerText = node.dataset.name || "Cômodo";
            propWallColorContainer.classList.remove('hidden');
            rotateSlider.parentElement.classList.add('hidden');
            scaleSlider.parentElement.classList.add('hidden');
            wallColorInput.value = node.style.borderColor || '#333333';
        } else {
            propName.innerText = node.dataset.name;
            propWallColorContainer.classList.add('hidden');
            rotateSlider.parentElement.classList.remove('hidden');
            scaleSlider.parentElement.classList.remove('hidden');
            scaleSlider.value = node.dataset.scale;
            rotateSlider.value = node.dataset.rotate;
            scaleVal.innerText = node.dataset.scale;
            rotateVal.innerText = node.dataset.rotate;
        }
    }

    function deselectAll() {
        document.querySelectorAll('.room-node, .placed-item').forEach(n => n.classList.remove('selected'));
        selectedNode = null;
        noSelection.classList.remove('hidden');
        selectionProps.classList.add('hidden');
    }

    function openPropsTab() {
        document.querySelector('.tab-btn[data-tab="props"]').click();
        noSelection.classList.add('hidden');
        selectionProps.classList.remove('hidden');
    }

    // --- Properties Panel Events ---
    scaleSlider.addEventListener('input', (e) => {
        if(selectedNode && !selectedNode.classList.contains('room-node')) {
            selectedNode.dataset.scale = e.target.value;
            scaleVal.innerText = e.target.value;
            updateTransform(selectedNode);
        }
    });

    rotateSlider.addEventListener('input', (e) => {
        if(selectedNode && !selectedNode.classList.contains('room-node')) {
            selectedNode.dataset.rotate = e.target.value;
            rotateVal.innerText = e.target.value;
            updateTransform(selectedNode);
        }
    });

    wallColorInput.addEventListener('input', (e) => {
        if(selectedNode && selectedNode.classList.contains('room-node')) {
            selectedNode.style.borderColor = e.target.value;
        }
    });

    btnDelete.addEventListener('click', () => {
        if(selectedNode) {
            selectedNode.remove();
            deselectAll();
        }
    });

    // --- Drag Logic ---
    function makeDraggableItem(el, container) {
        let isDragging = false;
        let pX, pY;

        el.addEventListener('mousedown', (e) => {
            if(isTourMode) return;
            selectNode(el);
            isDragging = true;
            // Get offset inside parent
            pX = e.clientX - el.offsetLeft;
            pY = e.clientY - el.offsetTop;
            e.stopPropagation(); // prevent dragging room
        });

        document.addEventListener('mousemove', (e) => {
            if(!isDragging) return;
            el.style.left = `${e.clientX - pX}px`;
            el.style.top = `${e.clientY - pY}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    function makeDraggableBlock(el) {
        let isDragging = false;
        let pX, pY;

        el.addEventListener('mousedown', (e) => {
            if(isTourMode) return;
            selectNode(el);
            const rect = el.getBoundingClientRect();
            if(e.clientX > rect.right - 20 && e.clientY > rect.bottom - 20) return; // Resize handle
            if(e.target.closest('.placed-item')) return; // Ignore drag if child item is clicked
            
            // isDragging = false; // HOUSE COMODOS ARE LOCKED
            // Only allow selection to change colors
        });

        document.addEventListener('mousemove', (e) => {
            if(!isDragging) return;
            el.style.left = `${e.clientX - pX}px`;
            el.style.top = `${e.clientY - pY}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }
});

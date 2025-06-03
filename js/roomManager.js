let currentRoom = null;  // Global to track loaded room
let loadedRooms = new Set();

window.addEventListener('load', () => {
    // Find first room, fallback to 'room1'
    currentRoom = Object.keys(rooms).find(key => rooms[key].firstRoom) || 'room1';
    loadRoom(currentRoom);
});

function loadRoom(roomId) {

    const oldRoom = currentRoom; // Store old room before switching
    currentRoom = roomId;

    const room = rooms[roomId];
    if (!room) {
        console.warn(`Room not found: ${roomId}`);
        return;
    }

    console.log(`Loading room: ${roomId}`);

    const assets = document.getElementById('asset-container');

    function ensureImageLoaded(imageId, imageSrc, callback) {
        let imgEl = document.getElementById(imageId);
        if (imgEl) {
            if (imgEl.complete) {
                callback();
            } else {
                imgEl.addEventListener('load', callback);
            }
            return;
        }

        imgEl = document.createElement('img');
        imgEl.setAttribute('id', imageId);
        imgEl.setAttribute('src', imageSrc);
        imgEl.setAttribute('crossorigin', 'anonymous');
        imgEl.addEventListener('load', callback);
        assets.appendChild(imgEl);
    }

    ensureImageLoaded(room.imageID, room.imageSrc, () => {
        document.getElementById('sky').setAttribute('src', room.image);
        console.log(`Room image loaded: ${room.imageID}`);
    });

    room.hotspots.forEach(hotspot => {
        if (hotspot.targetRoom) {
            const neighbor = rooms[hotspot.targetRoom];
            if (neighbor && !document.getElementById(neighbor.imageID)) {
                console.log(`Preloading neighbor room image: ${neighbor.imageID}`);
                const preloadImg = document.createElement('img');
                preloadImg.setAttribute('id', neighbor.imageID);
                preloadImg.setAttribute('src', neighbor.imageSrc);
                preloadImg.setAttribute('crossorigin', 'anonymous');
                assets.appendChild(preloadImg);
            }
        }
    });

    if (room.rotation) {
        document.getElementById('sky').setAttribute('rotation', {
            x: room.rotation[0],
            y: room.rotation[1],
            z: room.rotation[2]
        });
    }

    // Clear old hotspots (using oldRoom for log)
    const container = document.getElementById('hotspot-container');
    while (container.firstChild) {
        console.log(`Unloading hotspot for room: ${oldRoom}`);
        container.removeChild(container.firstChild);
    }

    // Add new hotspots for the new room
    room.hotspots.forEach(hotspot => {
    const el = document.createElement('a-image'); // Use a-image for icon
    el.setAttribute('src', hotspot.icon); // Set the source of your icon image
    el.setAttribute('width', '100'); // Set the width of the icon (adjust as needed)
    el.setAttribute('height', '100'); // Set the height of the icon (adjust as needed)
    el.setAttribute('position', getHotspotPosition(hotspot, room));
    el.setAttribute('look-at', '#camera');
    el.setAttribute('class', 'clickable');
    el.setAttribute('rotation', hotspot.iconRotation);
    el.setAttribute('depth-test', 'false');

        if (hotspot.targetRoom) {
            el.setAttribute('event-set__enter', '_event: mouseenter; scale: 1.3 1.3 1');
            el.setAttribute('event-set__leave', '_event: mouseleave; scale: 1 1 1');
            el.addEventListener('click', () => loadRoom(hotspot.targetRoom));
        }

        if (hotspot.info) {
            el.addEventListener('click', () => alert(hotspot.info));
        }

        container.appendChild(el);
        console.log(`Added hotspot${hotspot.targetRoom ? ` to ${hotspot.targetRoom}` : ''}`);
    });
}

function getHotspotPosition(hotspot, room) {
    const pos = Array.isArray(hotspot.position)
        ? new THREE.Vector3(...hotspot.position)
        : new THREE.Vector3(...hotspot.position.split(' ').map(parseFloat));

    const roomRot = room.rotation || [0, 0, 0];
    const euler = new THREE.Euler(
        THREE.MathUtils.degToRad(roomRot[0]),
        THREE.MathUtils.degToRad(roomRot[1]),
        THREE.MathUtils.degToRad(roomRot[2]),
        'YXZ' // A-Frame default
    );

    pos.applyEuler(euler);

    console.log('Hotspot magnitude:', pos.length());

    return pos;
}
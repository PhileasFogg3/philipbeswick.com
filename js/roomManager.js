let currentRoom = 'room1';

function loadRoom(roomId) {
    const room = rooms[roomId];
    if (!room) return;

    console.log(roomId)

    currentRoom = roomId;

    // Change background image
    document.getElementById('sky').setAttribute('src', room.image);

    // Set sky rotation if defined
    if (room.rotation) {
        sky.setAttribute('rotation', {
            x: room.rotation[0],
            y: room.rotation[1],
            z: room.rotation[2]
        });
    }

    console.log(room.rotation)

    // Clear old hotspots
    const container = document.getElementById('hotspot-container');
    while (container.firstChild) container.removeChild(container.firstChild);

    // Add new hotspots
    room.hotspots.forEach((hotspot, index) => {
        const el = document.createElement('a-entity');
        el.setAttribute('geometry', 'primitive: sphere; radius: 50');
        el.setAttribute('material', 'color: blue; shader: flat');
        el.setAttribute('position', getHotspotPosition(hotspot, room));
        el.setAttribute('look-at', '#camera');
        el.setAttribute('class', 'clickable');
        el.setAttribute('rotation', '0 180 0');

        if (hotspot.targetRoom) {
        el.setAttribute('event-set__enter', '_event: mouseenter; scale: 1.3 1.3 1');
        el.setAttribute('event-set__leave', '_event: mouseleave; scale: 1 1 1');
        el.addEventListener('click', () => loadRoom(hotspot.targetRoom));
        }

        if (hotspot.info) {
        el.addEventListener('click', () => alert(hotspot.info)); // Or custom UI
        }

        container.appendChild(el);
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

  console.log('Hotspot magnitude:', pos.length()); // Should be ≈ 500

  return pos;
}


// Initialize on load
window.addEventListener('load', () => loadRoom(currentRoom));
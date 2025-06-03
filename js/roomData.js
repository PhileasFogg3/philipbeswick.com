const rooms = {
  room1: {
    firstRoom: true,
    imageID: 'point1',
    imageSrc: 'resources/images/House/point1 small.jpg',
    image: '#point1',
    rotation: [0, 270, 0],
    hotspots: [
      {
        icon: 'resources/images/icon/360 project/arrow.png',
        iconRotation: '90 0 0',
        position: [-413.31, -232.81, 156.52],
        targetRoom: 'room2',
        label: 'Go to Room 2'
      }
    ]
  },
  room2: {
    firstRoom: false,
    imageID: 'point2',
    imageSrc: 'resources/images/House/point2 small.jpg',
    image: '#point2',
    rotation: [0, 300, 0],
    hotspots: [
      {
        icon: 'resources/images/icon/360 project/arrow.png',
        iconRotation: '-90 0 0',
        position: [360.32, -306.50, 160.57],
        targetRoom: 'room1',
        label: 'Back to Room 1'
      },
      {
        icon: 'resources/images/icon/360 project/arrow.png',
        iconRotation: '90 0 0',
        position: [-388.99, -229.34, -213.92],
        targetRoom: 'room3',
        label: 'Go to Room 3'
      }
    ]
  },
  room3: {
    firstRoom: false,
    imageID: 'point3',
    imageSrc: 'resources/images/House/point3 small.jpg',
    image: '#point3',
    rotation: [0, 260, 0],
    hotspots: [
      {
        icon: 'resources/images/icon/360 project/arrow.png',
        iconRotation: '-90 0 0',
        position: [421.15, -228.36, -141.25],
        targetRoom: 'room2',
        label: 'Back to Room 2'
      }
    ]
  }
};

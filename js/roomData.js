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
        iconHeight: '100',
        iconWidth: '100',
        position: [-413.31, -232.81, 156.52],
        targetRoom: 'room2',
        info: 'Enter the hallway...'
      },
      {
        icon: 'resources/images/icon/360 project/info.png',
        iconRotation: '0 90 0',
        iconHeight: '50',
        iconWidth: '50',
        position: [-255.14, 318.62, 288.10],
        info: 'The Grand-babies <3',
        shouldBounce: true
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
        info: 'Get back in the kitchen!'
      },
      {
        icon: 'resources/images/icon/360 project/arrow.png',
        iconRotation: '90 0 0',
        position: [-388.99, -229.34, -213.92],
        targetRoom: 'room3',
        info: 'Go on then... check out the front door.'
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
        info: 'Get yourself back in the hallway.'
      }
    ]
  }
};

import { Coords } from './types';

export const generateRandomCoordinatesCenter = (mapSize: { width: number, height: number }): Coords => {
  return {
    x: 200 + (Math.random() * (mapSize.width - 400)),
    y: 200 + (Math.random() * (mapSize.height - 400)),
  }
}

export const getRandomDoorMap = (mapSize: { width: number, height: number }):  Coords => {
  const places = [
    { x: mapSize.width / 2, y: 50 },
    { y: mapSize.height / 2, x: 50 },
    { x: mapSize.width / 2, y: mapSize.height - 50 },
    { y: mapSize.height / 2, x: mapSize.width - 50 }
  ];

  return places[Phaser.Math.RND.between(0, 3)];
}

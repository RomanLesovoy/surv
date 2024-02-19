export const getRandomCoordinates = (): { x: number, y: number } => {
  const borderLength = 200;
  const xFrom = [-borderLength, window.innerWidth + borderLength];
  const yFrom = [-borderLength, window.innerHeight + borderLength];
  const xBorder = Math.random() > 0.5;
  const index = Math.abs(Math.round((Math.random() * 2) - 1));
  const value = Math.round(Math.random() * (xBorder ? window.innerWidth : window.innerHeight));

  const result = { x: xBorder ? xFrom[index] : value, y: xBorder ? value : yFrom[index] };

  return result;
}

export const getRandomDoorMap = (mapSize: { width: number, height: number }):  { x: number, y: number } => {
  const places = [
    { x: mapSize.width / 2, y: 0 },
    { y: mapSize.height / 2, x: 0 },
    { x: mapSize.width / 2, y: mapSize.height },
    { y: mapSize.height / 2, x: mapSize.width }
  ];

  return places[Math.round(Math.random() * 3)]
}

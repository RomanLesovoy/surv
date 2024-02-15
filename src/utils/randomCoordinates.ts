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
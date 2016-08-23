module.exports = {
  randomColor: function() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  },

  randomType: function() {
    return TYPES[Math.floor(Math.random() * TYPES.length)];
  },

  randomVelocity: function() {
    let x = Math.random() * 2 - 1;
    let y = Math.random() * 2 - 1;
    let speed = Math.random();
    x = x / Math.sqrt(x * x + y * y);
    y = y / Math.sqrt(x * x + y * y);
    return [x, y];
  },

  getVelocity: function(vector){
    let x = vector[0];
    let y = vector[1];
    let result = [
      x/Math.sqrt(x * x + y * y),
      y/Math.sqrt(x * x + y * y)
    ];
    return result;
  },

  xDist: function(first, second) {
    return Math.abs(first.pos[0] - second.pos[0]);
  },

  yDist: function(first, second) {
    return Math.abs(first.pos[1] - second.pos[1]);
  },

  onCanvas: function(pos) {
    return ( pos[0] > 0 || pos[0] < canvas.width ? true : false);
  }
};

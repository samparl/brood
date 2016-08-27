const Constants = require('./constants');
const RADIUS = Constants.RADIUS;
const COLORS = Constants.COLORS;
const HORIZONTALS = Constants.HORIZONTALS;

module.exports = {
  randomColor: function() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  },

  randomType: function() {
    return Constants.TYPES[Math.floor(Math.random() * Constants.TYPES.length)];
  },

  randomTypeColor: function() {
    let index = Math.floor(Math.random() * Constants.TYPES.length);
    return([Constants.TYPES[index], Constants.COLORS[index]]);
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

  closestX: function(x) {
    let res = 0;
    for(let i in HORIZONTALS) {
      // debugger
      if(Math.abs(HORIZONTALS[i] - x) < Math.abs(x - res)){
        res = HORIZONTALS[i];
      }
    }
    return res;
  },

  xDist: function(first, second) {
    return Math.abs(first[0] - second[0]);
  },

  yDist: function(first, second) {
    return Math.abs(first[1] - second[1]);
  },

  dist: function(posA, posB) {
    return Math.sqrt(
      this.xDist(posA, posB) * this.xDist(posA, posB) +
      this.yDist(posA, posB) * this.yDist(posA, posB)
    );
  },

  onCanvas: function(pos) {
    return ( pos[0] > 0 || pos[0] < canvas.width ? true : false);
  },

  inRange: function(posA, posB) {
    return (
      this.xDist(posA, posB) < Constants.RADIUS * 0.01 &&
      this.yDist(posA, posB) < Constants.RADIUS * 0.01
    );
  }
};

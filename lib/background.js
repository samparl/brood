var canvas = document.getElementById("brood-canvas");
var ctx = canvas.getContext("2d");

let canvasBackground = ctx.createLinearGradient(canvas.height, 0, canvas.height, canvas.width);
canvasBackground.addColorStop(1, "#f44336");
canvasBackground.addColorStop(0.6, "#2196f3");

let nightSky = ctx.createLinearGradient(canvas.height, 0, canvas.height, canvas.width);
nightSky.addColorStop(0, "#000");
nightSky.addColorStop(0.9, "#2196f3");


let drawCeiling = function() {
  ctx.beginPath();
  ctx.fillStyle = "#d3d3d3";
  ctx.rect(0,0,canvas.width, this.top);
  ctx.fill();
  ctx.closePath();
};

let drawBuildings = function() {

};


module.exports = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let canvasBackground = ctx.createLinearGradient(this.top, this.top, this.top, canvas.height);
  canvasBackground.addColorStop(1, "#f44336");
  canvasBackground.addColorStop(0.6, "#2196f3");

  let nightSky = ctx.createLinearGradient(0, this.top, 0, 0);
  nightSky.addColorStop(1, "#000");
  nightSky.addColorStop(0.01, "#2196f3");

  ctx.fillStyle = canvasBackground;
  if(this.skeleton) {
    drawCeiling.call(this);
  } else {
    ctx.fillRect(0, this.top, canvas.width, canvas.height);
    ctx.fillStyle = nightSky;
    ctx.fillRect(0, 0, canvas.width, this.top);
    drawBuildings();
  }
};

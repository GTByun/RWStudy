var canvas = document.getElementById("game");
var context = canvas.getContext("2d");

function objDraw(x, y, size, color)
{
    context.beginPath();
    context.arc(x - size, y - size, size, 0, 2 * Math.PI);
    context.fillStyle = color;
    context.fill();
    context.closePath();
}

class player
{
    constructor(x, y, size, color)
    {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }
    draw()
    {
        objDraw(this.x, this.y, this.size, this.color);
    }
}

class bullet
{
    constructor(x, y, size, color)
    {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }
    draw()
    {
        objDraw(this.x, this.y, this.size, this.color);
    }
}


var p = new player(50, 50, 10, "blue");
var b = [];

p.draw();
canvas.onclick = function(event){
    const x = event.clientX;
    const y = event.clientY;
    b.push(new bullet(x, y, 5, "red"));
    p.draw();
    b[b.length - 1].draw();
}
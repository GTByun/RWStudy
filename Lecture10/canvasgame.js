var canvas = document.getElementById("game");


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
        var context = canvas.getContext("2d");
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
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
        var context = canvas.getContext("2d");
        context.beginPath();
        context.arc(this.x - this.size, this.y - this.size, this.size, 0, 2 * Math.PI);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    }
    Move()
    {
        y--;
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
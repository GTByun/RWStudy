var canvas = document.getElementById("game");
var context = canvas.getContext("2d");

function ObjDraw(x, y, size, color)
{
    context.beginPath();
    context.arc(x - size, y - size, size, 0, 2 * Math.PI);
    context.fillStyle = color;
    context.fill();
    context.closePath();
}

class player
{
    constructor(x, y, size)
    {
        this.x = x;
        this.y = y;
        this.size = size;
    }
    Draw()
    {
        ObjDraw(this.x, this.y, this.size, "blue");
    }
}

class bullet
{
    constructor(x, y, size)
    {
        this.x = x;
        this.y = y;
        this.size = size;
    }
    Draw()
    {
        ObjDraw(this.x, this.y, this.size, "red");
    }
    Move()
    {
        this.y--;
    }
}

class GameManager
{
    static Update()
    {
        for (let index = 0; index < b.length; index++)
            b[index].Move();
    }

    static Draw()
    {
        for (let index = 0; index < b.length; index++)
            b[index].Draw();
        p.Draw();
    }

    Loop()
    {
        context.clearRect(0, 0, canvas.width, canvas.height);
        GameManager.Update();
        GameManager.Draw();
    }
}
p = new player(320, 240, 15);
b = [];
e = [];
canvas.onclick = function(event){
    const x = event.clientX;
    const y = event.clientY;
    b.push(new bullet(x, y, 8));
}
var gm = new GameManager();
var loop = setInterval(gm.Loop , 1000 / 60);
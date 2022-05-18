var canvas = document.getElementById("game");
var context = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;
var halfWidth = canvas.width / 2;
var halfHeight = canvas.height / 2;

function ObjDraw(x, y, size, color)
{
    var halfSize = size / 2;
    context.beginPath();
    context.arc(x - halfSize, y - halfSize, size, 0, 2 * Math.PI);
    context.fillStyle = color;
    context.fill();
    context.closePath();
}

class player
{
    constructor(x, y, size, speed)
    {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
    }
    Draw()
    {
        ObjDraw(this.x, this.y, this.size, "blue");
    }
}

class bullet
{
    constructor(x, y, size, xMove, yMove, speed)
    {
        this.x = x;
        this.y = y;
        this.size = size;
        this.halfSize = size / 2;
        this.xMove = xMove * speed;
        this.yMove = yMove * speed;
    }
    Draw()
    {
        ObjDraw(this.x, this.y, this.size, "red");
    }
    Move()
    {
        this.x += this.xMove;
        this.y += this.yMove;
    }
}

class Enemy
{
    constructor(x, y, hp, speed)
    {
        this.x = x;
        this.y = y;
        this.hp = hp;
        this.speed = speed;
    }
    Move()
    {

    }
}

class GameManager
{
    constructor()
    {
        canvas.onclick = function(event){
            const x = event.clientX;
            const y = event.clientY;
            var xMove = x - p.x, yMove = y - p.y;
            var distance = Math.sqrt(Math.pow(xMove, 2) + Math.pow(yMove, 2));
            xMove /= distance;
            yMove /= distance;
            b.push(new bullet(p.x, p.y, 8, xMove, yMove, 5));
        }
    }

    Update()
    {
        for (let index = 0; index < b.length; index++)
        {
            b[index].Move();
            if (Math.abs(b[index].x - halfWidth) > halfWidth + b[index].halfSize || Math.abs(b[index].y - halfHeight) > halfHeight + b[index].halfSize)
            {
                b.splice(index, 1);
                index--;
            }
        }
            
    }

    Draw()
    {
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (let index = 0; index < b.length; index++)
            b[index].Draw();
        p.Draw();
    }

    Loop()
    {
        gm.Update();
        gm.Draw();
    }
}
var p = new player(320, 240, 15, 3);
var b = [];
var e = [];

var gm = new GameManager();
function Loop()
{
    gm.Update();
    gm.Draw();
}
var loop = setInterval(gm.Loop, 1000 / 60);
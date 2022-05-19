var canvas = document.getElementById("game");
var context = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;
var halfWidth = canvas.width / 2;
var halfHeight = canvas.height / 2;
var VectorInitial = {x: null, y: null};
var PI = Math.PI;

class Vector
{
    constructor(vector)
    {
        this.vector = vector;
    }

    CalVector(what, vector)
    {
        switch (what)
        {
            case "-":
                return new Vector({x: this.vector.x - vector.vector.x, y: this.vector.y - vector.vector.y});
            default:
                return new Vector(VectorInitial);
        }
    }
    
    CalVectorKeep(what, vector)
    {
        switch (what)
        {
            case "+":
                this.vector = {x: this.vector.x + vector.vector.x, y: this.vector.y + vector.vector.y};
                break;
            default:
                break;
        }
    }

    CalScalar(what, scalar)
    {
        switch (what)
        {
            case "*":
                return new Vector({x: this.vector.x * scalar, y: this.vector.y * scalar});
            case "/":
                return new Vector({x: this.vector.x / scalar, y: this.vector.y / scalar});
            default:
                return new Vector(VectorInitial);
        }
    }

    Normalization()
    {
        return this.CalScalar("/", Math.sqrt(Math.pow(this.vector.x, 2) + Math.pow(this.vector.y, 2)))
    }

    Copy()
    {
        return new Vector(this.vector);
    }
}

function Hex2(int)
{
    var result = int.toString(16);
    return result.length == 1 ? "0" + result : result;
}

function RandomInt256()
{
    return Math.random() * 256 | 0;
}

function RGB(red, green, blue)
{
    return "#" + Hex2(red) + Hex2(green) + Hex2(blue);
}

function ObjDraw(position, size, color)
{
    context.beginPath();
    context.arc(position.vector.x, position.vector.y, size, 0, 2 * PI);
    context.fillStyle = color;
    context.fill();
    context.closePath();
}

class player
{
    constructor(position, size)
    {
        this.position = position;
        this.size = size;
    }
    Draw()
    {
        ObjDraw(this.position, this.size, "blue");
    }
}

class bullet
{
    constructor(position, size, moveVector, speed)
    {
        this.position = position;
        this.size = size;
        this.halfSize = size / 2;
        this.moveVector = moveVector.CalScalar("*", speed);
    }
    Draw()
    {
        ObjDraw(this.position, this.size, "red");
    }
    Move()
    {
        this.position.CalVectorKeep("+", this.moveVector);
    }
}

class Enemy
{
    constructor(position, hp, speed, player)
    {
        this.position = position;
        this.hp = hp;
        this.moveVector = player.position.CalVector("-", this.position).Normalization().CalScalar("*", speed)
        this.color = RGB(RandomInt256(), RandomInt256(), RandomInt256());
    }
    Draw()
    {
        this.size = this.hp * 3;
        ObjDraw(this.position, this.size, this.color);
    }
    Move()
    {
        this.position.CalVectorKeep("+", this.moveVector);
    }
    Colleder(obj)
    {
        
    }
}

function CheckObjOut(obj)
{
    var pos = obj.position.vector;
    return Math.abs(pos.x - halfWidth) > halfWidth + obj.size || Math.abs(pos.y - halfHeight) > halfHeight + obj.size;
}

class GameManager
{
    constructor()
    {
        this.player = new player(new Vector({x: halfWidth, y: halfHeight}), 15);
        this.bullets = [];
        this.enemies = [];
        canvas.onclick = function(event){
            var playerPos = gm.player.position;
            var finalMove = new Vector({x: event.clientX, y: event.clientY}).CalVector("-", playerPos).Normalization();
            gm.bullets.push(new bullet(playerPos.Copy(), 8, finalMove, 5))
        }
    }

    Update()
    {
        if (Math.random() < 0.004)
        {
            var x = Math.random() * width, y = Math.random() * height;
            this.enemies.push(new Enemy(new Vector({x: x, y: y}), 5, 3, this.player));
        }
        for (let index = 0; index < this.enemies.length; index++)
        {
            var enemy = this.enemies[index];
            enemy.Move();
            if (CheckObjOut(enemy))
            {
                this.enemies.splice(index,1);
                index--;
                continue;
            }
        }
        for (let index = 0; index < this.bullets.length; index++)
        {
            var bullet = this.bullets[index];
            bullet.Move();
            if (CheckObjOut(bullet))
            {
                this.bullets.splice(index, 1);
                index--;
            }
        }
        
    }

    Draw()
    {
        context.clearRect(0, 0, width, height);
        for (let index = 0; index < this.bullets.length; index++)
            this.bullets[index].Draw();
        for (let index = 0; index < this.enemies.length; index++)
            this.enemies[index].Draw();
        this.player.Draw();
    }

    Loop()
    {
        this.Update();
        this.Draw();
    }
}

var e = [];

var gm = new GameManager();
var loop = setInterval(() => { gm.Loop(); }, 1000 / 60);
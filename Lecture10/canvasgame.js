class Vector
{
    static null = new Vector(null, null);
    static zero = new Vector(0, 0);

    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }

    CalVector(operator, vector)
    {
        switch (operator)
        {
            case "+":
                return new Vector(this.x + vector.x, this.y + vector.y);
            case "-":
                return new Vector(this.x - vector.x, this.y - vector.y);
            default:
                return null;
        }
    }
    
    CalVectorKeep(operator, vector)
    {
        switch (operator)
        {
            case "+":
                this.x = this.x + vector.x;
                this.y = this.y + vector.y;
                break;
            default:
                break;
        }
    }

    CalScalar(operator, scalar)
    {
        switch (operator)
        {
            case "*":
                return new Vector(this.x * scalar, this.y * scalar);
            case "/":
                return new Vector(this.x / scalar, this.y / scalar);
            default:
                return null;
        }
    }

    DistanceFromZero()
    {
        var pow = Math.pow;
        return Math.sqrt(pow(this.x, 2) + pow(this.y, 2));
    }

    Normalization()
    {
        return this.CalScalar("/", this.DistanceFromZero())
    }

    Copy()
    {
        return new Vector(this.x, this.y);
    }
}

class Canvas
{
    static self = document.getElementById("game");
    static context = this.self.getContext("2d");
    static width = this.self.width;
    static height = this.self.height;
    static width_Half = this.width / 2;
    static height_Half = this.height / 2;
    static collider = {type: "Box", start: new Vector(-this.width_Half, -this.height_Half), end: new Vector(this.width_Half, this.height_Half)};
    static position = new Vector(this.width_Half, this.height_Half);
}

class Cal
{
    static PI = Math.PI;

    static Dec2Hex(dec, digit)
    {
        var result = dec.toString(16);
        for (let index = result.length; index < digit; index++)
            result = "0" + result;
        return result;
    }
}

class Draw
{
    static RGB(red, green, blue)
    {
        var Hex2 = function(dec) { return Cal.Dec2Hex(dec, 2); };
        return "#" + Hex2(red) + Hex2(green) + Hex2(blue);
    }

    static Circle(position, size, color)
    {
        var context = Canvas.context;
        context.beginPath();
        context.arc(position.x, position.y, size, 0, 2 * Cal.PI);
        context.fillStyle = color;
        context.fill();
        context.closePath();
    }
}

class Random
{
    static RandomInt(limit)
    {
        return Math.random() * limit | 0;
    }

    static Random(limit)
    {
        return Math.random() * limit;
    }

    static RandomBool()
    {
        return Random.RandomInt(3) == 1 ? true : false;
    }
}

class Player
{
    constructor(position, size)
    {
        this.position = position;
        this.size = size;
    }

    Draw()
    {
        Draw.Circle(this.position, this.size, "blue");
    }
}

class Bullet
{
    constructor(position, size, direction, speed)
    {
        this.position = position;
        this.size = size;
        this.velocity = direction.CalScalar("*", speed);
        this.collider = {type: "Circle", size: this.size, offset: Vector.zero};
    }

    Draw()
    {
        Draw.Circle(this.position, this.size, "red");
    }

    Move()
    {
        this.position.CalVectorKeep("+", this.velocity);
    }
}

class Enemy
{
    static sizeTimes = 3;

    constructor(position, hp, speed, player)
    {
        this.position = position;
        this.hp = hp;
        this.sizeTimes = Enemy.sizeTimes;
        this.size = hp * this.sizeTimes;
        this.velocity = player.position.CalVector("-", this.position).Normalization().CalScalar("*", speed)
        var RandomColor = function() { return Random.RandomInt(230) };
        this.color = Draw.RGB(RandomColor(), RandomColor(), RandomColor());
        this.collider = {type: "Circle", size: this.size, offset: Vector.zero};
    }

    UpdateSize()
    {
        this.size = this.hp * this.sizeTimes;
        this.collider.size = this.size;
    }

    Draw()
    {
        Draw.Circle(this.position, this.size, this.color);
    }

    Move()
    {
        this.position.CalVectorKeep("+", this.velocity);
    }
}

class Collider
{
    static typeofCollider = ["Box", "Circle"];

    static ColliderOverlap(objA, objB) //미완성
    {
        var MakeRealCollider = Collider.MakeRealCollider;
        var aRealCol = MakeRealCollider(objA.collider, objA.position);
        var bRealCol = MakeRealCollider(objB.collider, objB.position);
        var CheckTypeNum = Collider.CheckTypeNum;
        if (CheckTypeNum(aRealCol) > CheckTypeNum(bRealCol))
        {
            var temp = aRealCol;
            aRealCol = bRealCol;
            bRealCol = temp;
        }
    }

    static MakeRealCollider(collider, position)
    {
        var typeofCollider = Collider.typeofCollider;
        var type = collider.type
        switch (type)
        {
            case typeofCollider[0]:
                return {type: type, start: position.CalVector("+", collider.start), end: position.CalVector("+", collider.end)};
            case typeofCollider[1]:
                return {type: type, size: collider.size, offset: position.CalVector("+", collider.offset)};
            default:
                return null;
        }
    }

    static CheckTypeNum(collider)
    {
        var typeofCollider = Collider.typeofCollider;
        var type = collider.type;
        for (let i = 0; i < typeofCollider.length; i++)
        {
            if (type == typeofCollider[i])
                return i;
        }
        return null;
    }
}

function CheckObjOut(obj)
{
    var pos = obj.position;
    var width_Half = Canvas.width_Half, height_Half = Canvas.height_Half;
    return Math.abs(pos.x - width_Half) > width_Half + obj.size || Math.abs(pos.y - height_Half) > height_Half + obj.size;
}

class GameManager
{
    constructor()
    {
        this.player = new Player(new Vector(Canvas.width_Half, Canvas.height_Half), 15);
        this.bullets = [];
        this.enemies = [];
        Canvas.self.onclick = function(event){
            var playerPos = gm.player.position;
            var direction = new Vector(event.clientX, event.clientY).CalVector("-", playerPos).Normalization();
            gm.bullets.push(new Bullet(playerPos.Copy(), 8, direction, 5))
        }
        this.Random = Random.Random;
        this.Precentage = function() { return this.Random(100); };
        this.RandomBool = Random.RandomBool;
    }

    Update()
    {
        if (this.Precentage() < 4)
        {
            var EnemyHP = Random.RandomInt(10);
            var EnemySize = EnemyHP * 3;
            var width = Canvas.width, height = Canvas.height;
            var x = this.Random(width), y = this.Random(height);
            if (this.RandomBool())
                x = this.RandomBool() ? -EnemySize : width + EnemySize;
            else
                y = this.RandomBool() ? -EnemySize : height + EnemySize;
            this.enemies.push(new Enemy(new Vector(x, y), EnemyHP, 1, this.player));
        }
        for (let i = 0; i < this.enemies.length; i++)
        {
            var enemy = this.enemies[i];
            enemy.Move();
            if (CheckObjOut(enemy))
            {
                this.enemies.splice(i,1);
                i--;
                continue;
            }
            enemy.UpdateSize();
        }
        for (let i = 0; i < this.bullets.length; i++)
        {
            var bullet = this.bullets[i];
            bullet.Move();
            if (CheckObjOut(bullet))
            {
                this.bullets.splice(i, 1);
                i--;
            }
        }
        
    }

    Draw()
    {
        Canvas.context.clearRect(0, 0, Canvas.width, Canvas.height);
        for (let i = 0; i < this.bullets.length; i++)
            this.bullets[i].Draw();
        for (let i = 0; i < this.enemies.length; i++)
            this.enemies[i].Draw();
        this.player.Draw();
    }

    Loop()
    {
        this.Update();
        this.Draw();
    }
}

var gm = new GameManager();
var loop = setInterval(() => { gm.Loop(); }, 1000 / 60);
class Vector
{
    static zero = new Vector(0, 0);
    static center = new Vector(document.getElementById("game").width, document.getElementById("game").height).CalScalar("/", 2);

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
                console.error("CalVector: Operator Error!");
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
                console.error("CalVectorKeep: Operator Error!");
                break;
        }
    }

    CalScalar(operator, scalar)
    {
        switch (operator)
        {
            case "+":
                return new Vector(this.x + scalar, this.y + scalar);
            case "-":
                return new Vector(this.x - scalar, this.y - scalar);
            case "*":
                return new Vector(this.x * scalar, this.y * scalar);
            case "/":
                return new Vector(this.x / scalar, this.y / scalar);
            default:
                console.error("CalScalar: Operator Error!");
                return null;
        }
    }


    Adj(operator, scalar, element)
    {
        if (!(element == "x" || element == "y"))
        {
            console.error("Adj: Element Error!");
            return null;
        }
        switch (operator)
        {
            case "+":
                switch (element)
                {
                    case "x":
                        return new Vector(this.x + scalar, this.y);
                    case "y":
                        return new Vector(this.x, this.y + scalar);
                }
            case "-":
                switch (element)
                {
                    case "x":
                        return new Vector(this.x - scalar, this.y);
                    case "y":
                        return new Vector(this.x, this.y - scalar);
                }
            case "=":
                switch (element)
                {
                    case "x":
                        return new Vector(scalar, this.y);
                    case "y":
                        return new Vector(this.x, scalar);
                }
            default:
                console.error("Adj: Operator Error!");
                return null;
        }
    }

    DistanceFromZero()
    {
        const pow = Math.pow;
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

class BoxCollider
{
    constructor(start, end)
    {
        this.start = start;
        this.end = end;
    }
}

class CircleCollider
{
    constructor(size, offset)
    {
        this.size = size;
        this.offset = offset != null ? offset : Vector.zero;
    }
}

const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const canvasCollider = new BoxCollider(Vector.center.CalScalar("*", -1), Vector.center);
const canvasPosition = Vector.center;

function TextMode(align, baseline)
{
    context.textAlign = align != null ? align : "center";
    context.textBaseline = baseline != null ? baseline : "middle";
}

function Dec2Hex(dec, digit)
{
    let result = dec.toString(16);
    for (let index = result.length; index < digit; index++)
        result = "0" + result;
    return result;
}

function RGB(red, green, blue)
{
    const Hex2 = function(dec) { return Dec2Hex(dec, 2); };
    return "#" + Hex2(red) + Hex2(green) + Hex2(blue);
}

function Clear()
{
    context.clearRect(0, 0, width, height);
}

function DrawCircle(position, size, color)
{
    context.beginPath();
    context.arc(position.x, position.y, size, 0, 2 * Math.PI);
    context.fillStyle = color;
    context.fill();
    context.closePath();
}

function DrawText(position, string, font, color)
{
    context.font = font;
    context.fillStyle = color == null ? "black" : color;
    context.fillText(string, position.x, position.y);
}

function RandomInt(limit)
{
    return Math.floor(Math.random() * limit);
}

function RandomIntRange(min, max)
{
    return RandomInt(max - min) + min;
}

function RandomFloat(limit)
{
    return Math.random() * limit;
}

function RandomBool()
{
    return RandomInt(2) == 1 ? true : false;
}

function ColliderTypeCheck(collider, type)
{
    return collider instanceof type;
}

function MakeRealCollider(obj)
{
    const collider = obj.collider;
    const position = obj.position;
    if (ColliderTypeCheck(collider, BoxCollider))
        return new BoxCollider(position.CalVector("+", collider.start), position.CalVector("+", collider.end));
    else if (ColliderTypeCheck(collider, CircleCollider))
        return new CircleCollider(collider.size, position.CalVector("+", collider.offset));
    else
    {
        console.error("MakeRealCollider: Collider type error");
        return null;
    }
}

function InBoxCollider_Point(boxCollider, point) //private
{
    const xBool = point.x >= boxCollider.start.x && point.x <= boxCollider.end.x;
    const yBool = point.y >= boxCollider.start.y && point.y <= boxCollider.end.y;
    return xBool && yBool;
}

function InCircleCollider_Point(circleCollider, point)
{
    return circleCollider.offset.CalVector("-", point).DistanceFromZero() <= circleCollider.size;
}

function ColliderOverlap_BoxNCircle(boxObj, circleObj)
{
    if (!ColliderTypeCheck(boxObj.collider, BoxCollider) || !ColliderTypeCheck(circleObj.collider, CircleCollider))
    {
        console.error("Overlap_BoxNCircle: Type Error!");
        return null;
    }
    const boxCollider = MakeRealCollider(boxObj), circleCollider = MakeRealCollider(circleObj);
    const boxStart = boxCollider.start, boxEnd = boxCollider.end;
    const size = circleCollider.size;
    let condition = [false, false];
    const range = [new BoxCollider(boxStart.Adj("-", size, "x"), boxEnd.Adj("+", size, "x")),
        new BoxCollider(boxStart.Adj("-", size, "y"), boxEnd.Adj("+", size, "y"))];
    for (let i = 0; i < range.length; i++)
        condition[0] = condition[0] || InBoxCollider_Point(range[i], circleCollider.offset);
    const points = [boxStart,
        boxStart.Adj("=", boxEnd.x, "x"),
        boxStart.Adj("=", boxEnd.y, "y"),
        boxEnd];
    for (let i = 0; i < points.length; i++)
        condition[1] = condition[1] || InCircleCollider_Point(circleCollider, points[i]);
    return condition[0] || condition[1];
}

function ColliderOverlap_CircleNCircle(objA, objB)
{
    if (!ColliderTypeCheck(objA.collider, CircleCollider) || !ColliderTypeCheck(objB.collider, CircleCollider))
    {
        console.error("Overlap_CircleNCircle: Type Error!");
        return null;
    }
    const colliderA = MakeRealCollider(objA), colliderB = MakeRealCollider(objB);
    return colliderA.offset.CalVector("-", colliderB.offset).DistanceFromZero() <= colliderA.size + colliderB.size;
}

class SquereObject
{
    constructor(position, collider)
    {
        this.position = position;
        this.collider = collider;
    }
}

class MyObject
{
    constructor(position, size, color, direction, speed)
    {
        this.position = position;
        this.size = size;
        this.color = color;
        this.collider = new CircleCollider(this.size);
        this.velocity = direction != null ? direction.CalScalar("*", speed) : null;
    }

    Draw()
    {
        DrawCircle(this.position, this.size, this.color);
    }

    Move()
    {
        this.position.CalVectorKeep("+", this.velocity);
    }
}

class Player extends MyObject
{
    constructor(position, size)
    {
        super(position, size, "blue");
    }
}

class Bullet extends MyObject
{
    constructor(position, size, direction, speed, damage)
    {
        super(position, size, "red", direction, speed);
        this.damage = damage;
    }
}

class Enemy extends MyObject
{
    static sizeTimes = 6;

    constructor(hp, speed, player)
    {
        const size = hp * 6;
        let x = RandomFloat(width), y = RandomFloat(height);
        if (RandomBool())
            x = RandomBool() ? -size : width + size;
        else
            y = RandomBool() ? -size : height + size;
        const position = new Vector(x, y);
        const RandomColor = function() { return RandomInt(230) };
        super(position, size,
            RGB(RandomColor(), RandomColor(), RandomColor()),
            player.position.CalVector("-", position).Normalization(), speed);
        this.hp = hp;
    }

    UpdateSize()
    {
        this.size = this.hp * 6;
        this.collider.size = this.size;
    }

    DrawHP()
    {
        DrawText(this.position.Adj("-", this.size + 10, "y"), this.hp, "18px serif");
    }
}

class Tanker extends Enemy
{
    constructor(player, times)
    {
        const hp = Math.floor(RandomIntRange(7, 11) * times);
        const speed = 1.5 / hp;
        super(hp, speed, player);
    }
}

class Runner extends Enemy
{
    constructor(player, times)
    {
        const hp = RandomIntRange(1, 4);
        const speed = (5 - ((hp - 1) * 0.5)) * times;
        super(hp, speed, player);
    }
}

class Grunt extends Enemy
{
    constructor(player, times)
    {
        const hp = Math.floor(RandomIntRange(4, 7 * times));
        const speed = 4 / hp * times;
        super(hp, speed, player);
    }
}

class GameManager
{
    constructor()
    {
        this.player = new Player(Vector.center, 25);
        this.bullets = [];
        this.enemies = [];
        this.Create = function(objtype, what) { objtype.push(what); };
        this.Remove = function(objtype, at) { objtype.splice(at, 1); };
        canvas.onclick = function(event){
            if (!gm.gameover)
            {
                var playerPos = gm.player.position;
                var direction = new Vector(event.clientX, event.clientY).CalVector("-", playerPos).Normalization();
                gm.Create(gm.bullets, new Bullet(playerPos.Copy(), 8, direction, 10, 1));
            }
        }
        this.Precentage = function(percent) { return RandomFloat(100) < percent; };
        this.score = 0;
        this.gameover = false;
        this.difficult = 0;
        this.difficultUp = 1 / 600;
    }

    Update()
    {
        this.times = 1 + this.difficult * 0.1;
        if (!this.gameover)
        {
            if (this.Precentage((2 + this.difficult) / (this.enemies.length + 1)))
            {
                if (RandomBool())
                {
                    if (RandomBool())
                        this.Create(this.enemies, new Tanker(this.player, this.times));
                    else
                        this.Create(this.enemies, new Runner(this.player, this.times));
                }
                else
                    this.Create(this.enemies, new Grunt(this.player, this.times - this.difficult * 0.05));
            }
            for (let i = 0; i < this.enemies.length; i++)
            {
                const enemy = this.enemies[i];
                enemy.Move();
                for (let j = 0; j < this.bullets.length; j++)
                {
                    var bullet = this.bullets[j];
                    if (ColliderOverlap_CircleNCircle(enemy, bullet))
                    {
                        enemy.hp -= bullet.damage;
                        this.Remove(this.bullets, j);
                        j--;
                    }
                }
                if (enemy.hp <= 0)
                {
                    this.Remove(this.enemies, i);
                    i--;
                    this.score++;
                    continue;
                }
                enemy.UpdateSize();
                if (ColliderOverlap_CircleNCircle(enemy, this.player))
                {
                    this.gameover = true;
                    this.gameoverScore = "Score: " + this.score.toString();
                }
                    
            }
            for (let i = 0; i < this.bullets.length; i++)
            {
                const bullet = this.bullets[i];
                bullet.Move();
                if (!ColliderOverlap_BoxNCircle(new SquereObject(canvasPosition, canvasCollider), bullet))
                {
                    this.Remove(this.bullets, i);
                    i--;
                }
            }
            this.difficult += this.difficultUp;
        }
    }

    Draw()
    {
        Clear();
        if (!this.gameover)
        {
            for (let i = 0; i < this.bullets.length; i++)
                this.bullets[i].Draw();
            TextMode();
            for (let i = 0; i < this.enemies.length; i++)
                this.enemies[i].Draw();
            this.player.Draw();
            for (let i = 0; i < this.enemies.length; i++)
                this.enemies[i].DrawHP();
            TextMode("start", "top");
            DrawText(Vector.zero.CalScalar("+", 15), "Score: " + this.score.toString(), "24px serif");
        }
        else
        {
            TextMode();
            DrawText(Vector.center, "Game Over!", "48px serif");
            DrawText(Vector.center.Adj("+", 100, "y"), this.gameoverScore, "24px serif");
        }
    }

    Loop()
    {
        this.Update();
        this.Draw();
    }
}

const gm = new GameManager();
const loop = setInterval(() => { gm.Loop(); }, 1000 / 60);
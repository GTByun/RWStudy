var locations = document.getElementsByClassName("location");
var isSelected = false;
var selected = null;
var tower = [[], [], []];
var boxColor = ["red", "green", "blue"];
var selectingEffect = null;

function Init()
{
    tower[0] = ["r", "y", "g", "b", "p", "d"];
    tower[1] = [];
    tower[2] = [];
    for (var i = 0; i < tower.length; i++)
        RefreshAll(i);
    Restoration()
}

function SetBorderColor(color)
{
    locations[selected].style.borderColor = typeof color == "string" ? color : boxColor[selected];
}

function Restoration()
{
    isSelected = false;
    clearInterval(selectingEffect);
    if (selected != null)
        SetBorderColor();
    selected = null;
}

function RefreshConcat(string)
{
    return "<span class='gle'>" + string + "</span><br>"
}

function Refresh(type)
{
    switch (type)
    {
        case "r":
            return RefreshConcat("🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥");
        case "y":
            return RefreshConcat("🟨🟨🟨🟨🟨🟨🟨🟨🟨");
        case "g":
            return RefreshConcat("🟩🟩🟩🟩🟩🟩🟩");
        case "b":
            return RefreshConcat("🟦🟦🟦🟦🟦");
        case "p":
            return RefreshConcat("🟪🟪🟪");
        case "d":
            return RefreshConcat("⬛");
    }
}

function RefreshAll(num)
{
    locations[num].innerHTML = "<br>";
    for (var i = 0; i < tower[num].length; i++)
        locations[num].innerHTML += Refresh(tower[num][i]);
}

function LcFun(num)
{
    if (!isSelected && selected == null)
    {
        if (tower[num].length != 0)
        {
            isSelected = true;
            selected = num;
            selectingEffect = setInterval("Flash()", 100);
        }
        else
            alert("이 칸은 비었습니다!");
    }
    else
    {
        if (selected != num)
        {
            tower[num].push(tower[selected].pop());
            RefreshAll(num);
            RefreshAll(selected);
        }
        else
            alert("같은 칸을 선택할 수 없습니다!");
        Restoration()
    }
}

function Flash()
{
    if (locations[selected].style.borderColor == boxColor[selected])
        SetBorderColor("white");
    else
        SetBorderColor();
}

function Lc0()
{
    LcFun(0);
}

function Lc1()
{
    LcFun(1);
}

function Lc2()
{
    LcFun(2);
}
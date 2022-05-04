//디자인 파트
var blockHTML = [];
var warning = {SelectNull:"", SelectSame:"", PutBigBlockOnSmallBlock:""};

var rawFile = new XMLHttpRequest();
rawFile.overrideMimeType("application/json");
rawFile.open("GET", "vocab.json", true);
rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4 && rawFile.status == "200")
    {
        var data = JSON.parse(rawFile.responseText);
        for (var i = 0; i < data.block.length; i++)
        {
            blockHTML.push(data.block[i]);
        }
        warning.SelectNull = data.warning.SelectNull;
        warning.SelectSame = data.warning.SelectSame;
        warning.PutBigBlockOnSmallBlock = data.warning.PutBigBlockOnSmallBlock;
    }
}
rawFile.send(null);

//프로그래밍 파트
var locations = document.getElementsByClassName("location");
var isSelected = false;
var selected = null;
var tower = [[], [], []];
var selectingEffect = null;

function Init()
{
    tower[0] = [0, 1, 2, 3, 4, 5];
    tower[1] = [];
    tower[2] = [];
    for (var i = 0; i < tower.length; i++)
        RefreshAll(i);
    Restoration();
}

function SetId(id)
{
    locations[selected].id = typeof id == "string" ? id : `location${selected}`;
}

function Restoration()
{
    isSelected = false;
    clearInterval(selectingEffect);
    if (selected != null)
        SetId();
    selected = null;
}

function RefreshConcat(string)
{
    return "<span class='floor'>" + string + "</span><br>";
}

function Refresh(type)
{
    return RefreshConcat(blockHTML[type]);
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
            alert(warning.SelectNull);
    }
    else
    {
        if (selected != num)
        {
            if (tower[selected][tower[selected].length - 1] > tower[num][tower[num].length - 1] || tower[num].length == 0)
            {
                tower[num].push(tower[selected].pop());
                RefreshAll(num);
                RefreshAll(selected);
            }
            else
                alert(warning.PutBigBlockOnSmallBlock);
        }
        else
            alert(warning.SelectSame);
        Restoration();
    }
}

function Flash()
{
    if (locations[selected].id == `location${selected}`)
        SetId("locationN");
    else
        SetId();
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
//디자인 파트
var vocabJSON = fetch("./vocab.json").then(response => {console.log(response.block0); return response.json();});
console.log(vocabJSON);
var block0HTML = "🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥";
var block1HTML = "🟨🟨🟨🟨🟨🟨🟨🟨🟨";
var block2HTML = "🟩🟩🟩🟩🟩🟩🟩";
var block3HTML = "🟦🟦🟦🟦🟦";
var block4HTML = "🟪🟪🟪";
var block5HTML = "⬛";
var warningSelectNull = "이 칸은 비었습니다!";
var warningSelectSame = "같은 칸을 선택할 수 없습니다!";
var warningPutBigBlockOnSmallBlock = "큰 블록은 작은 블록 위에 올릴 수 없습니다!";

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
    Restoration()
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
    return "<span class='floor'>" + string + "</span><br>"
}

function Refresh(type)
{
    switch (type)
    {
        case 0:
            return RefreshConcat(block0HTML);
        case 1:
            return RefreshConcat(block1HTML);
        case 2:
            return RefreshConcat(block2HTML);
        case 3:
            return RefreshConcat(block3HTML);
        case 4:
            return RefreshConcat(block4HTML);
        case 5:
            return RefreshConcat(block5HTML);
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
            alert(warningSelectNull);
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
                alert(warningPutBigBlockOnSmallBlock);
        }
        else
            alert(warningSelectSame);
        Restoration()
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
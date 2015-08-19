colorback (white)
color (black)
const totalComment := 11
const commentRow := 13
const commentCol := 1

const aRow := 1
const aCol := 1
const bRow := 6
const bCol := 1

const totalMode := 5

%const maxHP := 150

const baseDir := Dir.Current

const maxGameOnBNet := 8
type race : enum (t, p, z)
var raceName : array 0 .. 2 of string := init ("Terran", "Protoss", "Zerg")

type mode : enum (tour, onevone, twovtwo, threevthree, fourvfour)
var gameModeName : array 0 .. totalMode - 1 of string := init ("tour", "1 vs 1", "2 vs 2", "3 vs 3", "4 vs 4")

var totalTimeWasted := 0.0
var event := 0
var nextRepeatingEvent := 500

const randomness := 35
const commentator : array 1 .. 3 of string := init ("Korean 1", "Korean 2", "Korean 3")
var comment : array 1 .. totalComment of string
var commentColour : array 1 .. totalComment of int

const totalMap := 10
const maxPlayer := 8
var mapName : array 1 .. totalMap of string := init (
    "BGH", "Python", "Lost Temple", "Blue Storm", "Othello",
    "Andromeda", "Neo_Hunters", "Fastest Map", "Luna", "Zodiac"
    )
var gameSkillLevel : array 1 .. 8 of string := init ("Noob", "Any", "Average", "Expert", "Pro", "Korean", "Korean Pro", "Uber Korean Pro")

var randomUserName : array 1 .. 75 of string := init
    ("randomUser", "noob_killer", "fishtastic",
    "1337player", "TuringFreak", "LmFao_Master",
    "Zergling", "I R The_KING", "allThyBase",
    "Zeratul", "Cerebrate", "Overmind's mind",
    "Jim Raynor", "MyBase4Aiur", "Weee_Master",

    "IamNoob", "G.W. Bush", "Bill Gates",
    "SCV", "FlyingDrone", "Probe",
    "Lanschool Student", "FooFighter", "FooBar",
    "Fenix", "Dragoon", "ZergRusher",
    "O_Yeah", "Queen of Blade", "Overmind's face",

    "WallHacker", "Hacker", "Obama",
    "IOwnU", "Steven Harper", "FireFox",
    "Thunderbird", "Spammer", "Turing 4.1",
    "MinGW", "KFC Grandpa", "Ronald McDonald",
    "I4m_UR_m0M", "Homer Simpson", "Burger King",

    "LHC Killer", "Gordon Freeman", "Darth Vader",
    "Marine", "WindowsVista", "Terran Medic",
    "Zergling", "Hydralisk", "Ultralisk",
    "Tom", "Mitochondrion", "Mario",
    "Youtube", "DoomGuy", "lolcat",

    "Epic Fail!", "Epic Win!", "Zealot",
    "Dark Templar", "Sephiroth", "Red XIII",
    "Cloud", "Ubiquinone", "Google",
    "BFG9000", "Butter", "Not Butter!",
    "BBQ", "nobleman", "paladin"

    )

forward fcn battle (map : string, m : int, pA : addressint) : int
forward proc ending

type stat :
    record
	name : string
	level : int
	experience : int
	goalExp : int
	race : race
	cash : int
	%  mp : int
	hp : real
	maxHp : real
	skill : array 0 .. 2 of int
	micro : int
	macro : int
	strat : int
    end record
type team :
    record
	member : array 1 .. 8 of stat
	total : int
    end record

process flush
    var t := 0
    loop
	if Time.Elapsed div 1000 > t then
	    Input.Flush
	    t += 1
	end if
    end loop
end flush
%fork flush

fcn newStat (n : string, cost, hp, t, p, z, micro, macro, strat : int) : stat
    var s : stat
    s.name := n
    s.cash := cost
    % s.mp := mp
    s.hp := hp
    s.skill (ord (race.t)) := t
    s.skill (ord (race.p)) := p
    s.skill (ord (race.z)) := z
    s.micro := micro
    s.macro := macro
    s.strat := strat
    result s
end newStat
const NP := newStat ("NULL", 0, 0, 0, 0, 0, 0, 0, 0)

fcn newTeam (n : int, a, b, c, d, e, f, g, h : stat) : team
    var t : team
    t.total := n
    t.member (1) := a
    t.member (2) := b
    t.member (3) := c
    t.member (4) := d
    t.member (5) := e
    t.member (6) := f
    t.member (7) := g
    t.member (8) := h
    result t
end newTeam

fcn addStat (a, b : stat) : stat
    var s := a
    s.hp := s.hp + b.hp
    s.skill (ord (race.t)) := s.skill (ord (race.t)) + b.skill (ord (race.t))
    s.skill (ord (race.p)) := s.skill (ord (race.p)) + b.skill (ord (race.p))
    s.skill (ord (race.z)) := s.skill (ord (race.z)) + b.skill (ord (race.z))
    s.micro := s.micro + b.micro
    s.macro := s.macro + b.macro
    s.strat := s.strat + b.strat
    result s
end addStat

fcn newPlayer (n : string, race : race, cost, hp, t, p, z, micro, macro, strat : int) : stat
    var s := newStat (n, cost, hp, t, p, z, micro, macro, strat)
    s.maxHp := hp
    s.race := race
    s.level := 0
    s.experience := 0
    s.goalExp := 0
    result s
end newPlayer

fcn evaluate (i : stat) : int
    var score := i.micro ** 1.5 + i.macro ** 1.5 + i.strat ** 1.5
    score += i.skill (0) ** 1.2 + i.skill (1) ** 1.2 + i.skill (2) ** 1.2
    result score div 20
end evaluate

proc anyKey
    Input.Flush
    color (brown)
    put "Press anykey to continue."
    View.Update
    var crap := getchar
    color (black)
end anyKey

proc wasteTime (s : string, t : real)
    put s ..
    for i : 1 .. t div .2
	delay (200)
	put "." ..
    end for
    put ""
    totalTimeWasted += t
end wasteTime

fcn yesOrNo : char
    Input.Flush
    var ch : char
    loop
	ch := getchar
	exit when ch = 'y' or ch = 'n'
    end loop
    result ch
end yesOrNo

fcn getChoice (i, f : int) : int
    Input.Flush
    var crap : char
    loop
	crap := getchar
	exit when crap >= intstr (i) and crap <= intstr (f)
    end loop
    result strint (crap)
end getChoice

fcn plusMinus (t : real) : string
    if t >= 0 then
	result "+" + intstr (round (t))
    else
	result intstr (round (t))
    end if
end plusMinus

fcn oneOfThem (this, that : string) : string
    if Rand.Int (1, 2) = 1 then
	result this
    end if
    result that
end oneOfThem


fcn getInt : int
    var tempString : string
    loop
	tempString := " "
	get tempString : *
	for i : 1 .. length (tempString)
	    if ord (tempString (i)) > 57 or ord (tempString (i)) < 48 then
		put "Epic Input Fail ! (Must be Integer)"
		exit
	    end if
	    if i = length (tempString) then
		result strint (tempString)
	    end if
	end for
    end loop
end getInt

proc drawPic (x, y : int, file : string)
    Dir.Change (baseDir + "/picture")
    var pic : int
    var name := ""
    for decreasing i : length (file) .. 1
	if file (i) not= " " then
	    name := file (1 .. i) + ".jpg"
	    exit
	end if
    end for

    pic := Pic.FileNew (name)
    if pic > 0 then
	Pic.Draw (pic, x, y, picMerge)
	View.Update
	Pic.Free (pic)
    end if
    Dir.Change (baseDir)
end drawPic



var player, equipedPlayer : stat
var saving := 150
const totalBoss := 9
var currentLevel := 1
var boss : array 1 .. totalBoss of stat

boss (1) := newPlayer ("Master Fish", race.t, 100, 100, 20, 22, 19, 19, 20, 15)
boss (2) := newPlayer ("Hax0r1", race.t, 200, 120, 30, 30, 20, 25, 27, 30)
boss (3) := newPlayer ("July_zerg", race.z, 350, 150, 30, 30, 40, 45, 47, 45)
boss (4) := newPlayer ("Stork[gm]", race.p, 600, 180, 45, 45, 40, 50, 56, 43)
boss (5) := newPlayer ("[red]NaDa", race.t, 1000, 200, 45, 45, 45, 55, 65, 50)
boss (6) := newPlayer ("sAviOr[gm]", race.z, 1500, 220, 55, 55, 50, 75, 73, 50)
boss (7) := newPlayer ("n.Die_Jaedong", race.z, 2500, 230, 65, 75, 100, 85, 85, 80)
boss (8) := newPlayer ("Bisu[Shield]", race.p, 4000, 250, 85, 85, 80, 90, 95, 75)
boss (9) := newPlayer ("Slayer_Boxer", race.t, 20000, 300, 90, 80, 100, 100, 90, 100)

const totalEquipType := 6
const totalEquipLevel : array 0 .. totalEquipType - 1 of int := init (5, 6, 6, 4, 8, 5)
type equip : enum (mouse, keyboard, screen, mousepad, accessory, headphone)
var equipName : array 0 .. totalEquipType - 1 of string := init ("Mouse", "Keyboard", "Monitor", "Mouse Pad", "Accessory", "Headphone")

var equipment : array 0 .. totalEquipType - 1, 1 .. 9 of stat
var equiped : array 0 .. totalEquipType - 1 of int
var equipBought : array 0 .. totalEquipType - 1, 1 .. 9 of boolean

%newStat (                                 n : string,                   cost,     hp,   t, p,  z, micro, macro,strat
equipment (ord (equip.mouse), 01) := newStat ("Laptop Mouse           ", 000020, 000000, 01, 01, 01, 02, 02, 00)
equipment (ord (equip.mouse), 02) := newStat ("Logitech G1            ", 000050, 000000, 02, 02, 02, 02, 02, 00)
equipment (ord (equip.mouse), 03) := newStat ("Razor 9800             ", 000100, 000000, 03, 03, 03, 03, 03, 00)
equipment (ord (equip.mouse), 04) := newStat ("Razor Lacheis 4000     ", 000200, 000000, 04, 03, 03, 03, 05, 01)
equipment (ord (equip.mouse), 05) := newStat ("Logitech Laser (G9)    ", 001500, 000000, 07, 07, 07, 07, 09, 03)

equipment (ord (equip.keyboard), 01) := newStat ("Home Made Noob Board   ", 000050, 000000, 01, 01, 01, 01, 01, 00)
equipment (ord (equip.keyboard), 02) := newStat ("Dynex Wired (DX-WKBD)  ", 000089, 000000, 01, 01, 01, 02, 02, 00)
equipment (ord (equip.keyboard), 03) := newStat ("Longitech Wireless     ", 000190, 000000, 02, 02, 02, 02, 02, 00)
equipment (ord (equip.keyboard), 04) := newStat ("Microsoft  E. D. 7000  ", 000400, 000000, 03, 03, 03, 03, 03, 00)
equipment (ord (equip.keyboard), 05) := newStat ("Razer Lycosa           ", 002000, 000000, 06, 06, 06, 08, 07, 02)
equipment (ord (equip.keyboard), 06) := newStat ("A+Master Board         ", 010000, 000000, 10, 10, 10, 17, 10, 03)

equipment (ord (equip.screen), 01) := newStat ("Standard CRT           ", 000100, 000000, 00, 00, 00, 01, 01, 00)
equipment (ord (equip.screen), 02) := newStat ("Acer 18\" LCD           ", 000200, 000000, 01, 01, 01, 02, 02, 01)
equipment (ord (equip.screen), 03) := newStat ("LG 20\" LCD             ", 000350, 000000, 03, 03, 03, 03, 03, 02)
equipment (ord (equip.screen), 04) := newStat ("Samsung 25.5\" SCMaster ", 000500, 000000, 04, 04, 04, 04, 04, 02)
equipment (ord (equip.screen), 05) := newStat ("LG 30\" LCD W3000H-BN   ", 002000, 000000, 06, 06, 06, 07, 07, 07)
equipment (ord (equip.screen), 06) := newStat ("Pro Screen 9000         ", 008000, 000000, 10, 10, 10, 09, 09, 09)

equipment (ord (equip.mousepad), 01) := newStat ("Noob Pad             ", 000030, 000000, 00, 00, 00, 01, 01, 00)
equipment (ord (equip.mousepad), 02) := newStat ("Normal Pad           ", 000070, 000000, 01, 01, 01, 01, 01, 00)
equipment (ord (equip.mousepad), 03) := newStat ("Gel Pad              ", 000200, 000000, 00, 00, 00, 02, 02, 01)
equipment (ord (equip.mousepad), 04) := newStat ("RAZER Destructor Pro ", 000500, 000000, 02, 02, 02, 03, 03, 02)

equipment (ord (equip.accessory), 01) := newStat ("Four Leaf Clover       ", 000250, 000000, 01, 01, 01, 01, 01, 01)
equipment (ord (equip.accessory), 02) := newStat ("Sunken's Tongue        ", 000500, 000000, 00, 00, 05, 00, 05, 00)
equipment (ord (equip.accessory), 03) := newStat ("Magic Stone of Aiur    ", 000500, 000000, 00, 05, 00, 05, 00, 00)
equipment (ord (equip.accessory), 04) := newStat ("Camping Set            ", 000500, 000000, 05, 00, 00, 00, 00, 08)
equipment (ord (equip.accessory), 05) := newStat ("Zergling Head          ", 002500, 000000, 00, 00, 15, 00, 15, 00)
equipment (ord (equip.accessory), 06) := newStat ("Diamond from Pylon     ", 002500, 000000, 00, 15, 00, 05, 00, 00)
equipment (ord (equip.accessory), 07) := newStat ("Large Camping Bundle   ", 002500, 000000, 15, 00, 00, 00, 00, 20)
equipment (ord (equip.accessory), 08) := newStat ("Mineral Hack           ", 020000, 000000, 00, 00, 00, 00, 50, 00)

equipment (ord (equip.headphone), 01) := newStat ("iPod Earphone          ", 000050, 000000, 00, 00, 00, 00, 01, 01)
equipment (ord (equip.headphone), 02) := newStat ("Panasonic Earbuds      ", 000120, 000000, 00, 00, 00, 01, 02, 02)
equipment (ord (equip.headphone), 03) := newStat ("Razer Piranha          ", 000300, 000000, 01, 01, 01, 00, 03, 03)
equipment (ord (equip.headphone), 04) := newStat ("Sennheiser PC350       ", 000700, 000000, 02, 02, 02, 01, 05, 05)
equipment (ord (equip.headphone), 05) := newStat ("Lengendary SCphone     ", 003000, 000000, 04, 04, 04, 03, 10, 08)


const totalFoodType := 9
var food : array 1 .. totalFoodType of stat
food (01) := newStat ("Chips             ", 000005, 000020, 00, 00, 00, 00, 00, 00)
food (02) := newStat ("Beer              ", 000010, 000030, 00, 00, 00, 00, 00, 00)
food (03) := newStat ("Instant Noodle    ", 000020, 000050, 00, 00, 00, 00, 00, 00)
food (04) := newStat ("Orange Juice      ", 000030, 000060, 00, 00, 00, 00, 00, 00)
food (05) := newStat ("Apple Juice       ", 000050, 000095, 00, 00, 00, 00, 00, 00)
food (06) := newStat ("Chicken Burger    ", 000070, 000120, 00, 00, 00, 00, 00, 00)
food (07) := newStat ("Red Bull          ", 000100, 000160, 00, 00, 00, 00, 00, 00)
food (08) := newStat ("Chicken Wings     ", 000200, 000300, 00, 00, 00, 00, 00, 00)
food (09) := newStat ("Zergling Juice    ", 000500, 000600, 00, 00, 00, 00, 00, 00)

const totalTrainType := 6
var train : array 1 .. totalTrainType of stat
train (01) := newStat ("Thinking       |", 000100, 000000, 00, 00, 00, 01, 00, 00)
train (02) := newStat ("Finger         |", 000100, 000000, 00, 00, 00, 00, 01, 00)
train (03) := newStat ("Concentration  |", 000100, 000000, 00, 00, 00, 00, 00, 01)

train (04) := newStat ("Terran Build Order     |", 00050, 000000, 01, 00, 00, 00, 00, 00)
train (05) := newStat ("Toss Build Order       |", 00050, 000000, 00, 01, 00, 00, 00, 00)
train (06) := newStat ("Zerg Build Order       |", 00050, 000000, 00, 00, 01, 00, 00, 00)
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
proc newGame
    player := newPlayer ("Player", race.p, 100, 50, 18, 18, 18,
	15, 15, 12)
    %player := newPlayer ("Player", race.p, 100, 200, 200 + Rand.Int (-1, 1), 200 + Rand.Int (-1, 1), 200 + Rand.Int (-1, 1),
    %    205 + Rand.Int (-1, 1), 205 + Rand.Int (-1, 1), 205 + Rand.Int (-1, 1))

    player.level := 1
    player.goalExp := 25
    player.experience := 0
    for i : 0 .. totalEquipType - 1
	equiped (i) := maxint
	for j : 1 .. 9
	    equipBought (i, j) := false
	end for
    end for
    player.cash := 100

    equipedPlayer := player
end newGame

proc showItemStat (i : stat)
    cls
    put "Name       : " + i.name
    put "Cost       : " + intstr (i.cash)
    put ""
    put "Energy     : " + plusMinus (i.hp)
    put ""
    put "Micro      : " + plusMinus (i.micro)
    put "Macro      : " + plusMinus (i.macro)
    put "Strategy   : " + plusMinus (i.strat)
    put ""
    put "Vs Terran  : " + plusMinus (i.skill (ord (race.t)))
    put "Vs Toss    : " + plusMinus (i.skill (ord (race.p)))
    put "Vs Zerg    : " + plusMinus (i.skill (ord (race.z)))
    put ""

    drawPic (300, 200, i.name)

    anyKey
end showItemStat

proc showPlayerStat (i : stat)
    cls
    put "Name       : " + i.name
    put "Race       : " + raceName (ord (i.race))
    put "Level      : ", i.level
    put "Exp        : ", i.experience, "/", i.goalExp
    put "Cash       : $" + intstr (i.cash)
    put ""
    put "Energy     : ", round (i.hp / i.maxHp * 100), " %  (", ceil (i.hp), "/", i.maxHp, ")"
    put ""
    color (red)
    put "Micro      : ", repeat ("|", i.micro div 2), " ", i.micro
    color (green)
    put "Macro      : ", repeat ("|", i.macro div 2), " ", i.macro
    color (blue)
    put "Strategy   : ", repeat ("|", i.strat div 2), " ", i.strat
    color (black)
    put ""
    color (blue)
    put "Vs Terran  : ", repeat ("|", i.skill (ord (race.t)) div 2), " ", i.skill (ord (race.t))
    color (43)
    put "Vs Protoss : ", repeat ("|", i.skill (ord (race.p)) div 2), " ", i.skill (ord (race.p))
    color (red)
    put "Vs Zerg    : ", repeat ("|", i.skill (ord (race.z)) div 2), " ", i.skill (ord (race.z))
    put ""
    drawPic (maxx - 150, maxy - 80, raceName (ord (i.race)))

    anyKey
end showPlayerStat

proc refreshPlayer
    cls
    player.hp := equipedPlayer.hp
    if equipedPlayer.experience > player.experience then
	put "You gained ", equipedPlayer.experience - player.experience, " experience!  ",
	    "(", equipedPlayer.experience, "/", player.goalExp, ")"
	player.experience += equipedPlayer.experience - player.experience
	anyKey
    end if
    if player.experience >= player.goalExp then
	put "Level Up!"
	anyKey
	put "You are now level: ", player.level + 1
	anyKey
	cls
	var eb := player.level div 5 + 5
	put "Max Energy + ", eb
	player.maxHp += eb
	anyKey

	var c : int
	for decreasing i : 3 .. 1
	    cls
	    put "You have ", i, " skill points.\n"
	    put "1 - increase micro (", player.micro, ")"
	    put "2 - increase macro (", player.macro, ")"
	    put "3 - increase strategy (", player.strat, ")"
	    c := getChoice (1, 3)
	    if c = 1 then
		player.micro += 1
	    elsif c = 2 then
		player.macro += 1
	    elsif c = 3 then
		player.strat += 1
	    end if
	end for


	for decreasing i : 3 .. 1
	    cls
	    put "You have ", i, " race points.\n"
	    put "1 - increase vs Terran (", player.skill (0), ")"
	    put "2 - increase vs Protoss (", player.skill (1), ")"
	    put "3 - increase vs Zerg (", player.skill (2), ")"
	    c := getChoice (1, 3)
	    if c = 1 then
		player.skill (0) += 1
	    elsif c = 2 then
		player.skill (1) += 1
	    elsif c = 3 then
		player.skill (2) += 1
	    end if
	end for

	player.level += 1
	%player.hp := maxHP
	player.experience -= player.goalExp
	player.goalExp := ceil (player.goalExp * 1.04 + 10)
    end if
    if player.hp > player.maxHp then
	player.hp := player.maxHp
    end if
    if player.hp < 0 then
	player.hp := 0
    end if

    equipedPlayer := player
    for i : 0 .. totalEquipType - 1
	if equiped (i) <= totalEquipLevel (i) then
	    equipedPlayer := addStat (equipedPlayer, equipment (i, equiped (i)))
	end if
    end for
end refreshPlayer

fcn generatePlayer (skill : int) : stat
    var p : stat
    p.name := randomUserName (Rand.Int (1, upper (randomUserName)))
    if Rand.Int (1, 3) = 1 then
	p.race := race.t
    elsif Rand.Int (1, 2) = 1 then
	p.race := race.p
    else
	p.race := race.z
    end if
    p.maxHp := Rand.Int (50, 100) / 100 * skill * 20 + Rand.Int (50, 100)
    p.hp := p.maxHp * Rand.Int (60, 100) div 100
    p.micro := Rand.Int (skill * 7, skill * 14)
    p.macro := Rand.Int (skill * 7, skill * 14)
    p.strat := Rand.Int (skill * 7, skill * 14)
    p.skill (ord (race.t)) := Rand.Int (skill * 7, skill * 14)
    p.skill (ord (race.p)) := Rand.Int (skill * 7, skill * 14)
    p.skill (ord (race.z)) := Rand.Int (skill * 7, skill * 14)
    result p
end generatePlayer

proc showRoom (name : string, m : string, r : team)
    cls
    put "Game:  ", name
    put "Map:  ", m
    put "\n"
    for i : 1 .. r.total
	put r.member (i).name : 25, raceName (ord (r.member (i).race))
	if i = r.total div 2 then
	    color (red)
	    put "             vs"
	    color (black)
	end if
    end for


end showRoom

proc trainingGround
    cls
    drawPic (300, 30, "cafe1")
    wasteTime ("Owner: looking for a computer?", 1)
    wasteTime (player.name + ": Yes!", 1)
    wasteTime ("Owner: It will cost you $5.", 0.5)
    put "Deal?(y/n)"
    var cho := yesOrNo
    if cho = 'n' then
	return
    else
	if player.cash < 5 then
	    put "You dont have enough money."
	    anyKey
	    return
	else
	    player.cash -= 5
	end if
    end if
    cls
    wasteTime ("\nconnecting to Battle.Net", Rand.Real + 0.3)
    wasteTime ("Searching for fastest server", Rand.Real + 0.3)
    wasteTime ("Getting player profile", Rand.Real + 0.3)
    wasteTime ("Logging in", Rand.Real + 0.3)


    loop

	cls

	var maxSkill := 0
	var minSkill := 0
	put "Join channel:\n"

	put "1 - Noob"
	put "2 - Beginner"
	put "3 - Any"
	put "4 - Expert"
	put "5 - Korean Only"
	put "6 - Korean Pro Only"

	put "\n0 - Exit"
	var c := getChoice (0, 6)
	minSkill := c
	maxSkill := c + upper (gameSkillLevel) - 6

	exit when c = 0
	loop
	    if player.hp < 10 then
		cls
		put "You left the cafe because you ran out of energy."
		put "(You need to go home and rest OR buy something to eat)"
		anyKey
		return
	    end if
	    cls
	    put "Connected to Battle.net.\nThere are currently ",
		Rand.Int (100000, 200000), " players playing ", Rand.Int (30000, 80000), " Games."
	    put ""
	    put "\n1 - Join a game"
	    put "\n0 - leave"
	    drawPic (300, 30, oneOfThem ("computer1", "bnet2"))
	    c := getChoice (0, 1)
	    exit when c = 0



	    var gameName : array 1 .. maxGameOnBNet of string
	    var gameMode : array 1 .. maxGameOnBNet of int
	    var gameSkill : array 1 .. maxGameOnBNet of int
	    var gameMap : array 1 .. maxGameOnBNet of string

	    loop
		cls
		% generate game list
		var totalGame := Rand.Int (2, maxGameOnBNet)
		for i : 1 .. totalGame
		    gameMode (i) := Rand.Int (1, totalMode - 1)
		    gameSkill (i) := Rand.Int (minSkill, maxSkill)
		    gameMap (i) := mapName (Rand.Int (1, upper (mapName)))

		    gameName (i) := gameModeName (gameMode (i)) + " " + gameSkillLevel (gameSkill (i)) + " " + gameMap (i)
		    if Rand.Int (1, 2) = 1 then
			gameName (i) := gameMap (i) + " " + gameModeName (gameMode (i)) + " " + gameSkillLevel (gameSkill (i))
		    end if
		end for

		%output and get choice
		put "Available Games:\n\n"
		for i : 1 .. totalGame
		    put i, " - ", gameName (i)
		end for
		put "\n0 - back"
		drawPic (300, 30, "bnet1")
		c := getChoice (0, totalGame)
		exit when c = 0

		%% play a game on B-NEt
		var room : team
		room.total := gameMode (c) * 2
		refreshPlayer
		room.member (1) := equipedPlayer
		for j : 2 .. room.total
		    room.member (j) := generatePlayer (Rand.Int (gameSkill (c), ceil (gameSkill (c) ** 1.5)))
		end for
		% check for same user name

		var l, m := 1
		loop
		    exit when l = room.total
		    m := l + 1
		    loop
			if room.member (l).name = room.member (m).name then
			    room.member (m) := generatePlayer (gameSkill (c))
			    l := 1
			end if
			exit when m = room.total
			m += 1
		    end loop
		    l += 1
		end loop

		if evaluate (room.member (2)) / evaluate (equipedPlayer) > 2.5 then
		    cls
		    put "You tried to join: ", gameName (c)
		    put "The host banned you because you are too noob to play at their level.\n"
		    put "Try to join noob games before you are good enough to face the pros."

		    anyKey
		    exit
		end if

		showRoom (gameName (c), gameMap (c), room)
		color (red)
		put "\n\nReady? (y/n)"
		color (black)
		var c2 := yesOrNo
		exit when c2 = 'n'

		var winner := battle (gameMap (c), gameMode (c), addr (room))
		if winner = 2 then
		    put "You Lost!"
		else
		    put "You Won!"
		    equipedPlayer.experience += evaluate (room.member (2))
		end if

		totalTimeWasted += 5

		equipedPlayer.hp := room.member (1).hp
		anyKey
		refreshPlayer
		exit
	    end loop

	end loop
    end loop
end trainingGround

proc foodShop
    loop
	cls
	put "Food!"
	put "Your Energy: ", round (player.hp), "/", player.maxHp, "\n"
	for i : 1 .. totalFoodType
	    if food (i).cash <= player.cash then
		put i, " - ", food (i).name : 20, "$", food (i).cash
	    elsif food (i).cash > player.cash then
		put i, " - You are too poor to aford it!"
	    end if
	end for
	put "\n0 - Exit"
	drawPic (300, 30, oneOfThem ("food1", "food2"))
	var c := getChoice (0, totalFoodType)
	exit when c = 0
	if player.cash >= food (c).cash then
	    showItemStat (food (c))
	    var key : char
	    put "buy? (y/n)"
	    key := yesOrNo
	    if key = 'y' and player.cash >= food (c).cash then

		equipedPlayer := addStat (equipedPlayer, food (c))
		player.cash -= food (c).cash
		wasteTime ("\nConsuming " + food (c).name, 1.5)
		refreshPlayer
	    end if
	end if

    end loop
end foodShop

proc school
    loop
	cls
	put "So.. You are trying to get a degree in SC\n"
	for i : 1 .. totalTrainType
	    put i, " - ", train (i).name : 20
	end for
	put "\n0 - Exit"
	var c := getChoice (0, totalTrainType)
	exit when c = 0
	showItemStat (train (c))

	put "take lesson? (y/n)"
	var key := yesOrNo
	if key = 'y' and player.cash >= train (c).cash then
	    player := addStat (player, train (c))
	    player.cash -= train (c).cash
	    train (c).cash := round (train (c).cash + 50)
	    train (c).name += "|"
	    refreshPlayer
	elsif key = 'y' and player.cash < train (c).cash then
	    put "no money = no education!"
	    anyKey
	end if
    end loop
end school

proc shopEquipList (which : int)
    loop
	cls
	put "You want to buy a ", equipName (which), "."
	put "You have $", player.cash
	put ""
	for i : 1 .. totalEquipLevel (which)
	    if equipBought (which, i) then
		put i, " - You already have one!"
	    elsif equipment (which, i).cash > player.cash then
		put i, " - You are too poor to aford it!"
	    else
		put i, " - ", equipment (which, i).name : 20, "$", equipment (which, i).cash
	    end if
	end for
	put " "
	put "0 - exit "
	var c := getChoice (0, totalEquipLevel (which))
	if c >= 1 and c <= totalEquipLevel (which)
		and equipment (which, c).cash <= player.cash
		and equipBought (which, c) = false then
	    showItemStat (equipment (which, c))

	    put "buy? (y/n)"
	    var key := yesOrNo
	    if key = 'y' then
		player.cash -= equipment (which, c).cash
		equipBought (which, c) := true
	    end if
	end if
	exit when c = 0
    end loop
end shopEquipList

proc itemShop
    loop
	cls
	put "Welcome to Future Shop!\nWhat are you looking for?\n"
	for i : 1 .. totalEquipType
	    put i, " - ", equipName (i - 1)
	end for
	put "\n0 - nothing "
	drawPic (250, 30, oneOfThem ("itemshop1", "itemshop2"))
	var c := getChoice (0, totalEquipType)

	exit when c = 0
	if c >= 1 and c <= totalEquipType then
	    shopEquipList (c - 1)
	end if
    end loop
end itemShop


proc inventoryEquipList (which : int)
    loop
	cls
	put "Your: ", equipName (which)
	put ""
	for i : 1 .. totalEquipLevel (which)
	    if equipBought (which, i) and equiped (which) = i then
		put i, " - ", equipment (which, i).name, " - Using"
	    elsif equipBought (which, i) and ~equiped (which) = i then
		put i, " - ", equipment (which, i).name
	    else
		put i, " - dont have!"
	    end if
	end for
	put "\n0 - exit"
	var c := getChoice (0, totalEquipLevel (which))
	exit when c = 0
	if equipBought (which, c) then
	    showItemStat (equipment (which, c))
	    put "equip? (y/n)"
	    var ch := yesOrNo

	    if ch = 'y' then
		equiped (which) := c
		refreshPlayer
	    end if
	end if
    end loop
end inventoryEquipList

proc inventory
    loop
	cls
	put "I want: \n"
	for i : 0 .. totalEquipType - 1
	    put i + 1, " - ", equipName (i)
	end for
	put "\n0 - nothing "
	var c := getChoice (0, totalEquipType)
	exit when c = 0
	inventoryEquipList (c - 1)
    end loop
end inventory

proc home
    loop
	cls
	put "Finally, a place to rest! \n"
	put "1 - Inventory"
	put "2 - My stat"
	put "3 - Rest (+5 Energy)"
	put "4 - Sleep (+50 Energy)"
	put "5 - Take off all equipments."
	put "\n0 - Leave"
	var c := getChoice (0, 5)
	if c = 2 then
	    refreshPlayer
	    showPlayerStat (equipedPlayer)
	elsif c = 1 then
	    inventory
	elsif c = 3 then
	    wasteTime ("resting", 2)
	    put "you gained 5 energy."
	    anyKey
	    equipedPlayer.hp += 5
	    refreshPlayer
	elsif c = 4 then
	    color (red)
	    put "Warning, it will take 30 seconds of your life to sleep."
	    put "Are you sure you want to waste 30 seconds of your life \n  that you will never get back?"
	    color (black)
	    put "(y/n)"
	    var cc := yesOrNo
	    if cc = 'y' then
		wasteTime ("sleeping", 2)
		delay (3000)
		wasteTime ("sleeping more", 2)
		delay (3000)
		wasteTime ("zZzZzZ", 2)
		delay (3000)
		wasteTime ("omg! " + oneOfThem (oneOfThem ("cannon rush!", "SCV rush"), oneOfThem ("zergings", "noobs")), 2)
		delay (3000)
		wasteTime ("mmm......", 2)
		delay (3000)
		wasteTime ("zZzZzZ", 2)
		delay (3000)
		equipedPlayer.hp += 50
		put "you woke up."
		anyKey
		refreshPlayer
	    end if
	elsif c = 5 then
	    put "You lost all stat bonuses from items."
	    anyKey
	    for i : 0 .. totalEquipType - 1
		equiped (i) := maxint
	    end for
	    refreshPlayer
	end if

	exit when c = 0
    end loop
end home

proc tournament
    loop
	cls
	if player.hp < 5 then
	    put "you left the tournament becasue you ran out of energy"
	    anyKey
	    exit
	end if
	put "Welcome to Korea! \nThe land of SC Pros!\n";
	drawPic (300, 20, oneOfThem ("tour1", "tour2"))
	for i : 1 .. totalBoss
	    if currentLevel >= i then
		put i, " - ", boss (i).name, " ---->  Entry fee: ", "$", boss (i).cash div 2, "  Prize: ", "$", boss (i).cash
	    else
		put
		    i, " - Locked!"
	    end if
	end for
	put "\n0 - Run away!"

	var c := getChoice (0, currentLevel)
	exit when c = 0

	showPlayerStat (boss (c))
	var battleMap := mapName (Rand.Int (1, totalMap))
	put "1 vs 1?  on ", battleMap, "? (y/n)"
	var ch := yesOrNo
	if ch = 'y' and player.cash >= boss (c).cash div 2 then
	    player.cash -= boss (c).cash div 2
	    var winner := 0
	    refreshPlayer

	    cls
	    put "You are playing a match against: ", boss (c).name, ".\n"
	    put "A large crowd is sitting around you waiting for the game to start."
	    put "Korean commentators are preparing themselves,"
	    put "\nAs the camera moves through the audience,"
	    put "people cover their faces with signs saying:"
	    put "\"I love you ", oneOfThem (player.name, boss (c).name), " !\""

	    put "\nReady?"
	    anyKey
	    cls
	    put "Game will start in"
	    for decreasing j : 5 .. 1
		put j
		drawPic (200, 50, "battle1")
		delay (500)
	    end for

	    var room := newTeam (2, equipedPlayer, boss (c), NP, NP, NP, NP, NP, NP)
	    winner := battle (battleMap, ord (mode.tour), addr (room))
	    equipedPlayer := room.member (1)
	    if winner = 1 then
		player.cash += boss (c).cash
		cls
		put "You won ", "$", boss (c).cash, " !!"
		drawPic (300, 50, "tour3")
		anyKey
		if currentLevel = c then
		    equipedPlayer.experience += round (evaluate (boss (c)) * 2)
		    currentLevel := c + 1
		    if currentLevel > 9 then
			currentLevel := 9
			ending
		    end if
		else
		    equipedPlayer.experience += round (evaluate (boss (c)) * 0.2)
		end if

		refreshPlayer
	    else
		put "You suffered a crushing defeat!"
		anyKey
	    end if
	    totalTimeWasted += 5
	elsif ch = 'y' and player.cash < boss (c).cash div 2 then
	    put "You dont have enough cash to enter the game!"
	    anyKey
	end if

    end loop
end tournament

proc beg
    cls
    if player.hp >= 10 then
	put "Somewhere on the street,\nA teenager covered with blanket is sitting on sidewalk,\n",
	    "Not far from him, there is a sign written on a old card board.",
	    "\nSign: SC ruined my life.I am cold and hungry!"
	drawPic (200, 20, oneOfThem ("beg1   ", "beg2  "))

	wasteTime ("\nPlease help T_T.", 5)
	var m : int
	if Rand.Int (1, 10) = 1 then
	    m := round (Rand.Int (30, 60) / 100 * player.cash)
	    color (red)
	    put "\nYou were beaten up and lost: $", m

	    player.cash -= m
	else
	    m := Rand.Int (1, Rand.Int (1, 10) ** 2)
	    color (green)
	    put "\nSome nice people spared you: ", "$", m
	    player.cash += m
	end if
	equipedPlayer.hp -= 10
	color (black)
	anyKey
	refreshPlayer
    else
	put "you dont have enough energy to beg for money. (need 10+)"
	anyKey
    end if
end beg

proc bank
    loop
	cls
	put "Welcome to Bank of No Interest."
	put "You have: $", saving, " in your account, and $", player.cash, " on your hand."

	put "\n1 - Save Money"
	put "2 - Withdraw Money"
	put "\n0 - Leave"

	var c := getChoice (0, 2)
	exit when c = 0
	if c = 1 then
	    cls
	    put "How much Would you like to save?"
	    put "Save: " ..
	    var m : int
	    m := getInt
	    if m > player.cash then
		put "You don't have that much money!"
		anyKey
	    elsif m <= player.cash and m > 0 then
		player.cash -= m
		saving += m
	    end if
	end if
	if c = 2 then
	    cls
	    put "How much Would you like to withdraw?"
	    put "Take: " ..
	    var m : int
	    m := getInt
	    if m > saving then
		put "You don't have that much money!"
		anyKey
	    elsif m <= saving and m > 0 then
		saving -= m
		player.cash += m
	    end if
	end if
    end loop
end bank

proc runEvent
    var tt := totalTimeWasted
    if tt > nextRepeatingEvent then
	var e := Rand.Int (1, 5)
	if e = 1 then
	    cls
	    put "A random Korean girl approaches you."
	    anyKey
	    put "Girl: OMG!"
	    put "Girl: Are you ", player.name, " ?"
	    put player.name, " :..."
	    anyKey
	    put "Girl: I am your fan!"
	    put "Girl: Can you ", oneOfThem ("sign an autograph for me?", "take a picture with me?")
	    put "(y/n)"
	    var c := yesOrNo
	    if c = 'y' then
		put "Girl: Thank You!"
		var m := Rand.Int (totalTimeWasted div 8, totalTimeWasted div 5)
		put "She gives you: $", m
		player.cash += m
	    else
		put "She runs away crying."
	    end if
	    anyKey
	elsif e = 2 then
	    cls
	    put "Some random guy on the street walks up to you."
	    put "Guy: I've heard of your SC skills."
	    anyKey
	    put "Guy: I run this game show and I need "
	    put "     good SC players to join my new tournament."
	    put "Guy: do you want to join? "
	    put "(y/n)"
	    var y := yesOrNo
	    if y = 'y' then
		var tempBoss := generatePlayer (Rand.Int (2, 6))
		put "Guy: prepare yourself for your enemy."
		anyKey
		var room := newTeam (2, equipedPlayer, tempBoss, NP, NP, NP, NP, NP, NP)
		var winner := battle (oneOfThem ("Destination", "Rush Hour III"), ord (mode.tour), addr (room))
		if winner = 1 then
		    put "You won a special tournament!"
		    anyKey
		    var m := evaluate (tempBoss) * 10
		    put "The guy rewarded you $", m
		    anyKey
		    player.cash += m
		    put "Guy: I hope to see you in the official tournament."
		else
		    put "You lose. Better luck next time"
		end if
	    else
		put "Guy: Ok... It's your loss"
	    end if
	    anyKey
	elsif e = 3 then
	    cls
	    put "You need to pay for your rent"
	    anyKey
	    player.cash := max (0, player.cash - 50)
	    put "You spent $50."
	    anyKey
	elsif e = 4 then
	    cls
	    put "A teenager runs toward you."
	    anyKey
	    put "Teen: I know you!"
	    put "Teen: You are ", player.name, " !"
	    put "Teen: I have been training my sc skills for many years \n  and I am going to beat you!"
	    put "-  Accept challenge? (y/n)"
	    var y := yesOrNo
	    if y = 'y' then
		var tempBoss := generatePlayer (Rand.Int (totalTimeWasted div 500 + 1, totalTimeWasted div 500 + 2))
		put "Teen: get ready."
		anyKey
		var room := newTeam (2, equipedPlayer, tempBoss, NP, NP, NP, NP, NP, NP)
		var winner := battle (oneOfThem ("Destination", "Rush Hour III"), ord (mode.onevone), addr (room))
		if winner = 1 then
		    put "You won a special tournament!"
		    anyKey
		    equipedPlayer.experience += evaluate (tempBoss) * 3
		    put "You gained ", evaluate (tempBoss) * 3, " experience."
		    refreshPlayer
		    put "Teen: indeed you are pro!"
		    anyKey
		else
		    put "Teen: Noob, haha!"
		    anyKey
		end if
	    else
		put player.name, ": no you noob!"
		put "He walks away and disappointed"
		anyKey
	    end if
	elsif e = 5 then
	    cls
	    var m := Rand.Int (totalTimeWasted div 10, totalTimeWasted div 7)
	    put "As you walk pass an ordianry internet cafe"
	    put "A nerdy guy passes you."
	    anyKey
	    put "Nerdy Guy: Do you have a life?"
	    put player.name, " : WTF?"
	    anyKey
	    put "Nerdy Guy: You see, I dont have a life."
	    anyKey
	    put "Nerdy Guy: I was trying to buy godly items from pros from real life money."
	    anyKey
	    put "Nerdy Guy: If I keep this money"
	    put "  I will be buying items for ", oneOfThem (oneOfThem ("Maple Story", "WoW"), oneOfThem ("Lineage", "Runescape"))
	    put "  That will be crazy! who spends money on a game?"
	    put "  So take it now before I reach level ", Rand.Int (70, 90)
	    anyKey
	    put player.name, " : OK....?"
	    put "You gained $", m
	    player.cash += m
	    anyKey
	end if

	nextRepeatingEvent := round (tt + Rand.Int (50, 200))
	return
    end if
    %%%%%%%%% special Events %%%%%%%%
    if tt > 20 and event = 0 then
	cls
	put "As you walk around the street,  a stranger points at you and says:"
	put "\"you noob will never beat the masters. lolz~ \""
	anyKey
	put player.name, ": You will see... You will see."
	anyKey
    elsif tt > 50 and event = 1 then
	cls
	put "A guy apears and says:"
	put "\"Noob\""
	anyKey
	put player.name, ": T_T *cry*"
	anyKey
    elsif tt > 100 and event = 2 then
	cls
	put "A average kid appears and asks you to give him $5."
	put "give? (y/n)"
	var y := yesOrNo
	if y = 'y' then
	    if player.cash >= 5 then
		put "The kid happly entered an internet cafe."
		player.cash := max (player.cash - 5, 0)
	    else
		put "You dont even have $5 !!"
		anyKey
		put "kid: *cry*"
	    end if
	else
	    put "The kid punches you and takes all your money."
	    put "you now have $0."
	    player.cash := 0
	end if
	anyKey
    elsif tt > 200 and event = 3 then
	cls
	var m := Rand.Int (50, 100)
	put "As you walk pass an ordianry internet cafe, "
	put "As boy passes you and handed you $", m
	put "Boy: I dont need this money anymore."
	put player.name, " : WTF?"
	anyKey
	put "Boy: You see, I dont need this because I am not old enough to go in."
	anyKey
	put player.name, " : OK....?"
	put "You gained $", m
	put player.name, " : (Maybe I should buy a new mouse with this. )"
	player.cash += m
	anyKey
    elsif tt > 350 and event = 4 then
	cls
	put "An old guy walks passes you."
	anyKey
	put "Old guy: can you buy me a beer?"
	put "buy a beer for him for $20? (y/n)"
	var c := yesOrNo
	if c = 'y' then
	    if player.cash >= 20 then
		player.cash := max (player.cash - 20, 0)
		put "Old guy: Thanks!"
		put "Old guy: Gulp,Gulp...."
		anyKey
		put player.name, ": can you leave me alone now?"
		anyKey
		put "Old guy: not yet,"
		put "       let me show you something"
		put "He takes off his jacket. "
		put "Inside, there was a old book"
		put "\"Sun Tzu's Art of War\""
		anyKey
		put "Old guy: Here, take this."
		anyKey
		put "You read the book and improved you SC skills"
		put "+5 strategy skill points"
		player.strat += 5
	    else
		put "you dont have enough money."
	    end if
	else
	    put "He walks away crying for beer."
	end if
	anyKey
    elsif tt > 800 and event = 5 then
	cls
	put "You found a chainsaw !"
	put "Would you take it? (y/n)"
	var c := yesOrNo
	if c = 'y' then
	    put "Why would you want a chainsaw? that doesn't do anything."
	    anyKey
	    put "You threw it away after a while."
	else
	    put "You left the chainsaw where it was."
	end if
	anyKey
    elsif tt > 1200 and event = 6 then
	cls
	put "You see a man fishing near a river."
	anyKey
	put player.name, ": Hey."
	anyKey
	put "Man: Sup!"
	anyKey
	put player.name, ": Any luck?"
	put "Man: Didn't catch anything yet."
	anyKey
	put "Man: Can you help me fish while I go and dig some worms?"
	put "Help him? (y/n)(This will reduce your energy to 0) "
	var c := yesOrNo
	if c = 'y' then
	    equipedPlayer.hp := 0
	    put "Man: Thank you!"
	    anyKey
	    put "You caught a fish while he is away."
	    put "You increased your fishing skill and somehow also increased your SC skill."
	    anyKey
	    put "+5 macro skill points"
	    player.macro += 5
	else
	    put "Man: Guess I have to stop fishing for a while."
	end if
	anyKey

    elsif tt > 2500 and event = 7 then
	cls
	put "A very strange looking guy walks up to you."
	anyKey
	put "Guy: I am fishtastic."
	put player.name, ": Eh?"
	anyKey
	put "Fishtastic: I am the creator of SC RPG."
	put "Fishtastic: Have you played it before?"
	put "(y/n)"
	var c := yesOrNo
	put "Fishtastic: Oh.. wait, you are playing it now."
	anyKey
	put player.name, ": What? I am in your game?"
	anyKey
	put "Fishtastic: You been playing this for too long."
	anyKey
	put "Fishtastic: I will give you some help to beat it."
	player.strat += 10
	player.micro += 10
	player.macro += 10
	player.cash += 3000
	anyKey
	put "~*magic*~"
	anyKey
	put "+10 macro skill points"
	put "+10 micro skill points"
	put "+10 strategy skill points"
	put "+$3000"
	anyKey
	put "Fishtastic: Good Luck and Hope you Win."
	anyKey
    elsif tt > 4000 and event = 8 then
	cls
	put "You been playing this for too long"
	anyKey
	put "Here.. have 10k and finish it."
	anyKey
	put "+$10000"
	player.cash += 10000
	anyKey
    elsif tt > 5000 and event = 9 then
	cls
	put "You been playing this for WAY too long"
	anyKey
	put "This is the final special event."
	anyKey
	put "have 50k and hope you beat it."
	anyKey
	put "+$50000"
	player.cash += 50000
	anyKey
    else
	event -= 1
    end if
    event += 1
    refreshPlayer
end runEvent

proc gameMenu
    loop
	runEvent
	cls
	put "I want to go to: "
	put ""
	put "1 - SC Tournament"
	put "2 - Internet Cafe"
	put "3 - Food Shop"
	put "4 - Electronic Store"
	put "5 - Education"
	put "6 - Home"
	put "7 - Beg for money"
	put "8 - Bank"

	put "\n\n0 - Exit to Main Menu"

	drawPic (300, 30, oneOfThem (oneOfThem ("street1", "street2"), oneOfThem ("street3", "street4")))
	var c := getChoice (0, 8)
	if c = 1 then
	    wasteTime ("Going to the Stadium", 3)
	    tournament
	end if
	if c = 2 then
	    wasteTime (oneOfThem ("Entering SCProZ - Cafe!", "Entering Gosu-Cafe"), 2)
	    trainingGround
	end if
	if c = 3 then
	    wasteTime ("Buying food.", 2)
	    foodShop
	end if
	if c = 4 then
	    wasteTime ("Upgrade!", 1)
	    itemShop
	end if
	if c = 5 then
	    wasteTime ("Walking to University of SC", 3)
	    school
	end if
	if c = 6 then
	    home
	end if
	if c = 7 then
	    beg
	end if
	if c = 8 then
	    wasteTime ("Going to a bank!", 1)
	    bank
	end if
	exit when c = 0
    end loop
end gameMenu


proc addComment (s : string, c : int)
    for decreasing i : totalComment - 1 .. 1
	comment (i + 1) := comment (i)
	commentColour (i + 1) := commentColour (i)
    end for
    comment (1) := s
    commentColour (1) := c
end addComment

body fcn battle (map : string, m : int, pA : addressint) : int
    var cycle := 0
    var minute, second := 0

    var room : unchecked pointer to team
    var player : array 1 .. maxPlayer of unchecked pointer to stat
    var enemy : array 1 .. maxPlayer, 1 .. maxPlayer of boolean
    var dead : array 1 .. maxPlayer of boolean

    %var bonus : array 1 .. maxPlayer of real
    var APM : array 1 .. maxPlayer of int
    var resource : array 1 .. maxPlayer of real
    var troop : array 1 .. maxPlayer of real

    cheat (addressint, room) := pA
    for i : 1 .. room -> total
	cheat (addressint, player (i)) := addr ( ^room.member (i))
    end for
    var winner := maxint

    % init
    for i : 1 .. room -> total
	resource (i) := 1.0
	troop (i) := 0
	APM (i) := 0
	%bonus (i) := 1
	dead (i) := false
    end for
    for i : 1 .. maxPlayer
	for j : i .. maxPlayer
	    enemy (j, i) := false
	    enemy (i, j) := false
	end for
    end for
    if m = ord (mode.onevone) or m = ord (mode.tour) then
	enemy (1, 2) := true
	enemy (2, 1) := true
    else
	for i : 1 .. m
	    for j : m + 1 .. m + m
		enemy (i, j) := true
		enemy (j, i) := true
	    end for
	end for
    end if


    %ab := ( ^a.skill (ord ( ^b.race)) + 100) / 100 * 0.8
    %^player(i).skill (ord ( ^b.race)) + 100) / 100

    for i : 1 .. totalComment
	comment (i) := ""
	commentColour (i) := black
    end for

    View.Set ("offscreenonly")

    % main loop starts here!
    loop
	cls
	%draw bars
	if m = ord (mode.onevone) or m = ord (mode.tour) then
	    locate (aRow, aCol)
	    put player (1) -> name
	    locate (bRow, bCol)
	    put player (2) -> name

	    color (blue)
	    locate (aRow + 1, aCol)
	    put "Economy: ", repeat ('|', ceil (resource (1))), " ", ceil (resource (1))
	    locate (bRow + 1, bCol)
	    put "Economy: ", repeat ('|', ceil (resource (2))), " ", ceil (resource (2))

	    color (red)
	    locate (aRow + 2, aCol)
	    put "Troops:  ", repeat ('|', ceil (troop (1))), " ", ceil (troop (1))
	    locate (bRow + 2, bCol)
	    put "Troops:  ", repeat ('|', ceil (troop (2))), " ", ceil (troop (2))

	    color (green)
	    locate (aRow + 3, aCol)
	    put "Energy:  ", repeat ('|', ceil (player (1) -> hp / player (1) -> maxHp * 40)), " ", ceil (player (1) -> hp / player (1) -> maxHp * 100), "%"
	    locate (bRow + 3, bCol)
	    put "Energy:  ", repeat ('|', ceil (player (2) -> hp / player (2) -> maxHp * 40)), " ", ceil (player (2) -> hp / player (2) -> maxHp * 100), "%"
	    color (black)
	else
	    color (blue)
	    put "Your Team:"
	    color (black)
	    for i : 1 .. m
		if dead (i) = false then
		    put player (i) -> name : 20,
			"Economy: ", intstr (ceil (resource (i))) : 10,
			"Troops: ", intstr (ceil (troop (i))) : 10,
			"Energy: ", ceil (player (i) -> hp / player (i) -> maxHp * 100), "%   "
		else
		    put "Dead!"
		end if
	    end for
	    color (red)
	    put "\nEnemy Team:"
	    color (black)
	    for i : m + 1 .. m * 2
		if dead (i) = false then
		    put player (i) -> name : 20,
			"Economy: ", intstr (ceil (resource (i))) : 10,
			"Troops: ", intstr (ceil (troop (i))) : 10,
			"Energy: ", ceil (player (i) -> hp / player (i) -> maxHp * 100), "%   "
		else
		    put "Dead!"
		end if
	    end for
	end if

	% put comments
	locate (commentRow - 1, 1)
	put repeat ('-', maxcol)

	locate (commentRow, commentCol)
	for decreasing i : commentRow + totalComment - 1 .. commentRow
	    locate (i, commentCol)
	    color (commentColour (totalComment - (i - commentRow)))
	    put comment (totalComment - (i - commentRow))
	end for

	if m = ord (mode.onevone) or m = ord (mode.tour) then
	    locate (maxrow - 1, 1)
	    color (brown)
	    put "Map: " + map, "   Time: " + intstr (minute) + ":" + intstr (second)
	    color (red)
	    locate (maxrow - 1, 37)
	    put player (1) -> name, "'s APM: ", APM (1)
	    locate (maxrow - 1, 55)
	    put player (2) -> name, "'s APM: ", APM (2)
	else
	    locate (maxrow - 1, 1)
	    color (brown)
	    put "Map: " + map, "   Time: " + intstr (minute) + ":" + intstr (second)
	end if
	color (black)

	View.Update
	Time.DelaySinceLast (20)
	if winner not= maxint then
	    Time.DelaySinceLast (2000)
	    locate (maxrow - 1, 1)
	    anyKey
	    View.Set ("nooffscreenonly")
	    color (black)
	    result winner
	end if



	% events

	%fight
	for i : 1 .. room -> total
	    if 1.05 ** (troop (i) * 2) > Rand.Int (2, 100)         /* and Rand.Int (1, 5) = 1*/ then
		% pick a enemy
		var e : int
		var count := 0
		loop
		    count += 1
		    var r := Rand.Int (1, room -> total)
		    if enemy (i, r) and dead (r) = false then
			e := r
			exit
		    end if
		    exit when count > 10
		end loop
		exit when count > 10

		% prepare
		var troopUsed := Rand.Int (10, 90) / 100 * min (troop (i), troop (e))
		var luck := Rand.Int (90 - randomness, 90 + randomness) / 100
		var attackBonus := (player (i) -> skill (ord (player (e) -> race)) + 100) / 100

		var strategic := false
		if player (e) -> strat + Rand.Int (1, 40) < player (i) -> strat + Rand.Int (-20, 20) then
		    strategic := true
		end if

		if player (i) -> hp < 30 then
		    attackBonus *= 0.8
		end if
		if player (i) -> hp < 10 then
		    attackBonus *= 0.6
		end if

		% kill
		var killPercent := (player (i) -> micro * luck) / player (i) -> micro * attackBonus
		troop (e) -= troopUsed * killPercent
		troop (i) -= troopUsed

		var rLost := troopUsed * killPercent * (player (i) -> macro * luck) / player (e) -> macro * 1.5
		resource (e) -= rLost
		resource (i) -= troopUsed / luck

		% comment
		addComment (player (i) -> name + " attacks " + player (e) -> name + ".", red)
		if killPercent > 1.2 and m = 0 then
		    if Rand.Int (1, 2) = 1 then
			addComment (commentator (Rand.Int (1, 3)) + ":  " + "Great micro by " + player (i) -> name, green)
		    else
			addComment (commentator (Rand.Int (1, 3)) + ":  " + player (i) -> name + " just demonstrated an amazing micro", green)
		    end if
		end if
		var strategicBonus := (player (i) -> strat + 50) / (player (e) -> strat + 50) - 1 + Rand.Int (5, 20) / 100

		% special kill
		if strategic then
		    var target := Rand.Int (1, 3)
		    if target = 1 then
			troop (e) -= troopUsed * killPercent * strategicBonus
			addComment (player (i) -> name + " attacks " + player (e) -> name + " using high ground!", 35)
		    end if
		    if target = 2 then
			resource (e) -= troopUsed * killPercent * strategicBonus
			addComment (player (i) -> name + " attacks " + player (e) -> name + "'s mining area!", 35)
		    end if
		    if target = 3 then
			addComment (player (i) -> name + " attacks " + player (e) -> name + " from multiple direction,", 35)
			addComment (player (e) -> name + " lost energy fighting off all enemy!", 35)
			player (e) -> hp -= (player (e) -> hp / 100 * (1 + strategicBonus)) + Rand.Int (1, 3)
		    end if
		end if


		% lose energy
		player (i) -> hp -= 1
		player (e) -> hp -= 1 * killPercent

		% gg?
		if (resource (i) / resource (e) > 8 and resource (i) - resource (e) > 10)
			or (troop (i) / troop (e) > 8 and troop (i) - troop (e) > 10) then
		    %      put resource (i), "  ", resource (e)
		    %     put troop (i), "  ", troop (e)
		    %    anyKey
		    addComment (player (e) -> name + oneOfThem (": GG", ": gg"), cyan)
		    addComment (player (e) -> name + " has left the game.", 66)
		    dead (e) := true
		end if
	    end if

	    if round (player (i) -> hp) = 30 then
		player (i) -> hp -= 1
		if m = 0 then
		    addComment (commentator (Rand.Int (1, 3)) + ":  " + player (i) -> name + " is getting tired", grey)
		end if
	    end if

	    if round (player (i) -> hp) = 12 then
		player (i) -> hp -= 1
		if m = 0 then
		    addComment (commentator (Rand.Int (1, 3)) + ":  " + player (i) -> name + " is getting exhausted", black)
		end if
	    end if

	end for


	%game over?
	if m = ord (mode.tour) then
	    if dead (1) or dead (2) then
		addComment ("All Koreans:  GG", brown)
		winner := 1
		if dead (1) then
		    winner := 2
		end if
	    end if
	else
	    var team1Dead := true
	    var team2Dead := true
	    for i : 1 .. m
		if dead (i) = false then
		    team1Dead := false
		end if
		if dead (i + m) = false then
		    team2Dead := false
		end if
	    end for
	    if team1Dead then
		winner := 2
	    end if
	    if team2Dead then
		winner := 1
	    end if
	end if
	if cycle mod 50 = 0 then
	    for i : 1 .. room -> total
		APM (i) := player (i) -> micro + player (i) -> macro + 50 + Rand.Int (1, 50)
	    end for
	end if

	% end events
	%calcs

	for i : 1 .. room -> total
	    if dead (i) = false then
		player (i) -> hp -= 0.03 * Rand.Real
		%            ^b.hp -= 0.03 * Rand.Real
		if player (i) -> hp < 0 then
		    player (i) -> hp := 0
		end if
		if resource (i) > maxcol - 5 then
		    resource (i) := maxcol - 5
		end if
		if resource (i) < 0 then
		    resource (i) := 1
		end if

		if troop (i) > maxcol - 5 then
		    troop (i) := maxcol - 5
		end if
		if troop (i) < 0 then
		    troop (i) := 1
		end if

		resource (i) += ln (player (i) -> macro) / ln (1.05) / 300 * Rand.Real
		troop (i) += ln (player (i) -> macro) / ln (1.05) / 300 * Rand.Real * resource (i) ** 1.2 / 50
	    end if
	end for


	second += 1
	if second >= 60 then
	    second := 0
	    minute += 1
	end if
	cycle += 1

    end loop
end battle

proc intro
    cls

    put "What is your name: " ..
    loop
	get player.name : *
	exit when length (player.name) <= 20
	put "Name too long, 20 chars max"
	put "Type ur name Again:" ..
    end loop
    cls
    put player.name, " was an ordinary kid."
    put "Until one day, ", player.name, " discovred a game called:"
    anyKey
    cls
    put "Starcraft."
    drawPic (100, 50, "starcraft2")
    anyKey
    cls
    put "At that moment ", player.name, " discovered his destiny."
    put player.name, " swore to become the best SC player ever."
    anyKey
    cls
    put "Choose your race: \n"
    put "1 - Terran"
    put "2 - Protoss"
    put "3 - Zerg"
    var c2 := getChoice (1, 3)
    if c2 = 1 then
	player.race := race.t
    elsif c2 = 2 then
	player.race := race.p
    else
	player.race := race.z
    end if
    put "You have chosen to be a ", raceName (ord (player.race)), " player."
    anyKey
    cls
    put player.name, " must prove himself by beating the best SC players in the land of Korea"
    put "And so, ", player.name, " left his home town and traveled to this strange new world."
    anyKey
    put "with his SC skills and confidence,"
    put "he will defeat the Great SC Masters and become the new SC champion."
    anyKey
    cls
    wasteTime ("So it begins", 4)
    cls
    put "You are now in Korea."
    put "Your goal is to beat the final boss in SC Tournament\n"
    put "- You can train your skill in internet Cafe and Tournament"
    put "- Earn income by beating bosses or beg on street."
    put "- You can buy food to restore energy from food shop"
    put "- Items can be obtained from electronic store"
    put "- You can check your stat and use item at home."
    put "\n\nGood Luck and Have fun!"
    anyKey
end intro

proc credit
    cls
    color (blue)
    put "SCRPG"

    color (red)
    put "\nCreated and Coded by:"

    color (black)
    put "Xiao, AKA. Fishtastic"

    color (red)
    put "\nBeta Testers:"

    color (black)
    put "DanielG"
    put "Saad"
    put "Yingbo"
    put "Ben"
    put "Scott"

    color (red)
    put "\nAll Pictures are from interent and belong to their owners."

    color (red)
    put "\nSpecial Thanks to:"
    color (black)
    put "compsci.ca for turing TUTs"
    put "youtube.com/jon747 for SC movies."


    color (red)
    put "\nQuestions? Comments? Suggestions? Issues? Anything?"
    color (black)
    put "Mail:  whoisbingo@gmail.com"

    put "\n"
    anyKey
end credit

body proc ending
    cls
    drawPic (20, 20, "win3")
    wasteTime ("GG!", 3)
    put "Congratulations!"
    cls
    put "You beat slayers_boxer."
    drawPic (20, 20, "win2")
    anyKey
    cls
    put "All Korean SC fans now treat you like a god."
    drawPic (20, 20, "win1")
    anyKey
    cls
    put "Your victory is displayed on every TV channel."
    drawPic (20, 20, "win1")
    anyKey

    cls
    put "You have achieved your destiny!"
    put "You are the BEST SC PLAYER!\n"
    drawPic (20, 20, "win3")
    anyKey

    cls
    put "Now you should spend the rest of your life\n doing something better."
    put "perhaps you should get a education\n and stop playing games everyday."
    anyKey

    cls
    wasteTime ("Good job and thank you for playing! ", 5)
    put "you may chose to contine playing\n or get off your computer and take a break."
    anyKey

    cls
    put "You win $50000 extra for beating the game!"
    player.cash += 50000
    anyKey
    credit
end ending

var showContinue := false


proc mainMenu
    loop
	cls

	color (47)
	drawfillbox (0, 0, maxx, maxy, black)
	var tp1 := Pic.New (0, 0, maxx, maxy)

	cls
	put "\n\n\n\n \t\t\t\t SC RPG\n\n"
	put "1 - New Game"
	put "2 - Load Game"
	if not showContinue then
	    color (grey)
	    put "3 - Save Game"
	    put "4 - Continue"
	    color (47)
	else
	    put "3 - Save Game"
	    put "4 - Continue"
	end if
	put "\n5 - Credits"
	put "\n0 - Exit"
	color (black)
	var tp2 := Pic.New (0, 0, maxy, maxy)


	Pic.Draw (tp1, 0, 0, picMerge)
	drawPic (0, 0, "background")
	Pic.Draw (tp2, 0, 0, picMerge)
	var c : int
	loop
	    c := getChoice (0, 5)
	    exit when (c not= 4 and c not= 3) or showContinue = true
	end loop

	if c = 0 then
	    cls
	    put "Exit\n\nAre you sure?(y/n)"
	    var C := yesOrNo
	    exit when C = 'y'
	end if
	var chooo : char
	if c = 1 then
	    if showContinue then
		cls
		put "Are you sure you want to start over?         \n"
		    , "This is leave your current profile unsaved.\n(y/n)"
		chooo := yesOrNo
	    end if

	    if chooo = 'y' or showContinue = false then
		newGame
		showContinue := true
		intro
		equipedPlayer := player
		gameMenu
	    end if
	end if


	if c = 2 then
	    cls
	    put "Load Game\nEnter File Name:" ..
	    var n : string
	    get n
	    var IN : int
	    open : IN, n, read
	    if IN <= 0 then
		put "profile does not exist!"
		anyKey
	    else

		read : IN, player
		read : IN, boss
		read : IN, equipedPlayer
		read : IN, equipment
		read : IN, equiped
		read : IN, equipBought

		read : IN, train
		read : IN, food
		read : IN, currentLevel

		read : IN, totalTimeWasted
		read : IN, nextRepeatingEvent
		read : IN, event

		read : IN, saving
		put "Game Loaded"
		close : IN

		showContinue := true
		anyKey
		gameMenu
	    end if

	end if
	if c = 3 then
	    cls
	    put "Save Game\nEnter File Name:" ..
	    var n : string
	    get n
	    var OUT : int
	    var cc : char
	    if File.Exists (n) then
		cls
		color (red)
		put "Warning - your base is under attack."
		color (black)
		put "Well... actually, ", "\"", n, "\" already exist, saving will overwrite the file."
		put "are you sure? (y/n)"
		cc := yesOrNo
	    end if
	    if cc = 'y' or not File.Exists (n) then
		open : OUT, n, write
		write : OUT, player
		write : OUT, boss
		write : OUT, equipedPlayer
		write : OUT, equipment
		write : OUT, equiped
		write : OUT, equipBought

		write : OUT, train
		write : OUT, food
		write : OUT, currentLevel

		write : OUT, totalTimeWasted
		write : OUT, nextRepeatingEvent
		write : OUT, event

		write : OUT, saving

		put "Game Saved!"
		close : OUT

		anyKey
	    else
		put "no file was saved"
		anyKey
	    end if
	end if
	if c = 4 then
	    gameMenu
	end if
	if c = 5 then
	    credit
	end if
    end loop
end mainMenu

View.Set ("graphics:640;400,nobuttonbar")


newGame
mainMenu

//grid specifications
var gridX = 20;
var gridY = 20;

//square specifications
var squareSize = 30;

//ints for creating grid
var gameSquareCountX = 1;
var gameSquareCountY = 1;
var gameSquareCountZ = 1;

//character position
var currentCharacterPosition = [];
var nextCharacterPosition = [];

//level vars
var currentLevel = 1;
var maxLevelReached = 1;

//check for cookie and set level/max
var hasCookie = false;
if (mode == "player") {
    var cookie = getCookie();

    if (typeof cookie != 'undefined') {
        currentLevel = parseInt(deflateDecompress(cookie.cl), 10);
        maxLevelReached = parseInt(deflateDecompress(cookie.ml), 10);
        hasCookie = true;
    }
}

//check for start level paramater & override cookie
var startLevel = getUrlParameter('sl');

if (startLevel != null && startLevel != "undefined" && startLevel.length > 0) {
    currentLevel = parseInt(deflateDecompress(startLevel), 10);
}

//user keyboard press
var keypressed = "";
var previousKeyPressed = "";
var inputActive = true;

//test mode
var isTestMode = false;
var isReplayMode = false;

//move count
var levelMoveCount = 0;
var totalMoveCount = 0;

//character
var characterFoot = "Left";
var characterPositions = "cUp cDown cLeft cRight cFront cUpLeft cUpRight cDownLeft cDownRight cLeftLeft cLeftRight cRightLeft cRightRight cDead cFallen cLevelEnd cGameEnd character";
var characterHasMoved;

var additionalGridStyles = "weight-plate-open-gate fragile-ground-used center-explosion explosion-0 explosion-1 explosion-2 explosion-3 explosion-4 explosion-5 explosion-6 explosion-7 explosion-8";

var playerMoves = [];

//weight plate status
var weightPlateGatesUnlocked = false;

//MIDIjs (https://freemidi.org)
var midiFile = 'sounds/Yazoo-Onlyyou.mid';
var midiLength = 185;

if (isIE()) {
    //sound vars (https://opengameart.org - The Essential Retro Video Game Sound Effects Collection [512 sounds] By Juhani Junkala)
    var soundFootstepA = new Audio("sounds/sfx_movement_footsteps1a_10.mp3");
    var soundRockMove = new Audio("sounds/sfx_sounds_impact11_10.mp3");
    var soundDirt = new Audio("sounds/sfx_exp_various4_10.mp3");
    var soundKey = new Audio("sounds/sfx_coin_double1_10.mp3");
    var soundGateUnlocked = new Audio("sounds/sfx_sounds_pause5_in_10.mp3");
    var soundCoin = new Audio("sounds/sfx_coin_double1_10.mp3");
    var soundRevealExit = new Audio("sounds/sfx_coin_cluster3_10.mp3");
    var soundWeightPlate = new Audio("sounds/sfx_sounds_pause6_in_10.mp3");
    var soundWeightPlateGatesUnlocked = new Audio("sounds/sfx_sounds_pause5_in_10.mp3");
    var soundWarp = new Audio("sounds/sfx_movement_portal2_10.mp3");
    var soundError = new Audio("sounds/sfx_sounds_error3_10.mp3");
    var soundExitEntered = new Audio("sounds/sfx_sounds_pause7_in_10.mp3");
    var soundCharacterDied = new Audio("sounds/sfx_sounds_falling12_10.mp3");
    var soundBombMove = new Audio("sounds/sfx_sound_nagger2_10.mp3");
    var soundDetonator = new Audio("sounds/sfx_exp_medium5_10.mp3");
    var soundFragileGround = new Audio("sounds/sfx_sounds_falling1_10.mp3");
    var soundFalling = new Audio("sounds/sfx_sounds_falling7_10.mp3");
} else {
    //sound vars (https://opengameart.org - The Essential Retro Video Game Sound Effects Collection [512 sounds] By Juhani Junkala)
    var soundFootstepA = new Audio("sounds/sfx_movement_footsteps1a_10.wav");
    var soundRockMove = new Audio("sounds/sfx_sounds_impact11_10.wav");
    var soundDirt = new Audio("sounds/sfx_exp_various4_10.wav");
    var soundKey = new Audio("sounds/sfx_coin_double1_10.wav");
    var soundGateUnlocked = new Audio("sounds/sfx_sounds_pause5_in_10.wav");
    var soundCoin = new Audio("sounds/sfx_coin_double1_10.wav");
    var soundRevealExit = new Audio("sounds/sfx_coin_cluster3_10.wav");
    var soundWeightPlate = new Audio("sounds/sfx_sounds_pause6_in_10.wav");
    var soundWeightPlateGatesUnlocked = new Audio("sounds/sfx_sounds_pause5_in_10.wav");
    var soundWarp = new Audio("sounds/sfx_movement_portal2_10.wav");
    var soundError = new Audio("sounds/sfx_sounds_error3_10.wav");
    var soundExitEntered = new Audio("sounds/sfx_sounds_pause7_in_10.wav");
    var soundCharacterDied = new Audio("sounds/sfx_sounds_falling12_10.wav");
    var soundBombMove = new Audio("sounds/sfx_sound_nagger2_10.wav");
    var soundDetonator = new Audio("sounds/sfx_exp_medium5_10.wav");
    var soundFragileGround = new Audio("sounds/sfx_sounds_falling1_10.wav");
    var soundFalling = new Audio("sounds/sfx_sounds_falling7_10.wav");
}

var playGameEnd = false;

//for browsers that dont support .includes
if (!String.prototype.includes) {
    String.prototype.includes = function() {
        'use strict';
        return String.prototype.indexOf.apply(this, arguments) !== -1;
    };
}

//get thisURL
var thisURL = window.location.href;
if (thisURL.includes("/index.html")) {
    thisURL = window.location.href.substring(0, window.location.href.indexOf("/index.html"));
}
if (thisURL.includes("/builder.html")) {
    thisURL = window.location.href.substring(0, window.location.href.indexOf("/builder.html"));
}
if (thisURL.includes("/?ld=")) {
	thisURL = window.location.href.substring(0, window.location.href.indexOf("/?ld="));
}

//console message
console.log("You're only cheating yourself!");

//setup grid and initial game components - - - - -
$(document).ready(function() {

    //layout grid
    for (var i = 0; i < gridY; i++) {
        for (var j = 0; j < gridX; j++) {
            var squareIdentification = "";
            var newDiv = $("<div style='width:" + squareSize + "px;height:" + squareSize + "px;' class='gameSquare' id='gs_" + gameSquareCountX + "_" + gameSquareCountY + "' x='" + gameSquareCountX + "' y='" + gameSquareCountY + "' z='" + gameSquareCountZ + "'>" + squareIdentification + "</div>");
            $('#screen').append(newDiv);
            gameSquareCountX += 1;
            gameSquareCountZ += 1;
        }

        var newClear = $("<div class='clearFix'/>");
        $('#screen').append(newClear);
        gameSquareCountX = 1;
        gameSquareCountY += 1;
    }

    fitGrid();

    if (mode == "player") {
        setLevel();
    }

    if (mode == "builder") {
        initBuilder();
    }

    generateLevelIndicators();

    //preload images
    preload([
        'images/volex/Retina/Player/player_03.png',
        'images/volex/Retina/Player/player_06.png',
        'images/volex/Retina/Player/player_08.png',
        'images/volex/Retina/Player/player_07.png',
        'images/volex/Retina/Player/player_05.png',
        'images/volex/Retina/Player/player_04.png',
        'images/volex/Retina/Player/player_19.png',
        'images/volex/Retina/Player/player_20.png',
        'images/volex/Retina/Player/player_16.png',
        'images/volex/Retina/Player/player_17.png',
        'images/volex/Retina/Environment/environment_15_dirt.png',
        'images/volex/Retina/Blocks/block_08.png',
        'images/volex/Retina/Crates/crate_45.png',
        'images/volex/Retina/Environment/environment_04.png',
        'images/volex/Retina/Ground/key_red.png',
        'images/volex/Retina/Environment/environment_07.png',
        'images/volex/Retina/Ground/key_blue.png',
        'images/volex/Retina/Environment/environment_01.png',
        'images/volex/Retina/Ground/key_brown.png',
        'images/volex/Retina/Environment/environment_09.png',
        'images/volex/Retina/Ground/key_green.png',
        'images/volex/Retina/Ground/ground_01_w.png',
        'images/volex/Retina/Ground/ground_01_k_b.png',
        'images/volex/Retina/Ground/ground_01_k_r.png',
        'images/volex/Retina/Ground/ground_01_k_br.png',
        'images/volex/Retina/Ground/ground_coin.png',
        'images/volex/Retina/Crates/crate_01.png',
        'images/volex/Retina/Player/player_03_fallen.png',
        'images/volex/Retina/Crates/crate_01.png',
        'images/volex/Retina/Crates/crate_01_WP_gate.png',
        'images/volex/Retina/Environment/environment_15_hc.png',
        'images/volex/Retina/Environment/environment_15_hrk.png',
        'images/volex/Retina/Environment/environment_15_hbk.png',
        'images/volex/Retina/Environment/environment_15_hbrk.png',
        'images/volex/Retina/Environment/environment_15_hgk.png',
        'images/volex/Retina/Environment/environment_15_hwr.png',
        'images/volex/Retina/Environment/environment_15_hwb.png',
        'images/volex/Retina/Environment/environment_15_hwbr.png',
        'images/volex/Retina/Environment/environment_15_hwg.png',
        'images/volex/Retina/Ground/bomb_g.png',
        'images/volex/Retina/Ground/bomb_fg_c.png',
        'images/volex/Retina/Crates/crate_11_detonator.png',
        'images/volex/Retina/Ground/ground_hole.png',
        'images/volex/Retina/Ground/ground_fragile.png',
        'images/volex/Retina/Ground/center-explosion.png',
        'images/volex/Retina/Ground/explosion_0.png',
        'images/volex/Retina/Ground/explosion_1.png',
        'images/volex/Retina/Ground/explosion_2.png',
        'images/volex/Retina/Ground/explosion_3.png',
        'images/volex/Retina/Ground/explosion_4.png',
        'images/volex/Retina/Ground/explosion_5.png',
        'images/volex/Retina/Ground/explosion_6.png',
        'images/volex/Retina/Ground/explosion_7.png',
        'images/volex/Retina/Ground/explosion_8.png',
        'images/volex/Retina/Player/player_03_dead.png'
    ]);

    //check for test solution
    var testSolutionData = getUrlParameter('sd');

    if (testSolutionData != null && testSolutionData != "undefined" && testSolutionData.length > 0) {
        testSolutionData = deflateDecompress(testSolutionData);

        testSolutionData = testSolutionData.toString().split(',');

        $('#levelName').html('Replay Level');
        $('.level-indicator-current').attr('title', 'Replay Level');

        isReplayMode = true;

        playSolution(testSolutionData);
    }

    $('.header').click(function() {
        window.location.href = "index.html";
    });

    if (!hasCookie && mode == "player" && !isTestMode) {
        openModal('aboutAlert');
    }
});

//detect keypresses 
$(document).keydown(function(e) {
    if ((inputActive && mode != "builder") || e.which == 88 || e.which == 188 || e.which == 190) {
        inputHandler(e.which);
        if (e.which == 37 || e.which == 38 || e.which == 39 || e.which == 40) {
            e.preventDefault(); // prevent the default action (scroll / move caret)
        }
    }
});

function inputHandler(input, source) {
    switch (input) {
        case 37: // left
            keypressed = "left";
            tryNextCharacterPosition('left');
            if (source != 1) {
                playerMoves.push('l');
            }
            break;

        case 38: // up
            keypressed = "up";
            tryNextCharacterPosition('up');
            if (source != 1) {
                playerMoves.push('u');
            }
            break;

        case 39: // right
            keypressed = "right";
            tryNextCharacterPosition('right');
            if (source != 1) {
                playerMoves.push('r');
            }
            break;

        case 40: // down
            keypressed = "down";
            tryNextCharacterPosition('down');
            if (source != 1) {
                playerMoves.push('d');
            }
            break;

        case 88: // restart
            restartLevel();
            levelMoveCount = 0;
            updateVisualMoveCount();
            break;

        case 90: // rewind
            rewind();
            break;

        case 190:
            nl();
            break;

        case 188:
            pl();
            break;

        default:
            return; // exit this handler for other keys
    }
}


function isIE() {
    if (navigator.appName == 'Microsoft Internet Explorer' || !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv:11/)) || (typeof $.browser !== "undefined" && $.browser.msie == 1)) {
        return true;
    } else {
        return false;
    }
}

function updateMoveCount() {
    levelMoveCount++;
    totalMoveCount++;
    updateVisualMoveCount();
}

function updateVisualMoveCount() {
    var visualLevelMoveCount = levelMoveCount;
    var visualTotalMoveCount = totalMoveCount;
    $('#level-move-count').html(visualLevelMoveCount);
}

function setLevel() {
    weightPlateGatesUnlocked = false;

    //check for test data
    var testData = getUrlParameter('ld');

    if (testData != null && testData != "undefined" && testData.length > 0) {
        console.log('running in test mode');

        testData = deflateDecompress(testData);

        testData = testData.toString().split(',');

        levelData = [
            ["0", []],
            ['Test Level', testData]
        ];

        isTestMode = true;

        currentLevel = 1;
    }

    //check for test data end

    var currentLevelData = levelData[currentLevel][1];

    var arrayCount = 0;

    for (i = 1; i < gridX + 1; i++) {
        for (j = 1; j < gridY + 1; j++) {
            var arrayValue = currentLevelData[arrayCount];

            var gridStyle = gridElements[arrayValue][0];

            if (gridStyle != 'blank') {
                $('#gs_' + j + "_" + i).addClass(gridStyle);
            }

            if (gridStyle == 'character') {
                currentCharacterPosition = [j, i];
            }

            arrayCount++;
        }
    }

    gridHistory = [];
    updateGridHistory();

    //set visual params
    $('#levelName').html(levelData[currentLevel][0]);
    setVisualLevel();
    levelMoveCount = 0;
    updateVisualMoveCount();
    generateLevelIndicators();

    if (!isTestMode) {
        //for beta level improvements only
        var editThisLevelURL = thisURL + '/builder.html?ld=' + deflateCompress(levelData[currentLevel][1].toString());
        $('.current-level-edit').html("<a class='footer-link' href='" + editThisLevelURL + "' target='_blank'>edit this level</a>");
    } else {
        $('.builder-link').hide();
        var editThisLevelURL = thisURL + '/builder.html?ld=' + deflateCompress(levelData[currentLevel][1].toString());
        $('.current-level-edit').html("<a class='footer-link' href='" + editThisLevelURL + "' target='_blank'>edit this level</a><a class='footer-link replayLink' onclick='loadSolutionReplay();'>replay</a>");
        $('#visualLevel').html('Mode');
    }
}

function tryNextCharacterPosition(direction) {
    //get next position
    nextCharacterPosition = getNextPosition(direction, currentCharacterPosition[0], currentCharacterPosition[1]);

    //check that the next position isn't an object
    characterHasMoved = checkCharacterCollision(direction);

    //move character
    moveCharacter();
}

function getNextPosition(direction, currentPositionX, currentPositionY) {
    var nextPosition = [];

    switch (direction) {
        case 'left':
            nextPosition[0] = currentPositionX - 1;
            nextPosition[1] = currentPositionY;
            break;

        case 'up':
            nextPosition[0] = currentPositionX;
            nextPosition[1] = currentPositionY - 1;
            break;

        case 'right':
            nextPosition[0] = currentPositionX + 1;
            nextPosition[1] = currentPositionY;
            break;

        case 'down':
            nextPosition[0] = currentPositionX;
            nextPosition[1] = currentPositionY + 1;
            break;
    }

    //Allow infinite grid
    if (nextPosition[0] < 1) {
        nextPosition[0] = gridX;
    }
    if (nextPosition[0] > gridX) {
        nextPosition[0] = 1;
    }
    if (nextPosition[1] < 1) {
        nextPosition[1] = gridY;
    }
    if (nextPosition[1] > gridY) {
        nextPosition[1] = 1;
    }

    return nextPosition;
}

function checkBounds(targetPosition) {
    var boundClear = true;
    if (targetPosition[0] < 1) {
        boundClear = false;
    }
    if (targetPosition[0] > gridX) {
        boundClear = false;
    }
    if (targetPosition[1] < 1) {
        boundClear = false;
    }
    if (targetPosition[1] > gridY) {
        boundClear = false;
    }

    return boundClear;
}

function checkClearBlock(targetPosition) {
    var blockClear = true;
    var nextPositionSquare = $('#gs_' + targetPosition[0] + "_" + targetPosition[1]);
    var nextPositionContents = $(nextPositionSquare).attr('class');
    if (nextPositionContents.includes('weight-plate-gate') || nextPositionContents.includes('detonator') || nextPositionContents.includes('bomb') || nextPositionContents.includes('rock') || nextPositionContents.includes('dirt') || nextPositionContents.includes('wall') || nextPositionContents.includes('gate-red') || nextPositionContents.includes('gate-green') || nextPositionContents.includes('gate-blue') || nextPositionContents.includes('gate-brown')) {
        blockClear = false;
        playSound(soundError);
    }
    if (nextPositionContents.includes('weight-plate') && !nextPositionContents.includes('weight-plate-gate') && !nextPositionContents.includes('weight-plate-open-gate')) {
        playSound(soundWeightPlate);
    }

    return blockClear;
}

function checkCharacterCollision(direction) {
    var characterCanMove = true;

    //find what is in the nextPosition
    var nextPositionSquare = $('#gs_' + nextCharacterPosition[0] + "_" + nextCharacterPosition[1]);
    var nextPositionContents = $(nextPositionSquare).attr('class');

    var canMoveObject = true;

    //object movable rock or bomb
    if (nextPositionContents.includes('rock') || nextPositionContents.includes('bomb')) {
        var objectX = parseInt($(nextPositionSquare).attr('x'), 10);
        var objectY = parseInt($(nextPositionSquare).attr('y'), 10);

        var nextObjectPosition = getNextPosition(direction, objectX, objectY);

        canMoveObject = false;

        if (checkClearBlock(nextObjectPosition)) {
            var objectType;
            if (nextPositionContents.includes('rock')) {
                objectType = "rock";
                playSound(soundRockMove);
            }
            if (nextPositionContents.includes('bomb')) {
                objectType = "bomb";
                playSound(soundBombMove);
            }

            moveObject(nextCharacterPosition, nextObjectPosition, objectType);
            canMoveObject = true;
            playSound(soundRockMove);
        }

        nextCharacterPosition = currentCharacterPosition;
        characterCanMove = false;
    }

    //object block wall
    if (nextPositionContents.includes('wall')) {
        nextCharacterPosition = currentCharacterPosition;
        canMoveObject = false;
        characterCanMove = false;
    }

    //object gate-red gate-blue gate-brown gate-green
    if (nextPositionContents.includes('gate-red') || nextPositionContents.includes('gate-blue') || nextPositionContents.includes('gate-brown') || nextPositionContents.includes('gate-green') || nextPositionContents.includes('weight-plate-gate')) {
        nextCharacterPosition = currentCharacterPosition;
        characterCanMove = false;
        canMoveObject = false;
        playSound(soundError);
    }

    if (canMoveObject) {
        updateMoveCount();
    }

    return characterCanMove;
}

function moveObject(currentObjectPosition, nextObjectPosition, objectType) {
    $('#gs_' + currentObjectPosition[0] + "_" + currentObjectPosition[1]).removeClass(objectType);
    $('#gs_' + nextObjectPosition[0] + "_" + nextObjectPosition[1]).addClass(objectType);

    updateGridHistory();
}

function moveCharacter() {
    $('.gameSquare').removeClass('character');
    $('.gameSquare').removeClass(characterPositions);
    $('#gs_' + nextCharacterPosition[0] + "_" + nextCharacterPosition[1]).addClass('character');

    if (keypressed == "left" || keypressed == "right" || keypressed == "up" || keypressed == "down") {
        previousKeyPressed = keypressed;
    }

    characterDirection = "c" + previousKeyPressed.toUpperCase().substring(0, 1) + previousKeyPressed.substring(1) + characterFoot;

    $('#gs_' + nextCharacterPosition[0] + "_" + nextCharacterPosition[1]).addClass(characterDirection);
    currentCharacterPosition = nextCharacterPosition;
    nextCharacterPosition = [];
    checkLevel();

    characterFoot = (characterFoot == "Left") ? "Right" : "Left";

    if (characterHasMoved) {
        playSound(soundFootstepA);
        updateGridHistory();
    }
}

function checkLevel() {
    //check to see if level/game has ended
    if ($(".character.exit").length > 0) {
        //check to see if there are any more levels before increasing - otherwise the user has reached the last level and won
        if (currentLevel == levelData.length - 1) {
            //game has ended
            var characterPosition = $('.character');
            $(".gameSquare").removeClass(characterPositions);
            $(characterPosition).addClass('character cGameEnd');
            inputActive = false;
            playSound(soundExitEntered);
            if (!isTestMode) {
                playMidi();
                playGameEnd = true;
                gameEndAnimation();
                $('#levelDetail').hide();
                $('#endGameWording').show();
            } else {
                if (!isReplayMode) {
                    $('.replayLink').show();
                }
            }
        } else {
            //load next level
            inputActive = false;
            playSound(soundExitEntered);
            $(".character").addClass('cLevelEnd');
            functionDelay(function() {
                currentLevel += 1;
                if (maxLevelReached < currentLevel) {
                    maxLevelReached = currentLevel;
                }
                setCookie();
                transitionLevel();
            }, 1000);

        }
    }

    //gates - - - - - - - - - -

    //check to open gate-red with key-red
    if ($(".character.key-red").length > 0) {
        $(".character.key-red").removeClass("key-red");
        playSound(soundKey);
    }
    if ($(".key-red").length == 0 && $(".gate-red").length > 0) {
        playSound(soundGateUnlocked);
    }
    if ($(".key-red").length == 0) {
        $(".gate-red").removeClass("gate-red");
    }

    //check to open gate-blue with key-blue
    if ($(".character.key-blue").length > 0) {
        $(".character.key-blue").removeClass("key-blue");
        playSound(soundKey);
    }
    if ($(".key-blue").length == 0 && $(".gate-blue").length > 0) {
        playSound(soundGateUnlocked);
    }
    if ($(".key-blue").length == 0) {
        $(".gate-blue").removeClass("gate-blue");
    }

    //check to open gate-brown with key-brown
    if ($(".character.key-brown").length > 0) {
        $(".character.key-brown").removeClass("key-brown");
        playSound(soundKey);
    }
    if ($(".key-brown").length == 0 && $(".gate-brown").length > 0) {
        playSound(soundGateUnlocked);
    }
    if ($(".key-brown").length == 0) {
        $(".gate-brown").removeClass("gate-brown");
    }

    //check to open gate-green with key-green
    if ($(".character.key-green").length > 0) {
        $(".character.key-green").removeClass("key-green");
        playSound(soundKey);
    }
    if ($(".key-green").length == 0 && $(".gate-green").length > 0) {
        playSound(soundGateUnlocked);
    }
    if ($(".key-green").length == 0) {
        $(".gate-green").removeClass("gate-green");
    }

    //warp - - - - - - - - - -

    //object warp-gate green
    if ($(".character.warp-plate-green").length > 0 && $(".warp-plate-green").length > 1 && characterHasMoved) {
        if ($(".warp-plate-green.rock:not(.character)").length == 0) {
            inputActive = false;
            functionDelay(function() {
                var targetWarp = $(".warp-plate-green:not(.character)");
                currentCharacterPosition[0] = parseInt($(targetWarp).attr('x'), 10);
                currentCharacterPosition[1] = parseInt($(targetWarp).attr('y'), 10);
                $(".gameSquare").removeClass(characterPositions);
                $(targetWarp).addClass("character");
                playSound(soundWarp);
                inputActive = true;
                updateGridHistory();
            }, 300);
        }
    }

    //object warp-gate blue
    if ($(".character.warp-plate-blue").length > 0 && $(".warp-plate-blue").length > 1 && characterHasMoved) {
        if ($(".warp-plate-blue.rock:not(.character)").length == 0) {
            inputActive = false;
            functionDelay(function() {
                var targetWarp = $(".warp-plate-blue:not(.character)");
                currentCharacterPosition[0] = parseInt($(targetWarp).attr('x'), 10);
                currentCharacterPosition[1] = parseInt($(targetWarp).attr('y'), 10);
                $(".gameSquare").removeClass(characterPositions);
                $(targetWarp).addClass("character");
                playSound(soundWarp);
                inputActive = true;
                updateGridHistory();
            }, 300);
        }
    }

    //object warp-gate brown
    if ($(".character.warp-plate-brown").length > 0 && $(".warp-plate-brown").length > 1 && characterHasMoved) {
        if ($(".warp-plate-brown.rock:not(.character)").length == 0) {
            inputActive = false;
            functionDelay(function() {
                var targetWarp = $(".warp-plate-brown:not(.character)");
                currentCharacterPosition[0] = parseInt($(targetWarp).attr('x'), 10);
                currentCharacterPosition[1] = parseInt($(targetWarp).attr('y'), 10);
                $(".gameSquare").removeClass(characterPositions);
                $(targetWarp).addClass("character");
                playSound(soundWarp);
                inputActive = true;
                updateGridHistory();
            }, 300);
        }
    }

    //object warp-gate red
    if ($(".character.warp-plate-red").length > 0 && $(".warp-plate-red").length > 1 && characterHasMoved) {
        if ($(".warp-plate-red.rock:not(.character)").length == 0) {
            inputActive = false;
            functionDelay(function() {
                var targetWarp = $(".warp-plate-red:not(.character)");
                currentCharacterPosition[0] = parseInt($(targetWarp).attr('x'), 10);
                currentCharacterPosition[1] = parseInt($(targetWarp).attr('y'), 10);
                $(".gameSquare").removeClass(characterPositions);
                $(targetWarp).addClass("character");
                playSound(soundWarp);
                inputActive = true;
                updateGridHistory();
            }, 300);
        }
    }

    //coins - - - - - - - - - -

    //check to collect coin
    if ($(".character.coin").length > 0) {
        $(".character.coin").removeClass("coin");
        playSound(soundCoin);
    }

    //check if all coins are collected - show exit
    if ($('.coin').length == 0 && $('.coin-exit').length > 0) {
        $('.coin-exit').addClass('exit');
        $('.coin-exit').removeClass('coin-exit');
        playSound(soundRevealExit);
    }

    //weight plates - - - - - - - - - -

    var allPlatesCovered = true;

    $('.weight-plate').each(function() {
        if (!$(this).hasClass('rock') && !$(this).hasClass('character') && !$(this).hasClass('bomb')) {
            allPlatesCovered = false;
        }
    });

    if (allPlatesCovered && $('.weight-plate').length > 0) {
        $('.weight-plate-gate').addClass('weight-plate-open-gate');
        $('.weight-plate-gate').removeClass('weight-plate-gate');
        if (weightPlateGatesUnlocked == false) {
            playSound(soundWeightPlateGatesUnlocked);
            weightPlateGatesUnlocked = true;
        }
    }

    if (!allPlatesCovered && $('.weight-plate').length > 0) {
        $('.weight-plate-open-gate').addClass('weight-plate-gate');
        $('.weight-plate-open-gate').removeClass('weight-plate-open-gate');
        if (weightPlateGatesUnlocked == true) {
            playSound(soundError);
            weightPlateGatesUnlocked = false;
        }
    }

    if ($('.weight-plate.character').length > 0) {
        playSound(soundWeightPlate);
    }

    //dirt - - - - - - - - - -

    //check to remove dirt
    if ($(".character.dirt").length > 0) {
        $(".character.dirt").removeClass("dirt");
        playSound(soundDirt);
    }

    //bombs - - - - - - - - - -

    if ($(".character.detonator").length > 0) {
        $(".character.detonator").removeClass("detonator");
        $(".bomb").each(function() {
            detonateBomb(this);
        });
        playSound(soundDetonator);
    }

    //holes - - - - - - - - - -

    if ($(".character.hole").length > 0) {
        var fallenCharacter = $(".character.hole");
        $(fallenCharacter).removeClass(characterPositions);

        //load image to reload animation
        reloadGif('images/volex/Retina/Player/player_03_fallen.gif');

        $(fallenCharacter).addClass("cFallen");

        inputActive = false;
        playSound(soundFalling);
        playSound(soundCharacterDied);
    }
    if ($(".rock.hole").length > 0) {
        $(".rock.hole").removeClass("rock");
        playSound(soundFalling);
    }
    if ($(".bomb.hole").length > 0) {
        $(".bomb.hole").removeClass("bomb");
        playSound(soundFalling);
    }

    //fragile ground - - - - - - - - - -

    if ($(".character.fragile-ground").length > 0) {
        $(".character.fragile-ground").addClass("fragile-ground-used");
    }

    //fragile ground used - - - - - - - - - -

    if ($(".fragile-ground-used:not(.character)").length > 0) {
        $(".fragile-ground-used:not(.character)").addClass("hole");
        $(".fragile-ground-used:not(.character)").removeClass("fragile-ground-used fragile-ground");
        playSound(soundFragileGround);
    }
}

function reloadGif(src) {
    //load image to reload animation
    var ni = new Image();
    ni.src = src;
    ni.style.visibility = "hidden";
    ni.style.display = 'none';
    document.body.appendChild(ni);
    document.body.removeChild(ni);
}

function restartLevel() {
    // transitionLevel();
    stopGameEndAnimation();
    clearLevel();
    setLevel();
    inputActive = true;
}

function clearLevel(isRewind) {
    for (i = 0; i < gridElements.length; i++) {
        $('.gameSquare').removeClass(gridElements[i][0]);
        $('.gameSquare').removeClass(characterPositions);
        $('.gameSquare').removeClass(additionalGridStyles);
    }

    if (isRewind) {
        playerMoves.pop();
    } else {
        playerMoves = [];
    }
}

//next level
function nl() {
    if (currentLevel != levelData.length - 1 && currentLevel < maxLevelReached) {
        currentLevel += 1;
        setCookie();
        restartLevel();
    }
}

//previous level
function pl() {
    if (currentLevel != 1 && currentLevel <= maxLevelReached) {
        currentLevel -= 1;
        setCookie();
        restartLevel();
    }
    if (currentLevel > maxLevelReached) {
        currentLevel = maxLevelReached;
        setCookie();
        restartLevel();
    }
}

//jump level
function jl(targetLevel) {
    currentLevel = targetLevel;
    setCookie();
    restartLevel();
}

function setVisualLevel() {
    $('#visualLevel').html("Level " + currentLevel);
}

function preload(arrayOfImages) {
    $(arrayOfImages).each(function() {
        $('<img/>')[0].src = this;
    });
}

var vd;

function functionDelay(callback, delay) {
    clearTimeout(vd);
    vd = setTimeout(callback, delay);
}

function playMidi() {
    MIDIjs.play(midiFile);
    MIDIjs.player_callback = display_midi_message;
}

function display_midi_message(event) {
    //console.log(event.time);
    if (event.time > midiLength) {
        MIDIjs.stop();
        playMidi();
    }
}

function playSound(sound) {
    if (sound.currentTime) {
        sound.currentTime = 0;
    }
    sound.play();
}

function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}

function deflateCompress(value) {
    return Base64.toBase64(RawDeflate.deflate(Base64.utob(value)));
}

function deflateDecompress(value) {
    return Base64.btou(RawDeflate.inflate(Base64.fromBase64(value)));
}

var gridTransitionInt = 1;
var totalSquares = gridX * gridY;
var transitionDelay = 0;
var transitionST;

function transitionLevel(state) {
    state = state || 'hide';

    clearTimeout(transitionST);

    if (state == 'show' && gridTransitionInt == 1) {
        setLevel();
        inputActive = false;
    }

    if (gridTransitionInt <= totalSquares) {
        if (state == 'hide') {
            transitionST = setTimeout(function() {
                $(".gameSquare[z='" + gridTransitionInt + "']").css('visibility', 'hidden');
                gridTransitionInt++;
                transitionLevel('hide');
            }, transitionDelay);
        } else if (state == 'show') {
            transitionST = setTimeout(function() {
                $(".gameSquare[z='" + gridTransitionInt + "']").css('visibility', 'visible');
                gridTransitionInt++;
                transitionLevel('show');
            }, transitionDelay);
        }
    } else {
        gridTransitionInt = 1;

        if (state == 'hide') {
            clearLevel();
            transitionLevel('show');
        }

        if (state == 'show') {
            inputActive = true;
        }
    }
}

function generateLevelIndicators() {
    var indicators = "";
    var indicatorCurrent = "";
    var indicatorIncomplete = "";
    for (i = 1; i < levelData.length; i++) {
        if (i <= maxLevelReached) {
            indicators += "<a class='level-indicator-a' onclick='jl(" + i + ")'>";
        }
        if (i == currentLevel) {
            indicatorCurrent = "level-indicator-current";
        } else {
            indicatorCurrent = "";
        }
        if (i > maxLevelReached) {
            indicatorIncomplete = "level-indicator-incomplete";
        } else {
            indicatorIncomplete = "";
        }
        indicators += "<div class='level-indicator " + indicatorIncomplete + " " + indicatorCurrent + "' title='" + levelData[i][0] + "'>" + i + "</div>";
        if (i <= maxLevelReached) {
            indicators += "</a>";
        }
        if (i % 20 == 0) {
            indicators += "<br/>";
        }
    }

    $('#level-indicators').html(indicators);
}

function getCookie() {
    var storedCookie = Cookies.getJSON('levelData');
    return storedCookie;
}

function setCookie() {
    var cld = deflateCompress(currentLevel.toString());
    var mld = deflateCompress(maxLevelReached.toString());
    Cookies.set('levelData', {
        cl: cld,
        ml: mld
    }, {
        expires: 36524,
        sameSite: 'Lax'
    });
}

function removeCookie() {
    Cookies.remove('levelData');
}

// mobile - - - - - - - - - -

//auto resize grid for mobile
$(window).resize(function() {
    if (mode == "player") {
        fitGrid();
    }
});

function fitGrid() {
    var viewportWidth = $(window).width();
    var viewportHeight = $(window).height();

    if ((gridX * (squareSize + 2)) > viewportWidth) {
        var sizeW = getSquareSize();
        $('.gameSquare').css('height', sizeW + 'px');
        $('.gameSquare').css('width', sizeW + 'px');
    } else if (viewportHeight < 715) {
        var sizeH = getSquareSize();
        $('.gameSquare').css('height', sizeH + 'px');
        $('.gameSquare').css('width', sizeH + 'px');
    } else {
        $('.gameSquare').css('height', squareSize + 'px');
        $('.gameSquare').css('width', squareSize + 'px');
    }

    resizeMobileControls();
}

function getSquareSize() {
    var viewportWidth = $(window).width();
    //var viewportHeight = $( window ).height() - $('.header').height() - $('#levelDetail').height()- $('.instruction').height();
    var viewportHeight = $(window).height() - $('.header').height();
    var minViewport = (viewportWidth < viewportHeight) ? viewportWidth : viewportHeight;
    var size = Math.floor((minViewport / gridX) - 2);
    if (size > squareSize) {
        size = squareSize;
    }
    return size;
}

function toggleMobileControls() {
    $('.mobile-controls-container').toggle();
    resizeMobileControls();
}

function resizeMobileControls() {
    var size = getSquareSize();
    var mobileControlWidth = gridX * (size + 1);
    $('.mobile-controls-container').css('width', mobileControlWidth + 'px');
}

// mobile end - - - - - - - - - -

function detonateBomb(target) {
    var bombX = $(target).attr('x');
    var bombY = $(target).attr('y');

    var bombRadius = [];

    //get 1
    if (bombY > 1 && bombX > 1) {
        bombRadius.push($('.gameSquare[x=' + (parseInt(bombX, 10) - 1) + '][y=' + (parseInt(bombY, 10) - 1) + ']').attr('z'));
    } else {
        bombRadius.push("0");
    }

    //get 2
    if (bombY > 1) {
        bombRadius.push($('.gameSquare[x=' + bombX + '][y=' + (parseInt(bombY, 10) - 1) + ']').attr('z'));
    } else {
        bombRadius.push("0");
    }

    //get 3
    if (bombY > 1 && bombX < gridX) {
        bombRadius.push($('.gameSquare[x=' + (parseInt(bombX, 10) + 1) + '][y=' + (parseInt(bombY, 10) - 1) + ']').attr('z'));
    } else {
        bombRadius.push("0");
    }

    //get 4
    if (bombX > 1) {
        bombRadius.push($('.gameSquare[x=' + (parseInt(bombX, 10) - 1) + '][y=' + bombY + ']').attr('z'));
    } else {
        bombRadius.push("0");
    }

    //push bomb //6
    bombRadius.push($('.gameSquare[x=' + bombX + '][y=' + bombY + ']').attr('z'));

    //get 6
    if (bombX < gridX) {
        bombRadius.push($('.gameSquare[x=' + (parseInt(bombX, 10) + 1) + '][y=' + bombY + ']').attr('z'));
    } else {
        bombRadius.push("0");
    }

    //get 7
    if (bombY < gridY && bombX > 1) {
        bombRadius.push($('.gameSquare[x=' + (parseInt(bombX, 10) - 1) + '][y=' + (parseInt(bombY, 10) + 1) + ']').attr('z'));
    } else {
        bombRadius.push("0");
    }

    //get 8
    if (bombY < gridY) {
        bombRadius.push($('.gameSquare[x=' + bombX + '][y=' + (parseInt(bombY, 10) + 1) + ']').attr('z'));
    } else {
        bombRadius.push("0");
    }

    //get 9
    if (bombY < gridY && bombX < gridX) {
        bombRadius.push($('.gameSquare[x=' + (parseInt(bombX, 10) + 1) + '][y=' + (parseInt(bombY, 10) + 1) + ']').attr('z'));
    } else {
        bombRadius.push("0");
    }

    //remove bombRadius
    for (i = 0; i < bombRadius.length; i++) {
        if (bombRadius[i] != "0") {
            var gameSquareDestroyed = $('.gameSquare[z=' + bombRadius[i] + ']');

            $(gameSquareDestroyed).addClass('explosion-' + i);

            $(gameSquareDestroyed).removeClass('rock bomb wall dirt');

            var gameSquareDestroyedClass = $(gameSquareDestroyed).attr('class');

            if (gameSquareDestroyedClass.includes('character')) {
                $(gameSquareDestroyed).removeClass(characterPositions);
                inputActive = false;
                $(gameSquareDestroyed).addClass('cDead');
                playSound(soundCharacterDied);
            }

            if (gameSquareDestroyedClass.includes('fragile-ground')) {
                $(gameSquareDestroyed).removeClass('fragile-ground').addClass('hole');
            }
        }
    }
}

//play solution
var playSolutionInt = 0;
var playSolutionDelay = 500;
var solutionData;
var solutionDataLength;
var playSolutionST;

function playSolution(sd) {
    inputActive = false;
    playSolutionInt = 0;
    solutionData = sd;
    solutionDataLength = solutionData.length;
    //solutionLoop();
    playSolutionST = setTimeout(solutionLoop, 2000);
}

function solutionLoop() {
    var solutionMove = solutionData[playSolutionInt];

    if (solutionMove == 'l') {
        inputHandler(37, 1);
    }
    if (solutionMove == 'u') {
        inputHandler(38, 1);
    }
    if (solutionMove == 'r') {
        inputHandler(39, 1);
    }
    if (solutionMove == 'd') {
        inputHandler(40, 1);
    }

    playSolutionInt++;

    clearTimeout(playSolutionST);

    if (playSolutionInt < solutionDataLength) {
        playSolutionST = setTimeout(solutionLoop, playSolutionDelay);
    } else {
        if ($('.character.exit').length == 0) {
            inputActive = true;
        }
    }
}

function loadSolutionReplay() {
    if (isReplayMode) {
        location.reload();
    } else {
        window.open(getLevelURL(true), '_self');
    }
}

function getLevelURL(includeReplay) {
    var solutionLevelData = getUrlParameter('ld');
    var solutionURL = "?ld=" + solutionLevelData;
    var solutionData = getSolutionData();

    solutionURL += (solutionData != "" && includeReplay) ? "&sd=" + solutionData : "";

    return solutionURL;
}

function getGridData() {
    var gridData = "";
    $('.gameSquare').each(function() {
        gridData += $(this).attr('element') + ",";
    });
    //remove last comma
    gridData = gridData.substring(0, gridData.length - 1);

    return gridData;
}

function getSolutionData() {
    if (isReplayMode) {
        return getUrlParameter('sd');
    } else {
        return deflateCompress(playerMoves.toString());
    }
}

function openModal(target) {
    var modal = document.getElementById(target);
    modal.style.display = "block";
    var span = document.getElementsByClassName(target + "_close")[0];
    span.onclick = function() {
        modal.style.display = "none";
    };
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}

function closeModal(target) {
    var modal = document.getElementById(target);
    modal.style.display = "none";
}

//rewind
var gridHistory = [];
var rewindLevels = 10;

function updateGridHistory() {
    if (gridHistory.length > rewindLevels) {
        gridHistory.pop();
    }

    var currentGridState = [];

    $('.gameSquare').each(function() {
        var gridClasses = $(this).attr('class');
        currentGridState.push(gridClasses);
    });

    gridHistory.unshift(currentGridState);

    updateVisualUndoCount();
}

function rewind() {
    if (levelMoveCount > 0 && gridHistory[1]) {
        clearLevel(true);

        for (i = 0; i < gridHistory[1].length; i++) {
            $('.gameSquare[z=' + (i + 1) + ']').addClass(gridHistory[1][i]);

            if (gridHistory[1][i].includes('character')) {
                var characterHistoryX = parseInt($('.gameSquare[z=' + (i + 1) + ']').attr('x'), 10);
                var characterHistoryY = parseInt($('.gameSquare[z=' + (i + 1) + ']').attr('y'), 10);
                currentCharacterPosition = [characterHistoryX, characterHistoryY];
            }
        }

        gridHistory.shift();
    }

    updateVisualUndoCount();
}

function updateVisualUndoCount() {
    var visualUndos = gridHistory.length - 1 + " <span class='instruction'>/ " + rewindLevels + "</span>";
    $('#level-undo-count').html(visualUndos);
}

var pgeTimeout;

function gameEndAnimation() {
    if (playGameEnd) {
        clearTimeout(pgeTimeout);
        //get character position
        var endCharacterZ = $('.character').attr('z');

        //insert random square into random position but not into character position and not character element
        var totalGridInt = gridX * gridY;
        var randomGridPosition = Math.floor((Math.random() * totalGridInt) + 1);

        var totalElementsInt = gridElements.length;
        var randomElement = Math.floor((Math.random() * totalElementsInt));
        //var randomElement = Math.floor((Math.random() * 5));
        var randomElementClass = gridElements[randomElement][0];

        if (randomGridPosition != endCharacterZ && randomElementClass != 'character') {
            $('.gameSquare[z=' + randomGridPosition + ']').attr('class', 'gameSquare');
            $('.gameSquare[z=' + randomGridPosition + ']').addClass(randomElementClass);
        }
        pgeTimeout = setTimeout(gameEndAnimation, 100);
    }
}

function stopGameEndAnimation() {
    playGameEnd = false;
    clearTimeout(pgeTimeout);
    $('#levelDetail').show();
    $('#endGameWording').hide();
}
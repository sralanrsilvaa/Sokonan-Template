var currentElement = 0;

$(document).ready(function() {
    $('.gameSquare').click(function() {
        setGridElement(this);
    });
    $('.gameSquare').mouseover(function(evt) {
        setGridElementMo(evt, this);
    });
    $('.gameSquare').attr('element', 0);
    $('.gameSquare').css('cursor', 'pointer');

    var maxScreenWidth = gridX * (squareSize + 1);
    $('.instructions').css('max-width', maxScreenWidth);
    $('.instructions').css('min-width', maxScreenWidth);
    $('.instructions').css('margin', '0 auto');
});

function initBuilder() {
    console.log('starting builder');

    var levelElementsA = "";
    var levelElementsB = "";

    for (i = 0; i < gridElements.length; i++) {
        var selectedElementClass = (i == currentElement) ? "selectedElement" : "";
        var elementDescription = gridElements[i][2];
        if (gridElements[i].length != 0) {
            if (i < 18) {
                levelElementsA += "<div class='builderElement' onclick='setCurrentElement(" + i + ");' title='" + elementDescription + "'><div style='width:" + squareSize + "px;height:" + squareSize + "px;float:right;' class='gameSquareElement " + gridElements[i][0] + "'></div><div id='elementLabel_" + i + "' class='elementLabel " + selectedElementClass + "' style='height:" + squareSize + "px;float:right;margin-right:10px;'>" + gridElements[i][1] + "</div></div>";
            } else {
                levelElementsB += "<div class='builderElement' onclick='setCurrentElement(" + i + ");' title='" + elementDescription + "'><div style='width:" + squareSize + "px;height:" + squareSize + "px;' class='gameSquareElement " + gridElements[i][0] + "'></div><div id='elementLabel_" + i + "' class='elementLabel " + selectedElementClass + "' style='height:" + squareSize + "px;'>" + gridElements[i][1] + "</div></div>";
            }
        }
    }

    $('#levelElements-a').html(levelElementsA);
    $('#levelElements-b').html(levelElementsB);

    //check for url level data
    var urlLevelData = getUrlParameter('ld');

    if (urlLevelData != null && urlLevelData != "undefined" && urlLevelData.length > 0) {
        console.log('accepting url level data');

        urlLevelData = deflateDecompress(urlLevelData);

        urlLevelData = urlLevelData.toString().split(',');

        $('#output').val(urlLevelData);

        functionDelay(importLevel, 100);
    }
}

function setCurrentElement(element) {
    console.log('setting current element ' + element);

    currentElement = parseInt(element, 10);

    //change text style
    $('.elementLabel').removeClass('selectedElement');
    $('#elementLabel_' + element).addClass('selectedElement');
}

function setGridElement(target) {
    console.log('setting grid element');

    var rulesOk = checkRules();

    if (rulesOk) {
        for (i = 0; i < gridElements.length; i++) {
            $(target).removeClass(gridElements[i][0]);
        }
        if (currentElement != "0") {
            $(target).addClass(gridElements[currentElement][0]);
        }

        $(target).attr('element', currentElement);
    }
}

function setGridElementMo(evt, target) {
    if (evt.ctrlKey) {
        setGridElement(target);
    }
}

function outputLevel() {
    console.log('outputting level');

    $('#output').val(getGridData());
}

function testLevel() {
    console.log('testing level');

    outputLevel();

    var testData = $('#output').val();
    testData = deflateCompress(testData);
    var testURL = thisURL + "/?ld=" + testData;

    window.open(testURL, '_blank');
}

function shareLevel() {
    outputLevel();
    var testData = $('#output').val();
    testData = deflateCompress(testData);
    var buildURL = thisURL + "/builder.html?ld=" + testData;
    $('#buildUrlAlertContent').html(buildURL);
    openModal('buildUrlAlert');
}

function importLevel() {
    console.log('importing level');

    //get input
    var inputData = $('#output').val();

    if (inputData.indexOf('http') === -1) {
        clearGrid();

        //split into array
        var inputDataArray = inputData.split(",");

        var count = 0;

        $('.gameSquare').each(function() {
            $(this).addClass(gridElements[inputDataArray[count]][0]);
            $(this).attr('element', inputDataArray[count]);
            count++;
        });
    } else {
        console.log('can not import a url');
    }
}

var cTimeout;

function clearGridConfirm() {
    $('#clearLevel').hide();
    $('#clearLevelConfirm').show();

    $('#clearLevelConfirm').mouseout(function() {
        revertClearGridConfirm();
    });

    cTimeout = setTimeout(function() {
        revertClearGridConfirm();
    }, 5000);
}

function revertClearGridConfirm() {
    $('#clearLevel').show();
    $('#clearLevelConfirm').hide();
    clearTimeout(cTimeout);
}

function clearGrid(source) {
    revertClearGridConfirm();

    $('.gameSquare').each(function() {
        //clear grid
        for (i = 0; i < gridElements.length; i++) {
            $(this).removeClass(gridElements[i][0]);
            $(this).attr('element', '0');
        }
    });

    if (source == 'clearLevelButton') {
        $('#output').val('');
    }
    clearTimeout(cTimeout);
}

function checkRules() {
    rulesCheck = true;

    //check character : 1 only (remove previous)
    if (gridElements[currentElement][0] == "character" && $('.gameSquare.character').length > 0) {
        $('.gameSquare.character').attr('element', '0');
        $('.gameSquare.character').removeClass('character');
    }

    //check warp gates (red) : 2 only
    if ((gridElements[currentElement][0] == "warp-plate-red" || gridElements[currentElement][0] == "warp-plate-red rock") && ($('.gameSquare.warp-plate-red').length > 1 || $('.gameSquare.warp-plate-red.rock').length > 1)) {
        $('.gameSquare.warp-plate-red.rock').attr('element', '0');
        $('.gameSquare.warp-plate-red.rock').removeClass('warp-plate-red rock');

        $('.gameSquare.warp-plate-red').attr('element', '0');
        $('.gameSquare.warp-plate-red').removeClass('warp-plate-red');
    }

    //check warp gates (blue) : 2 only
    if ((gridElements[currentElement][0] == "warp-plate-blue" || gridElements[currentElement][0] == "warp-plate-blue rock") && ($('.gameSquare.warp-plate-blue').length > 1 || $('.gameSquare.warp-plate-blue.rock').length > 1)) {
        $('.gameSquare.warp-plate-blue.rock').attr('element', '0');
        $('.gameSquare.warp-plate-blue.rock').removeClass('warp-plate-blue rock');

        $('.gameSquare.warp-plate-blue').attr('element', '0');
        $('.gameSquare.warp-plate-blue').removeClass('warp-plate-blue');
    }

    //check warp gates (brown) : 2 only
    if ((gridElements[currentElement][0] == "warp-plate-brown" || gridElements[currentElement][0] == "warp-plate-brown rock") && ($('.gameSquare.warp-plate-brown').length > 1 || $('.gameSquare.warp-plate-brown.rock').length > 1)) {
        $('.gameSquare.warp-plate-brown.rock').attr('element', '0');
        $('.gameSquare.warp-plate-brown.rock').removeClass('warp-plate-brown rock');

        $('.gameSquare.warp-plate-brown').attr('element', '0');
        $('.gameSquare.warp-plate-brown').removeClass('warp-plate-brown');
    }

    //check warp gates (green) : 2 only
    if ((gridElements[currentElement][0] == "warp-plate-green" || gridElements[currentElement][0] == "warp-plate-green rock") && ($('.gameSquare.warp-plate-green').length > 1 || $('.gameSquare.warp-plate-green.rock').length > 1)) {
        $('.gameSquare.warp-plate-green.rock').attr('element', '0');
        $('.gameSquare.warp-plate-green.rock').removeClass('warp-plate-green rock');

        $('.gameSquare.warp-plate-green').attr('element', '0');
        $('.gameSquare.warp-plate-green').removeClass('warp-plate-green');
    }

    //check detonator : 1 only (remove previous)
    if (gridElements[currentElement][0] == "detonator" && $('.gameSquare.detonator').length > 0) {
        $('.gameSquare.detonator').attr('element', '0');
        $('.gameSquare.detonator').removeClass('detonator');
    }

    return rulesCheck;
}
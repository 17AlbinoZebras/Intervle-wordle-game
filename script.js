// const colorCode = {
//   0: "correct-letter",
//   1: "one-away",
//   2: "two-away",
//   3: "two-away",
//   4: "four-away",
//   5: "four-away",
//   6: "six-away",
//   7: "six-away",
//   8: "eight-away",
//   9: "eight-away",
//   10: "ten-away",
//   11: "ten-away",
//   12: "twelve-away",
//   13: "twelve-away",
// };

const colorCode = {
  0: "correct-letter",
  1: "two-away",
  2: "two-away",
  3: "four-away",
  4: "four-away",
  5: "eight-away",
  6: "eight-away",
  7: "twelve-away",
  8: "twelve-away",
  9: "",
  10: "",
  11: "",
  12: "",
  13: "",
};

const emojiCode = {
  0: "\uD83E\uDD73",
  1: "\uD83E\uDD75",
  2: "\uD83D\uDD25",
  3: "\uD83D\uDD25",
  4: "\uD83C\uDF24",
  5: "\uD83C\uDF24",
  6: "\u2601",
  7: "\u2601",
  8: "\uD83D\uDCA7",
  9: "\uD83D\uDCA7",
  10: "\uD83E\uDDCA",
  11: "\uD83E\uDDCA",
  12: "\uD83E\uDD76",
  13: "\uD83E\uDD76",
};

const qwerty = [
  "q",
  "w",
  "e",
  "r",
  "t",
  "y",
  "u",
  "i",
  "o",
  "p",
  "a",
  "s",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "z",
  "x",
  "c",
  "v",
  "b",
  "n",
  "m",
];
const alpha = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

var target = "zebra";
var allDists = [[]];
var allGuesses = [[]];

var guessLetters = [];
var attempts = 0;

// var lettersSeen = false;

$(document).ready(function () {
  $("#rulesModal").modal("show");
  $('[data-bs-toggle="tooltip"]').tooltip();

  setTargetDaily();

  document.addEventListener("keydown", function (event) {
    var keyCode = event.keyCode || event.which;
    var keyPressed = String.fromCharCode(keyCode);

    setTimeout(buttonAnimate(keyCode), 200);
    if (isLetter(keyPressed)) {
      handleLetter(keyPressed);
    } else if (isBackspaceKeyCode(keyCode)) {
      handleBackspace();
    } else if (isEnterKeyCode(keyCode)) {
      handleEnter();
    }
  });

  var keyboardKeys = $(".keyboard-key");
  for (var i = 0; i < keyboardKeys.length; i++) {
    keyboardKeys[i].addEventListener("click", function () {
      var keyInHTML = $(this).text();
      //alert("you just pressed " + keyInHTML);
      if (keyInHTML.toLowerCase() === "enter") {
        handleEnter();
      } else if (isLetter(keyInHTML)) {
        handleLetter(keyInHTML);
      } else {
        handleBackspace();
      }
    });
  }

  $(".keyboard-checkbox").on("change", function () {
    changeKeyboard(this);
  });

  // $(".possible-letters-button").addEventListener("click", function () {
  //   lettersSeen = true;
  // });

  $(".color-key-button").on("click", function () {
    $(this).toggleClass("selected");
  })
});

function handleLetter(keyPressed) {
  let currentBox = $(".current-box");
  if (currentBox.length) {
    currentBox.html(keyPressed.toString());

    // Did they just type a letter into the final box of this row?
    // To check this, we find the parent of the current guess-box,
    // and see if it is the last element (:last-child) of the row
    if (!currentBox.parent().is(":last-child")) {
      nextBox = currentBox.parent().next().children(".guess-box");
      currentBox.addClass("contains-guess");

      // Now we make the next box the current-box.  This is safe
      // because we know it's not the last box in the row.
      currentBox.removeClass("current-box");
      nextBox.addClass("current-box");
      guessLetters.push(keyPressed);
    } else {
      // If it _was_ the last box, then we no longer have a
      // current-box.  This ensures that if they type another
      // character, it won't overwrite the last one
      currentBox.addClass("contains-guess");
      currentBox.removeClass("current-box");
      guessLetters.push(keyPressed);
    }
  }
  // They didn't type a letter, but did they type a backspace?
  // If so, we want to delete the character from the previously
  // filled box
}

function handleBackspace() {
  let currentBox = $(".current-box");

  // We check if either:
  // - There is no current box (the row is filled with letters)
  // - The current box is not the first one on the row
  // One of these needs to be true if we are going to let them
  // backspace over the last letter
  if (!currentBox.length || !currentBox.parent().is(":first-child")) {
    // Are we on a full row (no current box)?  If so, then
    // the previous box (the one we're going to delete) is
    // the last guess-box on the currently active row, which
    // we find by finding the last guess-box among all the
    // guess-col classed elements of the current-row
    if (!currentBox.length) {
      prevBox = $(".current-row")
        .children(".guess-col")
        .children(".guess-box:last");
    } else {
      // Otherwise, if there is a current box, then it's easier
      // to find the previous box; we just find the previous
      // guess-col and take its guess-box child
      prevBox = currentBox.parent().prev().children(".guess-box");
    }

    // Erase the previously typed letter
    prevBox.html("");
    prevBox.removeClass("contains-guess");

    guessLetters.pop();

    // If the row wasn't full, then there was a current-box
    // and so we need to remove that class before making the
    // previous box the current one
    if (currentBox.length) {
      currentBox.removeClass("current-box");
      //guessLetters.pop();
    }

    prevBox.addClass("current-box");
  } else {
    //alert("cannot backspace from first box");
  }
}

function handleEnter() {
  let currentBox = $(".current-box");

  if (!currentBox.length) {
    //check if valid guess
    //convert guessLetters to a lowercase String, guessWord
    var guessWord = guessLetters.join("").toLowerCase();
    allGuesses.push(guessWord);
    //console.log("got here!");
    //compare guessWord with the possible guesses
    if (guessOptions.has(guessWord)) {
      compareGuess(guessWord);
    } else {
      alert(guessWord + " is Not a valid guess :(");
    }
  }
}

function buttonAnimate(keyCode) {
  var keyPressed = String.fromCharCode(keyCode);
  if (isLetter(keyPressed)) {
    var activeButton = $("." + keyPressed.toLowerCase());
  } else if (isBackspaceKeyCode(keyCode)) {
    var activeButton = $(".backspace-key");
  } else if (isEnterKeyCode(keyCode)) {
    var activeButton = $(".enter-key");
  }
  activeButton.addClass("pressed-key");
  setTimeout(function () {
    activeButton.removeClass("pressed-key");
  }, 100);
}

function compareGuess(guessWord) {
  var guessVals = new Array(5);
  attempts++;

  //for each index in guessWord, compare the letter to the one in that index of the target then give results based on that

  if (guessWord == target) {
    guessVals = [0, 0, 0, 0, 0];
    allDists.push(guessVals);
    guessResults();
    setTimeout(foundAnswer(), 500);
  } else {
    for (var i = 0; i < target.length; i++) {
      var thisDist = Math.abs(guessWord.charCodeAt(i) - target.charCodeAt(i));

      if (thisDist <= 13) {
        guessVals[i] = thisDist;
      } else {
        guessVals[i] = Math.abs(26 - thisDist);
      }
    }
    allDists.push(guessVals);
    guessResults();
    showLetters();
  }
}

function guessResults() {
  //Changes the colors based on distance
  //alert(allDists);
  for (var i = 0; i < 5; i++) {
    var current = $(".current-row")
      .children()
      .children(".contains-guess:first");

    current.removeClass("contains-guess");
    current.addClass(colorCode[allDists[allDists.length - 1][i]]);
  }
  //alert(allDists);
  nextGuess();
}

function nextGuess() {
  guessLetters = [];
  currentRow = $(".current-row");
  nextRow = currentRow.next();
  currentRow.removeClass("current-row");
  nextRow.children(".guess-col").children(".box-1").addClass("current-box");
  nextRow.addClass("current-row");
}

function foundAnswer() {
  currentRow = $(".current-row");
  currentRow.removeClass("current-row");
  currentRow
    .children("guess-col")
    .children(".box-1")
    .removeClass("current-box");
  // alert("Great Job! You got the word in " + attempts + " attempts!");
  shareScore();
}

function outOfTurns() {
  alert(
    "Aw drat! Out of turns :/\nThe target word was " + target.toUpperCase()
  );
  shareScore();
}

function shareScore() {
  var gameNum;
  var scoreVal;
  // var gameMods = " ";
  var showGuesses = "";

  const millisecondsInADay = 24 * 60 * 60 * 1000;
  const daysSinceEpoch = Math.floor(Date.now() / millisecondsInADay);

  gameNum = daysSinceEpoch - 19540;

  scoreVal = attempts;
  if (attempts > 8) {
    scoreVal = "X";
  }

  // if (lettersSeen)
  // {
  //   console.log("*");
  //   gameMods = "°";
  // }

  for (var i = 0; i < allGuesses.length; i++) {
    for (var j = 0; j < allGuesses[i].length; j++) {
      showGuesses += emojiCode[allDists[i][j]] + " ";
      console.log(emojiCode[allDists[i][j]]);
    }
    showGuesses += "\n";
  }
  //console.log(showGuesses);

  $("#scoreModal").modal("show");

  $(".score-modal-title").html(
    "Great Job! You got the word in " + attempts + " attempts!"
  );

  var scoreText =
    "Intervle.fun " +
    gameNum +
    " " +
    scoreVal +
    "/8" +
    // gameMods +
    "\n" +
    showGuesses;

  var scoreLines = scoreText.split("\n");
  var scoreLinesCount = scoreLines.length;

  $(".score-modal-body").html(
    'Click Share to copy your score for sharing: <br/><br/><textarea rows="' +
      scoreLinesCount +
      '" id="copyText" style="border: none; resize: none;">' +
      scoreText +
      '</textarea><br><button class="share-button btn" id="shareScore" type="button" data-clipboard-target="#copyText" data-bs-toggle="popover" data-bs-placement="top" data-bs-content="Copied!">Share</button>'
  );

  $('[data-bs-toggle="popover"]').popover();
  $('[data-bs-toggle="popover"]').on('shown.bs.popover', function () {
      var $pop = $(this);
      setTimeout(function(){
        $pop.popover('hide');
      }, 2000); // 2000 milliseconds = 2 seconds
    });

  var clipboard = new ClipboardJS("#shareScore");
  clipboard.on('success', function(e) {
    e.clearSelection(); // Clear the selection immediately after copying
  });
}

function showLetters() {
  var possibleLetters = [[], [], [], [], []];

  //saves the last guess and the distance for each index
  var lastGuess = allGuesses[allGuesses.length - 1];
  var lastDists = allDists[allDists.length - 1];

  console.log(lastDists);

  //only adds one option if there's only one
  for (var i = 0; i < 5; i++) {
    var guessChar = lastGuess.charAt(i);
    var low = 1;
    var high = 1;
    var ordinalGuess = guessChar.charCodeAt(0) - 97;

    //only adds one option if there's only one
    if (lastDists[i] == 0) {
      possibleLetters[i].push(guessChar);
      high = -1;
    }

    //if the value is 2 or above, the symbol corresponds to only two possible values
    else if (lastDists[i] > 1) {
      //if the distance is even, it's the lower bound
      if (lastDists[i] % 2 == 0) {
        low = lastDists[i];
        high = lastDists[i] + 1;
      }
      //if the distance is odd, it's the upper bound
      else {
        low = lastDists[i] - 1;
        high = lastDists[i];
      }
    }
    //console.log(ordinalGuess);

    //loops through each value within range then finds the letters that are that distance away from the target
    for (var j = low; j <= high; j++) {
      if (j <= 12) {
        // console.log("letter " + String.fromCharCode(97 + (Math.abs(ordinalGuess + j) % 26)));
        // console.log("letter " + String.fromCharCode(97 + (Math.abs(ordinalGuess - j + 26) % 26)));
        possibleLetters[i].push(
          String.fromCharCode(97 + (Math.abs(ordinalGuess + j) % 26))
        );
        possibleLetters[i].push(
          String.fromCharCode(97 + (Math.abs(ordinalGuess - j + 26) % 26))
        );
        // console.log("whole shebang: " + possibleLetters[i])
      }
      //if the distance is 13 then there's only one letter
      else {
        possibleLetters[i].push(
          String.fromCharCode(97 + (Math.abs(ordinalGuess + j) % 26))
        );
      }
    }
    while (possibleLetters[i].length < 4) {
      possibleLetters[i].push("");
    }
    console.log(possibleLetters);
  }

  //reset all boxes
  // $("possible-letter").html("");

  //loops through each location and shows the possible letters in that position
  var eachBox = $(".possible-letter-box");
  for (var i = 0; i < 5; i++) {
    var currentBox = eachBox.eq(i);
    var currentSubBox = currentBox.children(".possible-letter");
    for (var j = 0; j < possibleLetters[i].length; j++) {
      currentSubBox.eq(j).html(possibleLetters[i][j]);
      //console.log(possibleLetters[i][j]);
    }
  }
}

function toAlphaKeyboard() {
  var letterKeys = $(".letter-key");
  for (var i = 0; i < 26; i++) {
    currentLetter = letterKeys.eq(i);
    //currentLetter = $("." + qwerty[i]);
    currentLetter.html(alpha[i]);
    currentLetter.removeClass(qwerty[i]);
    currentLetter.addClass(alpha[i]);
  }
}

function toQwertyKeyboard() {
  var letterKeys = $(".letter-key");
  for (var i = 0; i < 26; i++) {
    currentLetter = letterKeys.eq(i);
    //currentLetter = $("." + alpha[i]);
    currentLetter.html(qwerty[i]);
    currentLetter.removeClass(alpha[i]);
    currentLetter.addClass(qwerty[i]);
  }
}

function changeKeyboard(ele) {
  if ($(ele).prop("checked") == true) {
    toAlphaKeyboard();
  } else if ($(ele).prop("checked") == false) {
    toQwertyKeyboard();
  }
}

function setTargetDaily() {
  //Code this too
  target = targetOptions.getRandomElement(false);
  //alert("today's word is definitely not: " + target);
}

function setTargetEndless() {
  //picks and sets a new target
  target = targetOptions.getRandomElement(true);
  //alert("today's word is definitely not: " + target);
}

function isLetter(character) {
  return /[a-zA-Z]/.test(character);
}

function isBackspaceKeyCode(keyCode) {
  return keyCode == 8;
}

function isEnterKeyCode(keyCode) {
  return keyCode == 13;
}

/*
                                                                                        
                                  ████                                                  
                                  ████                                                  
                                    ██████████████                                      
                                  ██████████████████  ████                              
                                  ████████████████████████                              
                              ███████████████████                                  
                          ████▒▒▒▒████████████████████                                  
                        ██▒▒▒▒▒▒▒▒▒▒████████████████████                                
                      ██▒▒████▒▒▒▒▒▒▒▒▒▒████████████▒▒▒▒██                              
                    ██▒▒████████▒▒▒▒▒▒▒▒██▒▒▒▒▒▒▒▒▒▒▒▒▒▒██                              
                    ██▒▒████████▒▒▒▒▒▒▒▒██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██                            
                  ██▒▒▒▒▒▒████▒▒▒▒▒▒▒▒██▒▒▒▒▒▒▒▒▒▒▒▒████▒▒██                            
                  ██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▒▒▒▒▒▒▒▒▒▒████████▒▒██                          
                ██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒████▒▒▒▒▒▒▒▒▒▒████████▒▒██                          
                ██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒████████▒▒▒▒▒▒▒▒▒▒████▒▒▒▒██                          
                ██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██                          
                ██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██                          
                ██▒▒▒▒▒▒▒▒████▒▒▒▒▒▒██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██                            
                  ██▒▒▒▒████████▒▒▒▒██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██                            
                  ██▒▒▒▒████████▒▒▒▒██▒▒▒▒▒▒▒▒████▒▒▒▒▒▒▒▒██                            
                    ██▒▒▒▒████▒▒▒▒██▒▒▒▒▒▒▒▒████████▒▒▒▒██                              
                    ██▒▒▒▒▒▒▒▒▒▒▒▒██▒▒▒▒▒▒▒▒████████▒▒▒▒██                              
                      ██▒▒▒▒▒▒▒▒▒▒██▒▒▒▒▒▒▒▒▒▒████▒▒▒▒██                                
                        ████▒▒▒▒▒▒██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██                                  
                            ████████▒▒▒▒▒▒▒▒▒▒▒▒████                                    
                                  ██████████████                                        
                                                                                        
                      ░░                                                              
*/

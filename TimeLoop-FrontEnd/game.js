///Game Objects
//Array for counting Time Collapses  
  let collapseAmount = [];  
// Array for State ie backpack for character   
  let state = {}
//Sound menu music
var menuMusic = new Audio("sound/particles-revo-main-version-17674-02-28.mp3");
  menuMusic.loop = true;
  menuMusic.onended = function(){
    menuMusic.play();
}
//Sound game music
var gameMusic = new Audio("sound/machinations-roger-gabalda-main-version-01-35-11007.mp3");
  gameMusic.loop = true;
  gameMusic.onended = function(){
  gameMusic.play();
}
// sound effect for hover btn
var hoverBtnBeep = new Audio("sound/sfx-hover.wav")

const menubuttons = document.querySelectorAll('.intro-btn');
  menubuttons.forEach(button => {
    button.addEventListener('mouseenter', playSound);
  });
const gamebuttons = document.querySelectorAll('.btn');
  gamebuttons.forEach(button => {
    button.addEventListener('mouseenter', playSound);
  });

function playSound() {
    hoverBtnBeep.play();
}


// Opening Screen scroll up 
const togglePage = (goUp) => {
  
  goUp.preventDefault();
  menuMusic.play()
  document.querySelector(goUp.target.getAttribute('homepage-btn')).classList.toggle('is-open');
  }
document.querySelectorAll('[homepage-btn]').forEach(btn => btn.addEventListener('click', togglePage));


/// JSON / WEBAPI Part
// Intro Story Code with Fetch JSON for Story

let story;
let currentPartIndex = 0;


const fetchOptions = {
  method: 'GET', // or any other HTTP method you are using
  mode: 'cors', // Set the mode to 'cors' for cross-origin requests
}

async function fetchData() {
  try {
  // const response = await fetch('story.json'); // uses JSON  
   const response = await fetch('http://localhost:5116/api/story', fetchOptions);   // uses WEBAPI
  // const response = await fetch('http://fb02.decoded.com:5116/api/story', fetchOptions);   // uses Decoded.com WEBAPI

    const data = await response.json();
    return data.story;
  } catch (error) {
    console.error('Error fetching the story:', error);
    return [];
  }
}

// Use an immediately-invoked async function to wait for the data before executing the rest of the script
(async () => {
  story = await fetchData();
  document.getElementById("introStory-Btn").click()
})();

// Puts JSON file data into Intro story Text and Image 

document.getElementById("introStory-Btn").addEventListener('click', function showNextPart() {
  const storyText = document.getElementById('story-text');
  const storyImage = document.getElementById('story-image');
  const storyContinue = document.getElementById('introStory-Btn');
  const storyNext = document.getElementById('introStoryComplete-Btn');

  if (currentPartIndex < story.length) {
    storyText.textContent = story[currentPartIndex].text;
    storyImage.src = story[currentPartIndex].picture;
    currentPartIndex++;
  } else {
    storyText.textContent = "Now this is where your story starts..";
    storyContinue.style.display = "none";
    storyNext.style.display = "block";
    storyImage.style.display = "none";
  }
})

/// Changing screens code
// variables for screens
let menuPage = document.getElementById("menu");
let introStoryPage = document.getElementById("introStory");
let introPage = document.getElementById("intro");
let gamePage = document.getElementById("game");
let winPage = document.getElementById("winScreen");
let scorePage = document.getElementById("resultsScreen");
let creditsPage = document.getElementById("credits");

//Menu to Scores
let menuToScores = document.getElementById("menu-score-btn")
  menuToScores.addEventListener('click',function menuToScores() {
    scorePage.style.display = "block";
    menuPage.style.display = "none";
}, false);

//Scores to Menu
let scoresToMenu = document.getElementById("score-menu-btn")
  scoresToMenu.addEventListener('click',function scoresToMenu() {
    menuPage.style.display = "block";
    scorePage.style.display = "none";
}, false);

//menu to IntroStory
let menuToIntroStory = document.getElementById("menu-introStory-btn")
menuToIntroStory.addEventListener('click',function menuToIntroStory() {
    menuMusic.pause();
    gameMusic.play();
    introStoryPage.style.display = "block";
    menuPage.style.display = "none";
}, false);

//menu to Intro
let menuToIntro = document.getElementById("menu-intro-btn")
menuToIntro.addEventListener('click',function menuToIntro() {
    menuMusic.pause();
    gameMusic.play();    
    introPage.style.display = "block";
    menuPage.style.display = "none";
}, false);

//introStory to Intro
let introStoryCompleteClose = document.getElementById("introStoryComplete-Btn")
introStoryCompleteClose.addEventListener('click',function introStoryToIntro() {
    introStoryPage.style.display = "none";
    introPage.style.display = "block";
}, false);

//win to scores 
let winToScore = document.getElementById("win-score-btn")
winToScore.addEventListener('click',function winToScore() {
    winPage.style.display = "none";
    scorePage.style.display = "block";
}, false);

//Menu to Credits
let menuToCredits = document.getElementById("menu-credits-btn")
menuToCredits.addEventListener('click',function menuToCredits() {
    creditsPage.style.display = "block";
    menuPage.style.display = "none";
}, false);

//Credits to Menu
let creditsToMenu = document.getElementById("credits-menu-btn")
//let creditsToMenu = document.getElementById("credits-menu-btn")
creditsToMenu.addEventListener('click',function creditsToMenu() {
    menuPage.style.display = "block";
    creditsPage.style.display = "none";
}, false);


//Intro to game with game and timer start functions called
let introclose = document.getElementById("intro-btn")
introclose.addEventListener('click',function introToGame() {
  introPage.style.display = "none";
  gamePage.style.display = "block";
  
  startGame();
  resetGoTimer();
}, false);

/// Game Code
// Variables - Elements
const imageElement = document.getElementById('graphic')
const textElement = document.getElementById('text')
const optionButtonsElement = document.getElementById('option-buttons')

/// Functions
//Start Game (Resets backpack / State and goes to Node 1)
function startGame() {
  collapseAmount = [];
  state = {}
  showTextNode(1)
  document.getElementById("collapseCount").innerHTML = collapseAmount.length;
}

// Function restarts game at "returned" game 
// Adds a collapse / death and but doesnt reset back pack state

function timeCollapseGame(){
  collapseAmount.push(1);
  document.getElementById("timer").innerHTML = "EXPIRE";
  document.getElementById("collapseCount").innerHTML = collapseAmount.length;
  showTextNode(999);
  resetGoTimer();
}

// Creates win! 
let scoreWin = 0;
function winState(){
  stopTimer();
  // Calc time from collapses
  let collapseTiming = collapseAmount.length * 180;
  // Get the content of the timer div
  let timerDiv = document.getElementById("timer");
  let timerValue = timerDiv.textContent;
  // Split the timer value into minutes and seconds
  let timeArray = timerValue.split(":");
  let minutes = parseInt(timeArray[0], 10);
  let seconds = parseInt(timeArray[1], 10);
  // Calculate the total seconds
  let totalSeconds = 180 - ((minutes * 60) + seconds);
  scoreWin = totalSeconds + collapseTiming;
  console.log("Winning Score is: " + scoreWin);
  // Hide gamepage and show winpage
  gamePage.style.display = "none";
  winPage.style.display = "block";
  // Add new score!
  TopScore.addNewScore()
}


// Function for showing Elements 
// creates buttons for each option using forEach

function showTextNode(textNodeIndex) {
  const textNode = textNodes.find(textNode => textNode.id === textNodeIndex)
  textElement.innerHTML = textNode.text;
  imageElement.src = textNode.picture;
  while (optionButtonsElement.firstChild) {
    optionButtonsElement.removeChild(optionButtonsElement.firstChild)
  }
  textNode.options.forEach(option => {
    if (showOption(option)) {
      const button = document.createElement('button')
      button.innerText = option.text
      button.classList.add('btn')
      button.addEventListener('click', () => selectOption(option))
      optionButtonsElement.appendChild(button)
    }
  })
}

// Checks which options to show based on (state ie object in backpack)
function showOption(option) {
  return option.requiredState == null || option.requiredState(state);
}

// Checks node if -1 will trigger timecollapse and restart
// CHecks node if -2 will trigger winState
// Otherwise will set state and show next node
function selectOption(option) {
  const nextTextNodeId = option.nextText
  if (nextTextNodeId == -1) {
    return timeCollapseGame()
  } else if(nextTextNodeId == -2) {
     return winState()
  }
  state = Object.assign(state, option.setState)
  showTextNode(nextTextNodeId)
}


// Game Tree

const textNodes = [
  {
    id: 1,
    text: 'Going through the temporal flux left you feeling fuzzy, with a sense of deja vu. Have you been here before? You look down to the digital watch. Time is counting down! <br> Looking around and getting your bearings you come across your first obstacle an electronically locked door. Looks like it needs some sort of pass-card! <br> You keep looking... Result a second already open door',
    picture: "images/game01.jpg",
    options: [
      {
        text: 'Go through the already open door',
        nextText: 2
      },
      {
        text: 'Use cheat to unlock door',
        requiredState: (currentState) => currentState.cheat,
        nextText: 901
      }
    ]
  },
  {
    id: 2,
    text: 'The temporal anomalies are tearing base apart, hoping they are not spreading further you push on. <br> New room, new problems or are there? Actually this room is untouched! You see an electrical control panel on the wall and an unlocked door service corridor. <br> You can turn off the electricity to the corridor but it could make your journey a bit darker!',
    picture: "images/game02.jpg",
    options: [
      {
        text: 'Leave electricity alone, go through door',
        setState: { electric: true, noElectric:false },
        nextText: 3
      },
      {
        text: 'Turn off electricity and then go through door',
        setState: { noElectric: true, electric:false },
        nextText: 4
      }
    ]
  },
  {
    id: 3,
    text: 'Leaving the electricity on might of been the smart move! You can see clearly along the corridor, BINGO! A fire axe (also known to most as a key to all things called door! You approach the axe and just as you about to take it an anomaly withers it away like its 1000 years old! <br> Just keep moving past some boxes and round the corner! 3 doors are in front of you with convenient signs above each!',
    picture: "images/game04.jpg",
    options: [
      {
        text: 'Go through service corridor exit!',
        nextText: 801
      },
      {
        text: 'Go to the Lab offices',
        nextText: 6
      },
      {
        text: 'Go to janitors room',
        nextText: 5
      }
    ]
  },
  {
    id: 4,
    text: "The service corridor is eerily spooky and you can't see a damn thing.. Why did you switch off the electricity?! <br>  As you fumble down the corridor you stumble over some boxes. As you pick yourself up you see a glint of something highlighted by the emergancy lighting. Its an ID card! This might be useful later. You move on and round a corner to 3 doors with convenient signs above each",
    picture: "images/game05.jpg",
    options: [
      {
        text: 'Go through service corridor exit!',
        setState: { idCard: true },
        nextText: 801
      },
      {
        text: 'Go to the Lab offices',
        setState: { idCard: true },
        nextText: 6
      },
      {
        text: 'Go to janitors room',
        setState: { idCard: true },
        nextText: 5
      }
    ]
  },
  {
    id: 5,
    text: 'So... you fancied cleaning something? Get on with the mission! <br> Ok while you are here you have a scout around, nope there is nothing useful, so you have the choice of the two other doors',
    picture: "images/game06.jpg",
    options: [
      {
        text: 'Go through service corridor exit!',
        nextText: 801
      },
      {
        text: 'Go to the Lab offices',
        nextText: 6
      }
    ]
  },
  {
    id: 6,
    text: 'Entering Lab offices you see can see the mess the time collapses have had. Nothing has stood the test of time except an old relic in the corner Dr Malachi had labelled with a do not touch sticker. Could this be something? <br> You hear strange noises through the open door into main atrium.. Have you time to waste?',
    picture: "images/game07.jpg",
    options: [
      {
        text: 'Play on the old Atari',
        requiredState: (currentState) => currentState.noElectric,
        nextText: 7
      },
      {
        text: 'Play on the old Atari',
        requiredState: (currentState) => currentState.electric,
        setState: { password: true },
        nextText: 8
      },
      {
        text: 'Move to the Atrium',
        nextText: 9
      }
    ]
  },
  {
    id: 7,
    text: "The computer has no electricity as you turned off the electric to the whole of the lab office's electricity supply earlier",
    picture: "images/game07.jpg",
    options: [
      {
        text: 'Move on to the Atrium',
        nextText: 9
      }
    ]
  },
  {
    id: 8,
    text: 'The Atari "springs" to life. No No No! Its loaded BASIC. You restart the computer holding down OPTION button, you look in the only 5.25" disks directory... File named useful appears, you load it up. <br> Its got a list of books, and at the bottom, a line saying MyPassword: "MrMittens01!"',
    picture: "images/game08.jpg",
    options: [
      {
        text: 'Move on to the Atrium',

        nextText: 9
      }
    ]
  },
  {
    id: 9,
    text: 'The atrium is not an atrium in the traditional sense but more of a safe lock between the lab offices and the labs. The noise is getting louder, its coming from the labs but the doors to the lab are sealed shut. ',
    picture: "images/game09.jpg",
    options: [
      {
        text: 'Use the ID Card you found to open the door',
        requiredState: (currentState) => currentState.idCard,
        nextText: 10
      },
      {
        text: 'Bang on the door!',
        nextText: 11
      }
    ]
  },
  {
    id: 10,
    text: 'The door opened, things are looking up. Even better there is a map of the labs, time to press on (excuse the pun).',
    picture: "images/game09.jpg",
    options: [
      {
        text: "Go to Malachi's lab",
        nextText: 17
      }
    ]
  },
  {
    id: 11,
    text: 'Banging on the door was never going to work, an inspection around and you find a man sized air vent! If you were a fictional vest wearing NYPD cop saving a certain skyscraper from some terrorists you would of spotted this first and wouldnt of hurt your hand!',
    picture: "images/game09.jpg",
    options: [
      {
        text: 'Climb into the vent',
        nextText: 12
      },
      {
        text: "Keep banging on the door",
        nextText: 802
      }

    ]
  },
  {
    id: 12,
    text: "This vent is seemingly going on forever... 'Come out to the coast, we'll get together, have a few laughs' is the muttering of that NYPD cop you fondly think of  as you make your way further down the vent. The vent turns into 3 paths...",
    picture: "images/game10.jpg",
    options: [
      {
        text: 'Climb down vertical vent',
        nextText: 14
      },
      {
        text: 'Take the left vent',
        nextText: 14
      },
      {
        text: 'Climb over the vertical down vent and continue straight',
        nextText: 803
      }
    ]
  },
  {
    id: 14,
    text: "Climbing down the vent was a bad move, the labs were all on the floor you were on. <br> However the vent exits into some accountant's office. This must of been someone important as there is fake city backdrop!",
    picture: "images/game11.jpg",
    options: [
      {
        text: 'Exit the accountants office',
        nextText: 15
      }
    ]
  },  
  {
    id: 15,
    text: "You need to get back up to the laboratories, there is a sign with stairs written on it next to some elevators... What a choice!",
    picture: "images/game12.jpg",
    options: [
      {
        text: 'Use stairs',
        nextText: 16
      },
      {
        text: 'Use Elevator',
        nextText: 804
      }
    ]
  },
  {
    id: 16,
    text: 'Ahh the safe choice.. as you make your way back up the stairs towards the labs you, a temporal anomaly opens up above you in the ceiling, you hear it crackle and disappear.. <br> Moving through the door to the labs, there is a map on near by wall',
    picture: "images/game13.jpg",
    options: [
      {
        text: "Go to Malachi's lab",
        nextText: 17
      }
    ]
  },
  {
    id: 17,
    text: 'Malachi is long gone but the device causing all the issues is here! <br> You can turn it off if you can guess the password to the terminal',
    picture: "images/game14.jpg",
    options: [
      {
        text: "Enter MrMittens01!",
        requiredState: (currentState) => currentState.password,
        nextText: 18
      },
      {
        text: "Hit it with a nearby hammer",
        nextText: 805
      },
      {
        text: "Guess the Password",
        nextText: 19
      },
      {
        text: "Look around for some clues",
        nextText: 20
      }
    ]
  },
  {
    id: 18,
    text: 'Stopping the machine will stop the temporal anomalies and the labs will look like nothing ever happened. No one knows what happened to Malachi but your job is nearly over you just have to press the stop button!',
    picture: "images/game14.jpg",
    options: [
      {
        text: "Use the Stop button",
        nextText: -2
      }
    ]
  },
  {
    id: 19,
    text: 'Guessing the password didnt help one bit. Malachi has obviously been keeping up to date with security passwords tips.',
    picture: "images/game14.jpg",
    options: [
      {
        text: "Enter MrMittens01!",
        requiredState: (currentState) => currentState.password,
        nextText: 18
      },
      {
        text: "Hit it with a nearby hammer",
        nextText: 805
      },
      {
        text: "Look around for some clues",
        nextText: 20
      }
    ]
  },
  {
    id: 20,
    text: 'You look around and see a clutter of notes but one stands out. The Atari has the key... Time is running out the machine starts hissing..',
    picture: "images/game14.jpg",
    options: [
      {
        text: "Enter MrMittens01!",
        requiredState: (currentState) => currentState.password,
        nextText: 18
      },
      {
        text: "Go back to the Atari",
        nextText: 806
      }
    ]
  },
  {
    id: 801,
    text: 'As you step outside a time vortex above you crackles, you look up to see a flash of lightning and everything goes dark',
    picture: "images/game801.jpg",
    options: [
      {
        text: 'Enter the darkness!',
        nextText: -1
      }
    ]
  },
  {
    id: 802,
    text: "As you become insistant the door should open from you banging on it, an anomaly opens and sucks you though. The last thing you see is inside of a T-Rex's mouth as he makes you dinner!",
    picture: "images/game802.jpg",
    options: [
      {
        text: 'Enter the darkness!',
        nextText: -1
      }
    ]
  },
  {
    id: 803,
    text: 'The gap is just too large and you lose your grip, as you fall head first down the vent you realise this was a mistake. The last thing you remember is the crunch.',
    picture: "images/game803.jpg",
    options: [
      {
        text: 'Enter the darkness!',
        nextText: -1
      }
    ]
  },
  {
    id: 804,
    text: 'Someone forgot their computer based training on health and safety in the work place. Never get into an elevator while the building is being ripped apart by temporal events... The elevator to its credit starts to creep up before an anomaly decends it into darkness with you in it...  ',
    picture: "images/game804.jpg",
    options: [
      {
        text: 'Enter the darkness!',
        nextText: -1
      }
    ]
  },
  {
    id: 805,
    text: 'Hitting it with a hammer (HIWAH) is one of the more ridiculous things you could of done. You are travelled forward in time to a time Earth no longer exists, just space...',
    picture: "images/game805.jpg",    
    options: [
      {
        text: 'Enter the darkness!',
        nextText: -1
      }
    ]
  },
  {
    id: 806,
    text: 'Its too late for that! The last you hear is the machine implode sucking you into the black',
    picture: "images/game806.jpg",
    options: [
      {
        text: 'Enter the darkness!',
        nextText: -1
      }
    ]
  },

  {
    id: 999,
    text: 'Things feel the same but different as your day restarts in this hell!',
    picture: "images/restartday.jpg",
    options: [
      {
        text: 'Start your day, again!',
        nextText: 1
      }
    ]
  }
  

]


/// Timer Code
// Count down with start, stop, reset and Reset+Go
  let countdownInterval;
  const initialCountdownTime = 3 * 60 * 1000; // 3 minutes in milliseconds
  //const initialCountdownTime = 5 * 1000; // 5 seconds in milliseconds for testing collapse
  let countDownDate = new Date().getTime() + initialCountdownTime;

  function startTimer() {
    countdownInterval = setInterval(updateTimer, 1000);
  }

  function stopTimer() {
    clearInterval(countdownInterval);
    //document.getElementById("timer").innerHTML = "STOP";
  }

  function resetTimer() {
    clearInterval(countdownInterval);
    countDownDate = new Date().getTime() + initialCountdownTime;
    updateTimer();
  }
  
  function resetGoTimer(){
    resetTimer();
    startTimer();
  }

  function updateTimer() {
    const now = new Date().getTime();
    const distance = countDownDate - now;

    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("timer").innerHTML = `${minutes.toString().padStart(2, '0')}:
                                                   ${seconds.toString().padStart(2, '0')}`;

    if (distance < 0) {
      clearInterval(countdownInterval);
      console.log(collapseAmount.length)
      
      timeCollapseGame();
    }
  }

  /// Score Code
  //
  let scorelist = document.getElementById("results")

  class TopScore {
    constructor(name, collapses, totalScore) {
      this.name = name;
      this.collapses = collapses;
      this.totalScore = totalScore;
    }

    display() {
      console.log(`Top Score: ${this.name} - Collapses: ${this.collapses} - Total Score: ${this.totalScore}`);
    }

    static displayAll(topScores) {
      console.log('All Top Scores:');
      topScores.forEach((score) => {
        score.display();
      });
    }

    static displayInHTML(topScores) {
      // Keeps topscores array at 10 items
      if (topScores.length === 11) {
        topScores.pop();
      }
      // Sort the topScores array by the totalScore in ascending order
      const sortedTopScores = topScores.slice().sort((a, b) => a.totalScore - b.totalScore);
      const ol = document.createElement('ol');
      sortedTopScores.forEach((score) => {
        const li = document.createElement('li');
        li.textContent = `${score.name} - Collapses: ${score.collapses} - Total Score: ${score.totalScore}`;
        ol.appendChild(li);
      });
      scorelist.appendChild(ol);
    }

    static addNewScore() {
      const name = prompt('Enter your name:');
      const collapses = parseInt(collapseAmount.length);
      const totalScore = parseInt(scoreWin);

      const newScore = new TopScore(name, collapses, totalScore);
      
      // Find the correct position to insert the new score based on total score
      const index = allTopScores.findIndex(score => score.totalScore > totalScore);
      if (index === -1) {
        // If not found, add the new score to the end of the array
        allTopScores.push(newScore);
      } else {
        // Otherwise, insert the new score at the found index
        allTopScores.splice(index, 0, newScore);
      }

      // Clear the existing list and display the updated list
      scorelist.innerHTML = '';
      TopScore.displayAll(allTopScores);
      TopScore.displayInHTML(allTopScores);
      
      // Enter Name into winScreen 
      let agent = document.getElementById("playerName");
      agent.innerHTML = name
    }
  }

  // Secret Message in topscores existing data:
  const player1 = new TopScore("Thanks", 5, 9999);
  const player2 = new TopScore("To", 3, 9999);
  const player3 = new TopScore("Decoded's", 7, 9999);
  const player4 = new TopScore("Michael", 5, 9999);
  const player5 = new TopScore("for all", 7, 9999);
  const player6 = new TopScore("his", 5, 9999);
  const player7 = new TopScore("hard", 3, 9999);
  const player8 = new TopScore("work!", 7, 9999);


  // Create an array of top scores
  const allTopScores = [player1, player2, player3, player4, player5, player6, player7, player8];

  // Display all top scores in the console
  TopScore.displayAll(allTopScores);

  // Display all top scores in an ordered HTML list
  TopScore.displayInHTML(allTopScores);

  // Enter Name into winScreen 
  let agent = document.getElementById("playerName");
  agent.innerHTML = name

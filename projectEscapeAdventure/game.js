///Game Objects
//Array for counting Time Collapses  
  let collapseAmount = [];  
// Array for State ie backpack for character   
  let state = {}

// Opening Screen scroll up 
const togglePage = (goUp) => {
  goUp.preventDefault();
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
let scorePage = document.getElementById("resultsScreen")

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
    introStoryPage.style.display = "block";
    menuPage.style.display = "none";
}, false);

//menu to Intro
let menuToIntro = document.getElementById("menu-intro-btn")
menuToIntro.addEventListener('click',function menuToIntro() {
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
  textElement.innerText = textNode.text;
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
    text: 'You see a some toothpaste.',
    picture: "images/Escape0.png",
    options: [
      {
        text: 'Take the toothpaste',
        setState: { toothpaste: true },
        nextText: 2
      },
      {
        text: 'Leave the toothpaste',
        nextText: 2
      }
    ]
  },
  {
    id: 2,
    text: 'You travel in search of answers to where you are from and across a person with bad breathe.',
    picture: "images/Escape1.png",
    options: [
      {
        text: 'Trade the toothpaste for a gun',
        requiredState: (currentState) => currentState.toothpaste,
        setState: { toothpaste: false, sword: true },
        nextText: 3
      },
      {
        text: 'Trade the toothpaste for a armour',
        requiredState: (currentState) => currentState.toothpaste,
        setState: { toothpaste: false, shield: true },
        nextText: 3
      },
      {
        text: 'Ignore the person',
        nextText: 3
      },
      {
        text: 'Steal Coins',
        setState: { coins: true },
        nextText: 3
      }
    ]
  },
  {
    id: 3,
    text: 'After leaving the person you start to feel knackered and come across a village next to a cool looking fortress.',
    options: [
      {
        text: 'Explore the fortress',
        nextText: 4
      },
      {
        text: 'Find a room to sleep at in the village',
        nextText: 5
      },
      {
        text: 'Find a bush to sleep in',
        nextText: 6
      }
    ]
  },
  {
    id: 4,
    text: 'You are so tired that you fall asleep while exploring the fortrss and are killed by some terrible monster in your sleep.',
    options: [
      {
        text: 'Restart',
        nextText: -1
      }
    ]
  },
  {
    id: 5,
    text: 'Without any money to buy a room you break into the nearest hotel and fall asleep. After a few hours of sleep the owner of the hotel finds you and has the police lock you in a cell.',
    options: [
      {
        text: 'Restart',
        nextText: -1
      }
    ]
  },
  {
    id: 6,
    text: 'You wake up well rested and full of energy ready to explore the nearby fortress.',
    options: [
      {
        text: 'Explore the fortress',
        nextText: 7
      }
    ]
  },
  {
    id: 7,
    text: 'While exploring the fortress you come across a horrible monster in your path.',
    options: [
      {
        text: 'Try to run',
        nextText: 8
      },
      {
        text: 'Attack it with your gun',
        requiredState: (currentState) => currentState.sword,
        nextText: 9
      },
      {
        text: 'Hide behind your armour',
        requiredState: (currentState) => currentState.shield,
        nextText: 10
      },
      {
        text: 'Throw the toothpaste at it',
        requiredState: (currentState) => currentState.toothpaste,
        nextText: 11
      },
      {
        text: 'Pay it off with coins',
        requiredState: (currentState) => currentState.coins,
        nextText: 12
      }
    ]
  },
  {
    id: 8,
    text: 'Your attempts to run are in vain and the monster easily catches.',
    options: [
      {
        text: 'Restart',
        nextText: -1
      }
    ]
  },
  {
    id: 9,
    text: 'You foolishly thought this monster could be slain with a single bullet.',
    options: [
      {
        text: 'Restart',
        nextText: -1
      }
    ]
  },
  {
    id: 10,
    text: 'The monster laughed as you hid behind your armour and ate you.',
    options: [
      {
        text: 'Restart',
        nextText: -1
      }
    ]
  },
  {
    id: 11,
    text: 'You squirted toothpaste at the monster and it exploded. After the dust settled you saw the monster was destroyed. Seeing your victory you decide to claim this fortress as yours and live out the rest of your days there.',
    options: [
      {
        text: 'Congratulations. ',
        nextText: -2
      }
    ]
  },
  {
    id: 12,
    text: 'It eats the coins followed by you',
    options: [
      {
        text: 'Congratulations. Play Again.',
        setState: { coins: false },
        nextText: -1
      }
    ]
  },
  {
    id: 999,
    text: 'Things feel the same but different as your day restarts in this hell!',
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

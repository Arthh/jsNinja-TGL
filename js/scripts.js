(function(window, document){
 'use strict';

  var listGames = [];
  var cart = [];
  var listOfNumbers = [];
  var selectedGame;
  var $divListGames = getElement('[class=list-of-games]');
  var $divNumberGame = getElement('[class="games-list-numbers"]');

  function getElement(attributes){
    return document.querySelector(attributes);
  }

  function initialGameSelect(){
    document.querySelector('[class="game-choose-button"]').click();
  }

  function getAllGames() {
    var ajax = new XMLHttpRequest();
    ajax.open('GET', 'data/games.json', true);
    ajax.send()
    
    ajax.onreadystatechange = () =>  {
      if (ajax.readyState === 4 && ajax.status === 200) {
        listGames.push(JSON.parse(ajax.responseText).types);
        createGamesListButtons();
        initialGameSelect();
      }
    }
  }

  function createGamesListButtons() {
    listGames[0].map(game => {
      var newButton = document.createElement('button');
      var newButtonText = document.createTextNode(game.type);
      newButton.appendChild(newButtonText);

      newButton.setAttribute('class', 'game-choose-button');
      newButton.setAttribute('game-type', game.type);
      newButton.setAttribute('game-type-is-selected', 'false');

      newButton.style.border = `solid ${game.color}`;
      newButton.style.color = game.color;
      
      $divListGames.appendChild(newButton);
    })
    var $buttonSelectedGame = document.querySelectorAll('[class="game-choose-button"]');
    createEventForButtonGames($buttonSelectedGame);
  }

  function createEventForButtonGames(buttons) {
    buttons.forEach(button => {
      button.addEventListener('click', (event) => {
        resetDataButtons();
        event.preventDefault();
        setSelectedGame(button.getAttribute('game-type'))
        button.style.color = '#FFFF';
        button.style.background = selectedGame[0].color;
        addGameDescription();
        createNumbersForGame();
      })
    })
  } 

  function createEventForNumberButton(buttons){
    buttons.forEach(button => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        console.log(listOfNumbers);

        if(button.getAttribute('number-option-is-selected') === 'true'){
          button.setAttribute('number-option-is-selected', 'false');
          button.style.background = '#ADC0C4';
          var numberIndex = listOfNumbers.indexOf(button.innerHTML);
          listOfNumbers.slice(toString(numberIndex), 1);
        }
        else {
        button.setAttribute('number-option-is-selected', 'true');
        button.style.background = '#27C383';
        listOfNumbers.push(event.target.innerHTML);
        }
      })
    })
  }

  function resetDataButtons(){
    var $buttonSelectedGame = document.querySelectorAll('[class="game-choose-button"]');
    $buttonSelectedGame.forEach(button => {
      var game = listGames[0].filter(game => game.type === button.getAttribute('game-type'));
      button.style.border = `solid ${game[0].color}`;
      button.style.color = game[0].color;
      button.style.background = '#FFFF'
    })

  }

  function setSelectedGame(gameName){
    selectedGame = listGames[0].filter(game => game.type === gameName);
  }

  function addGameDescription() {
    var $gameDescription = getElement('[class="game-description"]');
    var $gameBetName = getElement('[class="game-bet-tex"]');
    $gameBetName.innerHTML = selectedGame[0].type;
    $gameDescription.innerHTML = selectedGame[0].description;
  }

  function formatNumberOfButtons(number){
    var formated = number < 10 ? `0${number}` : number;
    return formated;
  }

  function createNumbersForGame() {
    $divNumberGame.innerHTML = ''
    for (var i = 1; i <=selectedGame[0].range ; i++) {
      var newButton = document.createElement('button');
      var newButtonText = document.createTextNode(formatNumberOfButtons(i));
      newButton.appendChild(newButtonText);
      
      newButton.setAttribute('class', 'number-option');
      newButton.setAttribute('number-option-is-selected', 'false');
      
      $divNumberGame.appendChild(newButton);
    }
    var $allNumberButtons = document.querySelectorAll('[class="number-option"]');
    createEventForNumberButton($allNumberButtons);
  }



  getAllGames();
})(window, document);
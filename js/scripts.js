(function(window, document){
 'use strict';

  var listGames = [];
  var cart = [];
  var listOfNumbers = [];
  var selectedGame;
  var $divListGames = getElement('[class=list-of-games]');
  var $divNumberGame = getElement('[class="games-list-numbers"]');
  var $cartList = getElement('[class="cart-list"]');


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
    createEventForButtonOptions();
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
       if(listOfNumbers.length >= selectedGame[0]['max-number']){
          return console.log('error')
       }

        if(listOfNumbers.indexOf(String(button.innerHTML)) !== -1){
          button.style.background = '#ADC0C4';
          var numberIndex = listOfNumbers.indexOf(button.innerHTML);
          listOfNumbers.splice(numberIndex, 1);
        }
        else {
          button.setAttribute('number-option-is-selected', 'true');
          button.style.background = '#27C383';
          listOfNumbers.push(button.innerHTML);
        }        
      })
    })
  }

  function resetDataButtons(){
    listOfNumbers = [];
    var $buttonSelectedGame = document.querySelectorAll('[class="game-choose-button"]');
    $buttonSelectedGame.forEach(button => {
      var game = listGames[0].filter(game => game.type === button.getAttribute('game-type'));
      button.style.border = `solid ${game[0].color}`;
      button.style.color = game[0].color;
      button.style.background = '#FFFF'
    })
    clearSelectedNumbers();    
  }

  function clearSelectedNumbers () {
    var $numbersSelected = document.querySelectorAll('[class="number-option"]');
    $numbersSelected.forEach(number => {
      number.style.background = "#ADC0C4";
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

  function createNumbersForGame() {
    $divNumberGame.innerHTML = ''
    for (var i = 1; i <=selectedGame[0].range ; i++) {
      var newButton = document.createElement('button');
      var newButtonText = document.createTextNode(formatNumberOfButtons(i));
      newButton.appendChild(newButtonText);
      
      newButton.setAttribute('class', 'number-option');
      newButton.setAttribute('value', formatNumberOfButtons(i));
      newButton.setAttribute('number-option-is-selected', 'false');
      
      $divNumberGame.appendChild(newButton);
    }
    var $allNumberButtons = document.querySelectorAll('[class="number-option"]');
    createEventForNumberButton($allNumberButtons);
  }
  
  function formatNumberOfButtons(number){
    var formated = number < 10 ? `0${number}` : number;
    return formated;
  }

  function generateRandomNumbers(numberMax) {
    return String(formatNumberOfButtons(Math.ceil(Math.random() * numberMax)));
  }

  function completeRandomNumers() {
    listOfNumbers = [];
    var range =  selectedGame[0].range;
    while (listOfNumbers.length < selectedGame[0]['max-number']) {
      var randomNumber = String(generateRandomNumbers(range));
      var $numberButton = document.querySelector('[value="'+randomNumber+'"]');
      $numberButton.click();
    }
  }

  function createEventForButtonOptions (){  
    // EVENT TO CLEAR GAME BUTTON  
    getElement('[class="game-options-clear"]')
      .addEventListener('click', () => {
        clearSelectedNumbers();
    })
    
    // EVENT TO ADD TO CART BUTTON
    getElement('[class="games-add-cart-button"]')
      .addEventListener('click', () => {
        addGameToCart();
        resetDataButtons();
        initialGameSelect();
    })

    // EVENT TO COMPLETE RANDOM GAME
    getElement('[class="game-options-complete"]')
      .addEventListener('click', () => {
        completeRandomNumers();
      })
  }

  function addGameToCart(){
    const newGame = {
      id: String(new Date().getTime()),
      gameType: selectedGame[0].type,
      price: selectedGame[0].price,
      numbers: listOfNumbers,
      color: selectedGame[0].color
    }

    if(newGame.numbers.length < selectedGame[0]['max-number']){
      return console.log('numeros inferiores');
    }
    cart.push(newGame);
    createGameOnCart(newGame);
    console.log(cart);
  }

  function createGameOnCart(game) {
    var gameCartDiv = document.createElement('div');
    var gameCartInfosDiv = document.createElement('div');
    var gameCartNumbers = document.createElement('p');
    var gameCartType = document.createElement('p');
    var gameCartPrice = document.createElement('span');
    var gameCartRemoveButton = document.createElement('button');

    gameCartDiv.setAttribute('class', 'game-cart-div');
    gameCartInfosDiv.setAttribute('class', 'game-cart-info');

    gameCartNumbers.setAttribute('class', 'game-cart-numbers');
    gameCartType.setAttribute('class', 'game-cart-type');
    gameCartPrice.setAttribute('class', 'game-cart-price');

    gameCartRemoveButton.setAttribute('class', 'game-cart-remove');
    gameCartRemoveButton.setAttribute('game-id', game.id);

    gameCartNumbers.textContent = game.numbers.join(', ');
    gameCartType.textContent = game.gameType;
    gameCartPrice.textContent = game.price;

    gameCartInfosDiv.style.borderLeft = `3px ${game.color} solid`;
    gameCartInfosDiv.appendChild(gameCartNumbers);
    gameCartInfosDiv.appendChild(gameCartType);
    gameCartInfosDiv.appendChild(gameCartPrice);

    gameCartDiv.appendChild(gameCartRemoveButton);
    gameCartDiv.appendChild(gameCartInfosDiv);

    return $cartList.appendChild(gameCartDiv);
  }

  getAllGames();
})(window, document);
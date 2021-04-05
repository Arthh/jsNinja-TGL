(function(window, document){
 'use strict';

  var listGames = [];
  var selectedGame = [];
  var $divListGames = document.querySelector('[class=list-of-games]');

  function getAllGames() {
    var ajax = new XMLHttpRequest();
    ajax.open('GET', 'data/games.json', true);
    ajax.send()
    
    ajax.onreadystatechange = () =>  {
      if (ajax.readyState === 4 && ajax.status === 200) {
        listGames.push(JSON.parse(ajax.responseText).types);
        createGamesListButtons();
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
  }


  getAllGames();

  

})(window, document);
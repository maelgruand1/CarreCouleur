var pages = ["index.html", "game.html"];
var choice = ["Computer", "IA", "Payer"];
var current;
// Redirige à la page game.html
function goGame() {
  window.location.href = pages[1];
  alert("Redirige au jeu");
  console.log("Redirect to ", pages[1]);
}

// Récupération de la valeur du champ texte
const inputValue = document.querySelector('#inputValue');
inputValue.addEventListener('keyup', function(e) {
    e.preventDefault();
    if(e.keyCode==13){
        var nb=inputValue.value;
        console.log(nb);
    }
}, true);
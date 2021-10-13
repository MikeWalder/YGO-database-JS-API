const dataOrder = document.querySelector('#dataOrder');
const dataResult = document.querySelector('#dataResult');

// Récupération de la valeur du champ texte
const inputValue = document.querySelector('#inputValue');
inputValue.addEventListener('keyup', function(e) {
    e.preventDefault();
    if(e.keyCode==13){
        let nb=inputValue.value;
        inputValue.value = "";
        const urlName = `https://db.ygoprodeck.com/api/v7/cardinfo.php?language=fr&fname=${nb}`;
        fetch(urlName).then( (response) => 
            response.json().then((data) => {
                console.log(data);

                // Effacement de toute les cartes de la précédente recherche
                dataResult.innerText = `Résultats : ${data.data.length}`;
                let srcCards = [...document.querySelectorAll('.bg-dark img')];
                for(let j=0; j<srcCards.length; j++) {
                    document.querySelector(`#a${j}`).src = '';
                }

                // Affichage des images de cartes correspondant à la recherche entrée
                for(let i=0; i<`${data.data.length}`; i++) {
                    document.querySelector(`#a${i}`).src = data.data[i].card_images[0].image_url;
                }
            })
        ).catch(err => {
            console.log('Erreur : '+err);
        });
    }
}, true);

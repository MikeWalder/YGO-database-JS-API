const inputValue = document.querySelector('#inputValue');

const dataOrder = document.querySelector('#dataOrder');
const dataResult = document.querySelector('#dataResult');
const bgDark = document.querySelector('.bg-transparent');

const classCards = document.querySelector('#classCards');

const labelTri = [...document.querySelectorAll('.modal-body > label')];

for(let lb = (labelTri.length - 1); lb > 0; lb--){
    labelTri[2*lb+1] = labelTri[2*lb] = labelTri[lb]; 
}

let cardDescription = '';

/* ----- Réinitialisation de l'input texte au clic de l'icône scope ----- */
const iconeScope = document.querySelector('.fa-search');
iconeScope.addEventListener('click', function() {
    inputValue.value = '';
})

/* ----- Classement par type de carte ----- */
const typeOfCards = [...document.querySelectorAll('.tri > button')];
let typeCard = '';
for(let ak = 0; ak < typeOfCards.length; ak++) {
    typeOfCards[ak].addEventListener('click', function() {
        typeCard = this.value;
        gestionUrletStatus();
    })
}

/* ----- Classement dans le modal ----- */
const cardTri = [...document.querySelectorAll('.modal-body div > button')];
let orderTri = '';
for(let cardN = 0; cardN < cardTri.length; cardN++) {
    cardTri[cardN].addEventListener('focus', function() {
        orderTri = this.value;
        dataOrder.innerText = `Ordre : ${labelTri[cardN].innerText} (${this.innerText})`;
        gestionUrletStatus();
    })
}

/* ----- Gestion de l'input de recherche de cartes ----- */
inputValue.addEventListener('keyup', function(e) {
    e.preventDefault();
    if(e.keyCode==13){ // appui sur la touche entrée pour lancer la requête
        gestionUrletStatus();
    }
}, true);




/* ------------------------------------------- */
/* ________________ Fonctions ________________ */

function searchCardsData(data) {
    // Initialisation des variables
    let tabRoww = [];
    let disp = '';
    
    // Effacement du chemin de chaque image  
    let srcCards = [...document.querySelectorAll('.bg-transparent img')];
    for(let i=0; i<srcCards.length; i++) {
        document.querySelector(`#a${i}`).src = '';
    }

    // Affichage du nombre de résultats dans la navbar
    if(data.data.length) {
        dataResult.innerText = `Résultats : ${data.data.length}`;
    } else {
        dataResult.innerText = `Résultats : aucun`;
    }

    // Suppression de tous les éléments enfants de la liste des résultats lors de la précédente recherche
    while (bgDark.firstChild) {
        bgDark.removeChild(bgDark.lastChild);
    }

    // Insertion automatique de chaque élément de la liste répondant à la recherche
    for(let k=0; k<`${data.data.length}`; k++) {

        const colContainer = `<div class="col-4 col-lg-2 p-0 hovertexter">`;
        disp = '';
        if(k%6==0) { // Quand la colonne est remplie en ajouter une
            
            const roww = document.createElement('div');
            roww.classList.add('row');
            roww.id = `ro${k}`;
            tabRoww[k] = roww;
            bgDark.appendChild(tabRoww[k]);
            
            for(let j=0; j<6; j++) { // Remplissage de chaque colonne
                disp += colContainer;
                disp += `<img class="card-img-top" id="a${k + j}" value="${data.data[k].id}">`;
                disp += `<div class="" id="b${k + j}"></div>`;
                disp += `<div class="" id="c${k + j}"></div>`;
                disp += '</div>';
            }
            roww.innerHTML = disp;
        }

        if(data.data[k]) { // si l'indice du tableau JSON contient des données
            document.querySelector(`#a${k}`).src = data.data[k].card_images[0].image_url_small;
            document.querySelector(`#a${k}`).title = data.data[k].name;
            document.querySelector(`#a${k}`).alt = data.data[k].name;
            
            document.querySelector(`#b${k}`).classList = 'hoverCardTitle';
            document.querySelector(`#b${k}`).innerHTML = data.data[k].name;

            document.querySelector(`#c${k}`).classList = 'hoverCardDescription';
            document.querySelector(`#c${k}`).innerHTML = `${data.data[k].race} / ${data.data[k].type}`;
        }

    }
}

function gestionUrletStatus() {

    let nb=`&fname=${inputValue.value}`;  // Récupération de la valeur du champ texte
    const urlName = `https://db.ygoprodeck.com/api/v7/cardinfo.php?${typeCard}${orderTri}&language=fr${nb}`;

    fetch(urlName).then( (response) => {
        if(response.status >= 200 && response.status <= 299) {
            response.json().then((data) => {
                setTimeout(searchCardsData(data), 1500); // Appel de la fonction de traitement de la requête en input
                cardDetail(data); 
            })
            /*. then((data) => {
                cardDetail(data);
            }) */
        } else {
            dataResult.innerText = `Résultats : aucun`;
            while (bgDark.firstChild) {
                bgDark.removeChild(bgDark.lastChild);
            }
        }
    })
    .catch(err => {
        console.log('Erreur : '+err);
    });

}


function cardDetail(datae) {
    
    const idCard = [...document.querySelectorAll('.row img')];
    const titleCard = document.querySelector('#titleCard');
    const cardDescriptor = document.querySelector('#cardDescriptor');
    const cardImgDesc = document.querySelector('#cardImgDesc');
    const atkCard = document.querySelector('#atkCard');
    const defCard = document.querySelector('#defCard');
    const attributeCard = document.querySelector('#attributeCard');
    const typeCard = document.querySelector('#typeCard');
    
    for(let v = 0; v < datae.data.length; v++) {
        idCard[v].dataset.target = '';
        idCard[v].dataset.toggle = '';
        idCard[v].addEventListener('click', function() {

            cardDescription = `&fname=${this.title}`;
            const urlName = `https://db.ygoprodeck.com/api/v7/cardinfo.php?${typeCard}${orderTri}&language=fr${cardDescription}`;

            fetch(urlName).then( (response) => {
                if(response.status >= 200 && response.status <= 299) {
                    response.json().then((data) => {

                        // Remplissage du modal contenant les informations de la carte sélectionnée au clic
                        titleCard.innerText = data.data[0].name;
                        cardDescriptor.innerHTML = `<u>Description :</u><br>${data.data[0].desc}`;
                        
                        cardImgDesc.src=data.data[0].card_images[0].image_url;

                        data.data[0].attribute ? attributeCard.innerText = `Attribut : ${data.data[0].attribute}` : attributeCard.innerText = `Type : ${data.data[0].type}`;
                        data.data[0].race ? typeCard.innerText = `Type : ${data.data[0].race}` : '';
                        data.data[0].atk ? atkCard.innerText = `ATK : ${data.data[0].atk}` : atkCard.innerText = '';
                        data.data[0].def ? defCard.innerText = `DEF : ${data.data[0].def}` : defCard.innerText = '';

                        this.dataset.target = "#modalDescription";
                        this.dataset.toggle = "modal";
                    })
                }
            })
            .catch(err => {
                console.log('Erreur : '+err);
            });
        })
    }

}

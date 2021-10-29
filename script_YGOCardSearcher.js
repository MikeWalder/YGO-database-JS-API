let inputValue = document.querySelector('#inputValue');

let typeCardsNavbar = [...document.querySelectorAll('#typeCartes div button')];

const dataOrder = document.querySelector('#dataOrder');
const dataResult = document.querySelector('#dataResult');
const bgDark = document.querySelector('.bg-transparent');

const typesTextFrNavbar = ['Monstres Main', 'Monstres Side', 'Tous', 'Magie', 'Piège', 'Skill'];
const typesTextEnNavbar = ['Main monster', 'Side Monster', 'All', 'Spell', 'Trap', 'Skill'];

const classCards = document.querySelector('#classCards');

const modalTitle = document.querySelector('#exampleModalLabel');
const labelTri = [...document.querySelectorAll('.modal-body > label')];

const labelTriEn = ['Card name', 'Level/Rank', 'ATK', 'DEF'];
const labelTriFr = ['Nom carte', 'Niveau/Rang', 'ATK', 'DEF'];

let cardDescription = '';

/* ----- Gestion de la langue ----- */
const language = document.querySelector('#language');
let lang = '&language=fr';
language.addEventListener('click', function() {
    if(language.innerText === 'FR') {
        language.innerText = 'EN';
        inputValue.placeholder = 'Enter a card name or a keyword';
        for(let tp=0; tp<typeCardsNavbar.length; tp++){
            typeCardsNavbar[tp].innerText = typesTextEnNavbar[tp];
        }
        modalTitle.innerText = 'Sorting';
        for(let lT=0; lT<labelTri.length; lT++) {
            labelTri[lT].innerText = labelTriEn[lT];
        }
        dataOrder.innerText = 'Order : -';
        dataResult.innerText = 'Results : -';
        lang = '';
    } else {
        language.innerText = 'FR';
        inputValue.placeholder = 'Saisissez un nom de carte ou un mot-clé';
        for(let tp=0; tp<typeCardsNavbar.length; tp++){
            typeCardsNavbar[tp].innerText = typesTextFrNavbar[tp];
        }
        modalTitle.innerText = 'Tri';
        for(let lT=0; lT<labelTri.length; lT++) {
            labelTri[lT].innerText = labelTriFr[lT];
        }
        dataOrder.innerText = 'Ordre : -';
        dataResult.innerText = 'Résultats : -';
        lang = '&language=fr';
    }
    setTimeout(gestionUrletStatus(), 1200);
});

let labelTriTab = [];
for(let lb = (labelTri.length - 1); lb >= 0; lb--){
    labelTriTab[2*lb+1] = labelTriTab[2*lb] = labelTri[lb].innerText; 
}

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
        dataOrder.innerText = `Ordre : ${labelTriTab[cardN].innerText} (${this.innerText})`;
        gestionUrletStatus();
    })
}

/* ----- Gestion de l'input de recherche de cartes ----- */
inputValue.addEventListener('keyup', function(e) {
    e.preventDefault();
    if(e.keyCode==13){ // appui sur la touche entrée pour lancer la requête
        setTimeout(gestionUrletStatus(), 1200);
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
        if(language.innerText === 'FR') {
            dataResult.innerText = `Résultats : ${data.data.length}`;
        } else {
            dataResult.innerText = `Results : ${data.data.length}`;
        }
    } else {
        if(language.innerText === 'FR') {
            dataResult.innerText = `Résultats : aucun`;
        } else {
            dataResult.innerText = `Results : none`;
        }
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

        if(data.data[k]) { // si l'indice du tableau JSON contient des données afficher les résultats
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
    const urlName = `https://db.ygoprodeck.com/api/v7/cardinfo.php?${typeCard}${orderTri}${lang}${nb}`;

    fetch(urlName).then( (response) => {
        if(response.status >= 200 && response.status <= 299) {
            response.json().then((data) => {
                setTimeout(searchCardsData(data), 1500); // Appel de la fonction de traitement de la requête en input
                cardDetail(data); 
            })
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
    const cardPrice = document.querySelector('#cardPrice');
    let cardBanList = document.querySelector('#cardBanList');
    
    for(let v = 0; v < datae.data.length; v++) {
        idCard[v].dataset.target = '';
        idCard[v].dataset.toggle = '';
        idCard[v].addEventListener('click', function() {

            cardDescription = `&fname=${this.title}`;
            const urlName = `https://db.ygoprodeck.com/api/v7/cardinfo.php?${typeCard}${orderTri}${lang}${cardDescription}`;

            fetch(urlName).then( (response) => {
                if(response.status >= 200 && response.status <= 299) {
                    response.json().then((data) => {
                        
                        this.dataset.target = "#modalDescription";
                        this.dataset.toggle = "modal";

                        // Remplissage du modal contenant les informations de la carte sélectionnée au clic
                        titleCard.innerText = data.data[0].name;
                        cardDescriptor.innerHTML = `<u>Description :</u><br>${data.data[0].desc}`;
                        
                        cardImgDesc.src=data.data[0].card_images[0].image_url;

                        let attribute = '';
                        switch(data.data[0].attribute) {
                            case 'DARK':
                                attribute = `<img src='img/dark100.png' alt='${data.data[0].attribute}'>`;
                                break;
                            case 'LIGHT':
                                attribute = `<img src='img/light100.png' alt='${data.data[0].attribute}'>`;
                                break;
                            case 'WATER':
                                attribute = `<img src='img/water100.png' alt='${data.data[0].attribute}'>`;
                                break;
                            case 'FIRE':
                                attribute = `<img src='img/fire100.png' alt='${data.data[0].attribute}'>`;
                                break;
                            case 'EARTH':
                                attribute = `<img src='img/earth100.png' alt='${data.data[0].attribute}'>`;
                                break;
                            case 'WIND':
                                attribute = `<img src='img/wind100.png' alt='${data.data[0].attribute}'>`;
                                break;
                            case 'DIVINE':
                                attribute = `<img src='img/divine100.png' alt='${data.data[0].attribute}'>`;
                                break;
                        }

                        let type = '';
                        console.log(data);
                        switch(data.data[0].type) {
                            case 'Spell Card':
                                type = `<img src='img/spell100.png' alt='${data.data[0].type}'>`;
                                break;
                            case 'Trap Card':
                                type = `<img src='img/trap100.png' alt='${data.data[0].type}'>`;
                                break;
                        }

                        data.data[0].attribute ? attributeCard.innerHTML = `Attribut :   ${attribute}` : attributeCard.innerHTML = `Type : ${type}`;
                        data.data[0].race ? typeCard.innerText = `${data.data[0].race}` : '';
                        data.data[0].atk ? atkCard.innerText = `ATK : ${data.data[0].atk}` : atkCard.innerText = '';
                        data.data[0].atk == 0 ? atkCard.innerText = `ATK : ${data.data[0].atk}` : "";
                        data.data[0].def ? defCard.innerText = `DEF : ${data.data[0].def}` : defCard.innerText = '';
                        data.data[0].def == 0 ? defCard.innerText = `DEF : ${data.data[0].def}` : "";
                        data.data[0].card_prices[0] ? cardPrice.innerHTML = `<div class="text-center"><i class="fa fa-money-check-alt fa-2x mb-2"></i></div>
                        Amazon : ${data.data[0].card_prices[0].amazon_price}€
                        <br>CardMarket : ${data.data[0].card_prices[0].cardmarket_price}€
                        <br>Ebay : ${data.data[0].card_prices[0].ebay_price}€` : ''; 
                        cardBanList.innerHTML = '';
                        cardBanList.innerHTML += '<ul>';
                        if(data.data[0].card_sets) {
                            for(let set = 0; set < data.data[0].card_sets.length; set++) {
                                cardBanList.innerHTML += `<li><strong>${data.data[0].card_sets[set].set_name}</strong> 
                                ${data.data[0].card_sets[set].set_rarity_code} - ${data.data[0].card_sets[set].set_code}</li>`;
                            }
                            cardBanList.innerHTML += '</ul>';
                        }
                    })
                }
            })
            .catch(err => {
                console.log('Erreur : '+err);
            });
        })
    }

}

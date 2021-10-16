const dataOrder = document.querySelector('#dataOrder');
const dataResult = document.querySelector('#dataResult');
const bgDark = document.querySelector('.bg-dark');


const inputValue = document.querySelector('#inputValue');
inputValue.addEventListener('keyup', function(e) {
    e.preventDefault();
    if(e.keyCode==13){
        let nb=inputValue.value;  // Récupération de la valeur du champ texte
        console.log(nb);
        inputValue.value = "";  // Effacement du contenu de l'input text
        const urlName = `https://db.ygoprodeck.com/api/v7/cardinfo.php?language=fr&fname=${nb}`;
        console.log(urlName);
        fetch(urlName).then( (response) => {
            if(response.status >= 200 && response.status <= 299) {
                response.json().then((data) => {
                    console.log(data);
                    console.log(response.status);
                    // Effacement de toute les cartes de la précédente recherche

                    if(data.data.length) {
                        dataResult.innerText = `Résultats : ${data.data.length}`;
                        console.log(typeof(data));
                    } else {
                        dataResult.innerText = `Résultats : aucun`;
                    }
                    let srcCards = [...document.querySelectorAll('.bg-dark img')];
                    for(let i=0; i<srcCards.length; i++) {
                        document.querySelector(`#a${i}`).src = '';
                    }

                    let tabRoww = [];
                    let disp = '';

                    // Suppression de tous les éléments enfants de la liste des résultats lors de la précédente recherche
                    while (bgDark.firstChild) {
                        bgDark.removeChild(bgDark.lastChild);
                    }

                    // Insertion automatique de chaque élément de la liste répondant à la recherche
                    for(let k=0; k<`${data.data.length}`; k++) {

                        const colContainer = `<div class="col-xs-4 col-lg-2 p-0 hovertexter">`;
                        disp = '';
                        if(k%6==0) {
                            
                            const roww = document.createElement('div');
                            roww.classList.add('row');
                            roww.id = `ro${k}`;
                            tabRoww[k] = roww;
                            bgDark.appendChild(tabRoww[k]);
                            
                            for(let j=0; j<6; j++) {
                                disp += colContainer;
                                disp += `<img class="card-img-top" id="a${k + j}">`;
                                disp += `<div class="" id="b${k + j}"></div>`;
                                disp += `<div class="" id="c${k + j}"></div>`;
                                disp += '</div>';
                            }
                            roww.innerHTML = disp;
                        }

                        if(data.data[k]) { // si l'indice du tableau JSON contient des données
                            document.querySelector(`#a${k}`).src = data.data[k].card_images[0].image_url;
                            document.querySelector(`#a${k}`).title = data.data[k].name;
                            document.querySelector(`#a${k}`).alt = data.data[k].name;
                            
                            document.querySelector(`#b${k}`).classList = 'hoverCardTitle';
                            document.querySelector(`#b${k}`).innerHTML = data.data[k].name;
        
                            document.querySelector(`#c${k}`).classList = 'hoverCardDescription';
                            document.querySelector(`#c${k}`).innerHTML = `${data.data[k].race} / ${data.data[k].type}`;
                        } 
                    }
                })
            } else {
                dataResult.innerText = `Résultats : aucun`;
                while (bgDark.firstChild) {
                    bgDark.removeChild(bgDark.lastChild);
                }
            }
        }).catch(err => {
            console.log('Erreur : '+err);
        });
    }
}, true);



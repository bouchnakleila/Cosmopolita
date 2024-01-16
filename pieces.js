import { ajoutListenersAvis, ajoutListenerEnvoyerAvis,mettreAJour, afficherAvis } from "./avis.js";
//Récupération des pièces eventuellement stockées dans le localStorage
let pieces = window.localStorage.getItem('pieces');

if (pieces === null){
    // Récupération des pièces depuis l'API
    const reponse = await fetch('http://localhost:8081/pieces/');
    pieces = await reponse.json();
    // Transformation des pièces en JSON
    const valeurPieces = JSON.stringify(pieces);
    // Stockage des informations dans le localStorage
    window.localStorage.setItem("pieces", valeurPieces);
}else{
    pieces = JSON.parse(pieces);
}
// appel la fonction pour ajouter Avis
ajoutListenerEnvoyerAvis();
// affichage pieces
function genererPieces(pieces) {

  for(let i=0; i<pieces.length; i++)
    {
        const article = pieces[i];
        const sectionFiches = document.querySelector(".fiches");
        const pieceElement = document.createElement("article");
        const imageElement = document.createElement("img");
        imageElement.src = article.image;
        const nomElement = document.createElement("h2");
        nomElement.innerText = article.nom;
        const prixElement = document.createElement("p");
        prixElement.innerText = `Prix: ${article.prix} € (${article.prix < 35 ? "€" : "€€€"})`;
        const categorieElement = document.createElement("p");
        categorieElement.innerText = article.categorie ?? "(aucune categorie)";
        const descriptionElement = document.createElement("p");
        descriptionElement.innerText = article.description ?? "";
        const dispoElement = document.createElement("p");

        dispoElement.innerText = article.disponibilité ? "en stock" : "hors stock";
        const buttonAvis = document.createElement("button");
        buttonAvis.dataset.id = article.id;
        buttonAvis.textContent = "ouvrir-détails";
        sectionFiches.appendChild(pieceElement);
        // On rattache l’image à pieceElement (la balise article)
        pieceElement.appendChild(imageElement);
        pieceElement.appendChild(nomElement);
        pieceElement.appendChild(prixElement);
        pieceElement.appendChild(categorieElement);
        // Ajout des éléments au DOM pour l'exercice
        pieceElement.appendChild(descriptionElement);
        pieceElement.appendChild(dispoElement);
        pieceElement.appendChild(buttonAvis);
 
    }
    ajoutListenersAvis();
}

genererPieces(pieces);
/****************************************Avis */
for(let i = 0; i < pieces.length; i++){
    const id = pieces[i].id;
    const avisJSON = window.localStorage.getItem(`avis-piece-${id}`);
    const avis = JSON.parse(avisJSON);

    if(avis !== null){
        const pieceElement = document.querySelector(`article[data-id="${id}"]`);
        afficherAvis(pieceElement, avis)
    }
}
//***tri */
    const tri = document.querySelector(".btn-trier");
    tri.addEventListener("click",function(){
        
          pieces.sort(function(a,b){
            return a.prix - b.prix;
          });
          console.log(pieces);
            // Effacement de l'écran et regénération de la page
      document.querySelector(".fiches").innerHTML = "";
      genererPieces(pieces);
    });

    const filter = document.querySelector(".btn-filtrer");
    filter.addEventListener("click",function(){
        var Array = [];
        Array = pieces.filter(function(a){
            return a.prix <= 35;
        });
        console.log(Array);
          // Effacement de l'écran et regénération de la page
      document.querySelector(".fiches").innerHTML = "";
      genererPieces(Array);
    });

    const filterr = document.querySelector(".btn-filtrer-descrip");
    filterr.addEventListener("click",function(){
        
        const Array = pieces.filter(function(a){
            return a.description != null; // a.description;
        });
        console.log(Array);
          // Effacement de l'écran et regénération de la page
      document.querySelector(".fiches").innerHTML = "";
      genererPieces(Array);
    });

    const trii = document.querySelector(".btn-trier-dec");
    trii.addEventListener("click",function(){
          const piecesTrier = Array.from(pieces);
          piecesTrier.sort(function(a,b){
            return a.prix - b.prix; // b.prix - a.prix;
          });
          console.log(piecesTrier.reverse());
            // Effacement de l'écran et regénération de la page
      document.querySelector(".fiches").innerHTML = "";
      genererPieces(piecesTrier);
    });

//*************************************************

const noms = pieces.map(piece => piece.nom);

for(let i=pieces.length -1 ; i >= 0; i--){
    if(pieces[i].prix > 35){
        noms.splice(i,1);
    }
}
console.log(noms);

const abordablesElement = document.createElement("ul");

for(let i=0; i < noms.length ; i++)
{
    const nomElement = document.createElement('li');
    nomElement.innerText = noms[i];
    abordablesElement.appendChild(nomElement);
}

document.querySelector(".abordables").appendChild(abordablesElement)

const nomsDisponibles = pieces.map(piece => piece.nom);
const prixDisponibles = pieces.map(piece => piece.prix);
for(let i=pieces.length-1 ; i>=0 ; i--)
{
    if(pieces[i].disponibilité == false)
    {
        nomsDisponibles.splice(i,1);
        prixDisponibles.splice(i,1);
    }
}
const disponiblesElement = document.createElement("ul");

for(let i=0; i < nomsDisponibles.length ; i++)
{
    const nomElement = document.createElement('li');
    nomElement.innerText = nomsDisponibles[i]+' - '+prixDisponibles[i]+' €';
    //nomElement.innerText = `${nomsDisponibles[i]} - ${prixDisponibles[i]} €`;
    disponiblesElement.appendChild(nomElement);
}

document.querySelector(".disponibles").appendChild(disponiblesElement)

const prixElement = document.querySelector('#prix-max')
prixElement.addEventListener('input', function(){
    const piecesFiltrees = pieces.filter(function(piece){
        return piece.prix <= prixElement.value;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);  
});
mettreAJour();




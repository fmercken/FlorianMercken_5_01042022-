function getCartArticle (){

  const data = localStorage.getItem("userCart");
  let cartData =JSON.parse(data);
  if(!cartData) return;

  let div = "";
  cartData.forEach(function(article){
      div = div + `<article id="${article._id}" class="cart__item" data-id="${article._id}">
      <div class="cart__item__img">
        <img src="${article.picture}" alt="Photographie d'un canapé">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__titlePrice">
          <h2>${article.name}</h2>
          <p>${article.price}€</p>
          <p>${article.color}</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" onchange="onQuantityChanged(event, '${article._id}', '${article.color}')" name="itemQuantity" min="1" max="100" value="${article.quantity}">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem" data-id="${article._id}">Supprimer</p>
          </div>
        </div>
      </div>
    </article>`;
    });

    const divItems = document.getElementById("cart__items");
    divItems.innerHTML = div;     
}

main();

function main () {
    getCartArticle();
    countTotalInCart();
    initClearCart();
    validateCommande();
}

function onQuantityChanged(event, productId, color){
  let localSessionCart =JSON.parse(localStorage.getItem("userCart"));

  for (let i = 0; i < localSessionCart.length; i++) {
    const product = localSessionCart[i];

    if(product._id === productId && product.color === color)
    {
      product.quantity = parseInt(event.currentTarget.value);
    }
  }

  localStorage.setItem("userCart", JSON.stringify(localSessionCart));
  countTotalInCart();
}



//Recuperation des données
function countTotalInCart() {

  let totalPrice = 0;
  let totalQuantity = 0;

  let localSessionCart =JSON.parse(localStorage.getItem("userCart"));

  if(!localSessionCart) return;

  // parcourrir le tableau de produit du panier
  for (let i = 0; i < localSessionCart.length; i++)
  {
    const product = localSessionCart[i];
  // calculer le prix de la ligne (prix * quantité)
    totalPrice = totalPrice + (product.price * product.quantity);
    totalQuantity = totalQuantity + product.quantity;
  }
  // ajouter le prix de la ligne dans le prix total (totalPrice)
  let quantityHtml = document.getElementById("totalQuantity");
  let priceHtml = document.getElementById("totalPrice");
  
  quantityHtml.innerText = totalQuantity;
  priceHtml.innerText = totalPrice;
}


function onClickEmptyCart(event){

  // supprimer le html de l'article
  const idArticle = event.currentTarget.attributes['data-id'].value;
  var el = document.getElementById(idArticle);
  el.remove();


  // supprimer l'article dans le local storage
  const data = localStorage.getItem("userCart");
  let cartData =JSON.parse(data);

  cartData = cartData.filter(function(article){
    if(article._id != idArticle) return true;
    else return false;
  });

  localStorage.setItem("userCart", JSON.stringify(cartData));
}


//le panier se vide ainsi que le localStorage
function initClearCart() {
    const removeButtons = document.getElementsByClassName("deleteItem");
    for (let i = 0; i < removeButtons.length; i = i + 1 ) {
      removeButtons[i].addEventListener("click", onClickEmptyCart);
    }
}  



// 0) Exécuter cette function lors du click sur le bouton commander
function validateCommande(){

  const orderBtn = document.getElementById("order");
  orderBtn.addEventListener("click", (event) => {

    event.preventDefault(); 
    // 1) récupérer les données du formulaire (prénom, nom etc ...) et les placer dans dataToSendBackend.contact
    const data = localStorage.getItem("userCart");
    let cartData =JSON.parse(data);

    let inputName = document.querySelector("#firstName");
    let inputLastName = document.querySelector("#lastName");
    let inputCity = document.querySelector("#city");
    let inputAdress = document.querySelector("#address");
    let inputMail = document.querySelector("#email");

    // 2) vérifier le format des données utilisateur
    if (!inputName.value ||
        !inputLastName.value ||
        !inputCity.value ||
        !inputAdress.value ||
        !inputMail.value)
    {
      //si erreur afficher message d'erreur en utilisant alert
      alert("renseigner les champs valide");
    }
    // 3) récupérer les produits du panier et les placer dans dataToSendBackend.products
    else {
      let productsToSendBackend = cartData.map((product) => {
        return product._id;
      });

      const order = {
        contact: {
          firstName: inputName.value,
          lastName: inputLastName.value,
          address: inputAdress.value,
          city: inputCity.value,
          email: inputMail.value,
        },
        products: productsToSendBackend,
      }

      console.log("order to send", order);

       // 4) faire une requete POST ver le backend
      fetch(`http://localhost:3000/api/products/order`,{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body:  JSON.stringify(order)
      }).then(function (response) {
            return response.json();
      }).then((apiResult) => {
        console.log("fetch response", apiResult)
        alert("votre commande a bien été enregistrée. OrderId: " + apiResult.orderId + ". Vous allez être redirigé vers la page d'acceuil");
        localStorage.clear();
        //window.location.replace("file:///C:/Users/Flow/Documents/Developpement/P5-Dev-Web-Kanap-master/front/html/index.html");
        window.location.href = "./index.html";
      });
    }
  });
}
 

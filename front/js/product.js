main();

function main() {
  bindClickEvent();
  getArticle();
  

}


let productData;

function getArticle() {
  
  const productId = getParameter("id")

    fetch(`http://localhost:3000/api/products/${productId}`)
    .then(function (response) {
        return response.json();
        })
    //Produit
    .then(function (resultatAPI) {
        productData = resultatAPI;
        console.log(productData);

        populateDom("title", productData.name);
        populateDom("description", productData.description);
        populateDom("price" , productData.price);

        productData.colors.forEach((color) => {
          console.log("color", color);
          const select = document.getElementById("colors");
          const option = document.createElement("option");
          option.value = color;
          option.text = color;
          select.appendChild(option);

        });

        document.getElementById("image").src =  productData.imageUrl;
      })
}


function getParameter(paramName) {
  var searchString = window.location.search.substring(1),
      i, val, params = searchString.split("&");

  for (i=0;i<params.length;i++) {
    val = params[i].split("=");
    if (val[0] == paramName) {
      return val[1];
    }
  }
  return null;
}


function populateDom(id, value)
{
  const element = document.getElementById(id);
  if(element)
  {
    element.innerHTML = value;
  }
}

//fonction ajouté au panier
function onClickAddCart() {
  const quantity = document.querySelector("#quantity").value;
  const color = document.querySelector("#colors").value;
  console.log("color", colors)

  if (quantity > 0 && quantity< 100) {
    
    //produit qui sera ajouté au panier
    let productAdded = {
      _id: productData._id,
      name: productData.name,
      price: parseFloat(productData.price),
      quantity: parseFloat(quantity),
      color,
      picture: productData.imageUrl
    };
    console.log("onClickAddCart", productAdded);

    // on récupère le panier en local storage
    let localSessionCart =JSON.parse(localStorage.getItem("userCart"));

    //check si le produit n'existe pas déjà dans le panier
    
    if(!localSessionCart){
      localSessionCart = [];
      localSessionCart.push(productAdded)
      localStorage.setItem("userCart", JSON.stringify(localSessionCart))
    }
    else
    {
      let productFound = false;
      for (let i = 0; i < localSessionCart.length; i++) {
        const product = localSessionCart[i];

        if(product._id === productAdded._id 
            && product.color === productAdded.color)
        {
          product.quantity = product.quantity + productAdded.quantity;
          productFound = true;
        }
      }

      
      if(!productFound){
        localSessionCart.push(productAdded);
      }

      localStorage.setItem("userCart", JSON.stringify(localSessionCart))
    }
  }
  else
  {
    alert("La quantité doit être comprise entre 1 et 99 compris");
  }
}

function bindClickEvent() {
  const addToCartBtn = document.querySelector("#addToCart");
  addToCartBtn.addEventListener("click", onClickAddCart)
}
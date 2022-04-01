main();

function main() {
  getArticles();
}

//API
function getArticles() {

    fetch("http://localhost:3000/api/products")
    .then(function (res) {
        return res.json();
    })


//Produit
    .then(function (resultatAPI) {
        const articles = resultatAPI;
        console.log(articles);

        let div = "";
        articles.forEach(function(article){
          div = div + `<a href="./product.html?id=${article._id}">
            <article>
              <img src="${article.imageUrl}" alt="Lorem ipsum dolor sit amet, Kanap name1">
              <h3 class="productName">${article.name}</h3>
              <p class="productDescription">${article.description}</p>
            </article>
          </a>`;
        });

        const divItems = document.getElementById("items");
        divItems.innerHTML = div;     
    });
} 
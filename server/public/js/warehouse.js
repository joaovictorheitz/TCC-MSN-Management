const searchInput = document.getElementById("search-item-input");
const products = $("#products");
let sortingMethod = "title";
let sortingDirection = "asc";
let productList = []

$("#filters").animate({ width: "toggle" });
function toggleFilters() {
  $("#filters").animate({ width: "toggle" });
  $("#filter").toggleClass("active")
}

function filter(e) {
  const element = $(e);

  let filter = element.data("value");
  if (filter == "asc-desc") {
    if (sortingDirection == "asc") {
      sortingDirection = "desc"
      $(`[data-value="asc-desc"]`).css("transform", 'rotateY(180deg)')
    }
    else {
      (sortingDirection = "asc");
      $(`[data-value="asc-desc"]`).css("transform", 'rotateY(0)')
    }
  } else {
    sortingMethod = filter;
  }

  $(".filter-opt").each((e, i) => {
    let method = $(i).data("value");
    $(i).attr("data-selected", "false");

    if (method == sortingMethod || method == 'asc-desc') {
      $(i).attr("data-selected", "true");
    }
  });


  productList.sort((a, b) => {
    var x = a[sortingMethod];
    var y = b[sortingMethod];
    return x < y ? -1 : x > y ? 1 : 0;
  })

  if (sortingDirection == "desc") {
    productList.reverse();
  }

  render(productList)
}

function toggleList() {
  columns = $("#toggleList").data("columns");

  if (columns == 4) columns = 1;

  document.querySelectorAll(".product-card").forEach((card) => {
    $(card).css("width", `${100 / columns - 2}%`);
  });

  if (columns == 1) {
    $("#products").css("row-gap", "12px");
  } else {
    $("#products").css("row-gap", "24px");
  }

  $("#toggleList").data("columns", columns + 1);
  $("#columnsSelect").attr("src", `./assets/${columns + 1}columns.svg`);
}

function render(productsJSON) {
  products.empty();

  productsJSON.forEach((product) => {
    let productHtml = `
                <a class="product-card" href="/product/${product.id}">
                    <div class="product-image">
                        <img src="${product.thumbnail}">
                    </div>    
                    <div class="product-info">
                        <span class="product-name">${product.title}</span>

                        <div class="product-data">
                            <div class="product-data-tag">
                                <span class="product-data-title">Preço</span>
                                <span class="product-data">R$${product.price}</span>
                            </div>
                            <div class="product-data-tag">
                                <span class="product-data-title">Estoque</span>
                                <span class="product-data">${product.in_stock}</span>
                            </div>
                        </div>

                    </div>
                </a>
                `;

    products.append(productHtml);
  });
}

function query(searchQuery) {
  fetch(
    location.origin +
    `/stock/search?q=${searchQuery.trim()}&limit=21&sort=${sortingMethod}-${sortingDirection}`
  ).then((r) =>
    r.json().then((js) => {
      render(js);
      productList = js
    })
  );
}

searchInput.addEventListener("input", (e) => {
  let searchQuery = e.target.value;
  query(searchQuery);
});

query(" ");


document.addEventListener("DOMContentLoaded", async function () {
    const container = document.getElementById("productContainer");
  
    let allProducts = [];
    async function loadProductsFromAPI() {
        try {
          const res = await fetch('http://localhost:3000/api/products', {
            credentials: 'include' // <-- REQUIRED to send cookies
          });
          const data = await res.json();
          renderProducts(data|| []);
        } catch (err) {
          console.error("Failed to load products:", err);
        }
      }
  
      function renderProducts(productList) {
        container.innerHTML = "";
        productList.forEach(product => {
          const col = document.createElement("div");
          col.className = "col-lg-3 col-sm-6";
          col.innerHTML = `
            <div class="product_box">
              <h4 class="bursh_text">${product.name}</h4>
              <p class="lorem_text">${product.description}</p>
              <img src="${product.images[0]}" class="image_1">
              <div class="btn_main">
                <div class="buy_bt">
                  <ul>
                    <li><a href="#" onclick="handleBuyClick('${product._id}')">Buy Now</a></li>
                  </ul>
                </div>
                <h3 class="price_text">Price $${product.price}</h3>
              </div>
            </div>
          `;
          container.appendChild(col);
        });
      }
    await loadProductsFromAPI();

  });
  

const searchInput = document.getElementById("productSearchInput");
const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");
const filterButton = document.getElementById("filter_apply_button");
const container = document.getElementById("productContainer");

filterButton.addEventListener("click", async function () {
    const category = categoryFilter.value;
    const priceRange = priceFilter.value;
    const searchQuery = searchInput.value.trim().toLowerCase();

    const queryParams = new URLSearchParams();
    if (category && category !== "all") queryParams.append("category", category);
    if (priceRange && priceRange !== "all") queryParams.append("priceRange", priceRange);
    if (searchQuery) queryParams.append("searchQuery", searchQuery);

    const url = `http://localhost:3000/api/products/filter?${queryParams.toString()}`;

    try {
        const response = await fetch(url, {
          credentials: 'include' // <-- REQUIRED to send cookies
        });
        const data = await response.json();

        if (Array.isArray(data.products) && data.products.length > 0) {
          renderProducts(data.products);
      } else {
          container.innerHTML = "<p>No products found.</p>";
      }
    } catch (error) {
        console.error("Error fetching filtered products:", error);
        container.innerHTML = "<p>Failed to load products.</p>";
    }
});

// Get form element
const searchForm = document.getElementById("search_bar");

// Add submit event listener to the search form
searchForm.addEventListener("submit", async function(event) {
  event.preventDefault();
  
  // Use the same filtering logic but prioritize the search query
  const category = categoryFilter.value;
  const priceRange = priceFilter.value;
  const searchQuery = searchInput.value.trim().toLowerCase();

  const queryParams = new URLSearchParams();
  if (category && category !== "all") queryParams.append("category", category);
  if (priceRange && priceRange !== "all") queryParams.append("priceRange", priceRange);
  if (searchQuery) queryParams.append("searchQuery", searchQuery);

  const url = `http://localhost:3000/api/products/filter?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      credentials: 'include' // <-- REQUIRED to send cookies
    });
    const data = await response.json();

    if (Array.isArray(data.products) && data.products.length > 0) {
      renderProducts(data.products);
  } else {
      container.innerHTML = "<p>No products found matching your search.</p>";
  }
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    container.innerHTML = "<p>Failed to load products.</p>";
  }
});

function renderProducts(productList) {
    container.innerHTML = "";
    productList.forEach(product => {
        const col = document.createElement("div");
        col.className = "col-lg-3 col-sm-6";
        col.innerHTML = `
            <div class="product_box">
                <h4 class="bursh_text">${product.name}</h4>
                <p class="lorem_text">${product.description}</p>
                <img src="${product.images[0]}" class="image_1">
                <div class="btn_main">
                    <div class="buy_bt">
                        <ul>
                            <li><a href="#" onclick="handleBuyClick('${product._id}')">Buy Now</a></li>
                        </ul>
                    </div>
                    <h3 class="price_text">Price $${product.price}</h3>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}


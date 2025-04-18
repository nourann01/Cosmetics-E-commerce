const products = [
  { title: "Beauty Brush", description: "A premium makeup brush", image: "images/img-1.png", price: "$30", category: "Tools & Brushes" },
  { title: "Hair Comb", description: "Smooth and sleek comb", image: "images/img-2.png", price: "$25", category: "Tools & Brushes" },
  { title: "Makeup Kit", description: "Complete cosmetic kit", image: "images/img-3.png", price: "$50", category: "Makeup" },
  { title: "Nail Polish", description: "Glossy finish", image: "images/img-4.png", price: "$10", category: "Makeup" },
  { title: "Face Cream", description: "Moisturizing cream", image: "images/img-5.png", price: "$40", category: "Skincare" },
  { title: "Perfume", description: "Long-lasting fragrance", image: "images/img-6.png", price: "$60", category: "Perfumes" },
  { title: "Lipstick", description: "Vibrant shades", image: "images/img-7.png", price: "$15", category: "Makeup" },
  { title: "Eyeliner", description: "Smooth application", image: "images/img-8.png", price: "$18", category: "Makeup" },
  { title: "Blush", description: "Natural color", image: "images/img-9.png", price: "$22", category: "Makeup" },
  { title: "Foundation", description: "Even skin tone", image: "images/img-10.png", price: "$45", category: "Makeup" },
  { title: "Concealer", description: "Covers imperfections", image: "images/img-11.png", price: "$35", category: "Makeup" },
  { title: "Highlighter", description: "Radiant glow", image: "images/img-12.png", price: "$28", category: "Makeup" },
];

document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("productContainer");

  function renderProducts(productList) {
      container.innerHTML = "";
      productList.forEach(product => {
          const col = document.createElement("div");
          col.className = "col-lg-3 col-sm-6";
          col.innerHTML = `
              <div class="product_box">
                  <h4 class="bursh_text">${product.title}</h4>
                  <p class="lorem_text">${product.description}</p>
                  <img src="${product.image}" class="image_1">
                  <div class="btn_main">
                      <div class="buy_bt">
                          <ul>
                              <li class="active"><a href="#">Buy Now</a></li>
                              <li><a href="#">Buy Now</a></li>
                          </ul>
                      </div>
                      <h3 class="price_text">Price ${product.price}</h3>
                  </div>
              </div>
          `;
          container.appendChild(col);
      });
  }

  // Initial render
  renderProducts(products);

  // Search filter
  const searchForm = document.getElementById("search_bar");
  const searchInput = document.getElementById("productSearchInput");

  searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const query = searchInput.value.trim().toLowerCase();
      const filtered = products.filter(p =>
          p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
      );
      renderProducts(filtered);
  });

  // Filter by category and price
  function applyFilters() {
      const category = document.getElementById("categoryFilter").value;
      const priceRange = document.getElementById("priceFilter").value;

      let filtered = [...products];

      if (category) {
          filtered = filtered.filter(p => p.category === category);
      }

      if (priceRange) {
          const [min, max] = priceRange.split("-").map(Number);
          filtered = filtered.filter(p => {
              const priceNum = parseFloat(p.price.replace("$", ""));
              return priceNum >= min && priceNum <= max;
          });
      }

      renderProducts(filtered);
  }

  // Attach filter event listeners
  document.getElementById("filter_apply_button").addEventListener("click", applyFilters);
  document.getElementById("priceFilter").addEventListener("change", applyFilters);
});

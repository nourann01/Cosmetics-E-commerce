// const products = [
//     { title: "Beauty Brush", description: "A premium makeup brush", image: "images/img-1.png", price: "$30", category: "Tools & Brushes", brand:"Huda Beauty" },
//     { title: "Hair Comb", description: "Smooth and sleek comb", image: "images/img-2.png", price: "$25", category: "Tools & Brushes", brand:"Huda Beauty" },
//     { title: "Makeup Kit", description: "Complete cosmetic kit", image: "images/img-3.png", price: "$50", category: "Makeup", brand:"Elf" },
//     { title: "Nail Polish", description: "Glossy finish", image: "images/img-4.png", price: "$10", category: "Makeup", brand:"Essie" },
//     { title: "Face Cream", description: "Moisturizing cream", image: "images/img-5.png", price: "$40", category: "Skincare", brand:"Rose" },
//     { title: "Perfume", description: "Long-lasting fragrance", image: "images/img-6.png", price: "$60", category: "Perfumes", brand:"Chanel" },
//     { title: "Lipstick", description: "Vibrant shades", image: "images/img-7.png", price: "$15", category: "Makeup", brand:"Chanel" },
//     { title: "Eyeliner", description: "Smooth application", image: "images/img-8.png", price: "$18", category: "Makeup", brand:"Dior" },
//     { title: "Blush", description: "Natural color", image: "images/img-9.png", price: "$22", category: "Makeup", brand:"Sheglam" },
//     { title: "Foundation", description: "Even skin tone", image: "images/img-10.png", price: "$45", category: "Makeup", brand:"Chanel" },
//     { title: "Concealer", description: "Covers imperfections", image: "images/img-11.png", price: "$35", category: "Makeup", brand:"NARS" },
//     { title: "Highlighter", description: "Radiant glow", image: "images/img-12.png", price: "$28", category: "Makeup", brand:"Elf" },
//   ];
  
//   document.addEventListener("DOMContentLoaded", function () {
//     const container = document.getElementById("productContainer");
  
//     function renderProducts(productList) {
//         container.innerHTML = "";
//         productList.forEach(product => {
//             const col = document.createElement("div");
//             col.className = "col-lg-3 col-sm-6";
//             col.innerHTML = `
//                 <div class="product_box">
//                     <h4 class="bursh_text">${product.title}</h4>
//                     <p class="lorem_text">${product.description}</p>
//                     <img src="${product.image}" class="image_1">
//                     <div class="btn_main">
//                         <div class="buy_bt">
//                             <ul>
//                                 <li><a href="#" onclick="handleBuyClick('${product.title}')">Buy Now</a></li>
//                             </ul>
//                         </div>
//                         <h3 class="price_text">Price ${product.price}</h3>
//                     </div>
//                 </div>
//             `;
//             container.appendChild(col);
//         });
//     }
  
//     // Initial render
//     renderProducts(products);
  
//     // Get references to search and filter elements
//     const searchInput = document.getElementById("productSearchInput");
//     const categoryFilter = document.getElementById("categoryFilter");
//     const priceFilter = document.getElementById("priceFilter");
//     const brandFilter = document.getElementById("brand");
  
//     let searchQuery = "";
//     let category = "";
//     let priceRange = "";
//     let brand = "";
  
//     // Function to filter and render products based on search and filters
//     function applyFilters() {
//         let filtered = [...products];
  
//         // Apply category filter
//         if (category && category !== "all") {
//             filtered = filtered.filter(p => p.category === category);
//         }
  
//         // Apply price range filter
//         if (priceRange && priceRange !== "all") {
//             const [min, max] = priceRange.split("-").map(Number);
//             filtered = filtered.filter(p => {
//                 const priceNum = parseFloat(p.price.replace("$", ""));
//                 return priceNum >= min && priceNum <= max;
//             });
//         }
  
//         // Apply brand filter
//         if (brand && brand !== "all") {
//             filtered = filtered.filter(p => p.brand === brand);
//         }
  
//         // Apply search filter
//         if (searchQuery) {
//             filtered = filtered.filter(p =>
//                 p.title.toLowerCase().includes(searchQuery) || p.description.toLowerCase().includes(searchQuery)
//             );
//         }
  
//         // Render the filtered products
//         renderProducts(filtered);
//     }
  
//     // Search functionality
//     const searchForm = document.getElementById("search_bar");
  
//     searchForm.addEventListener("submit", function (e) {
//         e.preventDefault();
//         searchQuery = searchInput.value.trim().toLowerCase();
//         applyFilters();  // Re-apply filters after search query change
//     });
  
//     // Filter functionality
//     function handleFilterChange() {
//         category = categoryFilter.value;
//         priceRange = priceFilter.value;
//         brand = brandFilter.value;
//         applyFilters();  // Re-apply filters after any filter change
//     }
  
//     // Apply filters when the "Apply Filters" button is clicked
//     document.getElementById("filter_apply_button").addEventListener("click", handleFilterChange);  
//   });


document.addEventListener("DOMContentLoaded", async function () {
    const container = document.getElementById("productContainer");
  
    let allProducts = [];
  
    async function loadProductsFromAPI() {
        try {
          const res = await fetch('http://localhost:3000/api/product_get_all');
          const data = await res.json();
          renderProducts(data || []);
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
      
  
    // Load the products initially
    await loadProductsFromAPI();

  });
  
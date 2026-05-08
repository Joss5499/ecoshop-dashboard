// ===============================
// INVENTARIO
// ===============================

const initialProducts = [

    {
        id: 1,
        nombre: "Laptop Gamer",
        precio: 3500,
        categoria: "tecnologia",
        stock: 5,
        imagen: "https://picsum.photos/400?1",
        descripcion: "Laptop potente RTX."
    },

    {
        id: 2,
        nombre: "Silla Gamer",
        precio: 1200,
        categoria: "hogar",
        stock: 4,
        imagen: "https://picsum.photos/400?2",
        descripcion: "Silla premium ergonómica."
    },

    {
        id: 3,
        nombre: "Balón Adidas",
        precio: 150,
        categoria: "deportes",
        stock: 8,
        imagen: "https://picsum.photos/400?3",
        descripcion: "Balón profesional."
    },

    {
        id: 4,
        nombre: "SmartWatch",
        precio: 900,
        categoria: "tecnologia",
        stock: 6,
        imagen: "https://picsum.photos/400?4",
        descripcion: "Reloj inteligente."
    },

    {
        id: 5,
        nombre: "Cafetera Espresso",
        precio: 800,
        categoria: "hogar",
        stock: 3,
        imagen: "https://picsum.photos/400?5",
        descripcion: "Cafetera automática."
    },

    {
        id: 6,
        nombre: "Zapatillas Running",
        precio: 250,
        categoria: "deportes",
        stock: 10,
        imagen: "https://picsum.photos/400?6",
        descripcion: "Zapatillas cómodas para correr."
    }

];

// ===============================
// LOCAL STORAGE
// ===============================

let inventario =
JSON.parse(
    localStorage.getItem("inventario")
)
|| initialProducts;

let carrito =
JSON.parse(
    localStorage.getItem("carrito")
)
|| [];

// If old format, convert
if(carrito.length > 0 && typeof carrito[0] === 'object' && !carrito[0].quantity){
    carrito = carrito.map(product => ({product, quantity: 1}));
}

// ===============================
// DOM
// ===============================

const productsContainer =
document.getElementById("productsContainer");

const searchInput =
document.getElementById("searchInput");

const filterButtons =
document.querySelectorAll(".filter-btn");

const productDetail =
document.getElementById("productDetail");

const totalProducts =
document.getElementById("totalProducts");

const inventoryValue =
document.getElementById("inventoryValue");

const soldOut =
document.getElementById("soldOut");

const toast =
document.getElementById("toast");

const cartBtn =
document.getElementById("cartBtn");

const cartModal =
document.getElementById("cartModal");

const closeCart =
document.getElementById("closeCart");

const cartItems =
document.getElementById("cartItems");

const cartTotal =
document.getElementById("cartTotal");

const cartCount =
document.getElementById("cartCount");

const themeBtn =
document.getElementById("themeBtn");

const priceFilterButtons =
document.querySelectorAll(".price-filter-btn");

const addCategoryBtn =
document.getElementById("addCategoryBtn");

const newCategoryInput =
document.getElementById("newCategoryInput");

const categoryGroup =
document.getElementById("categoryGroup");

const productCategorySelect =
document.getElementById("productCategory");

let extraCategories =
JSON.parse(
    localStorage.getItem("extraCategories")
) || [];

// ===============================
// ESTADO
// ===============================

let currentCategory = "todos";

let currentPriceFilter = "todos";

// ===============================
// INIT
// ===============================

renderProducts();
updateDashboard();
renderCart();

renderExtraCategories();

addCategoryBtn.addEventListener("click", addNewCategory);

newCategoryInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter"){
        e.preventDefault();
        addNewCategory();
    }
});

// ===============================
// RENDER PRODUCTOS
// ===============================

function renderProducts(){

    productsContainer.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

    setTimeout(() => {

        productsContainer.innerHTML = "";

        let filtered = inventario;

// FILTRO CATEGORIA
    if(currentCategory !== "todos"){

        filtered = filtered.filter(
            product =>
            product.categoria === currentCategory
        );
    }

    // FILTRO PRECIO
    if(currentPriceFilter !== "todos"){

        filtered = filtered.filter(product => {

            if(currentPriceFilter === "bajo") return product.precio < 500;

            if(currentPriceFilter === "medio") return product.precio >= 500 && product.precio <= 2000;

            if(currentPriceFilter === "alto") return product.precio > 2000;

        });
        }

        // BUSCADOR
        filtered = filtered.filter(product =>
            product.nombre
            .toLowerCase()
            .includes(
                searchInput.value.toLowerCase()
            )
        );

        // CREAR TARJETAS
        filtered.forEach(product => {

            const card =
            document.createElement("div");

            card.classList.add("product-card");

            if(product.stock === 0){

                card.classList.add("agotado");
            }

            card.innerHTML = `
            
                <img src="${product.imagen}">

                <div class="product-info">

                    <h3>
                        ${product.nombre}
                    </h3>

                    <p>
                        ${product.descripcion}
                    </p>

                    <span>
                        S/${product.precio}
                    </span>

                    <small>
                        Stock:
                        ${product.stock}
                    </small>

                    ${
                        product.stock === 0
                        ?
                        `<div class="sold">
                            AGOTADO
                        </div>`
                        :
                        ""
                    }

                    <button
                        ${product.stock === 0
                        ? "disabled"
                        : ""}
                    >
                        Comprar
                    </button>

                </div>
            
            `;

            // DETALLE
            card.addEventListener("click", () => {

                showDetail(product);

            });

            // COMPRAR
            const btn =
            card.querySelector("button");

            btn.addEventListener("click", (e) => {

                e.stopPropagation();

                buyProduct(product.id);

            });

            productsContainer.appendChild(card);

        });

    }, 500); // Simulate loading time

}

// ===============================
// COMPRAR
// ===============================

function buyProduct(id){

    const product = inventario.find(p => p.id === id);

    if(product && product.stock > 0){

        product.stock--;

        // Check if already in cart
        const existing = carrito.find(item => item.product.id === id);

        if(existing){
            existing.quantity++;
        } else {
            carrito.push({product, quantity: 1});
        }

        showToast(
            "🛒 Producto agregado"
        );

        saveData();

        renderProducts();

        updateDashboard();

        renderCart();
    }
}

// ===============================
// DETALLE
// ===============================

function showDetail(product){

    productDetail.innerHTML = `
    
        <img src="${product.imagen}">

        <h2>
            ${product.nombre}
        </h2>

        <p>
            ${product.descripcion}
        </p>

        <h3>
            S/${product.precio}
        </h3>

        <small>
            Categoría:
            ${product.categoria}
        </small>
    
    `;
}

// ===============================
// DASHBOARD
// ===============================

function updateDashboard(){

    totalProducts.textContent =
    inventario.length;

    const total =
    inventario.reduce((acc, product)=>{

        return acc +
        (product.precio * product.stock);

    },0);

    inventoryValue.textContent =
    `S/${total}`;

    soldOut.textContent =
    inventario.filter(
        p => p.stock === 0
    ).length;
}

// ===============================
// CARRITO
// ===============================

function renderCart(){

    cartItems.innerHTML = "";

    let total = 0;

    carrito.forEach((item, index) => {

        const {product, quantity} = item;

        total += product.precio * quantity;

        const itemDiv = document.createElement("div");
        itemDiv.classList.add("cart-item");

        itemDiv.innerHTML = `
        
            <img src="${product.imagen}">

            <div class="cart-item-info">

                <h4>
                    ${product.nombre}
                </h4>

                <p>
                    S/${product.precio}
                </p>

                <div class="quantity-controls">

                    <button class="qty-btn" data-action="decrease" data-index="${index}">-</button>

                    <span class="qty">${quantity}</span>

                    <button class="qty-btn" data-action="increase" data-index="${index}">+</button>

                </div>

            </div>

            <button class="remove-btn" data-index="${index}">✖</button>
        
        `;

        cartItems.appendChild(itemDiv);
    });

    cartTotal.textContent =
    `S/${total}`;

    cartCount.textContent =
    carrito.reduce((acc, item) => acc + item.quantity, 0);

    document.querySelectorAll(".qty-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const action = e.target.dataset.action;
            const index = parseInt(e.target.dataset.index);
            adjustQuantity(index, action);
        });
    });

    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = parseInt(e.target.dataset.index);
            removeFromCart(index);
        });
    });
}

function normalizeCategory(value){
    return value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");
}

function saveCategories(){
    localStorage.setItem(
        "extraCategories",
        JSON.stringify(extraCategories)
    );
}

function createCategoryButton(categoryValue){
    const button = document.createElement("button");
    button.className = "filter-btn";
    button.dataset.category = categoryValue;
    button.textContent =
        categoryValue
        .split("-")
        .map(word => word[0].toUpperCase() + word.slice(1))
        .join(" ");

    button.addEventListener("click", ()=>{
        document.querySelectorAll(".filter-btn").forEach(
            b => b.classList.remove("active")
        );

        button.classList.add("active");
        currentCategory = categoryValue;
        renderProducts();
    });

    categoryGroup.appendChild(button);
}

function addCategoryToSelect(categoryValue){
    const option = document.createElement("option");
    option.value = categoryValue;
    option.textContent =
        categoryValue
        .split("-")
        .map(word => word[0].toUpperCase() + word.slice(1))
        .join(" ");
    productCategorySelect.appendChild(option);
}

function renderExtraCategories(){
    extraCategories.forEach(category => {
        createCategoryButton(category);
        addCategoryToSelect(category);
    });
}

function addNewCategory(){
    const raw = newCategoryInput.value;
    const category = normalizeCategory(raw);

    if(!category){
        showToast("Ingresa una categoría válida");
        return;
    }

    const baseCategories = ["todos", "tecnologia", "hogar", "deportes"];

    if(baseCategories.includes(category) || extraCategories.includes(category)){
        showToast("La categoría ya existe");
        return;
    }

    extraCategories.push(category);
    saveCategories();
    createCategoryButton(category);
    addCategoryToSelect(category);
    newCategoryInput.value = "";
    showToast("Categoría agregada");
}

// ===============================
// FILTROS
// ===============================

filterButtons.forEach(btn => {

    btn.addEventListener("click", ()=>{

        filterButtons.forEach(
            b => b.classList.remove("active")
        );

        btn.classList.add("active");

        currentCategory =
        btn.dataset.category;

        renderProducts();

    });

});

priceFilterButtons.forEach(btn => {

    btn.addEventListener("click", ()=>{

        priceFilterButtons.forEach(
            b => b.classList.remove("active")
        );

        btn.classList.add("active");

        currentPriceFilter =
        btn.dataset.price;

        renderProducts();

    });

});

// ===============================
// BUSCADOR
// ===============================

searchInput.addEventListener(
    "input",
    renderProducts
);

// ===============================
// KEYBOARD SHORTCUTS
// ===============================

document.addEventListener("keydown", (e) => {

    if(e.key === "Escape"){

        cartModal.style.display = "none";

    }

    if(e.ctrlKey && e.key === "k"){

        e.preventDefault();

        searchInput.focus();

    }

    if(e.ctrlKey && e.key === "t"){

        e.preventDefault();

        document.body.classList.toggle("dark");

    }

});

const checkoutBtn =
document.getElementById("checkoutBtn");

const addProductBtn =
document.getElementById("addProductBtn");

const addProductModal =
document.getElementById("addProductModal");

const closeAddModal =
document.getElementById("closeAddModal");

const addProductForm =
document.getElementById("addProductForm");

// ===============================
// MODAL
// ===============================

cartBtn.addEventListener("click", ()=>{

    cartModal.style.display = "flex";

});

closeCart.addEventListener("click", ()=>{

    cartModal.style.display = "none";

});

// ===============================
// MODAL AÑADIR PRODUCTO
// ===============================

addProductBtn.addEventListener("click", ()=>{

    addProductModal.style.display = "flex";

});

closeAddModal.addEventListener("click", ()=>{

    addProductModal.style.display = "none";

});

// ===============================
// FORM AÑADIR PRODUCTO
// ===============================

addProductForm.addEventListener("submit", (e)=>{

    e.preventDefault();

    const name = document.getElementById("productName").value;

    const price = parseFloat(document.getElementById("productPrice").value);

    const category = document.getElementById("productCategory").value;

    const stock = parseInt(document.getElementById("productStock").value);

    const image = document.getElementById("productImage").value;

    const description = document.getElementById("productDescription").value;

    const newProduct = {

        id: Date.now(), // Simple ID

        nombre: name,

        precio: price,

        categoria: category,

        stock: stock,

        imagen: image,

        descripcion: description

    };

    inventario.push(newProduct);

    saveData();

    renderProducts();

    updateDashboard();

    addProductForm.reset();

    addProductModal.style.display = "none";

    showToast("Producto añadido exitosamente");

});

// ===============================
// CHECKOUT
// ===============================

checkoutBtn.addEventListener("click", ()=>{

    if(carrito.length === 0){

        showToast("El carrito está vacío");

        return;

    }

    // Confirmar compra
    const total = carrito.reduce((acc, item) => acc + item.product.precio * item.quantity, 0);

    showToast(`Compra confirmada por S/${total}!`);

    carrito = [];

    saveData();

    renderCart();

    cartModal.style.display = "none";

});

// ===============================
// DARK MODE
// ===============================

themeBtn.addEventListener("click", ()=>{

    document.body.classList.toggle("dark");

});

// ===============================
// TOAST
// ===============================

function showToast(message){

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2000);
}

// ===============================
// AJUSTAR CANTIDAD
// ===============================

function adjustQuantity(index, action){

    const item = carrito[index];

    if(action === 'increase'){

        if(item.product.stock > 0){

            item.quantity++;

            item.product.stock--;

        } else {

            showToast("No hay más stock");

            return;

        }

    } else if(action === 'decrease'){

        if(item.quantity > 1){

            item.quantity--;

            item.product.stock++;

        } else {

            removeFromCart(index);

            return;

        }

    }

    saveData();

    renderProducts();

    updateDashboard();

    renderCart();

}

// ===============================
// REMOVER DEL CARRITO
// ===============================

function removeFromCart(index){

    const item = carrito[index];

    // Return stock
    item.product.stock += item.quantity;

    carrito.splice(index, 1);

    saveData();

    renderProducts();

    updateDashboard();

    renderCart();

    showToast("Producto removido del carrito");

}

// ===============================
// SAVE
// ===============================

function saveData(){

    localStorage.setItem(
        "inventario",
        JSON.stringify(inventario)
    );

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );
}
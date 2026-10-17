const products = [
  {id:1,name:"PC Gamer Ryzen 5 + RTX 3060",category:"PC Gamer",price:3499.90,emoji:"🖥️",tag:"MAIS VENDIDO",rating:"★★★★★",reviews:124},
  {id:2,name:"Teclado Mecânico RGB",category:"Periféricos",price:299.90,emoji:"⌨️",tag:"OFERTA",rating:"★★★★★",reviews:89},
  {id:3,name:"Headset Gamer Surround",category:"Áudio",price:349.90,emoji:"🎧",tag:"POPULAR",rating:"★★★★★",reviews:67},
  {id:4,name:"Placa de Vídeo RTX 4060 8GB",category:"Hardware",price:1999.90,emoji:"🎛️",tag:"DESTAQUE",rating:"★★★★★",reviews:52},
  {id:5,name:"Console PlayStation 5",category:"Consoles",price:4199.90,emoji:"🎮",tag:"DESTAQUE",rating:"★★★★★",reviews:201},
  {id:6,name:"Mouse Gamer  RGB 12800 DPI",category:"Periféricos",price:159.90,emoji:"🖱️",tag:"CUSTO-BENEFÍCIO",rating:"★★★★☆",reviews:76},
  {id:7,name:"Memória RAM 16GB RGB",category:"Hardware",price:279.90,emoji:"▥",tag:"UPGRADE",rating:"★★★★★",reviews:43},
  {id:8,name:"Controle Wireless Gamer",category:"Acessórios",price:229.90,emoji:"🎮",tag:"NOVO",rating:"★★★★☆",reviews:38}
];

const money = value => value.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const productGrid = document.querySelector("#productGrid");
const searchInput = document.querySelector("#search");
const sortSelect = document.querySelector("#sort");
const emptyState = document.querySelector("#empty");
const resultCount = document.querySelector("#resultCount");
const cartOverlay = document.querySelector("#cartOverlay");
const cartItems = document.querySelector("#cartItems");
const cartCount = document.querySelector("#cartCount");
const subtotal = document.querySelector("#subtotal");
const toast = document.querySelector("#toast");
let activeCategory = "Todos";
let cart = [];
let toastTimer;

function getVisibleProducts() {
  const term = searchInput.value.trim().toLocaleLowerCase("pt-BR");
  let list = products.filter(product => {
    const categoryMatch = activeCategory === "Todos" || product.category === activeCategory;
    const textMatch = `${product.name} ${product.category}`.toLocaleLowerCase("pt-BR").includes(term);
    return categoryMatch && textMatch;
  });
  switch (sortSelect.value) {
    case "low": list.sort((a,b) => a.price - b.price); break;
    case "high": list.sort((a,b) => b.price - a.price); break;
    case "name": list.sort((a,b) => a.name.localeCompare(b.name,"pt-BR")); break;
  }
  return list;
}

function renderProducts() {
  const list = getVisibleProducts();
  resultCount.textContent = `${list.length} ${list.length === 1 ? "produto" : "produtos"}`;
  emptyState.hidden = list.length > 0;
  productGrid.innerHTML = list.map(product => `
    <article class="product-card">
      <div class="product-art"><span class="tag">${product.tag}</span><span class="product-emoji" aria-hidden="true">${product.emoji}</span></div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <div class="rating">${product.rating} <span>(${product.reviews})</span></div>
        <div class="price">${money(product.price)}</div>
        <div class="installments">ou 12x de ${money(product.price / 12)}</div>
        <button class="add-cart" data-add="${product.id}">🛒 &nbsp; Adicionar ao carrinho</button>
      </div>
    </article>`).join("");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function addToCart(id) {
  const item = cart.find(row => row.id === id);
  if (item) item.quantity += 1;
  else cart.push({id,quantity:1});
  renderCart();
  showToast("Produto adicionado ao carrinho!");
}

function renderCart() {
  const totalItems = cart.reduce((sum,item) => sum + item.quantity,0);
  const totalPrice = cart.reduce((sum,item) => {
    const product = products.find(product => product.id === item.id);
    return sum + product.price * item.quantity;
  },0);
  cartCount.textContent = totalItems;
  subtotal.textContent = money(totalPrice);
  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty">Seu carrinho está vazio.<br>Adicione produtos para continuar.</p>';
    return;
  }
  cartItems.innerHTML = cart.map(item => {
    const product = products.find(product => product.id === item.id);
    return `<div class="cart-row"><div><strong>${product.name}</strong><small>${item.quantity} × ${money(product.price)}</small></div><div><strong>${money(product.price * item.quantity)}</strong><br><button data-remove="${product.id}">Remover</button></div></div>`;
  }).join("");
}

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});
cartItems.addEventListener("click", event => {
  const button = event.target.closest("[data-remove]");
  if (!button) return;
  cart = cart.filter(item => item.id !== Number(button.dataset.remove));
  renderCart();
});
document.querySelectorAll(".category").forEach(button => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    document.querySelectorAll(".category").forEach(item => item.classList.toggle("active", item === button));
    renderProducts();
  });
});
searchInput.addEventListener("input", renderProducts);
sortSelect.addEventListener("change", renderProducts);
document.querySelector("#openCart").addEventListener("click", () => { cartOverlay.hidden = false; });
document.querySelector("#closeCart").addEventListener("click", () => { cartOverlay.hidden = true; });
cartOverlay.addEventListener("click", event => { if (event.target === cartOverlay) cartOverlay.hidden = true; });
document.querySelector("#checkout").addEventListener("click", () => showToast("Checkout demonstrativo: conecte um meio de pagamento para vender de verdade."));
document.querySelector("#menuToggle").addEventListener("click", () => {
  const nav = document.querySelector("#nav");
  nav.classList.toggle("open");
  document.querySelector("#menuToggle").setAttribute("aria-expanded", nav.classList.contains("open"));
});
document.querySelectorAll("#nav a").forEach(link => link.addEventListener("click", () => document.querySelector("#nav").classList.remove("open")));
document.querySelector("#year").textContent = new Date().getFullYear();
renderProducts();
renderCart();

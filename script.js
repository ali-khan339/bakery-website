const h = new Date().getHours();
document.getElementById('openStatus').textContent =
  (h >= 9 && h < 23) ? "🟢 Abhi khula hai" : "🔴 Abhi band hai, subah 9 baje khulenge";

  // Menu ka data
const items = [
  {id:1, name:"Chocolate Cake", cat:"bakery", price:250, emoji:"🍰", desc:"Soft sponge, gehri chocolate cream."},
  {id:2, name:"Butter Croissant", cat:"bakery", price:180, emoji:"🥐", desc:"Karari parat, makhan ki khushboo."},
  {id:3, name:"Chocolate Chip Cookies", cat:"bakery", price:150, emoji:"🍪", desc:"Paanch cookies ka pack."},
  {id:4, name:"Cinnamon Roll", cat:"bakery", price:220, emoji:"🥮", desc:"Garam, meethi, icing ke saath."},
  {id:5, name:"Doodh Patti Chai", cat:"cafe", price:100, emoji:"☕", desc:"Dera wali kadak chai."},
  {id:6, name:"Cappuccino", cat:"cafe", price:350, emoji:"☕", desc:"Double shot, jhaagdaar doodh."},
  {id:7, name:"Club Sandwich", cat:"cafe", price:420, emoji:"🥪", desc:"Chicken, egg, salad, fries."},
  {id:8, name:"Pasta", cat:"cafe", price:550, emoji:"🍝", desc:"Creamy white sauce pasta."},
  {id:9, name:"Mango Shake", cat:"cold", price:280, emoji:"🥭", desc:"Taza aam, thanda doodh."},
  {id:10, name:"Cold Coffee", cat:"cold", price:320, emoji:"🧋", desc:"Ice cream ke saath."},
  {id:11, name:"Lemon Mint Margarita", cat:"cold", price:200, emoji:"🍋", desc:"Pudina aur nimbu, bilkul thanda."}
];

const grid = document.getElementById('menuGrid');

// Cards banana
function showMenu(cat){
  grid.innerHTML = "";
  items.filter(i => cat === "all" || i.cat === cat).forEach(i => {
    const card = document.createElement('div');
    card.className = 'item';
    card.innerHTML = `
      <div class="emoji">${i.emoji}</div>
      <h3>${i.name}</h3>
      <p>${i.desc}</p>
      <div class="row">
        <span class="price">Rs. ${i.price}</span>
        <button class="add" data-id="${i.id}">Add</button>
      </div>`;
    grid.appendChild(card);
  });
}

// Tabs par click
document.getElementById('tabs').addEventListener('click', e => {
  const tab = e.target.closest('.tab');
  if(!tab) return;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  showMenu(tab.dataset.cat);
});

showMenu("all");

// ===== Cart =====
let cart = {};   // {id: quantity}

// Add button
grid.addEventListener('click', e => {
  const btn = e.target.closest('.add');
  if(!btn) return;
  const id = btn.dataset.id;
  cart[id] = (cart[id] || 0) + 1;
  updateCart();
  btn.textContent = "Added ✓";
  setTimeout(() => btn.textContent = "Add", 800);
});

// Cart dobara banana
function updateCart(){
  const list = document.getElementById('cartItems');
  list.innerHTML = "";
  let total = 0, count = 0;
  for(const id in cart){
    const item = items.find(i => i.id == id);
    total += item.price * cart[id];
    count += cart[id];
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.name}<br><small>Rs. ${item.price}</small></span>
      <span class="qty">
        <button data-act="minus" data-id="${id}">−</button>
        ${cart[id]}
        <button data-act="plus" data-id="${id}">+</button>
      </span>`;
    list.appendChild(li);
  }
  if(count === 0) list.innerHTML = "<li>Cart khali hai.</li>";
  document.getElementById('cartTotal').textContent = total;
  document.getElementById('cartCount').textContent = count;
}

// + aur − buttons
document.getElementById('cartItems').addEventListener('click', e => {
  const b = e.target.closest('button');
  if(!b) return;
  const id = b.dataset.id;
  if(b.dataset.act === 'plus') cart[id]++;
  else { cart[id]--; if(cart[id] <= 0) delete cart[id]; }
  updateCart();
});

// Kholna, band karna, order
const cartEl = document.getElementById('cart');
document.getElementById('cartBtn').onclick = () => cartEl.classList.add('open');
document.getElementById('closeCart').onclick = () => cartEl.classList.remove('open');
document.getElementById('checkout').onclick = () => {
  if(Object.keys(cart).length === 0){ alert("Pehle kuch add karein."); return; }
  alert("Shukriya! Total: Rs. " + document.getElementById('cartTotal').textContent);
  cart = {}; updateCart(); cartEl.classList.remove('open');
};

updateCart();

// ===== About: numbers ginti =====
const counters = document.querySelectorAll('[data-target]');
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if(!en.isIntersecting) return;
    const el = en.target, target = +el.dataset.target;
    let n = 0; const step = Math.ceil(target / 40);
    const t = setInterval(() => {
      n = Math.min(n + step, target);
      el.textContent = n + (target >= 40 ? "+" : "");
      if(n >= target) clearInterval(t);
    }, 30);
    io.unobserve(el);
  });
}, {threshold:.5});
counters.forEach(c => io.observe(c));

// ===== Contact form =====
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();   // page refresh na ho
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const message = document.getElementById('message').value.trim();
  const box = document.getElementById('formMsg');

  if(!name || !message){
    box.className = "msg err"; box.textContent = "Naam aur message likhna zaroori hai."; return;
  }
  if(!/^03\d{2}-?\d{7}$/.test(phone)){
    box.className = "msg err"; box.textContent = "Sahi phone number likhein, jaise 0300-1234567."; return;
  }
  box.className = "msg ok"; box.textContent = "Shukriya " + name + "! Hum jald rabta karenge.";
  e.target.reset();
});

// Footer mein saal
document.getElementById('year').textContent = new Date().getFullYear();
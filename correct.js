document.addEventListener('DOMContentLoaded', () => {
  const btnCart = document.querySelector('.btn-cart');
  const cart = document.querySelector('.cart');
  const btnClose = document.querySelector('#cart-close');
  const container = document.querySelector('.container');

  btnCart.addEventListener('click', () => {
      cart.classList.add('cart-active');
      container.classList.add('container-cart-active');
  });

  btnClose.addEventListener('click', () => {
      cart.classList.remove('cart-active');
      container.classList.remove('container-cart-active');
  });

  // Clear cart items from sessionStorage on page load
  sessionStorage.removeItem('cartItems');
  
  loadfood();
});

function loadfood() {
  loadContent();
}

function loadContent() {
  const btnRemove = document.querySelectorAll('.cart-remove');
  btnRemove.forEach((btn) => {
      btn.addEventListener('click', removeItem);
  });

  const qtyElements = document.querySelectorAll('.cart-quantity');
  qtyElements.forEach((input) => {
      input.addEventListener('change', changeQty);
  });

  const cartBtns = document.querySelectorAll('.add-cart');
  cartBtns.forEach((btn) => {
      btn.addEventListener('click', addCart);
  });
  updateTotal();
}

function removeItem() {
  if (confirm('Do you want to remove it?')) {
      const title = this.parentElement.querySelector('.cart-food-title').innerText;
      itemList = itemList.filter(el => el.title != title);
      this.parentElement.remove();
      saveCartToSessionStorage();
      loadContent();
  }
}

function changeQty() {
  if (isNaN(this.value) || this.value < 1) {
      this.value = 1;
  }
  saveCartToSessionStorage();
  updateTotal();
}

let itemList = [];

function addCart() {
  const food = this.parentElement;
  const title = food.querySelector('.food-title').innerText;
  const price = food.querySelector('.food-price').innerText;
  const imgSrc = food.querySelector('.food-img').src;

  const newProduct = { title, price, imgSrc };

  // Check if the product is already in the cart
  const productExists = itemList.some(item => item.title === newProduct.title);

  if (productExists) {
    alert('هذا المنتج موجود ضمن السلةو يمكنك زيادة عدد القطع من داخل السلة');
    return; // Prevent adding the product again
  }

  // Add the product to the itemList

 {
      itemList.push(newProduct);
  }

  const newProductElement = createCartProduct(title, price, imgSrc);
  const element = document.createElement('div');
  element.innerHTML = newProductElement;
  const cartBasket = document.querySelector('.cart-content');
  cartBasket.append(element);

  saveCartToSessionStorage();
  loadContent();
}

function createCartProduct(title, price, imgSrc) {
  return `
   <div class="cart-box">
      <img src="${imgSrc}" class="cart-img">
      <div class="detail-box">
          <div class="cart-food-title">${title}</div>
          <div class="price-box">
              <div class="cart-price">${price}</div>
              <div class="cart-amt">${price}</div>
          </div>
          <h5><input type="number" value="1" class="cart-quantity"> قطعة</h5>
      </div>
      <i class="fa fa-trash cart-remove"></i>
   </div>
  `;
}

function updateTotal() {
  const cartItems = document.querySelectorAll('.cart-box');
  const totalValue = document.querySelector('.total-price');

  let total = 0;
  cartItems.forEach(product => {
      const priceElement = product.querySelector('.cart-price');
      const priceText = priceElement.innerText;
      const price = parseFloat(priceText.replace(/[^\d.-]/g, ''));  // Extract numeric value from price string
      const qty = product.querySelector('.cart-quantity').value;
      total += (price * qty);
      product.querySelector('.cart-amt').innerHTML = "Dnr." + (price * qty).toFixed();
  });

  // Convert total to string and remove '.00' if it exists
  let totalString = total.toFixed().replace(/\.00$/, '');

  totalValue.innerHTML = totalString + ' / Dinar.' ;

  const cartCount = document.querySelector('.cart-count');
  const count = cartItems.length;
  cartCount.innerHTML = count;

  if (count == 0) {
      cartCount.style.display = 'none';
  } else {
      cartCount.style.display = 'block';
  }
}

function saveCartToSessionStorage() {
  sessionStorage.setItem('cartItems', JSON.stringify(itemList));
}

const items = document.querySelector('.items');
const cartItems = document.querySelector('.cart__items');
const emptyCart = document.querySelector('.empty-cart');

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
};

const getSkuFromProductItem = (item) => item.querySelector('span.item__sku').innerText;

const cartItemClickListener = (event) => {
  cartItems.removeChild(event.target);
  saveCartItems(cartItems.innerHTML);
};

const emptyCartClickListener = () => {
  emptyCart.addEventListener('click', () => {
    cartItems.innerHTML = '';
  });
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const skuToCart = async (button) => {
  const sku = button.parentElement.querySelector('.item__sku').innerText;
  const product = await fetchItem(sku);
  const data = { sku: product.id, name: product.title, salePrice: product.price };
  cartItems.appendChild(createCartItemElement(data));
  saveCartItems(cartItems.innerHTML);
};

const addCartBtn = () => {
  const buttonAdd = document.querySelectorAll('.item__add');
  buttonAdd.forEach((btn) => btn.addEventListener('click', () => {
    skuToCart(btn);
  }));
};

const reqApi = async () => {
  const products = await fetchProducts('computador');
  products.results.forEach((item) => {
  const { id, title, thumbnail } = item;
  const createItem = createProductItemElement({
    sku: id,
    name: title,
    image: thumbnail,
  });
  items.appendChild(createItem);
  });
  addCartBtn();
  emptyCartClickListener();
};

const getItemsLocalStorage = () => {
  const get = getSavedCartItems();
  cartItems.innerHTML = get;
};

const getAllEvents = () => {
  const liCartItem = document.querySelectorAll('.cart__item');
  liCartItem.forEach((element) => {
    element.addEventListener('click', cartItemClickListener);
  });
};

const loading = () => {
  const loadingText = document.createElement('h3');
  loadingText.innerText = 'carregando...';
  loadingText.classList = 'loading';
  const body = document.querySelector('body');
  body.appendChild(loadingText);
  items.style.display = 'none';
  setTimeout(async () => {
    items.style.display = 'flex';
    loadingText.style.display = 'flex';
    await reqApi();
    body.removeChild(loadingText);
    getItemsLocalStorage();
    getAllEvents();
  });
};

window.onload = () => {
loading();
};

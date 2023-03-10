import { Basket } from "./class/basket.js";

const cartItems = document.getElementById("cart__items");
const totalQuantity = document.getElementById("totalQuantity");
const totalPrice = document.getElementById("totalPrice");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const address = document.getElementById("address");
const city = document.getElementById("city");
const email = document.getElementById("email");
const order = document.getElementById("order");

let basket = new Basket();
let firstNameChecked;
let lastNameChecked;
let emailChecked;
let cityChecked;
let adressChecked;

// fonction qui récupère les données d'un produit à l'aide d'un fetch
async function fetchData(productId) {
  const res = await fetch(`http://localhost:3000/api/products/${productId}`);
  return await res.json();
}

// Fonction qui me sert de base à l'arrivée sur la page panier. Elle trie mon panier dans l'ordre des id, elle calcule le prix total, elle utilise ma fonction pour avoir le nombre de produit total et utilise ma fonction d'affichage.
async function getBasket() {
  basket.basket.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  let total = 0;
  for (const product of basket.basket) {
    const data = await fetchData(product.id);
    total += parseInt(data.price * product.quantity);
    basketDisplay(data, product.color, product.quantity);
  }
  totalQuantity.textContent = basket.getNumberProduct();
  totalPrice.textContent = new Intl.NumberFormat().format(total);
}

// Fontion qui me sert au changement de quantité, à mettre à jour le nombre total de produit et le prix
function changeEvent(id, color, quantity) {
  basket.changeQuantity(id, color, quantity);
  update();
}

// fonction de suppression qui à la suppression met à jour le prix et le nombre de produits
function deleteKanap(id, color, article) {
  basket.remove(id, color);
  article.remove();
  update();
}

// fonction qui met à jour le nombre de produit et le prix total
async function update() {
  let total = 0;
  for (const product of basket.basket) {
    const data = await fetchData(product.id);
    total += data.price * product.quantity;
  }
  totalPrice.textContent = new Intl.NumberFormat().format(total);
  totalQuantity.textContent = basket.getNumberProduct();
}

// fonction d'affichage du panier, je crée des élements et je leur donne les id et class que l'on a dans HTML
function basketDisplay(data, color, quantity) {
  const article = document.createElement("article");
  article.classList.add("cart__item");
  article.dataset.id = data._id;
  article.dataset.color = color;
  cartItems.appendChild(article);

  const cartItemImg = document.createElement("div");
  cartItemImg.classList.add("cart__item__img");
  article.appendChild(cartItemImg);

  const img = document.createElement("img");
  img.src = data.imageUrl;
  img.alt = data.altTxt;
  cartItemImg.appendChild(img);

  const cartItemContent = document.createElement("div");
  cartItemContent.classList.add("cart__item__content");
  article.appendChild(cartItemContent);

  const cartItemContentDescription = document.createElement("div");
  cartItemContentDescription.classList.add("cart__item__content__description");
  cartItemContent.appendChild(cartItemContentDescription);

  const h2Name = document.createElement("h2");
  h2Name.textContent = data.name;
  const pColor = document.createElement("p");
  pColor.textContent = color;
  const pPrice = document.createElement("p");
  pPrice.textContent = new Intl.NumberFormat().format(data.price) + " €";
  cartItemContentDescription.append(h2Name, pColor, pPrice);

  const cartItemContentSettings = document.createElement("div");
  cartItemContentSettings.classList.add("cart__item__content__settings");
  cartItemContent.appendChild(cartItemContentSettings);

  const cartItemContentSettingsQuantity = document.createElement("div");
  cartItemContentSettingsQuantity.classList.add(
    "cart__item__content__settings__quantity"
  );
  cartItemContentSettings.appendChild(cartItemContentSettingsQuantity);

  const pQuantity = document.createElement("p");
  pQuantity.textContent = "Qté :";

  cartItemContentSettingsQuantity.appendChild(pQuantity);

  const itemQuantity = document.createElement("input");
  itemQuantity.classList.add("itemQuantity");
  itemQuantity.setAttribute("id", "itemQuantity");
  itemQuantity.type = "number";
  itemQuantity.min = "1";
  itemQuantity.max = "100";
  itemQuantity.value = quantity;
  cartItemContentSettingsQuantity.appendChild(itemQuantity);
  itemQuantity.addEventListener("change", (e) => {
    changeEvent(article.dataset.id, article.dataset.color, e.target.value);
    if (itemQuantity.value >= 100) {
      return (itemQuantity.value = 100);
    } else if (itemQuantity.value <= 0) {
      article.remove();
    }
  });

  const cartItemContentSettingsDelete = document.createElement("div");
  cartItemContentSettingsDelete.classList.add(
    "cart__item__content__settings__delete"
  );

  cartItemContentSettings.appendChild(cartItemContentSettingsDelete);

  const pDelete = document.createElement("p");
  pDelete.classList.add("deleteItem");
  pDelete.textContent = "Supprimer";
  pDelete.addEventListener("click", () =>
    deleteKanap(article.dataset.id, article.dataset.color, article)
  );

  cartItemContentSettingsDelete.appendChild(pDelete);
}

const regex = /^[A-Za-z\-\é\è\'\s]{3,20}$/;

// fonction qui gére la validation du prénom et return un boolean
const checkFirstName = (firstName) => {
  if (regex.test(firstName) !== true) {
    const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
    firstNameErrorMsg.innerText =
      "le Prénom doit contenir au minimun 3 lettres et ne doit pas contenir de chiffre";
    return false;
  } else {
    firstNameErrorMsg.innerText = "";
    return true;
  }
};
// fonction qui gére la validation du nom et return un boolean
const checkLastName = (lastName) => {
  if (regex.test(lastName) !== true) {
    const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
    lastNameErrorMsg.innerText =
      "le Nom doit contenir au minimun 3 lettres et ne doit pas contenir de chiffre";
    return false;
  } else {
    lastNameErrorMsg.innerText = "";
    return true;
  }
};
// fonction qui gére la validation de l'email et return un boolean
const checkEmail = (email) => {
  if (/^[\w\-\_\.]+@[\w-]+\.[a-z]{2,4}$/.test(email) !== true) {
    const emailErrorMsg = document.getElementById("emailErrorMsg");
    emailErrorMsg.innerText = "l'email n'est pas valide";
    return false;
  } else {
    emailErrorMsg.innerText = "";
    return true;
  }
};
// fonction qui gére la validation de l'adresse et return un boolean
const checkAdress = (adress) => {
  if (/^[A-Za-z0-9\s\'\é\è]{10,50}$/.test(adress) !== true) {
    const addressErrorMsg = document.getElementById("addressErrorMsg");
    addressErrorMsg.innerText = "L'adresse n'est pas valide";
    return false;
  } else {
    addressErrorMsg.innerText = "";
    return true;
  }
};
// fonction qui gére la validation de la ville et return un boolean
const checkCity = (city) => {
  if (regex.test(city) !== true) {
    const cityErrorMsg = document.getElementById("cityErrorMsg");
    cityErrorMsg.innerText = "la ville n'est pas valide";
    return false;
  } else {
    cityErrorMsg.innerText = "";
    return true;
  }
};

firstName.addEventListener("input", (e) => {
  firstNameChecked = checkFirstName(e.target.value);
});

lastName.addEventListener("input", (e) => {
  lastNameChecked = checkLastName(e.target.value);
});

address.addEventListener("input", (e) => {
  adressChecked = checkAdress(e.target.value);
});

city.addEventListener("input", (e) => {
  cityChecked = checkCity(e.target.value);
});

email.addEventListener("input", (e) => {
  emailChecked = checkEmail(e.target.value);
});

order.addEventListener("click", (e) => {
  e.preventDefault();
  if (basket.basket !== 0) {
    if (
      firstNameChecked &&
      lastNameChecked &&
      adressChecked &&
      cityChecked &&
      emailChecked
    ) {
      let contact = {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value,
      };

      let productId = [];
      basket.basket.forEach((product) => {
        productId.push(product.id);
      });

      const order = {
        contact: contact,
        products: productId,
      };

      fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        body: JSON.stringify(order),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((data) => data.json())
        .then((orderInfo) => {
          location.href = `./confirmation.html?id=${orderInfo.orderId}`;
        });
    } else {
      alert("veuillez remplir correctement le formulaire de contact");
    }
  } else {
    alert("Votre panier est vide");
  }
});

getBasket();

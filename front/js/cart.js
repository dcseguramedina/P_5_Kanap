//Retrieve the cart via the local storage and display the cart content//
function initCart() {

    let cart = getCartFromLocalStorage();
    if (cart == undefined || cart.length == 0) {
        alert(`Votre panier est vide`);
        return
    }

    displayCartContent(cart);
}
initCart();

//Get cart from local storage
function getCartFromLocalStorage() {
    let cart = [];
    if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
    }
    console.log(cart);
    return cart;
}



//Browse the cart content to display the product details
function displayCartContent(cart) {

    for (let product of cart) {
        //Recover the DOM element that will host the cart products 
        const sectionCartItems = document.getElementById("cart__items");

        //Create an "article" tag for the product and set its attributes
        const cartItem = document.createElement("article");
        cartItem.className = "cart__item";
        cartItem.setAttribute('data-id', product.productId);
        cartItem.setAttribute('data-color', product.productColor);
        //Attach the product to the cart products section
        sectionCartItems.appendChild(cartItem);

        //Create a "div" tag to contain the product image
        const cartItemImage = document.createElement("div");
        cartItemImage.className = "cart__item__img";
        //Attach the "div" to the product section
        cartItem.appendChild(cartItemImage);

        //Create an "img" tag for the product image
        const itemImage = document.createElement("img");
        itemImage.src = product.productImage;
        itemImage.alt = product.productAltTxt;
        //Attach the product image to the product
        cartItemImage.appendChild(itemImage);

        //Create a "div" tag to contain the product content
        const cartItemContent = document.createElement("div");
        cartItemContent.className = "cart__item__content";
        //Attach the "div" to the product content section
        cartItem.appendChild(cartItemContent);

        //Create a "div" tag to contain the product description
        const cartItemContentDescription = document.createElement("div");
        cartItemContentDescription.className = "cart__item__content__description";
        //Attach the "div" to the product description section
        cartItemContent.appendChild(cartItemContentDescription);

        //Create an "h2" tag for the product title
        const productTitle = document.createElement("h2");
        productTitle.textContent = product.productName;
        //Attach the title to the product 
        cartItemContentDescription.appendChild(productTitle);

        //Create a "p" tag for the product color
        const productColor = document.createElement("p");
        productColor.textContent = product.productColor;
        //Attach the color to the product
        cartItemContentDescription.appendChild(productColor);

        //Create a "p" tag for the product price   
        const productPrice = document.createElement("p");
        productPrice.className = "itemPrice";
        fetch('http://localhost:3000/api/products/' + product.productId)
            .then(function (response) {
                //Check the URL and retrieve the response in the json format
                if (response.ok) {
                    return response.json();
                }
            })
            .then(function (data) {
                let price = data.price;
                productPrice.textContent = price + " ???";                
            })
            .catch(function (error) {
                //Block of code to handle errors
                return error;
            })
        
        //Attach the "p" to the product 
        cartItemContentDescription.appendChild(productPrice);

        //Create a "div" tag to contain the product settings
        const cartItemContentSettings = document.createElement("div");
        cartItemContentSettings.className = "cart__item__content__settings";
        //Attach the "div" to the product settings section
        cartItemContent.appendChild(cartItemContentSettings);

        //Create a "div" tag to contain the product quantity
        const cartItemContentSettingsQuantity = document.createElement("div");
        cartItemContentSettingsQuantity.className = "cart__item__content__settings__quantity";
        //Attach the "div" to the product quantity section
        cartItemContentSettings.appendChild(cartItemContentSettingsQuantity);

        //Create a "p" tag for the product quantity
        const quantity = document.createElement("p");
        quantity.textContent = "Qt?? : ";
        //Attach the quantity to the product
        cartItemContentSettingsQuantity.appendChild(quantity);

        //Create an "input" tag for the product quantity details and set its attributes
        const quantityInput = document.createElement("input");
        quantityInput.className = "itemQuantity";
        quantityInput.setAttribute("type", "number");
        quantityInput.setAttribute("name", "itemQuantity");
        quantityInput.setAttribute("min", "1");
        quantityInput.setAttribute("max", "100");
        quantityInput.value = product.productQuantity;
        //Listen to the changes on the quantity inputs and retrieve the values 
        quantityInput.addEventListener("change", function (event) {
            event.preventDefault();
            modifyProductQuantity(cart, product, quantityInput);
        });
        //Attach the quantity details to the product
        cartItemContentSettingsQuantity.appendChild(quantityInput);

        //Create a "div" tag to contain the delete option
        const cartItemContentSettingsDelete = document.createElement("div");
        cartItemContentSettingsDelete.className = "cart__item__content__settings__delete";
        //Attach the "div" to the product settings section
        cartItemContentSettings.appendChild(cartItemContentSettingsDelete);

        //Create a "p" tag for the delete option
        const deleteItem = document.createElement("p");
        deleteItem.className = "deleteItem";
        deleteItem.textContent = "Supprimer";
        //Listen to the click on the "deleteItem" button and delete the products
        deleteItem.addEventListener("click", function (event) {
            event.preventDefault();
            deleteItemFromCart(cart, product);
        });
        //Attach the delete option to the product
        cartItemContentSettingsDelete.appendChild(deleteItem);

        //Recover the DOM element that contain the total quantity and insert the quantity
        let totalQuantity = getTotalQuantity(cart);
        const totalQuantityInput = document.getElementById("totalQuantity");
        //Attach the total quantity to the section
        totalQuantityInput.textContent = totalQuantity;

        //Recover the DOM element that contain the total price and insert the price
        
        let totalPrice = getTotalPrice();
        const totalPriceInput = document.getElementById("totalPrice");
        //Attach the total price to the section
        totalPriceInput.textContent = totalPrice;
    }
}

function getTotalQuantity(cart) {
    let totalQuantity = 0;
    if (localStorage.getItem("cart")) {
        let cart = JSON.parse(localStorage.getItem("cart"));
        for (let product of cart) {
            totalQuantity += product.productQuantity;
        }
    }
    return totalQuantity;
}

function getTotalPrice() {
    let productPrice = document.getElementsByClassName("itemPrice");
    console.log(productPrice);
    let price = 0;
    for(let i = 0; i < productPrice.length; i++) {
        price = productPrice[i].textContent;
        console.log(price);
        return price;
    }   

    let totalPrice = 0;
    if (localStorage.getItem("cart")) {
        let cart = JSON.parse(localStorage.getItem("cart"));
        for (let product of cart) {
            totalPrice += product.productQuantity * parseInt(price);
        }
    }
    return totalPrice;
}

function modifyProductQuantity(cart, product, quantityInput) {
    //If the new quantity is bigger than 100 units, alert and reset to the initial quantity     
    if (parseInt(quantityInput.value) > 100) {
        alert(`La quantit?? maximale ne peut pas d??passer les 100 unit??s`);
    }
    else {
        product.productQuantity = parseInt(quantityInput.value);
        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`La quantit?? du produit a ??t?? modifi??`);
    }
    window.location.reload();
}

function deleteItemFromCart(cart, product) {
    console.log("test");
    if (window.confirm(`Le produit va ??tre supprim?? du panier. Cliquez sur OK pour confirmer`)) {
        //Look for the selected product (same ID + same color) and keep everything different from it 
        cart = filterCartProduct(cart, product);
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Le produit a ??t?? supprimer")
        window.location.reload();
    }
    else {
        alert("Le produit n'a pas ??t?? supprim??")
    }
}

function filterCartProduct(cart, product) {
    return cart.filter(
        (p) => p.productId !== product.productId || p.productColor !== product.productColor
    )
}
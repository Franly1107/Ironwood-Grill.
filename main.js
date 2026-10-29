console.log("Ironwood Grill JavaScript connected!");
const carouselImage = document.querySelector(".carousel img");
if (carouselImage) {
    console.log("Carousel image exists");

const nextButton = document.querySelector("#next-btn");

const previousButton = document.querySelector("#prev-btn");

const pauseButton = document.querySelector("#pause-btn");

const resumeButton = document.querySelector("#resume-btn");

nextButton.addEventListener("click", function () {
    console.log("Next button clicked!");

    showNextImage(); // code reusability
});

previousButton.addEventListener("click", function () {
    console.log("Previous Button clicked");
    currentImageIndex--;

    if (currentImageIndex < 0) { // jumps to the last image.
        currentImageIndex = foodImages.length - 1;
    }

    carouselImage.src = foodImages[currentImageIndex];
});

console.log(carouselImage);

console.log(carouselImage.getAttribute("src"));

const foodImages = [
    "images/ribeye.png",
    "images/burger.png",
    "images/salmon.png",
    "images/ribs.png",
    "images/filet-mignon.png",
    "images/grilled-chicken.png",
    "images/loaded-fries.png",
    "images/shrimp-skewers.png",
    "images/steak-tacos.png",
    "images/lava-cake.png"
];

console.log(foodImages[0]);

let currentImageIndex = 0;
carouselImage.src = foodImages[currentImageIndex];

function showNextImage() {
    currentImageIndex++;

    if (currentImageIndex >= foodImages.length) { // return to index 0
        currentImageIndex = 0;
    }

    carouselImage.src = foodImages[currentImageIndex];
}

let carouselTimer = setInterval(function () {
    // make the image change automatically every 4 sec.
    // carouselTimer is the timer id that lets JavaScript stop it.
    console.log("4 seconds passed!");

    showNextImage(); // code reusability.

}, 4000);

let isCarouselRunning = true;

pauseButton.addEventListener("click", function () {
    clearInterval(carouselTimer);
    isCarouselRunning = false;
});

resumeButton.addEventListener("click", function () {
    console.log("Resume button clicked!");

    if (!isCarouselRunning) {
        carouselTimer = setInterval(showNextImage, 4000);
        isCarouselRunning = true;
    }
});

}


// <------------------------------- Current Year ------------------------------------------>

const currentYear = new Date().getFullYear(); // to get the date and year
console.log(currentYear);

const yearElement = document.querySelector("#current-year");

if (yearElement) {
    yearElement.textContent = currentYear;
}


// <------------------------------- Calgary Time ------------------------------------------>

const calgaryTimeElement = document.querySelector("#calgary-time"); // live Calgary clock.

function updateCalgaryTime() {
    const now = new Date();

    const calgaryTime = now.toLocaleTimeString("en-CA", {
        timeZone: "America/Edmonton",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    });

    if (calgaryTimeElement) {
        calgaryTimeElement.textContent = calgaryTime;
    }
}

updateCalgaryTime();
setInterval(updateCalgaryTime, 1000);


// <------------------------------- Calgary Weather ------------------------------------------>

const calgaryWeatherElement = document.querySelector("#calgary-weather"); // Adding Live Calgary Weather

function getCalgaryWeather() {

    const weatherURL = "https://api.open-meteo.com/v1/forecast?latitude=51.05&longitude=-114.07&current=temperature_2m";

    fetch(weatherURL)
        .then(response => {

            if (!response.ok) {
                throw new Error("Weather API request failed");
            }

            return response.json();
        })

        .then(data => {
            console.log(data);

            const temperature = data.current.temperature_2m;
            console.log(temperature);

            if (calgaryWeatherElement) {
                calgaryWeatherElement.textContent = `${temperature}°C`;
            }
        })

        .catch(error => {
            console.log("Weather request failed:", error);

            if (calgaryWeatherElement) {
                calgaryWeatherElement.textContent = "Weather unavailable";
            }
        });
}

getCalgaryWeather();
setInterval(getCalgaryWeather, 900000);


// <------------------------------- Menu ordering system ------------------------------------------>

// Each menu item has a name, price in cents, and matching HTML IDs.
// Keeping the menu in one array prevents repeating the same calculation ten times.

const menuItems = [
    { id: "ribeye", name: "Ribeye Steak", priceCents: 3499 },
    { id: "burger", name: "Burger", priceCents: 1899 },
    { id: "chicken", name: "Grilled Chicken", priceCents: 2499 },
    { id: "salmon", name: "Grilled Salmon", priceCents: 2999 },
    { id: "ribs", name: "BBQ Ribs", priceCents: 3299 },
    { id: "filet", name: "Filet Mignon", priceCents: 3999 },
    { id: "fries", name: "Loaded Fries", priceCents: 999 },
    { id: "shrimp", name: "Shrimp Skewers", priceCents: 2199 },
    { id: "tacos", name: "Steak Tacos", priceCents: 1799 },
    { id: "lava", name: "Chocolate Lava Cake", priceCents: 1199 }
];

const orderTotalElement = document.querySelector("#order-total");
const orderSubtotalElement = document.querySelector("#order-subtotal");
const gstElement = document.querySelector("#gst-amount");


// <------------------------------- Quantity validation ------------------------------------------>

function validateQuantity(input, itemName) {

    let quantity = Number(input.value); // convert the value to a number

    if (!Number.isFinite(quantity)) {
        alert(`Please enter a valid quantity for ${itemName}.`);
        quantity = 0;
    }

    if (quantity > 20) {
        // this is to limit the quantity of each dish to 20
        alert(`You cannot order more than 20 ${itemName}.`);
        quantity = 20;
    }

    if (quantity < 0) {
        // this is to limit the quantity of each dish to 0
        alert(`You cannot order a negative quantity of ${itemName}.`);
        quantity = 0;
    }

    if (!Number.isInteger(quantity)) {
        // customers must order whole numbers
        alert(`You cannot order a decimal quantity of ${itemName}.`);
        quantity = Math.floor(quantity);
    }

    input.value = quantity; // show the corrected value in the input

    return quantity;
}


// <------------------------------- Calculate the order total ------------------------------------------>

function updateOrderTotal() {

    let orderTotalCents = 0; // calculate the total price in cents for the order

    menuItems.forEach(function (item) {

        const quantityInput = document.querySelector(`#${item.id}-quantity`);
        const subtotalElement = document.querySelector(`#${item.id}-subtotal`);

        if (!quantityInput || !subtotalElement) {
            return;
        }

        const quantity = validateQuantity(quantityInput, item.name);

        const totalCents = quantity * item.priceCents; // calculate the total price in cents

        const totalDollars = (totalCents / 100).toFixed(2);
        // convert cents to dollars and format to 2 decimal places

        subtotalElement.textContent = totalDollars;

        orderTotalCents += totalCents;
    });

    const gstCents = Math.round(orderTotalCents * 0.05);
    // calculate the GST in cents (5% of the order total)

    const finalTotalCents = orderTotalCents + gstCents;
    // calculate the final total in cents (order total + GST)

    if (orderSubtotalElement) {
        orderSubtotalElement.textContent = (orderTotalCents / 100).toFixed(2);
    }

    if (gstElement) {
        gstElement.textContent = (gstCents / 100).toFixed(2);
    }

    if (orderTotalElement) {
        orderTotalElement.textContent = (finalTotalCents / 100).toFixed(2);
    }
}


// Add an event listener to every quantity input that recalculates the order.

menuItems.forEach(function (item) {

    const quantityInput = document.querySelector(`#${item.id}-quantity`);

    if (quantityInput) {
        quantityInput.addEventListener("input", updateOrderTotal);
    }
});

if (orderTotalElement) {
    updateOrderTotal(); // initialize subtotals when the menu page loads
}


// <------------------------------- Generate Receipt ------------------------------------------>

const generateReceiptButton = document.querySelector("#generate-receipt");

const orderForm = document.querySelector("#order-form");

const receiptContainer = document.querySelector("#receipt-container");

if (orderForm && receiptContainer) {

    // check if the element exists before trying to add an event listener

    orderForm.addEventListener("submit", function (event) {

        // When the form is submitted the event listener will be triggered
        event.preventDefault(); // Prevent the form from refreshing the page

        console.log("Generate Receipt button clicked!");

        updateOrderTotal(); // make sure the totals match the validated quantities

        const receiptNow = new Date(); // get the current date and time

        const receiptDate = receiptNow.toLocaleDateString("en-CA");

        const receiptTime = receiptNow.toLocaleTimeString("en-CA", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        });

        const receiptDateElement = document.querySelector("#receipt-date");
        const receiptTimeElement = document.querySelector("#receipt-time");
        const receiptItemsElement = document.querySelector("#receipt-items");

        if (!receiptItemsElement) {
            return;
        }

        if (receiptDateElement) {
            receiptDateElement.textContent = receiptDate;
        }

        if (receiptTimeElement) {
            receiptTimeElement.textContent = receiptTime;
        }

        receiptItemsElement.innerHTML = ""; // clear the previous receipt

        const selectedItems = menuItems.filter(function (item) {

            const input = document.querySelector(`#${item.id}-quantity`);

            return input && Number(input.value) > 0;
        });

        if (selectedItems.length === 0) {
            // Check if the user ordered nothing

            receiptContainer.hidden = true;
            // hide the receipt container if no items were ordered

            alert("You have not ordered anything. Please select at least one item to generate a receipt.");

            return; // Exit the function early if no items were ordered
        }

        receiptContainer.hidden = false;
        // show the receipt container when the button is clicked

        selectedItems.forEach(function (item) {

            const quantity = Number(
                document.querySelector(`#${item.id}-quantity`).value
            );

            const itemSubtotal = (quantity * item.priceCents / 100).toFixed(2);

            // Create a list item for the receipt
            const receiptItem = document.createElement("li");

            // Create the item name
            const itemName = document.createElement("span");
            itemName.textContent = item.name;

            // Create the total price for this item
            const itemPrice = document.createElement("span");
            itemPrice.textContent = `$${itemSubtotal}`;

            // Create the quantity and individual price details
            const itemDetails = document.createElement("span");

            itemDetails.textContent = `${quantity} @ $${(item.priceCents / 100).toFixed(2)}`;

            itemDetails.classList.add("receipt-details");

            // Group the name and details together
            const itemInfo = document.createElement("div");

            itemInfo.appendChild(itemName);
            itemInfo.appendChild(itemDetails);

            // Add the information and total price to the receipt
            receiptItem.appendChild(itemInfo);
            receiptItem.appendChild(itemPrice);

            // Display the item on the receipt
            receiptItemsElement.appendChild(receiptItem);
        });


        // Display the subtotal, GST and total using the same receipt styles.

        function addReceiptLine(label, value, className) {

            const line = document.createElement("p");
            line.classList.add(className);

            const lineLabel = document.createElement("span");
            lineLabel.textContent = label;

            const linePrice = document.createElement("span");
            linePrice.textContent = `$${value}`;

            line.appendChild(lineLabel);
            line.appendChild(linePrice);

            receiptItemsElement.appendChild(line);
        }

        addReceiptLine(
            "Subtotal: ",
            orderSubtotalElement.textContent,
            "receipt-subtotal"
        );

        addReceiptLine(
            "GST: ",
            gstElement.textContent,
            "receipt-gst"
        );

        addReceiptLine(
            "Total: ",
            orderTotalElement.textContent,
            "receipt-total"
        );
    });
}


// Download the receipt as a PDF using the browser's print option
const downloadPdfBtn = document.querySelector("#download-pdf-btn");

if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener("click", function () {
        window.print();
    });
}
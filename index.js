/**
 * @file index.js
 * @description Main file to handle the UI and fetch data from Firestore.
 */

import {
  addBookmark,
  createQuery,
  deleteBookmark,
  filterBookmarks,
  getRealtimeUpdates,
} from "./config.js";

/**
 * Creates a card element with the given data.
 * @param {Object} response - Data to create a card.
 * @returns {string} - HTML string of the card.
 */
const createCard = (response) => {
  let card = `
    
  <div class="card">
    <p class="title">${response.title}</p>
    <div class="sub-information">
      <p>
        <span class="category ${response.category}">
          ${response.category[0].toUpperCase()}${response.category.slice(1)}
        </span>
      </p>
      <a href="${response.link}" target="_blank">
        <i class="bi bi-box-arrow-up-right website"></i>
      </a>
      <a href="https://www.google.com/search?q=${
        response.title
      }" target="_blank">
        <i class="bi bi-google search"></i>
      </a>
      <span>
        <i class="bi bi-trash delete" data-id="${response.id}"></i>
      </span>
    </div>
  </div>
      
      `;

  return card;
};

/**
 * DOM elements from the HTML file.
 */
const addForm = document.querySelector(".add");
const cards = document.querySelector(".cards");
const categoryList = document.querySelector(".category-list");

/**
 * Event listener for the form submission.
 * @param {Event} event - Form submit event.
 */
const onSubmit = (event) => {
  event.preventDefault();

  const newBookmark = {
    title: addForm.title.value,
    link: addForm.link.value,
    category: addForm.category.value,
  };

  addBookmark(newBookmark);

  addForm.reset();
};

/**
 * Event listener for the delete button.
 */
const deleteEvent = () => {
  const deleteButtons = document.querySelectorAll(".delete");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", ({ target }) => {
      deleteBookmark(target.dataset.id);
    });
  });
};

/**
 * Renders the data received from Firestore.
 * @param {Array} data - Array of bookmark objects.
 */
const renderData = (data) => {
  cards.innerHTML = "";
  data.map((item) => {
    const card = createCard(item);
    cards.innerHTML += card;
    deleteEvent();
  });
};

/**
 * Event listener for the category list.
 */
const filterData = () => {
  // add event listener - click

  categoryList.addEventListener("click", (event) => {
    if (event.target.nodeName === "SPAN") {
      // remove active class from every span
      const allSpan = document.querySelectorAll(".category-list > span");
      allSpan.forEach((span) => {
        span.classList.remove("active");
      });

      // add active class to the clicked span

      event.target.classList.add("active");

      // If user clicks "All" category, get all bookmarks
      // from Firestore in real-time.
      // Otherwise, filter bookmarks by category and
      // get real-time updates from Firestore.
      if (event.target.textContent === "All") {
        getRealtimeUpdates(renderData, createQuery());
      } else {
        filterBookmarks(
          createQuery(event.target.textContent.toLowerCase()),
          renderData
        );
      }
    }
  });
};

// add event listener to the form
addForm.onsubmit = onSubmit;

// get real-time updates from Firestore
getRealtimeUpdates(renderData, createQuery());

// filter data based on category
filterData();

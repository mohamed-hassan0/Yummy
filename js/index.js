// side nav bar
function openNav() {
  $(".bars-icon").addClass("d-none");
  $(".x-icon").removeClass("d-none");
  $(".side-nav-bar").animate({ left: `0px` });
  for (let i = 0; i < 5; i++) {
    $(".side-nav-bar li")
      .eq(i)
      .animate(
        {
          top: 0,
        },
        (i + 5) * 100
      );
  }
}
$(".bars-icon").click(() => openNav());

function closeNav() {
  $(".side-nav-bar").animate({ left: `-300px` });
  $(".x-icon").addClass("d-none");
  $(".bars-icon").removeClass("d-none");
  $(".side-nav-bar li").animate(
    {
      top: 300,
    },
    500
  );
}
$(".x-icon").click(() => closeNav());

//loading
$(document).ready(() => {
  getMeals().then(() => {
    $(".loading-screen").fadeOut(500);
    $("body").css("overflow", "visible");
    getMeals();
  });
});

// meals
async function getMeals() {
  let response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s="
  );
  let finalResponse = await response.json();
  displayMeals(finalResponse.meals);
}

function displayMeals(mealsArr) {
  let meals = "";
  for (let i = 0; i < mealsArr.length; i++) {
    meals += `
    <div class="col-md-3">
        <div class="meal p-0 rounded-2 position-relative overflow-hidden" onclick="getMealDetails(${mealsArr[i].idMeal})">
        <img src="${mealsArr[i].strMealThumb}" class="w-100 rounded-2 p-0">
        <div class="meal-name p-0 position-absolute top-100 w-100 h-100 d-flex align-items-center rounded-2 start-0">
        <p class="ps-2 fs-3 text-black text-capitalize">${mealsArr[i].strMeal}</p>
        </div>
        </div>
    </div>
        `;
  }
  $(".meals .row").html(meals);
}

async function getMealDetails(mealId) {
  $(".meals").addClass("d-none");
  $(".inner-loading-screen").fadeIn(300);
  let api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  );
  let finalApi = await api.json();
  $(".inner-loading-screen").fadeOut(200);
  displayMealDetails(finalApi.meals[0]);
}

function displayMealDetails(details) {
  let tags = ``;
  if (details.strTags === null) {
    tags += "";
  } else if (details.strTags.includes(",") == true) {
    let arr = details.strTags.split(",");
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] !== undefined) {
        tags += `
                <li class="alert alert-danger m-2 p-1">${arr[i]}</li>
                `;
      }
    }
  } else {
    tags += `
        <li class="alert alert-danger m-2 p-1">${details.strTags}</li>
    `;
  }
  let Recipes = ``;
  for (let i = 1; i <= 20; i++) {
    if (details[`strIngredient${i}`] !== "") {
      Recipes += `
        <li class="alert alert-info m-2 p-1">${details[`strMeasure${i}`]}${
        ` ` + details[`strIngredient${i}`]
      }</li>
        `;
    }
  }
  let mealDetails = "";
  mealDetails += `
  <div class="col-md-4">
  <img
    class="w-100 rounded-3"
    src="${details.strMealThumb}"
    alt=""
  />
  <h2>${details.strMeal}</h2>
</div>
<div class="col-md-8">
  <h2>Instructions</h2>
  <p>${details.strInstructions}</p>
  <h3><span class="fw-bolder">Area : </span>${details.strArea}</h3>
  <h3>
    <span class="fw-bolder">Category : </span>${details.strCategory}
  </h3>
  <h3>Recipes :</h3>
  <ul class="list-unstyled d-flex g-3 flex-wrap">
  ${Recipes}
  </ul>

  <h3>Tags :</h3>
  <ul class="list-unstyled d-flex g-3 flex-wrap">
  ${tags}
  </ul>

  <a target="_blank" href="${details.strSource}" class="btn btn-success"
    >Source</a
  >
  <a target="_blank" href="${details.strYoutube}" class="btn btn-danger"
    >Youtube</a
  >
</div>
  `;
  $("#detailsContainer .row").removeClass("d-none").html(mealDetails);
  $("#searchContianer").addClass("d-none");
  $("#categoriesContainer").addClass("d-none");
  $("#areaContainer").addClass("d-none");
  $("#ingredientContainer").addClass("d-none");
}
// ============================================= search =================================
$("#search").click(() => {
  closeNav();
  $(".meals").addClass("d-none");
  $("#detailsContainer .row").addClass("d-none");
  $("#categoriesContainer").addClass("d-none");
  $("#contactContainer").addClass("d-none");
  $("#ingredientContainer").addClass("d-none");
  $("#searchContianer").removeClass("d-none");
});

async function searchByName(name) {
  $(".inner-loading-screen").fadeIn(300);
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
  );
  let finalResponse = await response.json();
  $(".inner-loading-screen").fadeOut(300);
  diplaySearchMeals(finalResponse.meals);
}

async function searchByFirstLetter(letter) {
    if (letter === "") {
        letter = "a"
    }
  $(".inner-loading-screen").fadeIn(300);
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
  );
  let finalResponse = await response.json();
  $(".inner-loading-screen").fadeOut(300);
  diplaySearchMeals(finalResponse.meals);
}

function diplaySearchMeals(mealsArr) {
  let meals = "";
  for (let i = 0; i < mealsArr.length; i++) {
    meals += `
    <div class="col-md-3">
        <div class="meal p-0 rounded-2 position-relative overflow-hidden" onclick="getMealDetails(${mealsArr[i].idMeal})">
        <img src="${mealsArr[i].strMealThumb}" class="w-100 rounded-2 p-0">
        <div class="meal-name p-0 position-absolute top-100 w-100 h-100 d-flex align-items-center rounded-2 start-0">
        <p class="ps-2 fs-3 text-black text-capitalize">${mealsArr[i].strMeal}</p>
        </div>
        </div>
    </div>
        `;
    $("#searchContianer .d-meals").html(meals);
  }
}
// ================================ Categories ======================================
$("#categories").click(() => {
  closeNav();
  $(".meals").addClass("d-none");
  $("#detailsContainer .row").addClass("d-none");
  $("#categoriesContainer").removeClass("d-none");
  $("#searchContianer").addClass("d-none");
  $("#ingredientContainer").addClass("d-none");
  $("#contactContainer").addClass("d-none");
  $("#areaContainer").addClass("d-none");
  getCategories();
});

async function getCategories() {
  $("#categoriesContainer .inner-loading-screen").fadeIn(300);
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  let finalResponse = await response.json();
  $("#categoriesContainer .inner-loading-screen").fadeOut(300);
  displayCategories(finalResponse.categories);
}

function displayCategories(mealsArr) {
  let meals = "";
  for (let i = 0; i < mealsArr.length; i++) {
    meals += `
      <div class="col-md-3">
          <div class="meal category p-0 rounded-2 position-relative overflow-hidden" onclick="getCategory('${
            mealsArr[i].strCategory
          }')">
          <img src="${
            mealsArr[i].strCategoryThumb
          }" class="w-100 rounded-2 p-0">
          <div class="meal-name p-0 position-absolute top-100 w-100 h-100 d-flex text-center justify-content-center flex-column rounded-2 start-0">
          <p class="ps-2 fs-3 text-black text-capitalize">${
            mealsArr[i].strCategory
          }</p>
          <p class="ps-2 fs-6 text-black text-capitalize">${mealsArr[
            i
          ].strCategoryDescription.slice(0, 100)}</p>
          </div>
          </div>
      </div>
          `;
  }
  $("#categoriesContainer .row").html(meals);
}
async function getCategory(category) {
  $("#categoriesContainer .inner-loading-screen").fadeIn(300);
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  let finalResponse = await response.json();
  $("#categoriesContainer .inner-loading-screen").fadeOut(300);
  displayCategory(finalResponse.meals);
}

function displayCategory(mealsArr) {
  let meals = "";
  for (let i = 0; i < mealsArr.length; i++) {
    meals += `
      <div class="col-md-3">
          <div class="meal p-0 rounded-2 position-relative overflow-hidden" onclick="getMealDetails(${mealsArr[i].idMeal})">
          <img src="${mealsArr[i].strMealThumb}" class="w-100 rounded-2 p-0">
          <div class="meal-name p-0 position-absolute top-100 w-100 h-100 d-flex align-items-center rounded-2 start-0">
          <p class="ps-2 fs-3 text-black text-capitalize">${mealsArr[i].strMeal}</p>
          </div>
          </div>
      </div>
          `;
  }
  $("#categoriesContainer .row").html(meals);
}
//=============================== Area ========================================================
$("#area").click(() => {
  closeNav();
  $(".meals").addClass("d-none");
  $("#searchContianer").addClass("d-none");
  $("#categoriesContainer").addClass("d-none");
  $("#ingredientContainer").addClass("d-none");
  $("#contactContainer").addClass("d-none");
  $("#detailsContainer .row").addClass("d-none")
  $("#areaContainer").removeClass("d-none");
  getArea();
});

async function getArea() {
  $("#areaContainer .inner-loading-screen").fadeIn(300);
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
  );
  let finalResponse = await response.json();
  $("#areaContainer .inner-loading-screen").fadeOut(300);
  displayAreas(finalResponse.meals);
}

function displayAreas(mealsArr) {
  let meals = "";
  for (let i = 0; i < mealsArr.length; i++) {
    meals += `
      <div class="col-md-3 z-1">
          <div class="meal p-0 rounded-2 position-relative text-center text-white cursor-pointer" onclick="getMealsArea('${mealsArr[i].strArea}')">
          <i class="fa-solid fa-house fs-1 cursor-pointer"></i>
          <p class="fs-3 cursor-pointer">${mealsArr[i].strArea}</p>
          </div>
      </div>
          `;
  }
  $("#areaContainer .row").html(meals);
}

async function getMealsArea(Area) {
  $("#areaContainer .inner-loading-screen").fadeIn(300);
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${Area}`
  );
  let finalResponse = await response.json();
  $("#areaContainer .inner-loading-screen").fadeOut(300);
  displayMealsArea(finalResponse.meals);
}
function displayMealsArea(mealsArr) {
  let meals = "";
  for (let i = 0; i < mealsArr.length; i++) {
    meals += `
      <div class="col-md-3">
          <div class="meal p-0 rounded-2 position-relative overflow-hidden" onclick="getMealDetails(${mealsArr[i].idMeal})">
          <img src="${mealsArr[i].strMealThumb}" class="w-100 rounded-2 p-0">
          <div class="meal-name p-0 position-absolute top-100 w-100 h-100 d-flex align-items-center rounded-2 start-0">
          <p class="ps-2 fs-3 text-black text-capitalize">${mealsArr[i].strMeal}</p>
          </div>
          </div>
      </div>
          `;
  }
  $("#areaContainer .row").html(meals);
}
//====================================== Ingredients ==============================================
$("#ingredients").click(() => {
  closeNav();
  $(".meals").addClass("d-none");
  $("#searchContianer").addClass("d-none");
  $("#categoriesContainer").addClass("d-none");
  $("#detailsContainer").addClass("d-none")
  $("#areaContainer").addClass("d-none");
  $("#ingredientContainer").removeClass("d-none");
  $("#contactContainer").addClass("d-none");
  getIngrediants();
});

async function getIngrediants() {
  $("#ingredientContainer .inner-loading-screen").fadeIn(300);
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  let finalResponse = await response.json();
  $("#ingredientContainer .inner-loading-screen").fadeOut(300);
  displayIngrediants(finalResponse.meals.slice(0, 20));
}

function displayIngrediants(mealsArr) {
  let meals = "";
  for (let i = 0; i < mealsArr.length; i++) {
    meals += `
      <div class="col-md-3 z-1">
          <div class="meal p-0 rounded-2 position-relative text-center text-white cursor-pointer" onclick="filterByIngrediants('${
            mealsArr[i].strIngredient
          }')">
          <i class="fa-solid fa-drumstick-bite fa-4x"></i>
          <p class="fs-3 cursor-pointer">${mealsArr[i].strIngredient}</p>
          <p class="fs-5 cursor-pointer">${mealsArr[i].strDescription
            .split(" ")
            .slice(0, 15)
            .join(" ")}</p>
          </div>
      </div>
          `;
  }
  $("#ingredientContainer .row").html(meals);
}

async function filterByIngrediants(ingrediants) {
  $("#ingredientContainer .inner-loading-screen").fadeIn(300);
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingrediants}`
  );
  let finalResponse = await response.json();
  $("#ingredientContainer .inner-loading-screen").fadeOut(300);
  displayByIngrediant(finalResponse.meals);
}

function displayByIngrediant(mealsArr) {
  let meals = "";
  for (let i = 0; i < mealsArr.length; i++) {
    meals += `
      <div class="col-md-3">
          <div class="meal p-0 rounded-2 position-relative overflow-hidden" onclick="getMealDetails(${mealsArr[i].idMeal})">
          <img src="${mealsArr[i].strMealThumb}" class="w-100 rounded-2 p-0">
          <div class="meal-name p-0 position-absolute top-100 w-100 h-100 d-flex align-items-center rounded-2 start-0">
          <p class="ps-2 fs-3 text-black text-capitalize">${mealsArr[i].strMeal}</p>
          </div>
          </div>
      </div>
          `;
  }
  $("#ingredientContainer .row").html(meals);
}
// ========================================================== contact ==========================================================
$("#contact").click(() => {
    closeNav();
    $(".meals").addClass("d-none");
    $("#searchContianer").addClass("d-none");
    $("#categoriesContainer").addClass("d-none");
    $("#areaContainer").addClass("d-none");
    $("#ingredientContainer").addClass("d-none");
    $("#contactContainer").removeClass("d-none");
    showContacts();
})

function showContacts() {
  submitBtn = document.getElementById("submitBtn");

  document.getElementById("nameInput").addEventListener("focus", () => {
    nameInputTouched = true;
  });

  document.getElementById("emailInput").addEventListener("focus", () => {
    emailInputTouched = true;
  });

  document.getElementById("phoneInput").addEventListener("focus", () => {
    phoneInputTouched = true;
  });

  document.getElementById("ageInput").addEventListener("focus", () => {
    ageInputTouched = true;
  });

  document.getElementById("passwordInput").addEventListener("focus", () => {
    passwordInputTouched = true;
  });

  document.getElementById("repasswordInput").addEventListener("focus", () => {
    repasswordInputTouched = true;
  });
}

let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;

function inputsValidation() {
  if (nameInputTouched) {
    if (nameValidation()) {
      document
        .getElementById("nameAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("nameAlert")
        .classList.replace("d-none", "d-block");
    }
  }
  if (emailInputTouched) {
    if (emailValidation()) {
      document
        .getElementById("emailAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("emailAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (phoneInputTouched) {
    if (phoneValidation()) {
      document
        .getElementById("phoneAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("phoneAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (ageInputTouched) {
    if (ageValidation()) {
      document
        .getElementById("ageAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("ageAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (passwordInputTouched) {
    if (passwordValidation()) {
      document
        .getElementById("passwordAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("passwordAlert")
        .classList.replace("d-none", "d-block");
    }
  }
  if (repasswordInputTouched) {
    if (repasswordValidation()) {
      document
        .getElementById("repasswordAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("repasswordAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (
    nameValidation() &&
    emailValidation() &&
    phoneValidation() &&
    ageValidation() &&
    passwordValidation() &&
    repasswordValidation()
  ) {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled", true);
  }
}

function nameValidation() {
  return /^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value);
}

function emailValidation() {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
    document.getElementById("emailInput").value
  );
}

function phoneValidation() {
  return /^[+20]?01[0125][0-9]{8}$/.test(
    document.getElementById("phoneInput").value
  );
}

function ageValidation() {
  return /^([1-9]|[1-9][0-9])$/.test(
    document.getElementById("ageInput").value
  );
}

function passwordValidation() {
  return /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(
    document.getElementById("passwordInput").value
  );
}

function repasswordValidation() {
  return (
    document.getElementById("repasswordInput").value ==
    document.getElementById("passwordInput").value
  );
}
const searchButton = document.getElementById('btn');
const mealList = document.getElementById('search-result');
const fav = document.getElementById('favButton');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');


let favouriteList = [];


searchButton.addEventListener('click', getMealList);
mealList.addEventListener('click', getRecepe);

recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

function getMealList(){
    let searchInput = document.getElementById('search-input').value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInput}`)
    .then(Response => Response.json())
    .then(data =>{
        let html = "";
        if(data.meals){
           
            data.meals.forEach(meal => {
                html += `
                <div class="meal-item" data-id="${meal.idMeal}">
                  <div class="meal-img">
                     <img src="${meal.strMealThumb}" alt="food">
                  </div>
                  <div class="meal-name">
                     <h3>${meal.strMeal}</h3>
                     <button type="submit" class="favourite">Add To Favourite</button>
                     <button type="submit" class="get-receipe">Get recepie</button>
                  </div>
               </div>
              
                `;
                
                
            });

       
        }else{
            html = "sorry we didn't find any meal";
            mealList.classList.add('notFound');
        }
        mealList.innerHTML = html;
    });
}


//get recipe of the meal
function getRecepe(e){
    e.preventDefault();
    if(e.target.classList.contains('get-receipe')){
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data.meals));
    }
    if(e.target.classList.contains('favourite')){
        let mealItems = e.target.parentElement.parentElement;
        console.log(mealItems);
        
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItems.dataset.id}`)
        .then(response => response.json())
        .then(data => addToFavorites(data.meals));
      
        
    }
}


//createing a  model
function mealRecipeModal(meal){
    console.log(meal);
    meal = meal[0];
    let html = `
    <h2 class = "recipe-title">${meal.strMeal}</h2>
        <p class = "recipe-category">${meal.strCategory}</p>
        <div class = "recipe-instruct">
          <h3>Instructions:</h3>
          <p>${meal.strInstructions}</p>
        </div>
        <div class = "recipe-meal-img">
          <img src = "${meal.strMealThumb}" alt = "">
        </div>
        <div class = "recipe-link">
          <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}






function addToFavorites(meal) {
  console.log(meal[0].strMeal);
  if (!favouriteList.includes(meal)) {
    favouriteList.push(meal);
    alert(`${meal[0].strMeal} has been added to your favorites.`);
  } else {
    alert(`${meal[0].strMeal} is already in your favorites.`);
  }
  }

  fav.addEventListener('click', showFav);


// Define a function to show all fav meal which are in favr array
function showFav() {
    mealList.innerHTML = '';
  
  if (favouriteList.length === 0) {
    const noFavMessage = document.createElement('p');
    noFavMessage.innerText = 'You have no favorite meals.';
    mealList.appendChild(noFavMessage);
  } else {
    console.log(favouriteList);
    favouriteList.forEach(meals => {
      console.log("Current Meal:", meals);
      console.log(meals.strMeal);
      const mealElement = document.createElement('div');
      mealElement.classList.add('meals');
      
      const mealImage = document.createElement('img');
      mealImage.src = meals[0].strMealThumb;
      mealImage.alt = meals[0].strMeal;
      mealElement.appendChild(mealImage);

      const mealName = document.createElement('h2');
     
      mealName.innerText = meals[0].strMeal;
      mealElement.appendChild(mealName);

      const mealIngredients = document.createElement('ul');
      for (let i = 1; i <= 20; i++) {
          if (meals[`strIngredient${i}`] && meals[`strMeasure${i}`]) {
            console.log(meals[`strIngredient${i}`])
              const ingredient = document.createElement('li');
              ingredient.innerText = `${meals[`strIngredient${i}`]} - ${meals[`strMeasure${i}`]}`;
              mealIngredients.appendChild(ingredient);
          } else {
              break;
          }
      }
      mealElement.appendChild(mealIngredients);

      const removeButton = document.createElement('button');
      removeButton.innerHTML = '<i class="fas fa-trash"></i> Remove from Favorites';
      removeButton.addEventListener('click', () => {
          removeFromFavorites(meals);
      });
      mealElement.appendChild(removeButton);

      mealList.appendChild(mealElement);
    });
  }
}






  
  
function removeFromFavorites(meal) {
  const mealIndex = favouriteList.findIndex(fav => fav.idMeal === meal.idMeal);
  if (mealIndex !== -1) {
    favouriteList.splice(mealIndex, 1);
    showFav();
    alert(`${meal[0].strMeal} has been removed from your favorites.`);
  }
}



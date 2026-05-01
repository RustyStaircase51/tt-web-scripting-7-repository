const savedContainer = document.getElementById("saved");
const status = document.getElementById("status");
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
const categoryFilter = document.getElementById("categoryFilter");


// Listens for buttons ("View Recipe", "Remove Favorite", and "Back to Favorites")
categoryFilter.addEventListener("change", filterFavorites);
savedContainer.addEventListener("click", function (e) {
    const id = e.target.getAttribute("meal-id");

    if (e.target.classList.contains("viewBtn")) {
        viewRecipe(id);
    }
    if (e.target.classList.contains("removeBtn")){
        removeFavorite(id);
    }
    if (e.target.classList.contains("backBtn")){
        categoryFilter.value = ""
        displayFavorites();
    }

});


//filters favorites
function filterFavorites() { 
    const category = categoryFilter.value
    if (category) {
        const filtered = favorites.filter(meal => meal.strCategory === category);
        displayFavorites(filtered);
        return;
    }

        displayFavorites(favorites);
        return;



}

// loads the card div unless there are no favorites.
function displayFavorites(list = favorites) {
    if (list.length === 0) {
        status.textContent = "No favorites saved yet. Go search for some new recipes!";
        savedContainer.innerHTML = "";
        return;
    }

    status.textContent = `Showing ${list.length} favorite(s).`;

    savedContainer.innerHTML = list.map(meal => {
        return `
        <div class="card">
            <h3>${meal.strMeal}</h3>
            <p><strong>Category:</strong> ${meal.strCategory}</p>
            <p><strong>Area:</strong> ${meal.strArea}</p>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>

			<br><button class="viewBtn" meal-id="${meal.idMeal}">View Recipe</button>
            <br><button class="removeBtn" meal-id="${meal.idMeal}">Remove Favorite</button>
        </div>
        `;
    }).join("");
}



// Deletes the favorite from localStorage
function removeFavorite(id) {
    favorites = favorites.filter(meal => meal.idMeal !== id);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites();
}



// Recipe View UI (Reused from search-script)
function viewRecipe(id) {
    const meal = favorites.find(m => m.idMeal === id);
	const ingredients = []
		
	for (let i = 1; i <= 20; i++) {
		const ingred = meal[`strIngredient${i}`];
		
	if (ingred.trim() !== "") {
		ingredients.push(ingred);}
	}
		
		
    savedContainer.innerHTML = `
        <div class="card">
            <h2>${meal.strMeal}</h2>
            <img src="${meal.strMealThumb}" />
			<p><strong>Ingredients:</strong></p>
			<ul>${ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
			<p><strong>Steps:</strong> ${meal.strInstructions}</p>
            <br><button class="backBtn">Back to Favorites</button>
        </div>
    `;
}




//Shows favorites immediately on page load
displayFavorites();
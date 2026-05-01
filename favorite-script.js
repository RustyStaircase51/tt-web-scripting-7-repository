const savedContainer = document.getElementById("saved");
const status = document.getElementById("status");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

displayFavorites();

function displayFavorites() {
    if (favorites.length === 0) {
        status.textContent = "No favorites saved yet.";
        savedContainer.innerHTML = "";
        return;
    }

    status.textContent = `You have ${favorites.length} favorite(s).`;

    savedContainer.innerHTML = favorites.map(meal => {
        return `
        <div class="card">
            <h3>${meal.strMeal}</h3>
            <p><strong>Category:</strong> ${meal.strCategory}</p>
            <p><strong>Area:</strong> ${meal.strArea}</p>

            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
			<br><button class="viewBtn" meal-id="${meal.idMeal}">View Recipe</button>
            <br><button class="removeBtn" meal-id="${meal.idMeal}">
                Remove
            </button>
        </div>
        `;
    }).join("");
}

// Event listener for remove buttons
savedContainer.addEventListener("click", function(e) {
    if (e.target.classList.contains("removeBtn")) {
        const id = e.target.getAttribute("meal-id");
        removeFavorite(id);
    }
});

function removeFavorite(id) {
    favorites = favorites.filter(meal => meal.idMeal !== id);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites();
}

// Recipe View UI
function viewRecipe(id) {
    const meal = currentMeals.find(m => m.idMeal === id);
	const ingredients = []
		
	for (let i = 1; i <= 20; i++) {
		const ingred = meal[`strIngredient${i}`];
		
	if (ingred.trim() !== "") {
		ingredients.push(ingred);}
	}
		
		
    results.innerHTML = `
        <div class="card">
            <h2>${meal.strMeal}</h2>
            <img src="${meal.strMealThumb}" />
			<p><strong>Ingredients:</strong></p>
			<ul>${ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
			<p><strong>Steps:</strong> ${meal.strInstructions}</p>
            <br><button class="backBtn">Back to Results</button>
        </div>
    `;
}


const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const status = document.getElementById("status");
const results = document.getElementById("results");
const categoryFilter = document.getElementById("categoryFilter");
let currentMeals = []; 



// Button Listeners ()
searchBtn.addEventListener("click", runSearch);
results.addEventListener("click", function (e) {
    const id = e.target.getAttribute("meal-id");

    if (e.target.classList.contains("favBtn")) {
        toggleFavorites(id, e.target);
    }

    if (e.target.classList.contains("viewBtn")) {
        viewRecipe(id);
    }
	if (e.target.classList.contains("backBtn")) {
		runSearch();
	}
});



//Search logic
async function runSearch() {
	const term = searchInput.value.trim();

	if (!term) {
		status.textContent = "Please enter a dish name.";
		results.innerHTML = "";
		return;
	}

	status.textContent = "Loading...";
	results.innerHTML = "";

	try {
		const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(term)}`;
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}
		
		const data = await response.json();
	
		if (!data.meals) {
			status.textContent = "No results found.";
			return;
		}

		let meals = data.meals
		
		const category = categoryFilter.value

		if (category) {
			meals = meals.filter(meal => meal.strCategory === category);
		}
		
		
		status.textContent = `Found ${meals.length} result(s).`;
		
		currentMeals = data.meals;
		loadResults({meals});	// calls UI
				
		
		} catch (error) {
		status.textContent = "Something went wrong. Please try again.";
		console.error(error);
		}
}



//UI logic for search
function loadResults(data) {
	let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
	
	results.innerHTML = data.meals.map(meal => {
		const isSaved = favorites.some(f => f.idMeal === meal.idMeal);
		
		return `<div class="card">
			<br><h3>${meal.strMeal}</h3>
			
			<p><strong>Category:</strong> ${meal.strCategory}</p>
			<p><strong>Area:</strong> ${meal.strArea}</p>
			
			<img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
			
			<br><button class="viewBtn" meal-id="${meal.idMeal}">View Recipe</button>
			<br><button class="favBtn ${isSaved ? "removeFav" : ""}" meal-id="${meal.idMeal}"> ${isSaved ? "Remove Favorite" : "Add to Favorites"}</button>
		
		</div>`;}).join("");
}





// Favorite Logic
function toggleFavorites(id, button) {
	const meal = currentMeals.find(m => m.idMeal === id);
	let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
	const index = favorites.findIndex(f => f.idMeal === id);

	if (index === -1) {
		favorites.push(meal);
		button.textContent = "Remove Favorite";
		button.classList.add("removeFav");
	}
	else {
		favorites.splice(index, 1);
		button.textContent = "Add to Favorites";
		button.classList.remove("removeFav");
	}
	localStorage.setItem("favorites", JSON.stringify(favorites));
};




	
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

		
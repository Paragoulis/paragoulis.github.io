let recipes = [];
let searchTerm = "";

const main = document.getElementById("main");

async function loadRecipes() {
  try {
    const response = await fetch("recipes.json");
    recipes = await response.json();
    handleHashChange();
  } catch (error) {
    main.innerHTML = "<p>Nem sikerült betölteni a recepteket.</p>";
    console.error("Hiba a receptek betöltésekor:", error);
  }
}

function renderList() {
  const container = document.createElement("div");
  container.className = "container";
  container.id = "recipe-list";

  const keywords = searchTerm
    .toLowerCase()
    .split(",")
    .map(k => k.trim())
    .filter(k => k.length > 0);

  const filteredRecipes = recipes.filter(recipe =>
    keywords.every(keyword =>
      recipe.ingredients.some(ing =>
        ing.toLowerCase().includes(keyword)
      )
    )
  );

  if (filteredRecipes.length === 0 && keywords.length > 0) {
    container.innerHTML = "<p>Nincs találat a megadott hozzávalókra.</p>";
  } else {
    filteredRecipes.forEach(r => {
      const card = document.createElement("a");
      card.className = "card";
      card.href = `#recipe-${r.id}`;
      card.innerHTML = `<h2>${r.title}</h2><p>${r.description}</p>`;
      container.appendChild(card);
    });
  }

  main.innerHTML = `
    <div class="search-container">
      <div class="search-wrapper">
        <input type="text" id="search" placeholder="pl. tojás, liszt" value="${searchTerm}" />
        <button id="clear-search" title="Törlés">&times;</button>
      </div>
      <button id="search-button" title="Keresés">
        <i class="fas fa-magnifying-glass"></i>
      </button>
    </div>
  `;

  main.appendChild(container);

  document.getElementById("search-button").addEventListener("click", () => {
    searchTerm = document.getElementById("search").value;
    renderList();
  });

  document.getElementById("clear-search").addEventListener("click", () => {
    searchTerm = "";
    renderList();
  });
}

function renderRecipe(id) {
  const recipe = recipes.find(r => r.id === id);
  if (!recipe) return renderList();

  const instructionSteps = recipe.instruction
    .split('\n')
    .map(step => `<li>${step.trim()}</li>`)
    .join("");

  main.innerHTML = `
    <div class="recipe-page">
      <a class="back" href="#">&larr; Vissza</a>
      <h2>${recipe.title}</h2>
      <p>${recipe.description}</p>
      <h3>Hozzávalók:</h3>
      <ul>
        ${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}
      </ul>
      <h3>Elkészítés:</h3>
      <ol>
        ${instructionSteps}
      </ol>
    </div>
  `;
}

function handleHashChange() {
  const hash = location.hash;
  if (hash.startsWith("#recipe-")) {
    const id = hash.replace("#recipe-", "");
    renderRecipe(id);
  } else {
    renderList();
  }
}

window.addEventListener("hashchange", handleHashChange);
loadRecipes();

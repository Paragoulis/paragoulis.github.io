let recipes = [];

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
  main.innerHTML = `<div class="container" id="recipe-list"></div>`;
  const container = document.getElementById("recipe-list");
  recipes.forEach(r => {
    const card = document.createElement("a");
    card.className = "card";
    card.href = `#recipe-${r.id}`;
    card.innerHTML = `<h2>${r.title}</h2><p>${r.description}</p>`;
    container.appendChild(card);
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

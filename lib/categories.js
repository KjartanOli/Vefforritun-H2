import { el, empty } from "./helpers.js";
// Við þurfum cache hérna, mér er sama hversu mikið eslint vill væla yfir dependency cycles
// eslint-disable-next-line import/no-cycle
import { cache } from "./cache.js";
// Já þessi modules skilgreina föll sem eru notuð í hinum module-inu
// eslint-disable-next-line import/no-cycle
import { categoryStats } from "./stats.js";

const categories = [];

/**
 * Vista flokka í local storage
 */
function saveCategories() {
	localStorage.setItem("categories", JSON.stringify(categories));
	categoryStats();
}

/**
	* Bætir nýjum flokki við, og vistar í local storage
	* @param {string | Category} category Titil flokksins eða Flokkur ef nú þegar til
	* @param {boolean} save Hvort það eigi að vista flokka
	* @returns {string} id nýja flokksins
	*/
export function addCategory(category, save = false) {
	if (typeof category === "string") {
		// Það gerir restina miklu auðveldari að endurskilgreina category
		// eslint-disable-next-line no-param-reassign
		category = {
			id: category.toLowerCase().replace(/ /, "-"),
			title: category,
		};
	}
	categories.push(category);
	if (save) {
		saveCategories();
	}

	return category.id;
}

/**
 * Fá lista af öllum þekktum flokkum
 * @returns {Array<Category>} Allir þekktir flokkar
 */
export function getCategories() {
	return categories;
}


export function createCategorySelection(todo) {
	if (todo.category === "") {
		todo.categorySelector.appendChild(el("option", "Flokkur"));
	}
	for (const cat of categories) {
		const c = el("option", cat.title);
		c.setAttribute("value", cat.id);
		if (cat.id === todo.category) {
			c.setAttribute("selected", "true");
		}
		todo.categorySelector.appendChild(c);
	}

	const newCat = el("option", "Nýr flokkur");
	newCat.setAttribute("value", "new");
	todo.categorySelector.appendChild(newCat);
}

function updateCategorySelects() {
	for (const todo of cache.todos.filter(t => t.categorySelector)) {
		empty(todo.categorySelector);
		createCategorySelection(todo);
	}
}

export function createCategoryCreator(todo) {
	return () => {
		const input = el("input");
		input.setAttribute("placeholder","nafn á flokk...");
		input.setAttribute("size","32");
		const confirm = el("button", "✓");
		const container = el("div", input, confirm);
		container.setAttribute("class","new-category");

		confirm.addEventListener("click", () => {
			const id = addCategory(input.value, true);
			container.replaceWith(todo.categorySelector);
			// Gráttu mér á eslint, þetta er Javascript ekki Haskell
			// eslint-disable-next-line no-param-reassign
			todo.category = id;
			cache.markAsModified();
			updateCategorySelects();
			categoryStats();
		});
		todo.categorySelector.replaceWith(container);
		input.focus();
	};
}

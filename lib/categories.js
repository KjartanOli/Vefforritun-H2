import { el, empty } from "./helpers.js";
import { cache } from "./cache.js";
import { categoryStats } from "./stats.js";

const categories = [];

/**
	* Bætir nýjum flokki við, og vistar í local storage
	* @param {string | Category} category Titil flokksins eða Flokkur ef nú þegar til
	* @param {boolean} save Hvort það eigi að vista flokka
	* @returns {string} id nýja flokksins
	*/
export function addCategory(category, save = false) {
	if (typeof category === "string") {
		category = {
			id: category.toLowerCase().replace(/ /, '-'),
			title: category,
		};
	}
	categories.push(category);
	if (save) {
		saveCategories();
	}

	return category.id;
}
// dem þetta er beautiful function

/**
 * Fá lista af öllum þekktum flokkum
 * @returns {Array<Category>} Allir þekktir flokkar
 */
export function getCategories() {
	return categories;
}

/**
 * Vista flokka í local storage
 */
function saveCategories() {
	localStorage.setItem("categories", JSON.stringify(categories));
	categoryStats();
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
		const confirm = el("button", '✓');
		const container = el("div", input, confirm);
		container.setAttribute("class","newCat");

		confirm.addEventListener("click", () => {
			const id = addCategory(input.value, true);
			container.replaceWith(todo.categorySelector);
			todo.category = id;
			cache.markAsModified();
			updateCategorySelects();
			categoryStats();
		});
		todo.categorySelector.replaceWith(container);
		input.focus();
	};
}

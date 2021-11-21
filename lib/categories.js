import { el, empty } from "./helpers.js";
import { cache } from "./cache.js";

const categories = [];
const catData = document.querySelector(".flokkarData")

/**
	* Bætir nýjum flokki við, og vistar í local storage
	* @param {string | Category} category Titil flokksins eða Flokkur ef nú þegar til
	* @param {boolean} save Hvort það eigi að vista flokka
	*/
export function addCategory(category, save = false) {
	if (typeof category === "string") {
		categories.push({
			id: category.toLowerCase().replace(/ /, '-'),
			title: category,
		});
	}
	else {
		categories.push(category);
	}
	if (save) {
		saveCategories();
	}
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
	showCategories();
}

function createCategorySelection(container) {
	for (const cat of categories) {
		const c = el("option", cat.title);
		c.setAttribute("value", cat.id);
		container.appendChild(c);
	}

	const newCat = el("option", "Nýr flokkur");
	newCat.setAttribute("value", "new");
	container.appendChild(newCat);
}

function updateCategorySelects() {
	for (const todo of cache.todos) {
		empty(todo.categorySelector);
		createCategorySelection(todo.categorySelector);
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
			addCategory(input.value, true);
			container.replaceWith(element);
			todo.category = input.value;
			cache.markAsModified();
			updateCategorySelects();
		});
		element.replaceWith(container);
		input.focus();
	};
}

export function showCategories() {
	empty(catData);
	for (const cat of categories) {
		let p = el("p",cat.title);
		let s = el("span","1");
		let d = el("div",p,s);
		d.setAttribute("class","sideData");
		catData.appendChild(d);
	}
}
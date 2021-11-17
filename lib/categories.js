import { el, empty } from "./helpers.js";

const categories = [];

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
	for (const el of document.querySelectorAll(".category")) {
		empty(el);
		createCategorySelection(el);
	}
}

export function createGategoryCreator(element) {
	return () => {
		const input = el("input");
		input.setAttribute("placeholder","nafn á flokk...")
		input.setAttribute("size","32")
		const confirm = el("button", '✓');
		const container = el("div", input, confirm);
		container.setAttribute("class","newCat")

		confirm.addEventListener("click", () => {
			addCategory(input.value, true);
			container.replaceWith(element);
			updateCategorySelects();
		});
		element.replaceWith(container);
		input.focus();
	};
}

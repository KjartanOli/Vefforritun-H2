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

export function createCategorySelection(todo) {
	todo.categorySelector.appendChild(el("option","Flokkur"))
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
		console.log(todo)
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
			addCategory(input.value, true);
			container.replaceWith(todo.categorySelector);
			todo.category = input.value;
			cache.markAsModified();
			updateCategorySelects();
		});
		todo.categorySelector.replaceWith(container);
		input.focus();
	};
}

export function showCategories() {
	empty(catData);
	for (const cat of categories) {
		let p = el("p",cat.title);
		let c = 0;
		for (const todo of cache.todos) {
			console.log("todo.category: " + todo.category)
			if (todo.category === cat.id) c++;
		}
		let s = el("span",c.toString());
		let d = el("div",p,s);
		d.setAttribute("class","sideData");
		catData.appendChild(d);
	}
}

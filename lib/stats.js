import { el, empty } from "./helpers.js";
import { cache } from "./cache.js";
import { getCategories } from "./categories.js";

const catData = document.querySelector(".flokkarData");

export function showCategories() {
	empty(catData);
	const stats = {};
	for (const todo of cache.todos.filter(t => !t.deleted)) {
		if (stats[todo.category] && !todo.deleted) {
			++stats[todo.category];
		}
		else {
			stats[todo.category] = 1;
		}
	}
	for (const cat of getCategories()) {
		let p = el("p", cat.title);
		let s = el("span", stats[cat.id] ? stats[cat.id].toString() : "0");
		let d = el("div", p, s);
		d.setAttribute("class", "sideData");
		catData.appendChild(d);
	}
}

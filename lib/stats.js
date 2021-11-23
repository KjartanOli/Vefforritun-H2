import { el, empty } from "./helpers.js";

const catData = document.querySelector(".flokkarData");

export function showCategories() {
	empty(catData);
	const stats = {};
	for (const todo of cache.todos) {
		if (stats[todo.category]) {
			++stats[todo.category];
		}
		else {
			stats[todo.category] = 1;
		}
	}
	for (const cat of categories) {
		let p = el("p", cat.title);
		let s = el("span", stats[cat.id] ? stats[cat.id].toString() : "0");
		let d = el("div", p, s);
		d.setAttribute("class", "sideData");
		catData.appendChild(d);
	}
}

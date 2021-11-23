import { el, empty } from "./helpers.js";
import { cache } from "./cache.js";
import { getCategories } from "./categories.js";

const catData = document.querySelector("#categoryStats");
const tagData = document.querySelector("#tagStats");

export function categoryStats() {
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

	for (const cat of getCategories()) {
		if (stats[cat.id]) {
			const container = el("div", el("p", cat.title), el("span", stats[cat.id].toString()));
			container.classList.add("sideData");
			catData.appendChild(container);
		}
	}
}

export function tagStats() {
	empty(tagData);
	const stats = {};
	for (const todo of cache.todos.filter(t => !t.deleted)) {
		for (const tag of todo.tags) {
			if (stats[tag]) {
				++stats[tag];
			}
			else {
				stats[tag] = 1;
			}
		}
	}

	for (const tag in stats) {
		const container = el("div", el("p", tag), el("span", stats[tag].toString()));
		container.classList.add("sideData");
		tagData.appendChild(container);
	}
}

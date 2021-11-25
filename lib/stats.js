import { el, empty } from "./helpers.js";
// Á þessum tímapunkti er það orðið mjög freistandi að slökkva globally á þessari reglu
// eslint-disable-next-line import/no-cycle
import { cache } from "./cache.js";
// eslint-disable-next-line import/no-cycle
import { getCategories } from "./categories.js";

const catData = document.querySelector("#category-stats");
const tagData = document.querySelector("#tag-stats");
const Fjoldi = document.querySelector("#todo-count");
const doneFjoldi = document.querySelector("#finished-count");

export function categoryStats() {
	empty(catData);
	const stats = {};
	for (const todo of cache.todos.filter(t => !t.deleted)) {
		if (stats[todo.category] && !todo.deleted) {
			// Þetta er ein heimskulegasta reglan í airbnb settinu
			// eslint-disable-next-line no-plusplus
			++stats[todo.category];
		}
		else {
			stats[todo.category] = 1;
		}
	}

	for (const cat of getCategories()) {
		if (stats[cat.id]) {
			const container = el("div", el("p", cat.title), el("span", stats[cat.id].toString()));
			container.classList.add("side-data");
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
				// Ég held ég sú búinn að tjá skoðun mína á þessari reglu nógu skýrt
				// eslint-disable-next-line no-plusplus
				++stats[tag];
			}
			else {
				stats[tag] = 1;
			}
		}
	}

	// Ég veit ekki einu sinni hvað þetta þýðir
	// eslint-disable-next-line guard-for-in
	for (const tag in stats) {
		const container = el("div", el("p", tag), el("span", stats[tag].toString()));
		container.classList.add("side-data");
		tagData.appendChild(container);
	}
}

export function fjoldi() {
	const h = cache.todos;
	let itemFjoldiNum = 0;
	let doneFjoldiNum = 0;

	for (const i of h) {
		// Ég held ég sú búinn að tjá skoðun mína á þessari reglu nógu skýrt
		// eslint-disable-next-line no-plusplus
		++itemFjoldiNum;
		if (i.data.completed) {
			// Ég held ég sú búinn að tjá skoðun mína á þessari reglu nógu skýrt
			// eslint-disable-next-line no-plusplus
			++doneFjoldiNum;
		}
	}
	Fjoldi.textContent = itemFjoldiNum;
	doneFjoldi.textContent = doneFjoldiNum;

}

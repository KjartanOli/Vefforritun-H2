import { cache } from "./lib/cache.js";
import {
	addCategory,
	getCategories,
} from "./lib/categories.js";
import { el } from "./lib/helpers.js";
import { categoryStats, tagStats } from "./lib/stats.js";

async function onStart() {
	// let geymdurListi = localStorage.getItem("listi");
	// let parsedListi = JSON.parse(geymdurListi);
	let remote, cats;
	let local = JSON.parse(localStorage.getItem("todos"));

	try {
		let data = await fetch(new URL("data.json", window.location.href));
		data = await data.json();
		remote = data.items;
		cats = data.categories;
	} catch (e) {
		console.log(e);
	}


	const categories = localStorage.getItem("categories");
	if (categories === null) {
		for (const cat of cats) {
			addCategory(cat);
		}
	} else {
		for (const cat of JSON.parse(categories)) {
			addCategory(cat);
		}
	}
	if (local) {
		for (const localItem of local) {
			let element;
			for (const item of remote) {
				if (item.id === localItem.id) {
					element = cache.newItem(item.modified > localItem.modified ? item : localItem);
					if (element) {
						holder.appendChild(element);
					}
					break;
				}
			}
			if (!element) {
				element = cache.newItem(localItem);
				// console.log(element)
				if (element) {
					holder.appendChild(element);
				}
			}
		}
	} else {
		for (const item of remote) {
			const element = cache.newItem(item);
			if (element) {
				holder.appendChild(element);
			}
		}
	}
	categoryStats();
	tagStats();
	createAddNew();
}

function createAddNew() {
	let takki = el("button","Bæta við nýju ToDo");
	takki.setAttribute("class","addNewButton");
	takki.addEventListener("click", (e) => {
		console.log("CreateAddNew")
		let newCard = cache.newItem(null);
		takkiHolder.replaceWith(newCard);
		createAddNew();
	})
	let takkiHolder = el("div",takki)
	takkiHolder.setAttribute("class","takkiholder")
	document.querySelector("#holder").appendChild(takkiHolder)
}

onStart();

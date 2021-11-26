// Þetta þarfnast varla útskýringar lengur, er það nokkuð?
// eslint-disable-next-line import/no-cycle
import { cache } from "./lib/cache.js";
import {
	addCategory,
} from "./lib/categories.js";
import { el } from "./lib/helpers.js";
import { categoryStats, tagStats,fjoldi } from "./lib/stats.js";


export function createAddNew() {
	const takki = el("button", "Bæta við nýju ToDo");
	takki.setAttribute("class", "add-new-button");
	const takkiContainer = el("div", takki);
	takki.addEventListener("click", () => {
		const newCard = cache.newItem(null);
		takkiContainer.remove();
		newCard.insert();
		createAddNew();
	});
	takkiContainer.setAttribute("class", "takkicontainer");
	document.querySelector("#container").appendChild(takkiContainer);
}

async function onStart() {
	// let geymdurListi = localStorage.getItem("listi");
	// let parsedListi = JSON.parse(geymdurListi);
	let remote;
	let cats;
	const local = JSON.parse(localStorage.getItem("todos"));

	try {
		let data = await fetch(new URL("data.json", window.location.href));
		data = await data.json();
		remote = data.items;
		cats = data.categories;
	} catch (e) {
		console.error(e);
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
			let inBoth = false;
			for (const item of remote) {
				if (item.id === localItem.id) {
					cache.newItem(item.modified > localItem.modified ? item : localItem).insert();
					inBoth = true;
					break;
				}
			}
			if (!inBoth) {
				cache.newItem(localItem).insert();
			}
		}
	} else {
		for (const item of remote) {
			cache.newItem(item).insert();
		}
	}
	categoryStats();
	tagStats();
	createAddNew();
	fjoldi()

}


onStart();

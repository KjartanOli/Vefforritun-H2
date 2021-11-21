import { cache } from "./lib/cache.js";
import { addCategory, getCategories, showCategories } from "./lib/categories.js";

let takki = document.querySelector("#testTakki");
let iTitill = document.querySelector("#inputTitill");
let iLysing = document.querySelector("#inputLysing");
let iDags = document.querySelector("#inputDags");
let iTag1 = document.querySelector("#inputTag1");
let iTag2 = document.querySelector("#inputTag2");
let iTag3 = document.querySelector("#inputTag3");
let iFlokkur = document.querySelector("#inputFlokkur");
let iLitur = document.querySelector("#inputLitur");
let sideBarCat = document.querySelector(".flokkarData")

let listi = [];
let id = 0;

// takki.addEventListener("click", nyttShit);
// let template = document.querySelector("#template");
// let holder = document.querySelector("#holder");

// function nyttShit() {
//   let uppl = writeJson();
//   builder(uppl.ID,uppl.Titill,uppl.Lysing,uppl.Dags,uppl.Flokkur,uppl.Tags,uppl.Litur);
// }

function takeAndEscape(e) {
  let output = e.value;
  e.value = null;
  return output;
}

async function onStart() {
  // let geymdurListi = localStorage.getItem("listi");
  // let parsedListi = JSON.parse(geymdurListi);
	let items, cats;
	if (localStorage.getItem("listi") === null || localStorage.getItem("categories")) {
		try {
			let data = await fetch(new URL("data.json", window.location.href));
			data = await data.json();
			items = data.items;
			cats = data.categories;
		}
		catch (e) {
			console.log(e);
		}
	}

	const categories = localStorage.getItem("categories")
	if (categories === null) {
		for (const cat of cats) {
			addCategory(cat);
		}
	}
	else {
		for (const cat of JSON.parse(categories)) {
			addCategory(cat);
		}
	}
	console.log(items)
	console.log(getCategories())
  showCategories();

  for (const item of items) {
		const element = cache.newItem(item);
		if (element) {
			holder.appendChild(element);
		}
  }
}

onStart();

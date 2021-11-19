import { cache } from "./cache.js";
import { getCategories } from "./categories.js";
import { el } from "./helpers.js";

//fjöldi stafa sem þarf að taka aftan af input til þess að textinn lýti út fyrir að vera í miðjunni
const sizeMagicNum = 0;
const template = document.querySelector("#template");

export class TodoItem {
	#data;
	#container;
	#categorySelector;

	constructor(item) {
		this.#data = item;
		this.#container = this.#data.deleted ? null : template.content.cloneNode(true);

		if (!this.#container) {
			return null;
		}

		const title = this.#container.querySelector(".titill");
		const description = this.#container.querySelector(".lysing");
		const due = this.#container.querySelector(".dags");
		const tagContainer = this.#container.querySelector(".tags");
		this.#categorySelector = this.#container.querySelector(".category");
		const addTagButton = this.#container.querySelector(".addTag");
		const checkbox = this.#container.querySelector(".check");

		title.value = this.#data.title;
		resizeTitle(title);
		title.addEventListener("change", (e) => {
			resizeTitle(title);
			this.#data.title = title.value;
			cache.markAsModified();
		});

		description.value = this.#data.description;
		resizeDescription(description);
		description.addEventListener("input", (e) => {
			resizeDescription(description);
			this.#data.description = description.value;
			cache.markAsModified();
		});


		due.value = this.#data.due;

		let card = this.#container.querySelector(".card");
		for (const cat of getCategories()) {
			const c = el("option", cat.title);
			c.setAttribute("value", cat.id);
			if (cat.id === this.#data.category) {
				c.setAttribute("selected", "true");
			}
			this.#categorySelector.appendChild(c);
		}

		const newCat = el("option", "Nýr flokkur");
		newCat.setAttribute("value", "new");
		this.#categorySelector.appendChild(newCat);

		this.#categorySelector.addEventListener("change", () => {
			if (this.#categorySelector.value === "new") {
				this.createCategoryCreator(categorySelect, this)();
			}
		});

		card.style.borderColor = "#000";
		let idToDel = this.#data.id;

		for (let i = 0; i < this.#data.tags.length; ++i) {
			const t = el("input");
			const li = el("li", t);
			t.value = this.#data.tags[i];
			resizeTag(t);
			tagContainer.appendChild(li);
			t.addEventListener("change", (e) => {
				this.#data.tags[i] = t.value;
				resizeTag(t);
				if (t.value === "") {
					li.remove();
					this.#data.tags = item.tags.filter(s => s !== "");
				}
				cache.markAsModified();
			});
		}

		addTagButton.addEventListener("click", (e) => {
			if (tagContainer.childElementCount < tagUpperLimit) {
				const t = el("input");
				const li = el("li", t);
				t.setAttribute("placeholder", "tag");
				t.setAttribute("size", "10");
				t.addEventListener("change", (e) => {
					console.log(t.value);
					resizeTag(t);
					if (t.value === "") li.remove();
				});
				tagContainer.appendChild(li);
			}
		});

		checkbox.addEventListener('change', (e) => {
			if (checkbox.checked) {
				console.log("Checkbox is checked..");
			} else {
				console.log("Checkbox is not checked..");
			}
		});

		// this.#container.querySelector("#delete").addEventListener("click",(e) => {
		//   card.remove()
		//   console.log(idToDel)
		//   for (const item of listi) {
		//     if (this.#data.ID === idToDel) {
		//       localStorage.removeItem("listi")
		//       listi.splice(listi.indexOf(item),1)
		//       localStorage.setItem("listi",JSON.stringify(listi))
		//       break;
		//     }
		//   }
		// })
	}

	get data() {
		return this.#data;
	}

	get container() {
		return this.#container;
	}

	get categorySelector() {
		return this.#categorySelector;
	}

	set category(cat) {
		this.#data.category = cat;
	}
}

function resizeTitle(t) {
	if (t.value.length > 32) {
		t.setAttribute("rows", 2)
		t.style.height = "2.4em"
	}
	else {
		t.setAttribute("rows", 1);
		t.style.height = "1.2em"
	}
}

function resizeDescription(d) {
	if (d.value == "") {
		d.style.height = "2em"
	}
	else {
		d.style.height = Math.floor(d.value.length / 45) + 2 + "em"
	}
}

function resizeTag(t) {
	if (t.value.length > sizeMagicNum) {
		t.setAttribute("size", t.value.length - sizeMagicNum)
	}

	else {
		t.setAttribute("size", 1)
	}
}

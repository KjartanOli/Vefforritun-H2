import { cache } from "./cache.js";
import { createCategorySelection, getCategories, createCategoryCreator, showCategories } from "./categories.js";
import { el } from "./helpers.js";

//fjöldi stafa sem þarf að taka aftan af input til þess að textinn lýti út fyrir að vera í miðjunni
const sizeMagicNum = 0;
let tagUpperLimit = 6;
const template = document.querySelector("#template");

export class TodoItem {
	#data;
	#container;
	#categorySelector;

	constructor(item) {
		

		this.#data = item;
		

		this.#container = this.#data.deleted ? null : template.content.cloneNode(true);

		if (!this.#container) {
			return;
		}

		const title = this.#container.querySelector(".titill");
		const description = this.#container.querySelector(".lysing");
		const due = this.#container.querySelector(".dags");
		const tagContainer = this.#container.querySelector(".tags");
		this.#categorySelector = this.#container.querySelector(".category");
		const addTagButton = this.#container.querySelector(".addTag");
		const important = this.#container.querySelector(".important");
		const done = this.#container.querySelector(".done");
		const efst = this.#container.querySelector(".efst");
		const Ctitle = this.#container.querySelector(".Otitill"); //closed title
		const Cdue = this.#container.querySelector(".Odags"); //closed date
		const Odescription = this.#container.querySelector(".nedri-lysing");
		const Odate = this.#container.querySelector(".nedri-date");
		const Ocategory = this.#container.querySelector(".nedri-flokkur");
		const Otags = this.#container.querySelector(".nedri-tags");
		const Odeleted = this.#container.querySelector(".nedri-delete");

		title.value = this.#data.title;
		title.style.display = "none";
		Ctitle.textContent = title.value;
		resizeTitle(title);

		title.addEventListener("change", () => {
			resizeTitle(title);
			this.#data.title = title.value;
			cache.markAsModified();
			this.#data.modified = Date.now();
		});

		title.addEventListener("click", (e) => {
			e.stopPropagation();
		});

		description.value = this.#data.description;
		// resizeDescription(description);
		description.addEventListener("input", () => {
			// resizeDescription(description);
			this.#data.description = description.value;
			cache.markAsModified();
			this.#data.modified = Date.now();
		});


		due.value = this.#data.due;
		Cdue.textContent = due.value;
		due.addEventListener("change", () => {
			Cdue.textContent = due.value;
			this.#data.due = new Date(due.value).getTime();
			cache.markAsModified();
			this.#data.modified = Date.now();
		});

		let card = this.#container.querySelector(".card");
		createCategorySelection(this);
		this.#categorySelector.addEventListener("change", () => {
			if (this.#categorySelector.value === "new") {
				createCategoryCreator(this)();
			}
			cache.markAsModified();
			this.#data.category = this.#categorySelector.value;
			showCategories();
		});

		card.style.borderColor = "#000";

		for (let i = 0; i < this.#data.tags.length; ++i) {
			const t = el("input");
			const li = el("li", t);
			t.value = this.#data.tags[i];
			resizeTag(t);
			tagContainer.replaceChild(li, addTagButton);
			tagContainer.appendChild(li);
			if (tagContainer.childElementCount < tagUpperLimit - 1) {
				tagContainer.appendChild(addTagButton);
			}
			t.addEventListener("change", () => {
				this.#data.tags[i] = t.value;
				resizeTag(t);
				if (t.value === "") {
					li.remove();
					this.#data.tags = item.tags.filter(s => s !== "");
				}
				cache.markAsModified();
				this.#data.modified = Date.now();
			});
		}

		addTagButton.addEventListener("click", (e) => {
			if (tagContainer.childElementCount < tagUpperLimit) {
				const t = el("input");
				const li = el("li", t);
				this.#data.tags.push(null);
				t.setAttribute("placeholder", "tag");
				t.setAttribute("size", "10");
				t.addEventListener("change", () => {
					console.log(t.value);
					this.#data.tags[this.#data.tags.length - 1] = t.value;
					resizeTag(t);
					if (t.value === "") {
						li.remove();
						this.#data.tags = this.#data.tags.filter(t => t !== "");
					}
					cache.markAsModified();
					this.#data.modified = Date.now();
					if (tagContainer.childElementCount < tagUpperLimit - 1) {
						tagContainer.appendChild(addTagButton);
					}
				});
				tagContainer.replaceChild(li, addTagButton);
				tagContainer.appendChild(li);
				if (tagContainer.childElementCount < tagUpperLimit - 1) {
					tagContainer.appendChild(addTagButton);
      			}
			}
		});

		if (this.#data.priority) {
			important.checked = true;
			console.log(this)
		}
		important.addEventListener('click', (e) => {
			e.stopPropagation();
			this.#data.priority = important.checked;
			cache.markAsModified();
			this.#data.modified = Date.now();
			
		});

		if (this.#data.completed) done.checked = true;
		done.addEventListener('click', (e) => {
			e.stopPropagation();
			this.#data.completed = done.checked;
			cache.markAsModified();
			this.#data.modified = Date.now();
		});


		title.style.display = "none";
		Odescription.style.display = "none";
		Odate.style.display = "none";
		Ocategory.style.display = "none";
		Otags.style.display = "none";
		Odeleted.style.display = "none";

		efst.addEventListener("click", (e) => {
			if (title.style.display === "none") {
				Ctitle.style.display = "none";
				efst.style.display = "grid";
				title.style.display = "grid";
				Odescription.style.display = "block";
				Odate.style.display = "flex";
				Ocategory.style.display = "flex";
				Otags.style.display = "grid";
				Odeleted.style.display = "flex";
			}
			else {
				Ctitle.textContent = title.value;
				Ctitle.style.display = "block";
				title.style.display = "none";
				Odescription.style.display = "none";
				Odate.style.display = "none";
				Ocategory.style.display = "none";
				Otags.style.display = "none";
				Odeleted.style.display = "none";
			}
		});

		this.#container.querySelector("#delete").addEventListener("click",(e) => {
		  card.remove();
			this.#data.deleted = true;
			cache.markAsModified();
			this.#data.modified = Date.now();
		//   console.log(idToDel)
		//   for (const item of listi) {
		//     if (this.#data.ID === idToDel) {
		//       localStorage.removeItem("listi")
		//       listi.splice(listi.indexOf(item),1)
		//       localStorage.setItem("listi",JSON.stringify(listi))
		//       break;
		//     }
		//   }
		});
	};

	get data() {
		return this.#data;
	}

	get id() {
		return this.#data.id
	}

	get category() {
		return this.#data.category;
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
	if (t.value.length > 38) {
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

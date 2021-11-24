import { cache } from "./cache.js";
import { createCategorySelection, createCategoryCreator } from "./categories.js";
import { el } from "./helpers.js";
import { categoryStats, tagStats } from "./stats.js";

//fjöldi stafa sem þarf að taka aftan af input til þess að textinn lýti út fyrir að vera í miðjunni
const sizeMagicNum = 0;
let tagUpperLimit = 6;
const template = document.querySelector("#template");
const holder = document.querySelector("#holder");

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

		this.#container.querySelector(".card").setAttribute("id", `todo-${this.id}`);

		const efst = this.#container.querySelector(".efst");

		this.#createTitle();
		this.#createDescription();
		this.#createDue();
		this.#createCategories();
		this.#createTagListing();
		this.#createPriorityCheckbox();
		this.#createDoneCheckbox();
		this.#createDeletButton();

		efst.addEventListener("click", (e) => {
			this.container.classList.toggle("open");
		});


	};

	#createTitle() {
		const title = this.#container.querySelector(".title");
		const Ctitle = this.#container.querySelector(".Otitle"); //closed title

		title.value = this.#data.title;
		Ctitle.textContent = title.value;
		resizeTitle(title);

		title.addEventListener("change", () => {
			resizeTitle(title);
			this.title = title.value;
		});

		title.addEventListener("click", (e) => {
			e.stopPropagation();
		});
	}

	#createDescription() {
		const description = this.#container.querySelector(".description");

		description.value = this.#data.description;
		// resizeDescription(description);
		description.addEventListener("input", () => {
			// resizeDescription(description);
			this.description = description.value;
		});
	}

	#createTagListing() {
		const tagContainer = this.#container.querySelector(".tags");
		const addTagButton = this.#container.querySelector(".addTag");

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
					this.tags = item.tags.filter(s => s !== "");
				}
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
	}

	#createDue() {
		const due = this.#container.querySelector(".date");
		const Cdue = this.#container.querySelector(".Odate"); //closed date
		if (this.#data.due !== null) {
			let tempdate = new Date(this.#data.due).toLocaleDateString("en-GB");
			due.value = tempdate;
			Cdue.textContent = tempdate;
		}
		due.addEventListener("change", () => {
			Cdue.textContent = due.value;
			this.#data.due = new Date(due.value).getTime();
			cache.markAsModified();
			this.#data.modified = Date.now();
		});
	}

	#createCategories() {
		this.#categorySelector = this.#container.querySelector(".category");
		createCategorySelection(this);
		this.#categorySelector.addEventListener("change", () => {
			if (this.#categorySelector.value === "new") {
				createCategoryCreator(this)();
			}
			this.category = this.#categorySelector.value;
		});
	}

	#createPriorityCheckbox() {
		const important = this.#container.querySelector(".important");
		if (this.#data.priority) {
			important.checked = true;
			// console.log(this)
		}
		important.addEventListener("click", (e) => {
			e.stopPropagation();
			this.#data.priority = important.checked;
			cache.markAsModified();
			this.#data.modified = Date.now();

		});
	}

	#createDoneCheckbox() {
		const done = this.#container.querySelector(".done");
		if (this.#data.completed) done.checked = true;
		done.addEventListener('click', (e) => {
			e.stopPropagation();
			this.completed = done.checked;
		});
	}

	#createDeletButton() {
		let delButton = this.#container.querySelector("#delete");
		delButton.addEventListener("click", (e) => {
			this.pop();
			this.deleted = true;
			categoryStats();
			tagStats();
		});
	}

	#markModification() {
		this.#data.modified = Date.now();
		cache.markAsModified();
	}

	/**
	 * Bætir þessu TODO inn í holder, og tryggir að TODO-ið hafi enn reference að því.
	 */
	insert() {
		if (this.container) {
			holder.appendChild(this.container);
			this.#container = document.querySelector(`#todo-${this.id}`);
		}
	}

	/**
	 * Fjarlægir spjaldið fyrir þetta TODO úr DOM-inu.
	 */
	pop() {
		this.container.remove();
	}

	get data() {
		return this.#data;
	}

	get id() {
		return this.#data.id;
	}

	get title() {
		return this.#data.title;
	}

	get description() {
		return this.#data.description;
	}

	get due() {
		return this.#data.due;
	}

	get category() {
		return this.#data.category;
	}

	get tags() {
		return this.#data.tags;
	}

	get deleted() {
		return this.#data.deleted;
	}

	get container() {
		return this.#container;
	}

	get categorySelector() {
		return this.#categorySelector;
	}

	set category(cat) {
		this.#data.category = cat;
		this.#markModification();
		categoryStats();
	}

	set tags(tags) {
		this.#data.tags = tags;
		this.#markModification();
		tagStats();
	}

	set title(title) {
		this.#data.title = title;
		this.#markModification();
	}

	set description(desc) {
		this.#data.description = desc;
		this.#markModification();
	}

	set deleted(d) {
		this.#data.deleted = d;
		this.#markModification();
	}

	set completed(c) {
		this.#data.completed = c;
		this.#markModification();
	}
}

function resizeTitle(t) {
	if (t.value.length > 38) {
		t.setAttribute("rows", 2);
		// t.style.height = "2.4em"
	}
	else {
		t.setAttribute("rows", 1);
		t.style.height = "1.2em";
	}
}

function resizeTag(t) {
	if (t.value.length > sizeMagicNum) {
		t.setAttribute("size", t.value.length - sizeMagicNum);
	}

	else {
		t.setAttribute("size", 1);
	}
}

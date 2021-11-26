// Þessir dependency cycles eru nauðsynlegir
// eslint-disable-next-line import/no-cycle
import { cache } from "./cache.js";
// eslint-disable-next-line import/no-cycle
import { createCategorySelection, createCategoryCreator } from "./categories.js";
import { el } from "./helpers.js";
// eslint-disable-next-line import/no-cycle
import { categoryStats, tagStats } from "./stats.js";


function resizeTitle(t) {
	if (t.value.length > 38) {
		t.setAttribute("rows", 2);
	}
	else {
		t.setAttribute("rows", 1);
		// Ég veit ekki einusinni hverju hún er að væla yfir hér
		// eslint-disable-next-line no-param-reassign
		t.style.height = "1.2em";
	}
}


function resizeTag(t) {
	if (t.value.length > 0) {
		t.setAttribute("size", t.value.length);
	}

	else {
		t.setAttribute("size", 1);
	}
}

const tagUpperLimit = 6;
const template = document.querySelector("#template");
const container = document.querySelector("#container");

export class TodoItem {
	#data;
	#container
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

		efst.addEventListener("click", () => {
			this.#container.classList.toggle("open");
		});
	};

	#createTitle() {
		const title = this.#container.querySelector(".title");
		const Ctitle = this.#container.querySelector(".closed-title"); // closed title

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
		description.addEventListener("input", () => {
			this.description = description.value;
		});
	}

	#createTagListing() {
		const tagContainer = this.#container.querySelector(".tags");
		const addTagButton = this.#container.querySelector(".add-tag");

		// Þetta airbnb-config er djöfulsins brandari
		// eslint-disable-next-line no-plusplus
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
					this.tags = this.tags.filter(s => s !== "");
				}
			});
		}

		addTagButton.addEventListener("click", () => {
			if (tagContainer.childElementCount < tagUpperLimit) {
				// t í ytra scope er ekki notað lengur, að shadow-a það er fullkomlega í lagi
				// eslint-disable-next-line no-shadow
				const t = el("input");
				const li = el("li", t);
				this.#data.tags.push(null);
				t.setAttribute("placeholder", "tag");
				t.setAttribute("size", "10");
				t.addEventListener("change", () => {
					this.#data.tags[this.#data.tags.length - 1] = t.value;
					resizeTag(t);
					if (t.value === "") {
						li.remove();
						// Shadowing er fullkomlega valid, og einn af stóru kostunum við block scope, afhverju er eslint svona á móti því?
						// eslint-disable-next-line no-shadow
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
		const Cdue = this.#container.querySelector(".closed-date"); // closed date
		if (this.#data.due !== null) {
			const tempdate = new Date(this.#data.due).toLocaleDateString("en-GB");
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
		if (this.priority) {
			important.checked = true;
		}
		important.addEventListener("click", (e) => {
			e.stopPropagation();
			this.priority = important.checked;
		});
	}

	#createDoneCheckbox() {
		const done = this.#container.querySelector(".done");
		if (this.#data.completed) done.checked = true;
		done.addEventListener("click", (e) => {
			e.stopPropagation();
			this.completed = done.checked;
		});
	}

	#createDeletButton() {
		const delButton = this.#container.querySelector(".delete");
		delButton.addEventListener("click", () => {
			this.pop();
			this.deleted = true;
			categoryStats();
			tagStats();
		});
	}

	markModification() {
		this.#data.modified = Date.now();
		cache.markAsModified();
	}

	/**
	 * Bætir þessu TODO inn í container, og tryggir að TODO-ið hafi enn reference að því.
	 */
	insert() {
		if (this.#container) {
			container.appendChild(this.#container);
			this.#container = document.querySelector(`#todo-${this.id}`);
		}
	}

	/**
	 * Fjarlægir spjaldið fyrir þetta TODO úr DOM-inu.
	 */
	pop() {
		this.#container.remove();
	}

	get data() {
		return this.#data;
	}

	get id() {
		return this.#data.id;
	}

	get due() {
		return this.#data.due;
	}

	get container() {
		return this.#container;
	}

	get categorySelector() {
		return this.#categorySelector;
	}

	set category(cat) {
		this.#data.category = cat;
		this.markModification();
		categoryStats();
	}

	get category() {
		return this.#data.category;
	}

	get tags() {
		return this.#data.tags;
	}

	set tags(tags) {
		this.#data.tags = tags;
		this.markModification();
		tagStats();
	}

	get title() {
		return this.#data.title;
	}

	set title(title) {
		this.#data.title = title;
		this.markModification();
	}

	get description() {
		return this.#data.description;
	}

	set description(desc) {
		this.#data.description = desc;
		this.markModification();
	}

	get deleted() {
		return this.#data.deleted;
	}

	set deleted(d) {
		this.#data.deleted = d;
		this.markModification();
	}

	set completed(c) {
		this.#data.completed = c;
		this.markModification();
	}

	set priority(b) {
		this.#data.priority = b;
		this.markModification();
	}

	get priority() {
		return this.#data.priority;
	}
}

import { TodoItem } from "./TodoItem.js";

const saveInterval = 500;

class Cache {
	#todos = [];
	#modified = false;

	markAsModified() {
		this.#modified = true;
	}

	newItem(item) {
		if (item === null) {
			console.log(this.#todos[this.#todos.length - 1].id)
			item = {
				"id": (Number.parseInt(this.#todos[this.#todos.length - 1].id, 10) + 1).toString(),
				"title": "",
				"description": "",
				"category": "",
				"tags": [],
				"priority": false,
				"modified": Date.now(),
				"due": null,
				"deleted": false,
				"completed": false
			}
		}

		const todo = new TodoItem(item);
		cache.#todos.push(todo);

		return todo.container;
	}

	save() {
		this.#modified = false;
		localStorage.setItem("todos",JSON.stringify(this.#todos.map(t => t.data)));
	}

	get modified() {
		return this.#modified;
	}

	get todos() {
		return this.#todos;
	}
}

export const cache = new Cache();

setInterval(() => {
	if (cache.modified) {
		cache.save();
	}
}, saveInterval);

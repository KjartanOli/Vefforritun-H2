import { TodoItem } from "./TodoItem.js";

const saveInterval = 5000;

class Cache {
	#todos = [];
	#modified = false;

	markAsModified() {
		this.#modified = true;
	}

	newItem(item) {
		const todo = new TodoItem(item);
		cache.#todos.push(todo);

		return todo.container;
	}

	save() {
		this.#modified = false;
		return this.#todos.map(t => t.data);
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
		console.log(cache.save());
	}
}, saveInterval);

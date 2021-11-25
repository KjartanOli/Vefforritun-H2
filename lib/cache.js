// Þessi dependency cycle er nauðsynlegur
// eslint-disable-next-line import/no-cycle
import { TodoItem } from "./TodoItem.js";

const saveInterval = 500;

class Cache {
	constructor() {
		this.todos = [];
		this.modified = false;
	}

	markAsModified() {
		this.modified = true;
	}

	newItem(item) {
		if (item === null) {
			// Það gerir lífið okkar allra einfaldara að endurskilgreina item í stað þess að búa til nýja breytu
			// eslint-disable-next-line no-param-reassign
			item = {
				"id": (Number.parseInt(this.todos[this.todos.length - 1].id, 10) + 1).toString(),
				"title": "",
				"description": "",
				"category": "",
				"tags": [],
				"priority": false,
				"modified": Date.now(),
				"due": null,
				"deleted": false,
				"completed": false
			};
		}
		const todo = new TodoItem(item);
		this.todos.push(todo);

		return todo;
	}

	save() {
		localStorage.setItem("todos",JSON.stringify(this.todos.map(t => t.data)));
		this.modified = false;
	}

	get modified() {
		return this.modified;
	}

	get todos() {
		return this.todos;
	}
}

export const cache = new Cache();

setInterval(() => {
	if (cache.modified) {
		cache.save();
	}
}, saveInterval);

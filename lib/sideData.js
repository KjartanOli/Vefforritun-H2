import { catData } from "./categories.js";
import { el,empty } from "./helpers.js";


export function showCategories() {
	empty(catData);
    let categories = JSON.parse(localStorage.getItem("categories"));
    let todos = JSON.parse(localStorage.getItem("todos"))
    console.log(categories)
	for (const cat of categories) {
		let p = el("p",cat.title);
		let c = 0;
		for (const todo of todos) {
			// console.log("todo.category: " + todo.category)
			if (todo.category === cat.id) c++;
		}
		let s = el("span",c.toString());
		let d = el("div",p,s);
		d.setAttribute("class","sideData");
		catData.appendChild(d);
	}
}
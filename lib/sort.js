// The horror, modules sem þurfa hvort annað
// eslint-disable-next-line import/no-cycle
import { createAddNew } from "../script.js";
import { cache } from "./cache.js";

function endurRadad(todos) {
	todos.forEach(t => t.pop());
	document.querySelector(".add-new-button").remove();
	todos.forEach(t => t.insert());
  createAddNew();
}

function compareTitle(a,b) {
    if ( a.title < b.title ){
      return -1;
    }
    if ( a.title > b.title ){
      return 1;
    }
    return 0;
  }

function compareDate(a,b) {
    if ( a.due < b.due ){
        return 1;
      }
      if ( a.due > b.due ){
        return -1;
      }
      return 0;
}

function compareImp(a,b) {
    if ( a.priority < b.priority ){
        return 1;
      }
      if ( a.priority > b.priority ){
        return -1;
      }
      return 0;
}

export const filter = document.querySelector("#rada");

filter.addEventListener("change", () => {
	const radad = cache.todos.filter(t => !t.deleted);
	switch (filter.value) {
		case "title":
			radad.sort(compareTitle);
			break;

		case "time":
			radad.sort(compareDate);
			break;

		case "importance":
			radad.sort(compareImp);
			break;

		default:
			break;
	}
	endurRadad(radad);
});

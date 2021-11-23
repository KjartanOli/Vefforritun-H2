import { cache } from "./cache.js";
import { empty,el } from "./helpers.js"

export let filter = document.querySelector("#rada")
let holder = document.querySelector("#holder")
if (!localStorage.getItem("todos")) cache.markAsModified()

filter.addEventListener("change", (e) => {
    let radad = JSON.parse(localStorage.getItem("todos"));
    console.log(radad)
    switch (filter.value) {
        case "title":
            radad.sort(compareTitle);
            console.log(radad)
            break;
    
        case "time":
            radad.sort(compareDate);
            console.log(radad)
            break;
        
        case "importance":
            radad.sort(compareImp);
            console.log(radad)
            break;

        default:
            break;
    }
    empty(holder)
    endurRadad(radad)
})

function endurRadad(r) {
    for (const item of r) {
        const element = cache.newItem(item);
        if (element) {
            holder.appendChild(element);
        }
    }
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

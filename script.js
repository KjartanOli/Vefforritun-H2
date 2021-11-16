import { el } from "./lib/helpers.js";

let takki = document.querySelector("#testTakki");
let iTitill = document.querySelector("#inputTitill");
let iLysing = document.querySelector("#inputLysing");
let iDags = document.querySelector("#inputDags");
let iTag1 = document.querySelector("#inputTag1");
let iTag2 = document.querySelector("#inputTag2");
let iTag3 = document.querySelector("#inputTag3");
let iFlokkur = document.querySelector("#inputFlokkur");
let iLitur = document.querySelector("#inputLitur");

let listi = [];
let id = 0;

takki.addEventListener("click", nyttShit);
let template = document.querySelector("#template");
let holder = document.querySelector("#holder");

function nyttShit() {
  let uppl = writeJson();
  builder(uppl.ID,uppl.Titill,uppl.Lysing,uppl.Dags,uppl.Flokkur,uppl.Tags,uppl.Litur);
}

function builder(id,tit,lys,dag,flo,tags,lit) {
  let clone = template.content.cloneNode(true);
  let tagContainer = clone.querySelector(".tags");
  clone.querySelector(".titill").textContent = tit;
  clone.querySelector(".lysing").textContent = lys;
  clone.querySelector(".dags").textContent = dag;
  clone.querySelector(".flokkur").textContent = flo;
  let card = clone.querySelector(".card");
  card.style.borderColor = lit
  let idToDel = id;

  for (const tag of tags) {
		tagContainer.appendChild(el("li", tag));
	}

  clone.querySelector("#delete").addEventListener("click",(e) => {
    card.remove()
    console.log(idToDel)
    for (const item of listi) {
      if (item.ID === idToDel) {
        localStorage.removeItem("listi")
        listi.splice(listi.indexOf(item),1)
        localStorage.setItem("listi",JSON.stringify(listi))
        break;
      }
    }
  })

  holder.appendChild(clone)
}

function takeAndEscape(e) {
  let output = e.value;
  e.value = null;
  return output;
}

function writeJson() {
  if (listi.length <= 0) { 
    id = 0; 
    console.log(listi.length)
  }
  else{ 
    id = listi[listi.length-1].ID+1;
    console.log(id)
  }
  let obj = {
    ID: id,
    Titill: takeAndEscape(iTitill),
    Lysing: takeAndEscape(iLysing),
    Dags: dateFormat(takeAndEscape(iDags)),
    Flokkur: takeAndEscape(iFlokkur),
    Tags: [
      takeAndEscape(iTag1),
      takeAndEscape(iTag2),
      takeAndEscape(iTag3),
    ],
    Litur: takeAndEscape(iLitur),
  }

  localStorage.removeItem("listi")
  listi.push(obj)
  localStorage.setItem("listi",JSON.stringify(listi))
  
  return obj;
}

function onStart() {
  let geymdurListi = localStorage.getItem("listi");
  let parsedListi = JSON.parse(geymdurListi);
  
  for (const key of parsedListi) {
    listi.push(key);
    builder(key.ID,key.Titill,key.Lysing,key.Dags,key.Flokkur,key.Tags,key.Litur)
  }
}

function empty(element) {
  if (!element || !element.firstChild) {
    return;
  }

  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function dateFormat(d) {
  let out = "";
  out = out + d.substring(8,10) + "-";
  out = out + d.substring(5,7) + "-";
  out = out + d.substring(0,4);
  return out;
}

if (localStorage.getItem("listi") !== null) onStart();
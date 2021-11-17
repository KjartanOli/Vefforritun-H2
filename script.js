import { el } from "./lib/helpers.js";
import { addCategory, getCategories, createGategoryCreator } from "./lib/categories.js";

let takki = document.querySelector("#testTakki");
let iTitill = document.querySelector("#inputTitill");
let iLysing = document.querySelector("#inputLysing");
let iDags = document.querySelector("#inputDags");
let iTag1 = document.querySelector("#inputTag1");
let iTag2 = document.querySelector("#inputTag2");
let iTag3 = document.querySelector("#inputTag3");
let iFlokkur = document.querySelector("#inputFlokkur");
let iLitur = document.querySelector("#inputLitur");

let tagUpperLimit = 5;
let sizeMagicNum = 0; //fjöldi stafa sem þarf að taka aftan af input til þess að textinn lýti út fyrir að vera í miðjunni

let listi = [];
let id = 0;

takki.addEventListener("click", nyttShit);
let template = document.querySelector("#template");
let holder = document.querySelector("#holder");

function nyttShit() {
  let uppl = writeJson();
  builder(uppl.ID,uppl.Titill,uppl.Lysing,uppl.Dags,uppl.Flokkur,uppl.Tags,uppl.Litur);
}

function builder(id,tit,lys,dag, category ,tags,lit) {
  let clone = template.content.cloneNode(true);
  let title = clone.querySelector(".titill");
  let description = clone.querySelector(".lysing");
  let date = clone.querySelector(".dags");
  let tagContainer = clone.querySelector(".tags");
  const categorySelect = clone.querySelector(".category");
  let addTag = clone.querySelector(".addTag")
  let category = clone.querySelector(".flokkur")
  let checkbox = clone.querySelector(".check")
  
  title.value = tit;
  resizeTitle(title)
  title.addEventListener("change",(e) => {
    console.log(title.value)
    resizeTitle(title)
  });

  description.value = lys;
  resizeDescription(description)
  description.addEventListener("change",(e) => {
    console.log(description.value)
    resizeDescription(description)
  });


  date.value = dag;
  category.textContent = flo;
  let card = clone.querySelector(".card");
	for (const cat of getCategories()) {
		const c = el("option", cat.title);
		c.setAttribute("value", cat.id);
		if (cat.id === category) {
			c.setAttribute("selected", "true");
		}
		categorySelect.appendChild(c);
	}
	const newCat = el("option", "Nýr flokkur");
	newCat.setAttribute("value", "new");
	categorySelect.appendChild(newCat);

	categorySelect.addEventListener("change", () => {
		console.log(categorySelect.value)
		if (categorySelect.value === "new") {
			createGategoryCreator(categorySelect)()
		}
	})

  card.style.borderColor = lit
  let idToDel = id;

  for (const tag of tags) {
    let t = el("input")
    let li = el("li", t)
    t.value = tag;
    resizeTag(t)
    tagContainer.appendChild(li);
    t.addEventListener("change",(e) => {
      console.log(t.value);
      resizeTag(t)
      if (t.value === "") li.remove();
    })
	}

  addTag.addEventListener("click",(e) => {
    if (tagContainer.childElementCount < tagUpperLimit) {
      let t = el("input")
      let li = el("li", t)
      t.setAttribute("placeholder","tag")
      t.addEventListener("change",(e) => {
        console.log(t.value);
        resizeTag(t)
        if (t.value === "") li.remove();
      })
      tagContainer.appendChild(li);
    }
  })

  checkbox.addEventListener('change', (e) => {
    if (checkbox.checked) {
      console.log("Checkbox is checked..");
    } else {
      console.log("Checkbox is not checked..");
    }
  });

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

async function onStart() {
  // let geymdurListi = localStorage.getItem("listi");
  // let parsedListi = JSON.parse(geymdurListi);
	let items, cats;
	if (localStorage.getItem("listi") !== null) {
		try {
			let data = await fetch(new URL("data.json", window.location.href));
			data = await data.json();
			items = data.items;
			cats = data.categories;
		}
		catch (e) {
			console.log(e);
		}
	}

	const categories = localStorage.getItem("categories")
	if (categories === null) {
		for (const cat of cats) {
			addCategory(cat);
		}
	}
	else {
		for (const cat of JSON.parse(categories)) {
			addCategory(cat);
		}
	}
	console.log(items)
	console.log(getCategories())
  for (const item of items) {
    // listi.push(key);
    // builder(key.ID,key.Titill,key.Lysing,key.Dags,key.Flokkur,key.Tags,key.Litur)
    if (!item.deleted) {
      builder(item.id, item.title, item.description, item.date, item.category, item.tags, "#000000")
    }
  }
}


function dateFormat(d) {
  let out = "";
  out = out + d.substring(8,10) + "-";
  out = out + d.substring(5,7) + "-";
  out = out + d.substring(0,4);
  return out;
}

function resizeTitle(t) {
  if (t.value.length > 32) {
    t.setAttribute("rows",2)
    t.style.height = "2.4em"
  }
  else {
    t.setAttribute("rows",1);
    t.style.height = "1.2em"
  }
}

function resizeDescription(d) {
  if (d.value == "") {
    d.style.height = "2em"
  }
  else {
    d.style.height = Math.floor(d.value.length / 40) + 2 +"em"
  }
}

function resizeTag(t) {
  if (t.value.length > sizeMagicNum) {
    t.setAttribute("size",t.value.length-sizeMagicNum)
  }
  
  else {
    t.setAttribute("size",1)
  }
}

onStart();

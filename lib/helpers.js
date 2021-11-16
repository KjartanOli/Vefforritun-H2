/**
 * Býr til element með nafni og bætir við öðrum elementum eða texta nóðum.
 * @param {string} name Nafn á elementi
 * @param  {...string | HTMLElement} children Hugsanleg börn: önnur element eða strengir
 * @returns {HTMLElement} Elementi með gefnum börnum
 */
export function el(name, ...children) {
	const e = document.createElement(name);

	for (const child of children) {
		if (typeof child === "string") {
			e.appendChild(document.createTextNode(child));
		} else {
			e.appendChild(child);
		}
	}

	return e;
}

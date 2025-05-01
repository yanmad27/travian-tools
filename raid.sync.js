function getFarms(id) {
	const farmlist = document.querySelector(`[data-list="${id}"]`).parentElement.parentElement.querySelector('tbody')

	const farms = []
	farmlist.childNodes.forEach((child, index) => {
		if (index === farmlist.childNodes.length - 1) return
		let name = child.querySelector('[class="target"] span').innerHTML
		if (name.includes('coordinate')) {
			name = `Oasis ${child.querySelector('[class="target"] [class="coordinateX"]').innerHTML}|${child.querySelector('[class="target"] [class="coordinateY"]').innerHTML}`
		}
		const item = {
			no: index + 1,
			id: Number(child.querySelector('[class="selection"] input').getAttribute('data-slot-id')),
			interval: 10,
			active: true,
			name: name,
		}
		farms.push(item)
	})
	return farms
}

console.log(getFarms(1817))
console.log(getFarms(2291))

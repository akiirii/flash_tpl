const fs = require('fs')
const { splitTemplate, normalizeTemplate, parseTemplate } = require('./internal')

const render = (template, data) => {
	const tpl = splitTemplate(template)

	if (!tpl || !tpl.length) {
		throw new Error('Wrong data')
	}

	const nt = normalizeTemplate(tpl)
	let result = []
	result = parseTemplate(nt, result, { data })
	return result.join("")
}

const renderFile = (path, data) => {
	const template = fs.readFileSync(path).toString()
	return render(template, data)
}

module.exports = {
	render,
	renderFile,
}



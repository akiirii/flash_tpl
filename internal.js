const regex = /{{([^}]+)?}}/g

const special = ['#', '/']

const splitTemplate = (template) => {

	const tpl = []
	let index = 0
	let match

	while (match = regex.exec(template)) {
		tpl.push(template.substring(index, match.index))
		tpl.push(template.substring(match.index, regex.lastIndex))
		index = regex.lastIndex
	}

	return tpl
}

const insertVariable = (expression, ctx) => {
	if (ctx.data[expression] === undefined) {
		throw new Error(`Variable: ${expression} do not exist`)
	}
	return ctx.data[expression]

}

const expessions = {
	'#each': (expression, ctx, template, result) => {
		const nt = normalizeTemplate(template)
		if (nt[0].startsWith('\n')) {
			nt[0] = nt[0].substring(1)
		}
		nt[nt.length - 1].replace('\n', '')

		ctx.data[expression].map((element, index) => {
			const newCtx = {
				data: element,
				each: {
					index,
					length: ctx.data[expression].length - 1
				}
			}
			result.push(parseTemplate(nt, result, newCtx))
		})

		return result
	},
	'#unless': (expression, ctx, template, result) => {
		if (!ctx.each) {
			throw new Error('Wrong template')
		}
		if (expression === '@last') {
			const condition = template.join('').split('{{else}}')
			result.push(ctx.each.length !== ctx.each.index ? condition[0] : condition[1])
		}
		return result
	}
}

const getInstructionEnding = (instruction) => {
	const end = instruction.replace('#', '/')
	return `{{${end}}}`
}

const normalizeTemplate = (tpl) => {
	let nt = []
	let index = 0

	while (tpl.length) {
		const el = tpl[index]
		if (!regex.test(el)) {
			nt.push(el)
			tpl.shift()
			continue
		}

		const expression = /{{([^}}]+)?}}/g.exec(el)[1]

		if (special.indexOf(expression[0]) !== -1) {
			const instruction = expression.split(" ")
			endInstruction = tpl.indexOf(getInstructionEnding(instruction[0]))

			if (endInstruction === -1) {
				throw new Error('Wrong template')
			}

			const instructionTemplate = tpl.splice(index + 1, endInstruction)
			instructionTemplate.pop()

			nt.push({
				variable: instruction[1],
				expression: instruction[0],
				render: instructionTemplate
			})
			tpl.shift()
			continue
		}

		nt.push({ expression })
		tpl.shift()

	}
	return nt
}

const parseTemplate = (origin, result, ctx) => {
	origin.forEach((el) => {
		if (expessions[el.expression]) {
			const a = expessions[el.expression](el.variable, ctx, el.render, result)
			result.push(a)
			return
		}

		if (el.expression) {
			result.push(insertVariable(el.expression, ctx))
			return
		}

		result.push(el)
	})

	return result
}

module.exports = {
	splitTemplate,
	parseTemplate,
	normalizeTemplate,
}

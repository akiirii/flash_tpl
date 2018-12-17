const chai = require('chai')
const expect = chai.expect
const { renderFile } = require('../index')
const data = require('../data')


describe('Render', function () {
	it('should return simple template', function () {
		const expected = `Hey Your name goes here, here's a poem for you:

  roses are red
  violets are blue
  you are able to solve this
  we are interested in you
`

		expect(renderFile('./templates/template.tmpl', data)).to.be.equal(expected)
	})


	it('should return extra template', function () {
		const expected = `Hey Your name goes here, here's a slightly better formatted poem for you:

  roses are red,
  violets are blue,
  you are able to solve this,
  we are interested in you!
`

		expect(renderFile('./templates/extra.tmpl', data)).to.be.equal(expected)
	})
})
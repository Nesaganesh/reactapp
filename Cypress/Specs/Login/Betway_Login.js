  describe('first Betway login Test', () => {
	it('Visit the Sports Betway home page', () => {
		//cy.visit('https://betway.com/en/sports?overrideJurisdictionId=1')
		//https://m-pickles-the-dog.spinsport.ludologic.com/sports_betway_com/en/sports
		cy.visit('https://m-pickles-the-dog.spinsport.ludologic.com/sports_betway_com/en/sports')
	})

	

	it('.type() - type into a DOM element', () => {
	    
	    cy.get('div.usernameInput input').focus()
	      .type('URM969757588').should('have.value', 'URM969757588')

		

	    cy.get('div.passwordInput input').focus()
	      .type('test').should('have.value', 'test')

	    cy.get('div.submitButton').scrollIntoView().click() 

	    cy.get('div.accountBalance').should('be.visible')


		
		
	    // cy.get('div.messageBoxContainer span').should(($div) => {
		//   const text = $div.text()

		//   expect(text).to.match(' Your login details are incorrect. Please try again. ')
		// })
	       
	 })

	 it('uses minimatch to intercept', () => {

		cy.wait(20000)
		cy.intercept('POST','/api/events/v2/GetCategoryDetails', (req) => {
			req.continue((res) => {
				res.send({ fixture: 'Response.json' })
			})
		})

		// cy.intercept('POST','/api/events/v2/GetCategoryDetails', (req) => {
		// 	req.continue((res) => {
		// 	  res.send({ fixture: 'Response.json' })
		// 	})
		//   }).as('GetCategoryDetails')
		// cy.wait('@GetCategoryDetails')

	  })

	




})
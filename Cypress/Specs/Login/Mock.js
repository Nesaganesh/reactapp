describe('first Betway login Test', () => {
	
    it('Visit the Sports Betway home page', () => {
      cy.visit('https://m-pickles-the-dog.spinsport.ludologic.com/sports_betway_com/en/sports')
    })

    it('Intercepting network calls', () => {

      cy.intercept({method:'POST', url:'/api/Events/V2/GetCategories'}, { fixture: 'Categories.json' }).as('Categories');
      cy.wait(10000);
    })

    it('Intercepting network calls', () => {

        cy.intercept({method:'POST', url:'/api/Events/V2/GetCategoryDetails'}, { fixture: 'GetCategoryDetails.json' }).as('GetCategoryDetails');
          cy.visit('https://m-pickles-the-dog.spinsport.ludologic.com/sports_betway_com/en/sports/cat/soccer');
          cy.wait('@GetCategoryDetails');

        //cy.intercept({method:'POST', url:'/api/Events/V2/GetCategoryDetails'}, { fixture: 'Response.json' })
        // cy.wait('@GetCategoryDetails').then((interception) =>{

        //     assert.isNotNull(interception.response.body, '1st API call has data')
        // })

        // cy.intercept({method:'POST', url:'/api/Events/V2/GetCategoryDetails'}, (req) => {
        //     cy.log(req)
        //     req.reply((res) => {
        //       // sends a fixture body instead of the existing 'res.body'
        //       res.send({ fixture: '/Users/nesag/Documents/Working/Spinsport.Ui.automation.Cypress/Specs/Login/Response.json' })
          
        //       // delays the response by 1000ms
        //       //res.delay(1000)
          
        //       // throttles the response to 64kbps
        //       //res.throttle(64)
        //     })
        //   })

          // cy.intercept({method:'POST', url:'/api/Events/V2/GetCategoryDetails'}, (req) => {
          //   const fixtureFilename = req.body.CorrelationId
           
          //   console.log('**********************************************')
          //   console.log(fixtureFilename)
          //   console.log('**********************************************')

          //   req.continue((res) => {
          //     res.send({ fixture: 'Response.json' })
          //   })

          //   console.log('**********************************************')
          //   console.log(fixtureFilename)
          //   console.log('**********************************************')

          // }) 

          // cy.intercept({method:'POST', url:'/api/Events/V2/GetCategoryDetails'}, (req) => {

          //   req.reply({
          //     fixture: "GetCategoryDetails"
          //   })

           
            
          // })

          


         

         
        // cy.wait('@Categories').then((interception)=> {
        //     cy.log(interception.response.body)
        //}) 
    })



})
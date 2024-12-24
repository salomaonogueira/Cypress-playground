describe('Cypress Playground', () => {
    beforeEach(() => {
        cy.visit('https://cypress-playground.s3.eu-central-1.amazonaws.com/index.html')
    })
        it('shows a promotional banner', () => {
            cy.get('#promotional-banner').should('be.visible')
      // implementação do caso de teste aqui.
    })

    it('clicks the Subscribe button and showss a success message', () => {
        cy.contains('button', 'Subscribe').click()
        cy.contains('#success', "You've been successfully subscribed to our newsletter.").should('be.visible')
    })

    it('types in an input whict "signs" a form, the asserts it is signed', () => {
        cy.get('#signature-textarea').type('Salomão')
        cy.contains('#signature', 'Salomão').should('be.visible')
    })

    it('types in the signature field, checks the checkbox to see the preview, the unchack', () => {
        cy.get('#signature-textarea-with-checkbox').type('Salomão')
        cy.get('#signature-checkbox').check()
        cy.contains('#signature-triggered-by-check', 'Salomão').should('be.visible')
        cy.get('#signature-checkbox').uncheck()
        cy.contains('#signature-triggered-by-check', 'Salomão').should('not.exist')
    })

    it('checks both possible radios and asserts if it is "on" or "off"', () => {
        cy.contains('#on-off', 'ON').should('be.visible')
        
        cy.get('#off').check()
        
        cy.contains('#on-off', 'OFF').should('be.visible')
        cy.contains ('#on-off', 'ON').should('not.exist')
        
        cy.get('#on').check()
        
        cy.contains('#on-off', 'ON').should('be.visible')
        cy.contains('#on-off', 'OFF').should('not.exist')
    })

    it('selects a type via the dropdown field and asserts on the selection', () => {
    cy.contains('p', "You haven't selected a type yet.").should('be.visible')

    cy.get('#selection-type').select(3)
    cy.contains('p', "You've selected: VIP").should('be.visible')

    cy.get('#selection-type').select('standard')
    cy.contains('p', "You've selected: STANDARD").should('be.visible')

    cy.get('#selection-type').select('Basic')
    cy.contains('p', "You've selected: BASIC").should('be.visible')

    })    

    it('selects multiple fruits via the dropdown field and asserts on the selection', () => {
        cy.contains ('p', "You haven't selected any fruit yet.")
        cy.get('#fruit').select(['apple', 'banana', 'cherry'])
        cy.contains ('p', "You've selected the following fruits: apple, banana, cherry")
        .should('be.visible')
})

    it('uploads a file and asserts the correct file name appears as a paragraph', () => {
    cy.get('input[type="file"]').selectFile('./cypress/fixtures/example.json')
    
    cy.contains('p', 'The following file has been selected for upload: example.json').should('be.visible')
    })
})

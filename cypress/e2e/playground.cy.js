describe('Cypress Playground', () => {
    beforeEach(() => {
        const now = new Date(Date.UTC(2024, 3, 15)) // Os meses iniciam no índice 0, ou seja, 3 é equivalente ao mês de Abril
        cy.clock(now)
        cy.visit('https://cypress-playground.s3.eu-central-1.amazonaws.com/index.html')
    })
        it('shows a promotional banner', () => {
            cy.get('#promotional-banner').should('be.visible')
      // implementação do caso de teste aqui.
    })

    // clica no botão assinar e mostra uma mensagem de sucesso.
    it('clicks the Subscribe button and showss a success message', () => {
        cy.contains('button', 'Subscribe').click()
        cy.contains('#success', "You've been successfully subscribed to our newsletter.").should('be.visible')
    })

    // digita uma entrada que "assina" um formulário, afirma que ele é assinado.
    it('types in an input whict "signs" a form, the asserts it is signed', () => {
        cy.get('#signature-textarea').type('Salomão')
        cy.contains('#signature', 'Salomão').should('be.visible')
    })

    // verifica se a assinatura é exibida quando a caixa de seleção é marcada e se desaparece quando a caixa de seleção é desmarcada.
    it('types in the signature field, checks the checkbox to see the preview, the uncheck', () => {
        cy.get('#signature-textarea-with-checkbox').type('Salomão')
        cy.get('#signature-checkbox').check()
        cy.contains('#signature-triggered-by-check', 'Salomão').should('be.visible')
        cy.get('#signature-checkbox').uncheck()
        cy.contains('#signature-triggered-by-check', 'Salomão').should('not.exist')
    })

    // verifica ambos os radios possíveis e afirma se está "ligado" ou "desligado"
    it('checks both possible radios and asserts if it is "on" or "off"', () => {
        cy.contains('#on-off', 'ON').should('be.visible')
        
        cy.get('#off').check()
        
        cy.contains('#on-off', 'OFF').should('be.visible')
        cy.contains ('#on-off', 'ON').should('not.exist')
        
        cy.get('#on').check()
        
        cy.contains('#on-off', 'ON').should('be.visible')
        cy.contains('#on-off', 'OFF').should('not.exist')
    })

    // verifica se as mensagens corretas são exibidas ao selecionar diferentes opções no campo dropdown.
    it('selects a type via the dropdown field and asserts on the selection', () => {
    cy.contains('p', "You haven't selected a type yet.").should('be.visible')

    cy.get('#selection-type').select(3)
    cy.contains('p', "You've selected: VIP").should('be.visible')

    cy.get('#selection-type').select('standard')
    cy.contains('p', "You've selected: STANDARD").should('be.visible')

    cy.get('#selection-type').select('Basic')
    cy.contains('p', "You've selected: BASIC").should('be.visible')

    })    

    // verifica se a seleção múltipla de frutas no campo dropdown funciona corretamente e se a mensagem correta é exibida após a seleção.
    it('selects multiple fruits via the dropdown field and asserts on the selection', () => {
        cy.contains ('p', "You haven't selected any fruit yet.")
        cy.get('#fruit').select(['apple', 'banana', 'cherry'])
        cy.contains ('p', "You've selected the following fruits: apple, banana, cherry")
        .should('be.visible')
})

    // carrega um arquivo e afirma que o nome correto do arquivo aparece como um parágrafo.
    it('uploads a file and asserts the correct file name appears as a paragraph', () => {
    cy.get('input[type="file"]').selectFile('./cypress/fixtures/example.json')
    
    cy.contains('p', 'The following file has been selected for upload: example.json').should('be.visible')
    })

    // verifica se a requisição GET é feita corretamente ao clicar no botão e se os dados retornados são exibidos corretamente na página.
    it('clicks a button and triggers a request', () => {
        cy.intercept('GET', 'https://jsonplaceholder.typicode.com/todos/1')
        .as('getTodo')
        
        cy.contains ('button', 'Get TODO').click()
        cy.wait('@getTodo')
        .its('response.statusCode' )
        . should('be.equal', 200)
        
        cy.contains('li', 'TODO ID: 1').should('be.visible')
        cy.contains('li', 'Title: delectus aut autem').should('be.visible')
        cy.contains('li', 'Completed: false').should('be.visible')
        cy.contains('li', 'User ID: 1').should('be.visible')
    })

    // clica em um botão e aciona uma solicitação fragmentada.
    it('clicks a button and triggers a stubbed request', () => {
        const todo = require('../fixtures/todo.json');
        
        cy.intercept('GET', 'https://jsonplaceholder.typicode.com/todos/1', { fixture: 'todo' }).as('getTodo');
        
        cy.contains('button', 'Get TODO').click();
        
        cy.wait('@getTodo', { timeout: 10000 })
          .its('response.statusCode').should('eq', 200);
        
        cy.contains('li', `TODO ID: ${todo.id}`).should('be.visible');
        cy.contains('li', `Title: ${todo.title}`).should('be.visible');
        cy.contains('li', `Completed: ${todo.completed}`).should('be.visible');
        cy.contains('li', `User ID: ${todo.userId}`).should('be.visible');
    });
    
    // clica em um botão e simula uma falha de API.
    it('clicks a button and simulates an API failure', () => {
        cy.intercept('GET','https://jsonplaceholder.typicode.com/todos/1',
        { statusCode: 500 } ).as('serverFailure')
        cy.contains('button', 'Get TODO').click()
        cy.wait('@serverFailure').its('response.statusCode').should('be.equal', 500)
        cy.contains('span', 'Oops, something went wrong. Refresh the page and try again.').should('be.visible')
        })
        
        // clica em um botão e simula uma falha de rede.
        it('clicks a button and simulates a network failure', () => {
            cy.intercept('GET', 'https://jsonplaceholder.typicode.com/todos/1', { forceNetworkError: true }).as('networkError');
            cy.contains('button', 'Get TODO').click();
            cy.wait('@networkError');
            cy.contains('span', 'Oops, something went wrong. Check your internet connection, refresh the page, and try again.')
              .should('be.visible');
        })      

        // faz uma solicitação HTTP e declara no código de status retornado.
        it('makes an HTTP request and asserts on the returned status code', () => {
            cy.request('GET', 'https://jsonplaceholder.typicode.com/todos/1')
            .its('status')
            .should ('be.equal', 200)
        })        

        Cypress._.times(10, index => {
            it(`selects ${index + 1} out of 10`, () => {
            cy.get('input[type="range"]')
            .invoke('val', index + 1)
            .trigger('change')
            cy.contains('p', `You're on level: ${index + 1}`).should('be.visible')
            })

            it('selects a date and asserts the correct date has been displayed', () => {
                cy.get('#date').type('2024-08-24').blur()
                cy. contains("The date you've selected is: 2024-08-24").should('be.visible')
        })

    })

        // digita uma senha com base em uma variável protegida sem vazá-la.
        it('types a password based on a protected variable without leaking it', () => {
        cy.get('#password')
        .type(Cypress.env('password'), { log: false })

        cy.get('#show-password-checkbox').check()

        cy.get('#password-input input[type="password"]').should('not.exist')
        cy.get('#password-input input[type="text"]')
        .should('be.visible').and('have.value', Cypress.env('password'))

        cy.get('#show-password-checkbox').uncheck()

        cy.get('#password-input input[type="password"]').should('be.visible')
        cy.get('#password-input input[type="text"]').should('not.exist')
    })    


    // conta o número de animais em uma lista.
        it('counts the number of animals in a list', () => {
        cy.get('ul#animals li').should('have.length', 5)
})

    // congela o relógio do navegador e afirma que a data congelada é exibida.
    it('freezes the browser clock and asserts the frozen date is displayed', () => {
    cy.contains('p', 'Current date: 2024-04-15').should('be.visible')
})
    // copia o código, digita, envia e em seguida declara a mensagem de sucesso.
    it('copies the code, types it, submits it, then asserts on the success message', () => {
    cy.get('#timestamp')
    .then(element => {
        const code = element[0].innerText
        
        cy.get('#code').type(String(code)) // Convertendo para string
        cy.contains('button', 'Submit').click()
        
        cy.contains("Congrats! You've entered the correct code.").should('be.visible')
    })
})

    // digita um código incorreto e afirma na mensagem de erro.
    it('types an incorrect code and asserts on the error message', () => {
    cy.get('#code').type('1234567890')
    cy.contains('button', 'Submit').click()
    
    cy.contains("The provided code isn't correct. Please, try again.").should('be.visible')
})

    // verifica se o arquivo de texto é baixado corretamente e se o seu conteúdo corresponde ao esperado.
    it('downloads a file, reads it, and asserts on its content', () => {
    cy.contains('a', 'Download a text file').click()
    
    cy.readFile('cypress/downloads/example.txt')
    .should('be.equal', 'Hello, World!')
    
    })

})
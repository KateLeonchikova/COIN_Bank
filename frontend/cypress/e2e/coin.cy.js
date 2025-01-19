/// <reference types="cypress" />
describe('COIN', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
    cy.get('#login').type('developer');
    cy.get('#password').type('skillbox');
    cy.contains('Войти').click();
    cy.url().should('include', '/accounts');
  });

  it('Возможности просмотра списка счетов', () => {
    cy.get('.accounts__main').should('exist').and('be.visible');
    cy.get('.card').should('exist').and('be.visible');
    cy.get('.card__account').should('have.length.greaterThan', 0);
  });

  it('Перевод средств со счета', () => {
    cy.get('.card')
      .eq(0)
      .within(() => {
        cy.contains('Открыть').click();
      });
    cy.get('.transfer__input-account').type('27120208050464008002528428');
    cy.get('.transfer__input-amount').type('1');
    cy.contains('Отправить').click();
    cy.on('window:alert', (alertText) => {
      expect(alertText).to.equal('Перевод успешно завершен!');
    });
  });

  it('Создание нового счета и попытка перевода средств с него', () => {
    cy.get('.card__account').then((accountsBefore) => {
      const initialAccountCount = accountsBefore.length;
      cy.contains('Создать новый счёт').click();
      cy.get('.card__account').should('have.length', initialAccountCount + 1);
      cy.get('.card')
        .last()
        .within(() => {
          cy.contains('Открыть').click();
        });
      cy.get('.transfer__input-account').type('27120208050464008002528428');
      cy.get('.transfer__input-amount').type('1');
      cy.contains('Отправить').click();
      cy.on('window:alert', (alertText) => {
        expect(alertText).to.equal('Ошибка при переводе: Overdraft prevented');
      });
    });
  });
});

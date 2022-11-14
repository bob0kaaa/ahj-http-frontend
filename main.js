/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/controller.js
class Controller {
  constructor(userI) {
    this.userI = userI;
    this.tickets = null;
    this.url = 'https://app-server123.herokuapp.com/';
    this.modalSubmit = this.modalSubmit.bind(this);
    this.modalReset = this.modalReset.bind(this);
  }

  init() {
    this.getTickets();
    this.userI.widget.addEventListener('click', e => {
      e.preventDefault();
      if (e.target.dataset.id === 'edit') this.editTicket(e);else if (e.target.dataset.id === 'del') this.delTicket(e);else if (e.target.dataset.id === 'title') this.showDescription(e);else if (e.target.dataset.id === 'add') this.addTicket(e);
    });
  }

  async sendXHR(method, query, type) {
    const xhr = new XMLHttpRequest();

    if (method === 'GET') {
      const url = `${this.url}?method=${query}`;
      xhr.open(method, url, false);
      xhr.send();
    } else if (method === 'POST') {
      const url = `${this.url}?method=${type}`;
      xhr.open(method, url, false);
      xhr.send(query);
    } else if (method === 'DELETE') {
      const url = `${this.url}?method=deleteTicket&id=${query}`;
      xhr.open(method, url, false);
      xhr.send();
    }

    return xhr.responseText;
  }

  async modalSubmit(e) {
    e.preventDefault();
    const {
      name
    } = e.target;
    const id = e.target.dataset.idfor;

    if (name === 'edit') {
      const request = new FormData(document.forms[1]);
      request.append('id', id);
      await this.sendXHR('POST', request, 'editTicket');
    } else if (name === 'del') {
      const request = id;
      this.sendXHR('DELETE', request);
    } else if (name === 'createTicket') {
      const request = new FormData(document.forms[1]);
      const result = JSON.parse(await this.sendXHR('POST', request, 'createTicket'));
      this.userI.list.innerHTML += this.userI.rowTemplate(result.id, result.status, result.name, result.created);
    }

    this.getTickets();
    this.userI.modal.removeEventListener('submit', this.modalSubmit);
    await this.userI.modal.classList.add('hidden');
  }

  modalReset(e) {
    e.preventDefault();
    this.userI.modal.classList.add('hidden');
    this.userI.modal.removeEventListener('reset', this.modalReset);
  }

  delTicket(e) {
    const {
      id
    } = e.target.closest('.row').dataset;
    this.userI.modal.classList.remove('hidden');
    this.userI.modal.innerHTML = this.userI.delTemplate(id);
    this.userI.modal.addEventListener('submit', this.modalSubmit);
    this.userI.modal.addEventListener('reset', this.modalReset);
  }

  addTicket() {
    this.userI.modal.classList.remove('hidden');
    this.userI.modal.innerHTML = this.userI.editTemplate('Добавить тикет', '', '', 'createTicket');
    this.userI.modal.addEventListener('submit', this.modalSubmit);
    this.userI.modal.addEventListener('reset', this.modalReset);
  }

  async showDescription(e) {
    if (!e.target.children[0]) {
      const {
        id
      } = e.target.parentElement.dataset;
      const result = JSON.parse(await this.sendXHR('GET', `ticketById&id=${id}`));
      e.target.innerHTML += this.userI.descriptionTemplate(result.description);
    } else e.target.removeChild(e.target.children[0]);
  }

  async editTicket(e) {
    this.userI.modal.classList.remove('hidden');
    const {
      id
    } = e.target.closest('.row').dataset;
    const result = JSON.parse(await this.sendXHR('GET', `ticketById&id=${id}`));
    this.userI.modal.innerHTML = this.userI.editTemplate('Изменить тикет', result.name, result.description, 'edit', id);
    this.userI.modal.addEventListener('submit', this.modalSubmit);
    this.userI.modal.addEventListener('reset', this.modalReset);
  }

  async getTickets() {
    const result = JSON.parse(await this.sendXHR('GET', 'allTickets'));
    this.tickets = result;
    this.fillFields(this.tickets);
  }

  fillFields(tArr) {
    this.userI.list.innerHTML = '';
    tArr.forEach(ticket => {
      this.userI.list.innerHTML += this.userI.rowTemplate(ticket.id, ticket.status, ticket.name, ticket.created);
    });
  }

}
;// CONCATENATED MODULE: ./src/js/userInterface.js
class UserInterface {
  constructor() {
    this.status = document.querySelector('[data-id=status]');
    this.title = document.querySelector('[data-id=title]');
    this.data = document.querySelector('[data-id=data]');
    this.list = document.querySelector('.list');
    this.modal = document.querySelector('.modal');
    this.widget = document.querySelector('.ticketswidget');
  }

  rowTemplate(id, status, title, data) {
    return `
    <div class="row" data-id="${id}">
      <div data-id="status">${status}</div>
      <div data-id="title" class="title">${title}</div>
      <div data-id="data" class="date">${data}</div>
      <div><button data-id="edit">&#9998;</button></div>
      <div><button data-id="del">&#10006;</button></div>
    </div>`;
  }

  editTemplate(header, title, description, name, id) {
    return `
    <form name=${name} data-idfor="${id}">
      <h3>${header}</h3>
      <span class="descript">Краткое описание задачи</span><br><input type="text" class="brief-desc" name="title" value="${title}"><br>
      <span class="descript">Подробное описание задачи</span><br><input type="text" class="desc" name="description" value="${description}"><br>
      <button class="button" type="submit">Создать</button>
      <button class="button" type="reset">Отмена</button>
      
    </form>
      `;
  }

  descriptionTemplate(description) {
    return `
    <p>${description}</p>
    `;
  }

  delTemplate(id) {
    return `
    <form name="del" data-idfor=${id}>
      <h3>Удалить тикет</h3>
      <p>Вы уверины что хотите удалить задачу?</p>
      <button class="button" type="submit">Ок</button>
      <button class="button" type="reset">Отмена</button>
      
    </form>
    `;
  }

}
;// CONCATENATED MODULE: ./src/js/app.js


const userI = new UserInterface();
const controller = new Controller(userI);
controller.init();
;// CONCATENATED MODULE: ./src/index.js


/******/ })()
;
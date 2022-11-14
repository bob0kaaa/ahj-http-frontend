export default class Controller {
  constructor(userI) {
    this.userI = userI;
    this.tickets = null;
    this.url = 'https://app-server123.herokuapp.com/';
    this.modalSubmit = this.modalSubmit.bind(this);
    this.modalReset = this.modalReset.bind(this);
  }

  init() {
    this.getTickets();
    this.userI.widget.addEventListener('click', (e) => {
      e.preventDefault();
      if (e.target.dataset.id === 'edit') this.editTicket(e);
      else if (e.target.dataset.id === 'del') this.delTicket(e);
      else if (e.target.dataset.id === 'title') this.showDescription(e);
      else if (e.target.dataset.id === 'add') this.addTicket(e);
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
    return (xhr.responseText);
  }

  async modalSubmit(e) {
    e.preventDefault();
    const { name } = e.target;
    const id = e.target.dataset.idfor;

    if (name === 'edit') {
      const request = new FormData(document.forms[1]);
      request.append('id', id);
      (await (this.sendXHR('POST', request, 'editTicket')));
    } else if (name === 'del') {
      const request = id;
      ((this.sendXHR('DELETE', request)));
    } else if (name === 'createTicket') {
      const request = new FormData(document.forms[1]);
      const result = JSON.parse(await (this.sendXHR('POST', request, 'createTicket')));
      this.userI.list.innerHTML += this.userI.rowTemplate(
        result.id, result.status, result.name, result.created,
      );
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
    const { id } = e.target.closest('.row').dataset;
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
      const { id } = e.target.parentElement.dataset;
      const result = JSON.parse(await this.sendXHR('GET', `ticketById&id=${id}`));
      e.target.innerHTML += this.userI.descriptionTemplate(result.description);
    } else e.target.removeChild(e.target.children[0]);
  }

  async editTicket(e) {
    this.userI.modal.classList.remove('hidden');
    const { id } = e.target.closest('.row').dataset;
    const result = JSON.parse(await this.sendXHR('GET', `ticketById&id=${id}`));

    this.userI.modal.innerHTML = this.userI.editTemplate(
      'Изменить тикет', result.name, result.description, 'edit', id,
    );
    this.userI.modal.addEventListener('submit', this.modalSubmit);
    this.userI.modal.addEventListener('reset', this.modalReset);
  }

  async getTickets() {
    const result = JSON.parse(await (this.sendXHR('GET', 'allTickets')));
    this.tickets = result;
    this.fillFields((this.tickets));
  }

  fillFields(tArr) {
    this.userI.list.innerHTML = '';
    tArr.forEach((ticket) => {
      this.userI.list.innerHTML += this.userI.rowTemplate(
        ticket.id, ticket.status, ticket.name, ticket.created,
      );
    });
  }
}

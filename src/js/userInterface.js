export default class UserInterface {
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

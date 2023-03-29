const form = document.querySelector('.form')
const list = document.querySelector('.list')
const listValue = document.querySelector('#listValue')
const footer__btn = document.querySelector('.footer__btn')
const selectFilter = document.querySelector("[name='status']")

let currentStatus = 'all'
let todos = JSON.parse(localStorage.getItem('todos')) || []
let dropIndex, dragIndex
//let todos = [
//  {
//    id: 'salom',
//    todo: 'Reading books',
//    status: true,
//    createTime: '16:00 23.03.2023',
//  },
//  {
//    id: 'salom2',
//    todo: 'Play football',
//    status: false,
//    createTime: '16:03 23.03.2023',
//  },
//  {
//    id: 'salom3',
//    todo: 'Watch TV',
//    status: true,
//    createTime: '16:30 23.03.2023',
//  },
//  {
//    id: 'salom4',
//    todo: 'coding',
//    status: false,
//    createTime: '15:00 23.03.2023',
//  },
//]
const filterStatus = (status) => {
  switch (status) {
    case 'completed':
      return todos.filter((v) => v.status)
    case 'proccess':
      return todos.filter((v) => !v.status)
    default:
      return todos
  }
}
const render = () => {
  localStorage.setItem('todos', JSON.stringify(todos))
  list.innerHTML = ''
  filterStatus(currentStatus) != 0
    ? filterStatus(currentStatus).forEach((v, length) => {
        const checkbox = v.status
          ? `<input checked type="checkbox" class="checkbox " />`
          : `<input type="checkbox" class="checkbox" />`
        const label = v.status
          ? `<label class="label"><i class='bx bx-check'></i>${checkbox}</label>`
          : `<label class="label">${checkbox}</label>`

        const input = v.status
          ? ` <input disabled class="todo completed item__input" value="${v.todo}">
          <span class="span--line"></span>`
          : ` <input disabled class="todo item__input" value="${v.todo}">`

        const editButton = v.status
          ? ''
          : `   <button class="edit item__btn">
          <i class="bx bx-sm bxs-pencil"></i>
          </button>`

        list.innerHTML += `
      <li class="item" id="${v.id}" draggable="true">
        <span class="nth">${length + 1}</span>
        <div class="item__section">
            <div class="date">
              <span class="create--time">${v.createTime}</span>
            </div>
            <div class="item__form">
            ${label}
              ${input}
            </div>
          </div>
        <div class="item__btns">
       ${editButton}
          <button style="display:none" id="${v.id}" class="save item__btn">
          <i class='bx bx-sm bx-save'></i>
          </button>
            <button style="display:none" id="${v.id}" class="cancel item__btn">
            <i class="bx bx-md bx-x"></i>
          </button>
          <button id="${v.id}" class="delete item__btn">
          <i class='bx bx-sm bx-trash' ></i>
          </button>
        </div>
      </li>
    `
      })
    : (list.innerHTML = `<span class="empty">bo'm bo'sh</span>`)

  const dragList = document.querySelectorAll('.item')
  dragList.forEach((el, i) => {
    el.addEventListener('dragstart', (e) => {
      setTimeout(() => el.classList.add('dragging'), 0)
      const currentId = e.target.closest('.item')?.id
      dragIndex = todos.findIndex((v) => v.id == currentId)
    })
    el.addEventListener('dragover', (e) => {
      e.preventDefault()
    })
    el.addEventListener('dragleave', (e) => {})

    el.addEventListener('drop', (e) => {
      e.preventDefault()
      const currentId = e.target.closest('.item')?.id
      dropIndex = todos.findIndex((v) => v.id == currentId)
      //let temp = todos[dragIndex]
      //todos[dragIndex] = todos[dropIndex]
      //todos[dropIndex] = temp
    })
    el.addEventListener('dragend', (e) => {
      let a = todos.splice(dragIndex, 1)
      todos.splice(dropIndex, 0, a[0])
      e.preventDefault()
      el.classList.remove('dragging')
      render()
    })
  })
}

render()
form.addEventListener('submit', (e) => {
  e.preventDefault()
  const inputValue = e.target.elements.todo.value
  const inp = document.querySelector('.form__inp')

  if (inputValue) {
    const find = todos.find((el) => el.todo == inputValue)
    if (!find) {
      const h = new Date().getHours()
      const min = new Date().getMinutes()
      const d = new Date().getDate()
      const m =
        new Date().getMonth() < 9
          ? '0' + (new Date().getMonth() + 1)
          : new Date().getMonth() + 1
      const y = new Date().getFullYear()
      const newTodo = {
        id: 'a' + new Date().getTime(),
        todo: inputValue,
        status: false,
        createTime: `${h}:${min} ${d}.${m}.${y}`,
      }
      todos.unshift(newTodo)
      form.reset()
      render()
      inp.placeholder = 'Text input'
    } else {
      errorFn(),
        (e.target.elements.todo.value = ''),
        (inp.placeholder = 'there is such a task')
    }
  } else {
    errorFn()
  }
  function errorFn() {
    inp.classList.add('emptyInp')
    inp.placeholder = 'empty field'
    setTimeout(() => {
      inp.classList.remove('emptyInp')
    }, 700)
  }
})

footer__btn.addEventListener('click', () => {
  todos = []
  render()
})

selectFilter.addEventListener('change', (e) => {
  currentStatus = e.target.value
  render()
})

list.addEventListener('click', (e) => {
  const currentitem = e.target.closest('.item')
  const currentId = e.target.closest('.item')?.id
  const selector = (className) => `#${currentId} .${className}`
  const saveButton = document.querySelector(selector('save'))
  const cancelButton = document.querySelector(selector('cancel'))
  const editButton = document.querySelector(selector('edit'))
  const currentInput = document.querySelector(selector('todo'))

  if (e.target.closest('.checkbox')) {
    const id = todos.findIndex((v) => v.id === currentId)
    todos[id].status = !todos[id].status
    render()
  }

  if (e.target.closest('.delete')) {
    todos = todos.filter((v) => v.id != currentId)
    currentitem.classList.add('deleteEffect')
    setTimeout(() => {
      render()
    }, 500)
  }
  document.addEventListener('keydown', (e) => {
    if (e.code == 'Escape') {
      render()
    }
    if (e.code == 'Enter') {
      if (currentInput.value) {
        saveButton.style.display = 'none'
        cancelButton.style.display = 'none'
        editButton.style.display = 'block'
        currentInput.setAttribute('disabled', '')
        todos = todos.map((e) =>
          e.id === currentId ? { ...e, todo: currentInput.value } : e
        )
      } else {
        alert('empty input value')
      }
      render()
    }
  })
  if (e.target.closest('.save')) {
    let fin = todos.filter((v) => v.todo == currentInput.value)
    console.log(fin.length)
    if (fin.length >= 1) {
      alert('there is surch a task')
    } else {
      if (currentInput.value) {
        saveButton.style.display = 'none'
        cancelButton.style.display = 'none'
        editButton.style.display = 'block'
        currentInput.setAttribute('disabled', '')
        todos = todos.map((e) =>
          e.id === currentId ? { ...e, todo: currentInput.value } : e
        )
      } else {
        alert('empty input value')
      }
      render()
    }
  }

  if (e.target.closest('.edit')) {
    const value = currentInput.value
    saveButton.style.display = 'block'
    cancelButton.style.display = 'block'
    editButton.style.display = 'none'
    currentInput.removeAttribute('disabled')
    currentInput.focus()

    currentInput.value = ''
    currentInput.value = value

    currentitem.classList.add('active--inp')

    currentInput.addEventListener('blur', (e) => {
      setTimeout(() => {
        saveButton.style.display = 'noe'
        cancelButton.style.display = 'none'
        editButton.style.display = 'block'
        render()
      }, 100)
    })
  }
  if (e.target.closest('.cancel')) {
    saveButton.style.display = 'none'
    cancelButton.style.display = 'none'
    editButton.style.display = 'block'
    currentInput.setAttribute('disabled', '')
    render()
  }
})

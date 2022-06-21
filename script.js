const storage = localStorage.getItem('characterData');
const parsedStorage = storage ? JSON.parse(storage) : [];
const data = parsedStorage;

const createFormElement = document.querySelector('#formCreate')
const createElement = document.querySelector('.create')
const filterElement = document.querySelector('.filter')
const characterFormBlockElement = document.querySelector('.character')

const inputCharacterFilter = document.querySelector('#filter')
const seceltCharacterFilter = document.querySelector('#choice')

const redOpponentsPlace = document.querySelector('.red-opponent .character__body')
const blueOpponentsPlace = document.querySelector('.blue-opponent .character__body')

let isEdit = false;

//-----------------------------------------------------------------------
// нашел и решил интересный баг
// если открыть меню редактирования в одной 'тудушке' и удалить ее,
// то другие тудушки нельзя отредактировать (так как isEdit == true)
//-----------------------------------------------------------------------

// app Harry Potter 2.0!
// Что нового?
// новая функция: сражение!
// исправлены баги с редактированием умерших

//-----------------------------------------------------------------------

class Character {

    constructor() {
        createFormElement.addEventListener('submit', this.handleCreateCharacter.bind(this))
        characterFormBlockElement.addEventListener('submit', this.handleSubmitEdition.bind(this))
        
        createFormElement.addEventListener('click', this.handleOpenSelect.bind(this))
        createElement.addEventListener('click', this.handleClickMore.bind(this))
        characterFormBlockElement.addEventListener('click', this.handleCheckCharacterSetting.bind(this))
        characterFormBlockElement.addEventListener('click', this.handleEditCharacter.bind(this))
        characterFormBlockElement.addEventListener('click', this.handleRemoveCharacter.bind(this))
        characterFormBlockElement.addEventListener('click', this.handleSelectCharacter.bind(this))
        
        characterFormBlockElement.addEventListener('change', this.handleCheckIsChecked.bind(this))
        seceltCharacterFilter.addEventListener('change', this.handleChangeSort.bind(this))
        
        inputCharacterFilter.addEventListener('input', this.handleInputSearchTitle.bind(this))

        window.addEventListener('beforeunload', () => {
            const string = JSON.stringify(data);
            localStorage.setItem('characterData', string);
          });
        document.addEventListener('DOMContentLoaded', () => {
            render(data);
        });        
    }
    //----------------------------------------------
    handleSelectCharacter(event) {
        const { target } = event;
        const { select } = target.dataset;

        if(select != 'character') return
        const { id } = target.dataset;
        const parentSelectElement = target.closest('.character__body');

        data.forEach(item => {
            if(item.id == id) {
                if(parentSelectElement.classList.contains('choice')) {
                parentSelectElement.classList.remove('choice')
                item.isSelected = false
            } else {
                    redOpponentsPlace.innerHTML = item.intelligence
                    parentSelectElement.classList.add('choice')
                    item.isSelected = true
                }
            } 
        })
    }

    //----------------------------------------------
    handleOpenSelect(event) {
        const { target } = event;
        const { role } = target.dataset;

        if(role != 'select') return
        const characterbody = document.querySelectorAll('.character__body')

        characterbody.forEach(item => {
            item.classList.toggle('select')
        })
    }

    //----------------------------------------------

    handleClickMore(event) {
        const { target } = event;
        
        if(target.dataset.role != 'more') return
        
        createElement.classList.toggle('more')
        filterElement.classList.toggle('more')
    }
    //----------------------------------------------

    handleCheckIsChecked(event) {
        const { target } = event;
        const { id } = target;
        const parentCheckedLabelElement = target.closest('.character__body')
        
        if (target.dataset.role !== 'life') return
        
        if(isEdit) {
            alert('Идет редактироавание')
            target.removeAttribute('checked')
            isEdit = false
            render(data)
            return
        }
    
        data.forEach((item) => {
            if (item.id == id) {
              item.isChecked = target.checked;
            }
        });
    
        parentCheckedLabelElement.classList.toggle('checked')
    }
    
    //----------------------------------------------
    
    handleInputSearchTitle (event) {
        const { target } = event
        const queryString = target.value
      
        const matches = data.filter(item => {
          if (item.title.includes(queryString)) {
            return true
          }
        })
      
        render(matches)
    }
    //----------------------------------------------
      
    handleChangeSort (event) {
        const { target } = event
        const { value } = target
      
        let sortedData = []
        let currentValue = '';
    
        function checkSort(value) {
            return (a, b) => a[value] > b[value] ? 1 : -1;
        }
    
        switch (value) {
            case '1':
                currentValue = 'intelligence';
                break;
            case '2':
                currentValue = 'magic';
                break;
            case '3':
                currentValue = 'power';
                break;
            case '4':
                currentValue = 'faculty';
                break;
            case '5':
                currentValue = 'age';
                break;
            default:
                sortedData = data
                break;
        }
    
        sortedData = data.sort(checkSort(currentValue))
        render(sortedData)
    }
    //----------------------------------------------
    
    handleCreateCharacter(event) {
        event.preventDefault();
        
        let date = new Date()
        const character = {
            id: date.getTime(),
            isChecked: false,
            isSelected: false,
            intelligence: checkStarCount(),
            magic: checkStarCount(),
            power: checkStarCount()
        
        }
        
        const formData = new FormData(createFormElement)
        
        for (const [name, value] of formData) {
            character[name] = value;
        }
        
        data.push(character);
    
        createFormElement.reset();
        render(data)
    }
    
    //----------------------------------------------
    
    handleRemoveCharacter(event) {
        const { target } = event;
        
        if (target.dataset.role !== 'remove') return
    
        const { id } = target.dataset;
    
        data.forEach((item, index) => {
          if (item.id == id) {
            data.splice(index, 1);
          }
        });
    isEdit = false;
    render(data);  
    }
    
    //----------------------------------------------
    handleEditCharacter(event) {
        const { target } = event;
        const formParentEditElement = target.closest('.character__body')
        
        if(target.dataset.role !== 'edit') return

        if(formParentEditElement.classList.contains('checked')) {
            alert('Мертвых нельзя переименовать...')
            return
        } 
    
        if(isEdit) {
            alert('Уже идет редактирование...')
            return
        } else {
            isEdit = true;
        }
    
        const { id } = target;
        data.forEach(item => {
            if(item.id == id) {
                formParentEditElement.classList.add('edit')
            }
        })
    }
    //----------------------------------------------
    
    handleSubmitEdition(event) {
        event.preventDefault() 
    
        const { target } = event;
        const editInputElement = target.querySelector('input[name="title"]')
        const { value } = editInputElement
        const { id } = target
        
        data.forEach((item) => {
            if (item.id == id) {
                item.title = value;
            }
        });
      
        const formParentElement = target.closest('.character__body')
        formParentElement.classList.remove('edit')
    
        isEdit = false;
        render(data)
    }
    //----------------------------------------------
    
    handleCheckCharacterSetting(event) {
        const { target } = event;
    
        if(target.dataset.role != 'more') return
        
        const parentMoreElement = target.closest('.character__setting')
        parentMoreElement.classList.toggle('active');
    }    
}

const app = new Character

//----------------------------------------------
function checkStarCount() {
    let stars = '';
    let count = getRandomInt(6)

    if (count == 0) return '⭐'

    for (let i = 0; i < count; i++) {
      stars += '⭐';
    }
  
    return stars;
  }

//----------------------------------------------
function checkFaculty(nameOfFaculty) {

    switch (nameOfFaculty) {
        case '1':
            return 'Гриффиндор';    
        case '2':
            return 'Слизерин';    
        case '3':
            return 'Пуффендуй';    
        case '4':
            return 'Когтевран';    
        default:
            return 'Неизвестно';    
    }
}

//----------------------------------------------
function checkFacultyPictures(facultyPictures) {

    switch (facultyPictures) {
        case '1':
            return 'griffindor';    
        case '2':
            return 'slytheerin';    
        case '3':
            return 'hufflepuff';    
        case '4':
            return 'ravenclaw';    
        default:
            return 'all-bg';    
    }
  }


//----------------------------------------------
function currentDate() {
    let date = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
  
    let stringtDate = date.toLocaleDateString('to-RU', options);
    return stringtDate
}
//----------------------------------------------

function characterTemplate({title, age, faculty, intelligence, magic, power, isSelected, id, isChecked}) {
    
    let stringDate = currentDate();
    
    facultyName = checkFaculty(faculty)
    facultyPictures = checkFacultyPictures(faculty)

    let selectedAttr = isSelected ? 'choice' : '';
    let checkedAttr = isChecked ? 'checked' : '';

    data.forEach(item => {
        if (item.title == '') item.title = 'Нет имени';

        if (item.age == '') item.age = 'Не указан';
    })

    return `
    
    <div class="character__body ${checkedAttr} ${selectedAttr}">
        <form  id="${id}" data-id="${id}" class="character-form">

            <div class="character__content">
                <div class="battle-checkbox" data-select="character" 
                data-id="${id}" id="${id}"></div>

                <h2 class="character__title">${title}</h2>
                <input type="text" name="title" class="create__edit-title"
                maxlength="20" minlength="3" 
                placeholder="Имя и Фамилия" value="${title}">

                <div class="character__info">
                    <p class="character__age">Возраст: ${age}</p>
                    <p class="character__faculty">${facultyName}</p>    
                </div>
                <div class="character__talents">
                    <p class="character__intelligence">${intelligence} : Интеллект</p>
                    <p class="character__magic">${magic} : Магия</p>
                    <p class="character__power">${power} : Сила</p>
                </div>

                <div class="character__setting">

                    <div data-role="more" class="character__more">
                        <i class="fas fa-plus"></i>
                    </div>

                    <div class="character__edit" data-role="edit"
                    data-id="${id}" id="${id}">
                        <i class="fas fa-wrench"></i>
                    </div>

                    <div data-role="remove" data-id="${id}" id="${id}" class="character__remove">
                        <i class="fas fa-trash-alt"></i>
                    </div>

                    <button type="submit" class="character__save" data-role="save">
                        <i class="fas fa-save"></i>
                    </button>

                    <div class="character__life">
                        <label id="life" for="life"><i class="fas fa-skull-crossbones"></i></label>
                            <input type="checkbox" id="${id}" data-role="life"
                            ${checkedAttr} class="life-checkbox">
                    </div>

                </div>
                <p class="character__date">${stringDate}</p>    
            </div>

            <div class="character__img">
                <img src="img/${facultyPictures}.jpg" alt="faculty">
            </div>

        </form>
    </div>
    `
}

//----------------------------------------------

function getRandomInt(max) {
    return Math.floor(Math.random() * (max));
}

//----------------------------------------------
function render(characterList) {
    let result = '';

    characterList.forEach(item => {
        const template = characterTemplate(item)
        result = result + template;
    });

    if(result != '') {
        characterFormBlockElement.innerHTML = result;
    } else {
        characterFormBlockElement.innerHTML = 'Создай своего персонажа';
    }
}

const battleParamElement = document.querySelector('.battle__parametr')
const battleStartElement = document.querySelector('.start-battle')

function showCharacterForBattle() {
    console.log('ffff')
}



battleStartElement.addEventListener('click', handleCheckPvpParams)
function handleCheckPvpParams(value) {
    
    value = getRandomInt(3)

    switch (value) {
        case 0:
            battleParamElement.innerHTML = '<h2>Cила</h2>'
            break;
        case 1:
            battleParamElement.innerHTML = '<h2>Интеллект</h2>'
            break;
        case 2:
            battleParamElement.innerHTML = '<h2>Магия</h2>'
            break;    
        default:
            break;
    }
}

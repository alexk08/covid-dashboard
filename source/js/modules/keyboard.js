const keyCodes = {
  'backspace': 8, 'enter': 13, 'shift': 16, 'caps': 20, 'space': 32, '0': 48, '1': 49, '2': 50, '3': 51, '4': 52,
  '5': 53, '6': 54, '7': 55, '8': 56, '9': 57, 'a': 65, 'b': 66, 'c': 67, 'd': 68, 'e': 69, 'f': 70, 'g': 71, 'h': 72,
  'i': 73, 'j': 74, 'k': 75, 'l': 76, 'm': 77, 'n': 78, 'o': 79, 'p': 80, 'q': 81, 'r': 82, 's': 83, 't': 84, 'u': 85,
  'v': 86, 'w': 87, 'x': 88, 'y': 89, 'z': 90, ';': 186, '=': 187, ',': 188, '-': 189, '.': 190, '/': 191, '\`': 192,
  '[': 219, '\\': 220, ']': 221, '\'': 222, 'lt': 37, 'gt': 39,
};

export const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
  },

  eventHandlers: {
    oninput: null,
    onclose: null,
  },

  properties: {
    value: '',
    capsLock: false,
    shift: false,
    language: 'en',
    sound: false,
    microphone: false,
  },

  init() {
    // Create main elements
    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');

    // Setup main elements
    this.elements.main.classList.add('keyboard', 'keyboard--hidden');
    this.elements.keysContainer.classList.add('keyboard__keys');
    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

    window.addEventListener('keydown', (e) => {
      const key = document.querySelector(`button[data-key="${e.keyCode}"`);
      if (e.keyCode === 16 || e.keyCode === 20) {
        key.click();
      }
      if (key !== null) {
        key.classList.add('active');
      }
    });

    window.addEventListener('keyup', (e) => {
      const key = document.querySelector(`button[data-key="${e.keyCode}"`);
      if (key !== null) {
        key.classList.add('active');
      }
    });

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    // Automatically use keyboard for elements with .use-keyboard-input
    document.querySelectorAll('.use-keyboard-input').forEach((element) => {
      element.addEventListener('focus', () => {
        this.open(element.value, (currentValue) => {
          element.value = currentValue;
        });
      });
    });
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    const keyLayout = [
      '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace',
      'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']',
      'caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', '\\', 'enter',
      'shift', 'en/ru', 'done', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '?',
      'space', 'lt', 'gt'
    ];

    // Creates HTML for an icon
    const createIconHTML = (iconName) => {
      return `<i class="material-icons">${iconName}</i>`;
    };

    const textarea = document.querySelector('.use-keyboard-input');

    keyLayout.forEach((key) => {
      const keyElement = document.createElement('button');
      const insertLineBreak = ['backspace', ']', 'enter', '?'].indexOf(key) !== -1;

      // Add attributes/classes
      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard__key');
      keyElement.setAttribute('data-key', keyCodes[key]);

      switch (key) {
        case 'backspace':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('backspace');

          keyElement.addEventListener('click', () => {
            textarea.focus();
            document.querySelector('.use-keyboard-input').click();
            this.properties.value = this.properties.value.substring(0, this._getCaretPosition() - 1) +
                                                this.properties.value.substring(this._getCaretPosition(), this.properties.value.length);
            this._triggerEvent('oninput');
          });

          break;

        case 'caps':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
          keyElement.innerHTML = createIconHTML('keyboard_capslock');

          keyElement.addEventListener('click', () => {
            textarea.focus();
            this._toggleCapsLock();
            keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock);
          });

          break;

        case 'enter':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('keyboard_return');

          keyElement.addEventListener('click', () => {
            textarea.focus();
            this.properties.value += '\n';
            this._triggerEvent('oninput');
          });

          break;

        case 'shift':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
          keyElement.innerHTML = createIconHTML('arrow_upward');

          keyElement.addEventListener('click', () => {
            textarea.focus();
            this._toggleShift();
            keyElement.classList.toggle('keyboard__key--active', this.properties.shift);
          });

          break;

        case 'space':
          keyElement.classList.add('keyboard__key--extra-wide');
          keyElement.innerHTML = createIconHTML('space_bar');

          keyElement.addEventListener('click', () => {
            textarea.focus();
            this.properties.value += ' ';
            this._triggerEvent('oninput');
          });

          break;

        case 'done':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--dark');
          keyElement.innerHTML = createIconHTML('check_circle');

          keyElement.addEventListener('click', () => {
            textarea.focus();
            this.close();
            this._triggerEvent('onclose');
          });

          break;

        case 'en/ru':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = `<i class="material-icons"></i> ${this.properties.language}`;

          keyElement.addEventListener('click', () => {
            this._toggleLanguage();
          });

          break;

        case 'lt':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('arrow_left');

          keyElement.addEventListener('click', () => {
            this._setCaretPosition(this._getCaretPosition() - 1);
          });

          break;

        case 'gt':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('arrow_right');

          keyElement.addEventListener('click', () => {
            this._setCaretPosition(this._getCaretPosition() + 1);
          });

          break;

        default:
          keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener('click', () => {
            textarea.focus();
            console.log(document.querySelector('.use-keyboard-input'));
            if (this.properties.shift) {
              if (this.properties.language === 'en') {
                const changedSymbolIndexEn = ['\`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '[', ']', ';', '\'', '\\', ',', '.', '/'].indexOf(key);
                const shiftArrayEn = ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '{', '}', ':', '"', '|', '<', '>', '?'];
                if (changedSymbolIndexEn !== -1) {
                  this.properties.value = this.properties.value.substring(0, this._getCaretPosition()) +
                                                        shiftArrayEn[changedSymbolIndexEn] +
                                                        this.properties.value.substring(this._getCaretPosition() + 1, this.properties.value.length);
                } else {
                  this.properties.value = this.properties.capsLock ? this.properties.value.substring(0, this._getCaretPosition()) +
                                                                                   key.toUpperCase() +
                                                                                   this.properties.value.substring(this._getCaretPosition(), this.properties.value.length) :
                    this.properties.value.substring(0, this._getCaretPosition()) +
                                                                                   key.toLowerCase() +
                                                                                   this.properties.value.substring(this._getCaretPosition(), this.properties.value.length);
                }
              } else {
                const changedSymbolIndexRus = ['\`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '\\', '/'].indexOf(key);
                const shiftArrayRus = ['Ё', '!', '"', '№', ';', '%', ':', '?', '*', '(', ')', '_', '+', '/', ','];
                if (changedSymbolIndexRus !== -1) {
                  this.properties.value = this.properties.capsLock ? this.properties.value.substring(0, this._getCaretPosition()) +
                                                                                   shiftArrayRus[changedSymbolIndexRus].toUpperCase() +
                                                                                   this.properties.value.substring(this._getCaretPosition(), this.properties.value.length) :
                    this.properties.value.substring(0, this._getCaretPosition()) +
                                                                                   shiftArrayRus[changedSymbolIndexRus].toLowerCase() +
                                                                                   this.properties.value.substring(this._getCaretPosition(), this.properties.value.length);
                } else {
                  const changedIndex = [
                    'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']',
                    'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'',
                    'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.'
                  ].indexOf(key);

                  const unshiftArrayRus = [
                    'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ',
                    'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э',
                    'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю'
                  ];
                  this.properties.value = this.properties.capsLock ? this.properties.value.substring(0, this._getCaretPosition()) +
                                                                                   unshiftArrayRus[changedIndex].toUpperCase() +
                                                                                   this.properties.value.substring(this._getCaretPosition(), this.properties.value.length) :
                    this.properties.value.substring(0, this._getCaretPosition()) +
                                                                                   unshiftArrayRus[changedIndex].toLowerCase() +
                                                                                   this.properties.value.substring(this._getCaretPosition(), this.properties.value.length);
                }
              }
            } else {
              if (this.properties.language === 'en') {
                this.properties.value = this.properties.capsLock ? this.properties.value.substring(0, this._getCaretPosition()) +
                                                                               key.toUpperCase() +
                                                                               this.properties.value.substring(this._getCaretPosition(), this.properties.value.length) :
                  this.properties.value.substring(0, this._getCaretPosition()) +
                                                                               key.toLowerCase() +
                                                                               this.properties.value.substring(this._getCaretPosition(), this.properties.value.length);
              } else {
                const changedSymbolIndexRus = ['\`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '\\', '/'].indexOf(key);
                const unShiftArrayRus = ['ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '\\', '.'];
                if (changedSymbolIndexRus !== -1) {
                  this.properties.value = this.properties.capsLock ? this.properties.value.substring(0, this._getCaretPosition()) +
                                                                                   unShiftArrayRus[changedSymbolIndexRus].toUpperCase() +
                                                                                   this.properties.value.substring(this._getCaretPosition(), this.properties.value.length) :
                    this.properties.value.substring(0, this._getCaretPosition()) +
                                                                                   unShiftArrayRus[changedSymbolIndexRus].toLowerCase() +
                                                                                   this.properties.value.substring(this._getCaretPosition(), this.properties.value.length);
                } else {
                  const changedIndex = [
                    'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']',
                    'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'',
                    'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.'
                  ].indexOf(key);

                  const unshiftArrayRus = [
                    'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ',
                    'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э',
                    'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю'
                  ];
                  this.properties.value = this.properties.capsLock ? this.properties.value.substring(0, this._getCaretPosition()) +
                                                                                   unshiftArrayRus[changedIndex].toUpperCase() +
                                                                                   this.properties.value.substring(this._getCaretPosition(), this.properties.value.length) :
                    this.properties.value.substring(0, this._getCaretPosition()) +
                                                                                   unshiftArrayRus[changedIndex].toLowerCase() +
                                                                                   this.properties.value.substring(this._getCaretPosition(), this.properties.value.length);
                }
              }
            }
            this._triggerEvent('oninput');
            document.querySelector('.use-keyboard-input').click();
          });

          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'));
      }
    });

    return fragment;
  },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] === 'function') {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }
    }
  },

  _toggleShift() {
    if (this.properties.shift) {
      this.properties.capsLock = true;
    }
    this.properties.capsLock = !this.properties.capsLock;
    this.properties.shift = !this.properties.shift;
    const firstRowShiftEnglish = [
      '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '{', '}', ':', '"', '|', '<', '>', '?'
    ];
    const firstRowUnshiftEnglish = [
      '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '[', ']', ';', '\'', '\\', ',', '.', '/'
    ];

    const firstRowShiftRus = [
      'Ё', '!', '"', '№', ';', '%', ':', '?', '*', '(', ')', '_', '+', '/', ','
    ];
    const firstRowUnshiftRus = [
      'ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '\\', '/'
    ];

    let j = 0;
    let i = 0;
    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        if (i < 13 || i === 24 || i === 25 || (i >= 36 && i <= 38) || (i >= 50 && i <= 52)) {
          if (this.properties.language === 'en') {
            key.textContent = this.properties.shift ? firstRowShiftEnglish[j] : firstRowUnshiftEnglish[j];
          } else {
            key.textContent = this.properties.shift ? firstRowShiftRus[j] : firstRowUnshiftRus[j];
          }
          j++;
        } else {
          key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
        }
      }
      i++;
    }
  },

  _toggleLanguage() {
    this.properties.language = this.properties.language === 'en' ? 'ru' : 'en';
    this.elements.keys[41].innerHTML = `<i class="material-icons"></i> ${this.properties.language}`;

    const keyLayoutUnshiftRus = [
      'ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=',
      'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ',
      'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', '\\',
      'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', ','
    ];

    const keyLayoutShiftRus = [
      'Ё', '!', '"', '№', ';', '%', ':', '?', '*', '(', ')', '_', '+',
      'Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х', 'Ъ',
      'Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э', '/',
      'Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю', ','
    ];

    const keyLayoutUnshiftEn = [
      '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=',
      'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']',
      'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', '\\',
      'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'
    ];

    const keyLayoutShiftEn = [
      '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+',
      'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}',
      'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', '|',
      'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?'
    ];

    let i = 0;
    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        if (this.properties.language === 'ru') {
          if (this.properties.shift) {
            key.textContent = keyLayoutShiftRus[i];
          } else {
            key.textContent = keyLayoutUnshiftRus[i];
          }
        } else if (this.properties.language === 'en') {
          if (this.properties.shift) {
            key.textContent = keyLayoutShiftEn[i];
          } else {
            key.textContent = keyLayoutUnshiftEn[i];
          }
        }
        key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
        i++;
      }
    }
  },

  _getCaretPosition() {
    let caretPos = 0;
    const textarea = document.querySelector('.use-keyboard-input');
    if (document.selection) {
      textarea.focus();
      let sel = document.selection.createRange();
      sel.moveStart('character', -textarea.value.length);
      caretPos = sel.text.length;
    } else if (textarea.selectionStart || textarea.selectionStart === '0') {
      caretPos = textarea.selectionStart;
    }
    return caretPos;
  },

  _setCaretPosition(caretPos) {
    const textarea = document.querySelector('.use-keyboard-input');
    if (textarea.setSelectionRange) {
      textarea.focus();
      textarea.setSelectionRange(caretPos, caretPos);
    } else if (textarea.createTextRange) {
      let range = textarea.createTextRange();
      range.collapse(true);
      range.moveEnd('character', caretPos);
      range.moveStart('character', caretPos);
      range.select();
    }
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove('keyboard--hidden');
  },

  close() {
    const textarea = document.querySelector('.use-keyboard-input');
    this.properties.value = '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add('keyboard--hidden');
    textarea.blur();
  },
};

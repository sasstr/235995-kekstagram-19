'use strict';

var AMOUNT_OF_PHOTOS = 25;
var comments = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
var descriptions = [
  'Вот это была удача заснять такое',
  'Воспоминания на всю жизнь в одном кадре',
  'Тестим новую камеру! =)',
  'А могло и получиться елси бы не ты!',
  'Да будет свет сказал монтер!',
  'В этот день мы не остались дома',
  'Фотографы отдыхают'
];
var CommentsAmount = {
  MIN: 1,
  MAX: 3
};
var Comments = {
  MIN: 1,
  MAX: 7
};
var AvatarAmount = {
  MIN: 1,
  MAX: 6
};
var LikesAmount = {
  MIN: 15,
  MAX: 200
};
var names = [
  'Артем',
  'Петя',
  'Иван',
  'Игорь',
  'Дима',
  'Коля'
];
var pictureContainer = document.querySelector('.pictures');
var main = document.querySelector('main');
// Забираем шаблон для Большой фотки
var bigPicture = document.querySelector('#big-picture')
  .content
  .querySelector('.big-picture');

var imageUpload = document.querySelector('.img-upload');

// Забираем шаблон для формы загрузки фото
var imageUploadForm = document.querySelector('#img-upload__form')
.content
.querySelector('.img-upload__form');

imageUpload.appendChild(imageUploadForm);

/**
 * Функция возращает случайное целое число между min и max - включительно
 * @param {number} min минимальное число
 * @param {number} max максимальное число
 * @return {number} случайное значение в заданном диапозоне
 */
var getRandomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

/**
 *  Функция возращает случайный элемент массива
 * @param {array} array массив
 * @return {array} возращает случайный элемент массива
 */
var getRendomItemOfArray = function (array) {
  return array[getRandomInteger(0, array.length)];
};

/**
 *  Функция перемешивает элементы массива
 * @param {array} array массив
 * @return {array} возращает массив с перемешанными случайным образом элементами
 */
var shuffleElemetsOfArray = function (array) {
  var cloneArray = array.slice();
  var j;
  var temp;
  for (var i = cloneArray.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = cloneArray[j];
    cloneArray[j] = cloneArray[i];
    cloneArray[i] = temp;
  }

  return cloneArray;
};

/** Функция создает комментарий к фото
 * @return {object} объект с комментарием фото
 */
var createComment = function () {
  return {
    avatar: 'img/avatar-' + getRandomInteger(AvatarAmount.MIN, AvatarAmount.MAX) + '.svg',
    message: shuffleElemetsOfArray(comments)
                    .slice(0, getRandomInteger(CommentsAmount.MIN, CommentsAmount.MAX))
                    .join(' '), // получаем строку из двух случайных коментов
    name: getRendomItemOfArray(names)
  };
};


/**
 * Функция создает один элемент массива с данными, которые будут описывать фотографии
 * @param {number} index индекс
 * @return {object} Объект описывающий фото
 */
var createUserPicture = function (index) {
  return {
    url: 'photos/' + (index + 1) + '.jpg', // Добавить счетчик что бы не повторялись фото от 1 до 25
    likes: getRandomInteger(LikesAmount.MIN, LikesAmount.MAX),
    comments: new Array(getRandomInteger(Comments.MIN, Comments.MAX))
                .fill('')
                .map(createComment),
    description: descriptions[getRandomInteger(0, descriptions.length - 1)]
  };
};

/**
 *  Функция создает массив объектов фоток
 * @param {number} amountOfPictures колличество объектов для описания фото
 * @return {array} массив объектов фоток
 */
var createArrayOfPictures = function (amountOfPictures) {
  var pictures = [];
  for (var i = 0; i < amountOfPictures; i++) {
    pictures.push(createUserPicture(i));
  }

  return pictures;
};

// Создаем массив фоток
var pictures = createArrayOfPictures(AMOUNT_OF_PHOTOS);

/**
 *  Функция создает DOM элемент #picture
 * @param {array} picture колличество объектов для описания фото
 * @return {element} Дом элемент с фотками
 */
var createPicture = function (picture) {
  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var pictureDomElement = pictureTemplate.cloneNode(true);
  pictureDomElement.querySelector('.picture__img').src = picture.url;
  pictureDomElement.querySelector('.picture__comments').textContent = picture.comments.length;
  pictureDomElement.querySelector('.picture__likes').textContent = picture.likes;

  return pictureDomElement;
};

/**
 *  Функция отрисует все фотки
 * @param {array} picturesList Массив фоток
 * @param {element} fragment Элемент фрагмент
 * @return {element} отрисует все фотки
 */
var renderPictures = function (picturesList) {
  var picturesFragment = document.createDocumentFragment();
  for (var i = 0; i < picturesList.length; i++) {
    picturesFragment.appendChild(createPicture(picturesList[i]));
  }

  return picturesFragment;
};

pictureContainer.appendChild(renderPictures(pictures));

/**
 *  Функция создает элемент модального окна .big-picture из первой фотки
 * @param {object} picture Объект с даннными о фото
 * @return {element} создает элемент модального окна .big-picture
 */
var createBigPicture = function (picture) {
  if (document.querySelector('.big-picture')) {
    document.querySelector('.big-picture').remove();
  }
  var cloneBigPicture = bigPicture.cloneNode(true);
  var socialComments = cloneBigPicture.querySelector('.social__comments');
  var socialComment = cloneBigPicture.querySelector('.social__comment').cloneNode(true);

  cloneBigPicture.querySelector('.big-picture__img img').src = picture.url;
  cloneBigPicture.querySelector('.likes-count').textContent = picture.likes;
  cloneBigPicture.querySelector('.comments-count').textContent = picture.likes;
  cloneBigPicture.querySelector('.social__caption').textContent = picture.description;

  socialComments.innerHTML = '';

  cloneBigPicture.querySelector('.social__comment-count').classList.add('hidden');
  cloneBigPicture.querySelector('.comments-loader').classList.add('hidden');

  picture.comments.forEach(function (comment) {
    var newSocialComment = socialComment.cloneNode(true);
    newSocialComment.querySelector('.social__picture').src = comment.avatar;
    newSocialComment.querySelector('.social__text').textContent = comment.message;
    newSocialComment.querySelector('.social__picture').alt = comment.name;

    socialComments.appendChild(newSocialComment);
  });

  cloneBigPicture.querySelector('.social__comments-loader')
    .insertAdjacentElement('beforeBegin', socialComments);

  return cloneBigPicture;
};

/**
 *  Функция скрывает модальное окно с большой фоткой
 *
 * @return {void} скрывает модальное окно с большой фоткой
 */
var hiddenBigPicture = function () {
  var currentBigPicture = document.querySelector('.big-picture');
  main.removeChild(currentBigPicture);
  currentBigPicture.classList.add('hidden');
};

/**
 *  Функция показывает модальное окно с большой фоткой
 *
 * @return {void} показывает модальное окно с большой фоткой
 */
var showBigPicture = function () {
  var picture = createBigPicture(pictures[0]);

  picture.querySelector('#picture-cancel').addEventListener('click', function () {
    hiddenBigPicture();
  });

  main.insertBefore(picture, null);
  picture.classList.remove('hidden');
};
document.body.classList.add('modal-open');

var pictureImg = document.querySelector('.picture__img');
// Вешаем событие клик на первую фотку что бы открыть модалку
pictureImg.addEventListener('click', function () {
  showBigPicture();
});

var pin = document.querySelector('.effect-level__pin');
var effectLevelLine = document.querySelector('.effect-level__line');
var effectLevelDepth = document.querySelector('.effect-level__depth');
var effectLevelValue = document.querySelector('.effect-level__value');
var cancelButton = document.querySelector('.cancel');
var scaleControlSmaller = document.querySelector('.scale__control--smaller');
var scaleControlBigger = document.querySelector('.scale__control--bigger');
var scaleControlValue = document.querySelector('.scale__control--value');
var uploadFileInput = document.querySelector('#upload-file');

pin.style.cursor = 'pointer';

uploadFileInput.addEventListener('click', function (evtUpload) {
  evtUpload.preventDefault();
  document.querySelector('.img-upload__overlay').classList.remove('hidden');
});

uploadFileInput.addEventListener('change', function (evtChange) {
  evtChange.preventDefault();
  document.querySelector('.img-upload__overlay').classList.remove('hidden');
});

cancelButton.addEventListener('click', function (evtCancel) {
  evtCancel.preventDefault();
  document.querySelector('.img-upload__overlay').classList.add('hidden');
  imageUploadForm.reset();
});

document.body.addEventListener('keyup', function (evtEsc) {
  evtEsc.preventDefault();
  if (evtEsc.key === 'Escape') {
    document.querySelector('.img-upload__overlay').classList.add('hidden');
    imageUploadForm.reset();
  }
});

var onPinMouseMove = function (evtMove) {
  evtMove.preventDefault();
  // Получаем ширину ползунка
  var pinWidthShift = pin.offsetWidth / 2;
  // Получаем ширину контейнера для ползунка
  var lineWidth = effectLevelLine.offsetWidth;
  // Получаем начальные координаты ползунка
  var coordStartX = evtMove.clientX;
  // Получаем координаты смещения по X
  var shiftCoord = coordStartX - evtMove.clientX;

  // Получаем длину родителя ползунка в переделах которого он должен перемещаться
  var PinLimit = {
    MIN: pin.offsetLeft - pinWidthShift,
    MAX: pin.offsetLeft + lineWidth + pinWidthShift,
  };
  // Получаем новые координаты ползунка по X
  var pinCoordX = pin.offsetLeft - shiftCoord;
  // Получаем новый % на который попал ползунок
  var pinLocation = pinCoordX / lineWidth;

  if (pinCoordX > PinLimit.MIN || pinCoordX < PinLimit.MAX) {
    pin.style.left = pinCoordX + 'px';
    effectLevelDepth.style.width = pinLocation * 100 + '%';
    effectLevelValue.value = Math.trunc(pinLocation * 100);
  }
};

pin.addEventListener('mousemove', onPinMouseMove);

var onPinMouseUp = function (evtUp) {
  evtUp.preventDefault();
  pin.removeEventListener('mousemove', onPinMouseMove);
};

pin.addEventListener('mouseup', onPinMouseUp);

// Валидация хэштегов

var textHashtags = document.querySelector('.text__hashtags');

// Функция преобразует введенные пользователем хэштеги в массив хэштегов
var getHashtags = function (inputHashtags) {
  var hashtags = inputHashtags.split(' ');

  if (hashtags.length === 0) {
    return -1;
  }

  return hashtags;
};

// Получаем массив хэштегов
var hashtagsArray = getHashtags(textHashtags);

// Функция валидирует правильность введенных хэштегов
var checkHashtags = function (hashtags) {
  var checkedHashtags = new Set();
  var errors = new Set();

  var noEmptyHashtags = hashtags.filter(function (hashtag) {
    return hashtag.trim() !== '';
  });

  if (noEmptyHashtags.length !== hashtags.length) {
    errors.add('Не может быть хэштегов состоящих только из пробелов!');
  }

  if (hashtags.length > 5) {
    errors.add('Хэштегов не может быть больше пяти!');
  }
  hashtags.forEach(function (hashtag) {
    hashtag.toLowerCase();
    if (!hashtag.startsWith('#')) {
      errors.add('Вы должны начинать название хэштега не с #');
    }
    if (hashtag.length > 20) {
      errors.add('Хэштег не может состоять из' + hashtag.length + ' символов. /n Максимальная длинна не более 20 символов');
    }
    if (hashtag.length === 1) {
      errors.add('Хэштег не может состоять из одного символа');
    }
    checkedHashtags.add(hashtag);
  });
  if (checkedHashtags.length !== hashtags.length) {
    errors.add('Не может быть одинаковых хэштегов!');
  }

  return errors;
};

/*
2.3. Хэш-теги:
хэш-тег начинается с символа # (решётка); +++

строка после решётки должна состоять из букв и чисел и
не может содержать пробелы, спецсимволы (#, @, $ и т.п.),
символы пунктуации (тире, дефис, запятая и т.п.), эмодзи и т.д.; ---

хеш-тег не может состоять только из одной решётки; +++

максимальная длина одного хэш-тега 20 символов, включая решётку; +++

хэш-теги нечувствительны к регистру: #ХэшТег и #хэштег  +++
считаются одним и тем же тегом;

хэш-теги разделяются пробелами; +++

один и тот же хэш-тег не может быть использован дважды; +++

нельзя указать больше пяти хэш-тегов; +++

хэш-теги необязательны; ---

===========================================================
если фокус находится в поле ввода хэш-тега, нажатие
на Esc не должно приводить к закрытию формы редактирования изображения.

===========================================================
Сообщения о неправильном формате хэштега задаются
с помощью метода setCustomValidity у соответствующего поля.
*/

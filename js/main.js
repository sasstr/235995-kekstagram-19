'use strict';

var amountOfPhoto = 25;
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
var pictureElement = document.querySelector('.pictures');

/**
 * Функция возращает случайное целое число между min и max - включительно
 * @param {number} min минимальное число
 * @param {number} max максимальное число
 * @return {number} случайное значение в заданном диапозоне
 */
var getRandomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

//  Функция возращает случайный элемент массива
/**
 * @param {array} array массив
 * @return {array} возращает случайный элемент массива
 */
var getRendomItemOfArray = function (array) {
  return array[getRandomInteger(0, array.length)];
};

//  Функция перемешивает элементы массива
/**
 * @param {array} array массив
 * @return {array} возращает массив с перемешанными случайным образом элементами
 */
var shuffleElemetsOfArray = function (array) {
  var cloneArray = array.slice();
  var j;
  var temp;
  for (var i = 0; i < cloneArray.length; i++) {
    j = Math.floor(Math.random() * (i + 1));
    temp = cloneArray[j];
    cloneArray[j] = cloneArray[i];
    cloneArray[i] = temp;
  }
  return cloneArray;
};

// Функция создает комментарий к фото
/**
 * @return {object} объект с комментарием фото
 */
var createComment = function () {
  return {
    avatar: 'img/avatar-' + getRandomInteger(AvatarAmount.MIN, AvatarAmount.MAX) + '.svg',
    massage: shuffleElemetsOfArray(comments)
                    .slice(0, getRandomInteger(CommentsAmount.MIN, CommentsAmount.MAX))
                    .join(' '), // получаем строку из двух случайных коментов
    name: getRendomItemOfArray(names)
  };
};

//  Функция создает один элемент массива с данными, которые будут описывать фотографии
/**
 * @param {number} i индекс
 * @return {object} Объект описывающий фото
 */
var createUserPhoto = function (i) {
  return {
    url: 'photos/' + (i + 1) + '.jpg', // Добавить счетчик что бы не повторялись фото от 1 до 25
    likes: getRandomInteger(LikesAmount.MIN, LikesAmount.MAX),
    comments: new Array(getRandomInteger(CommentsAmount.MIN, CommentsAmount.MAX))
                .fill('')
                .map(createComment),
    description: descriptions[getRandomInteger(0, descriptions.length - 1)]

  };
};

/**
 *  Функция создает массив объектов фоток
 * @param {number} amountOfPhotos колличество объектов для описания фото
 * @return {array} массив объектов фоток
 */
var createArrayOfPhotos = function (amountOfPhotos) {
  var arrayOfPhotos = [];
  for (var i = 0; i < amountOfPhotos; i++) {
    arrayOfPhotos.push(createUserPhoto(i));
  }
  return arrayOfPhotos;
};

// Создаем массив фоток
var arrayOfPhotos = createArrayOfPhotos(amountOfPhoto);

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
 * @return {element} отрисует все фотки
 */
var renderPictures = function () {
  var pictures = document.createDocumentFragment();
  for (var i = 0; i < amountOfPhoto; i++) {
    pictures.appendChild(createPicture(arrayOfPhotos[i]));
  }
  return pictures;
};

pictureElement.appendChild(renderPictures());

/**
 *  Функция создает элемент модального окна .big-picture из первой фотки
 *
 * @return {void} создает элемент модального окна .big-picture из первой фотки
 */
var createBigPicture = function () {
  var firstPhoto = arrayOfPhotos[0];
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureImg = bigPicture.querySelector('.big-picture__img img');
  var likesCount = bigPicture.querySelector('.likes-count');
  var commentsCount = bigPicture.querySelector('.comments-count');
  var socialComments = bigPicture.querySelector('.social__comments');
  var socialComment = bigPicture.querySelector('.social__comment');

  bigPictureImg.src = firstPhoto.url;
  likesCount.textContent = firstPhoto.likes;
  commentsCount.textContent = firstPhoto.likes;
  bigPicture.querySelector('.social__caption').textContent = firstPhoto.description;
  bigPicture.querySelectorAll('.social__comment').forEach(function (li) {
    li.remove();
  });
  firstPhoto.comments.forEach(function (comment) {
    socialComment.querySelector('.social__picture').src = comment.avatar;
    socialComment.querySelector('.social__text').textContent = comment.massage;
    socialComments.appendChild(socialComment);
  });
};

createBigPicture();

var pictureCancelBtn = document.querySelector('#picture-cancel');
var bigPicture = document.querySelector('.big-picture');
var pictureImg = document.querySelector('.picture__img');
// Вешеаем событие клик на крестик для закрытия окна
pictureCancelBtn.addEventListener('click', function () {
  bigPicture.classList.add('hidden');
});
// Вешаем событие клик на первую фотку что бы открыть модалку
pictureImg.addEventListener('click', function () {
  bigPicture.classList.remove('hidden');
});

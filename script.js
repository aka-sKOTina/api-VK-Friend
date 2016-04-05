function log(l) {
    console.log(l)
};

new Promise(function (resolve) {
    if (document.readyState === "complete") {
        resolve();
    } else {
        window.onload = resolve;
    }
})
    .then(function() {
        return new Promise(function(resolve, reject) {
            VK.init({
                apiId: 5379338
            });

            VK.Auth.login(function(response) {
                if (response.session) {
                    resolve(response)
                } else {
                    reject(alert("не удалось авторизоваться"))
                }
            }, 2);
        });
    }) 
    .then(function () { 
        return new Promise(function (resolve, reject) { 
            VK.api("friends.get", {'fields': 'photo'}, function (response) { 
                var res = response.response;
                for (var key in res) {
                    var img = document.createElement("img"); // cоздаем тег img
                    var href = res[key].photo; // присваиваем ссылку на фото
                    var li = document.createElement("li"); // создаем тег li
                    img.setAttribute("src", href); // img присваивам изображение
                    img.setAttribute("draggable", true)
                    li.appendChild(img); // вставляем в li наш img со ссылкой
                    li.innerHTML += "<span class='friendName'>" + res[key].first_name + " " + res[key].last_name + "</span>" + " <span class='addFriend'>+</span>"// в ли добавляем имя и фамилию
                    friendList.appendChild(li); // вставляем все в первый ul
                }
                var allLi = document.querySelectorAll("li"); // находим все li
                resolve(allLi);

            }); 
        }); 
    })
    .then(function (allLi) {
            var targAdd = document.querySelector(".addFriend"); // добавляю переменную для сравнения
            var findFriend = document.querySelectorAll(".friendList li"); // список друзей из левой колонки
            var targRemove;
            var rightFriendLi; // здесь будут все li из правой колонки

          

            friendList.addEventListener("click", function(e){
                if(e.target.classList.contains('addFriend')) {
                    someFriend.appendChild(e.target.parentNode);
                    e.target.classList.add("removeFriend");
                    e.target.classList.remove("addFriend");
                    e.target.innerHTML = "&chi;";
                    
                }
                targRemove = document.querySelector(".removeFriend"); // переменная объявленна в глобальной видимости
                // после каждого события клик, в ней появляются новые данные
                rightFriendLi = document.querySelectorAll(".someFriend li"); // при добавление друзей в правую колонку
                // помещаем в нашу переменную список этих друзей
            });


            someFriend.addEventListener("click", function(e){
                // нашел баг: если удалять самого верхнего из списка, то можно удалить только
                // одного человека, после этого событие не работает
                if(e.target.classList.contains('removeFriend')) {
                    friendList.appendChild(e.target.parentNode);
                    e.target.classList.addEventListener("addFriend");
                    e.target.classList.remove("removeFriend");
                    e.target.innerHTML = "+";
                    
                }
                 rightFriendLi = document.querySelectorAll(".someFriend li"); // если удалили друга, обновим
                 // информацию о наших друзьях из правой колонки
            });


            var data;
            friendList.addEventListener ("dragstart", function(e) {
                e.dataTransfer.effectAllowed="move";
                data = e.target.parentNode;
                e.dataTransfer.setDragImage(e.target, 25, 25);
                return true;
            });

            someFriend.addEventListener("dragenter", function(e) {
                e.preventDefault();
                return true;
            });

            // someFriend.addEventListener("dragover", function(e) {
            //     e.preventDefault();
            // });

            someFriend.addEventListener("dragdrop", function(e) {
                someFriend.appendChild(data);
                log(e.target)
                e.stopPropagarion();
                return false;
            });




           
            searchAll.addEventListener("input", function() {
                var temp = searchAll.value; // значение из инпута
                if (temp.length === 0) { // если поле пустое, дальше перебор всех друзей
                    // на поиск класса с display: none;
                    for (var key in findFriend) {
                        if(findFriend[key].classList.contains("not-visible")) { // проверка, если ли
                            // в нашем списке друзей слева у эл-тов класс not-visible
                            findFriend[key].classList.remove("not-visible"); // удаляем, если есть.
                            // и после чего отобразятся все друзья
                        }
                    } 
                } else { // если инпут не пустой, делаем всех скрытыми
                    for (var key in findFriend) { 
                        findFriend[key].classList.add("not-visible");
                        return log(findFriend[key]);
                        
                    }
                        for (var i = 0; i < findFriend.length; i++) { // цикл для поиска по индексу
                        if(findFriend[i].innerHTML.indexOf(temp) !== -1){
                            friendList.classList.remove("not-visible"); // выводим тех друзей,
                            // которые соответствую поиску, удаляя класс с display: none;
                        }
                    };

                }

              
        });


    })
    
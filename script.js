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
                    li.setAttribute("id", res[key].uid); // добавляем каждому эл-ту li id, который = id друга
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
            var retObj = JSON.parse(localStorage.getItem("object")); // возвращаем локальное хранилище
            for (var i = 0; i < retObj.length; i++) {
                var a = document.getElementById(retObj[i])
                log(a);
                someFriend.appendChild(a);
                a.children[2].classList.add("removeFriend");
                a.children[2].classList.remove("addFriend");
                a.children[2].innerHTML = "&chi;";
            }
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
                    e.target.classList.remove("removeFriend");
                    e.target.innerHTML = "+";
                    
                }
                 rightFriendLi = document.querySelectorAll(".someFriend li"); // если удалили друга, обновим
                 // информацию о наших друзьях из правой колонки
            });


            var data;
            friendList.addEventListener ("dragstart", function(e) {
                // e.dataTransfer.effectAllowed="move";
                data = e.target.parentNode;
                e.dataTransfer.setDragImage(e.target, 25, 25);
            });

            someFriend.addEventListener("dragover", function(e) {
                e.preventDefault();
            });

            someFriend.addEventListener("drop", function(e) {
                e.preventDefault();
                someFriend.appendChild(data);
                data.children[2].classList.add("removeFriend");
                data.children[2].classList.remove("addFriend");
                data.children[2].innerHTML = "&chi;";
                data = null;
            });

            someFriend.addEventListener ("dragstart", function(e) {
                e.dataTransfer.effectAllowed="move";
                data = e.target.parentNode;
                e.dataTransfer.setDragImage(e.target, 25, 25);
            });

            friendList.addEventListener("dragover", function(e) {
                e.preventDefault();
            });

            friendList.addEventListener("drop", function(e) {
                e.preventDefault();
                friendList.appendChild(data);
                data.children[2].classList.add("addFriend"); // меняем на нужный класс спан
                data.children[2].classList.remove("removeFriend"); // удаляем не нужный класс спану
                data.children[2].innerHTML = "+";
                data = null;
            });


            searchAll.addEventListener("input", function() {
                var temp = searchAll.value.trim(); // значение из инпута
      
                   
                        for (var i = 0; i < friendList.children.length; i++) { // цикл для поиска по индексу
                        if(friendList.children[i].innerHTML.indexOf(temp) !== -1){
                            friendList.children[i].classList.remove("not-visible"); // выводим тех друзей,
                            // которые соответствую поиску, удаляя класс с display: none;
                        } else {
                            friendList.children[i].classList.add("not-visible");
                        }
                    };
            });


            searchSome.addEventListener("input", function() {
                var temp = searchSome.value.trim(); // значение из инпута
      
                   
                        for (var i = 0; i < someFriend.children.length; i++) { // цикл для поиска по индексу
                        if(someFriend.children[i].innerHTML.indexOf(temp) !== -1){
                            someFriend.children[i].classList.remove("not-visible"); // выводим тех друзей,
                            // которые соответствую поиску, удаляя класс с display: none;
                        } else {
                            someFriend.children[i].classList.add("not-visible");
                        }
                    };
            });

            
            save.addEventListener("click", function () {
                var saveList = [];
                for (var i = 0; i < someFriend.children.length; i++) {
                                    saveList.push(someFriend.children[i].id)
                                }
                        var sObj = JSON.stringify(saveList);
                        localStorage.setItem("object", sObj);
                        log(localStorage)
            });


    })
    
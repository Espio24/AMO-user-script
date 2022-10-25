// ==UserScript==
// @name AMOscripts
// @namespace http://tampermonkey.net/
// @version 0.1
// @description try to take over the world!
// @author You
// @match https://sshagin.amocrm.ru/leads/detail*
// @icon https://www.google.com/s2/favicons?sz=64&domain=amocrm.ru
// @grant none
// @downloadURL  https://github.com/Espio24/AMO-user-script/blob/e9984289634744d089c746ea7a7061661a5f0148/AMOscripts%20user.js
// @updateURL    https://github.com/Espio24/AMO-user-script/blob/e9984289634744d089c746ea7a7061661a5f0148/AMOscripts%20user.js
// ==/UserScript==

(function() {
    'use strict';
    //Функции
    function strToObj(str){
        var obj = {};
        if(str&&typeof str ==='string'){
            var objStr = str.match(/\{(.)+\}/g);
            eval("obj ="+objStr);
        }
        return obj
    }
	
	console.log('kek');

    function getToken(login, password){
        var url = new URL('https://api.pyrus.com/v4/auth');
        url.searchParams.set('login', login);
        url.searchParams.set('security_key', password);
        // console.log(url);
        var xhr = new XMLHttpRequest();
        xhr.open('GET', `${url}`, false);
        xhr.send();
        if (xhr.status != 200) {
            return alert(`Ошибка ${xhr.status}: ${xhr.statusText}`); // пример вывода: 404: Not Found
        } else {
            response_data = xhr.responseText;
            token = strToObj(response_data).access_token;
            //console.log(response_data);
            return token;
        }
    }

    function getDolgnost(dolgnost){
        if (dolgnost == 'Ген.директор'){
            return 1}
        else if (dolgnost == 'Директор')
        {return 2}
        else if (dolgnost == 'Гл.бухгалтер')
        {return 3}
        else if (dolgnost == 'Бухгалтер')
        {return 4}
        else if (dolgnost == 'IT-директор')
        {return 6}
        else if (dolgnost == 'IT-специалист')
        {return 5}
        else if (dolgnost == 'Супервайзер')
        {return 11}
        else if (dolgnost == 'Торговый представитель/Менеджер')
        {return 7}
        else {return null}

    }

    function getTippodkluchenia(tippodkluchenia){
        if (tippodkluchenia.includes('Автомат') || tippodkluchenia.includes('Ручной') ){
            return 1}
        else if (tippodkluchenia.includes('Самостоятельно'))
        {return 3}
        else if (tippodkluchenia == 'По почте')
        {return 2}
        else if (tippodkluchenia == 'EDI')
        {return 4}
        else if (tippodkluchenia.includes('IIKO'))
        {return 5}
        else if (tippodkluchenia.includes('StoreHouse'))
        {return 6}
        else if (tippodkluchenia == 'FTP')
        {return 7}
        else
        {return null}
    }


    function getGdeNakli(GdeNakli){
        if (GdeNakli.includes('8')){
            return 1}
        else if (GdeNakli.includes('7'))
        {return 2}
        else {return null}
    }

    function getKakPodkluchaem(kakPordkluchaem){
        if (kakPordkluchaem.includes('без')){
            return 1}
        else if (GdeNakli.includes('отбором'))
        {return 5}
        else if (GdeNakli.includes('Ручной'))
        {return 2}
        else {return null}
    }

    function getKakaja1C(Kakaja1C){
        if (Kakaja1C == 'Комплексная автоматизация 1.1'){
            return 6}
        else if (Kakaja1C == 'Комлпексная автоматизация 2')
        {return 11}
        else if (Kakaja1C == 'УНФ')
        {return 7}
        else if (Kakaja1C == 'УПП')
        {return 10}
        else if (Kakaja1C == 'Самописная')
        {return 8}
        else if (Kakaja1C.includes('1.6'))
        {return 12}
        else if (Kakaja1C == 'FRESH Бухгалтерия предприятия (ред. 3.0)')
        {return 13}
        else if (Kakaja1C == 'Управление торговлей 10')
        {return 1}
        else if (Kakaja1C == 'Управление торговлей 11')
        {return 2}
        else if (Kakaja1C == 'Бухгалтерия 3.0')
        {return 4}
        else if (Kakaja1C == 'Бухгалтерия 2.0')
        {return 3}
        else if (Kakaja1C == 'ERP')
        {return 5}
        else {return null}
    }

    function checkClose(taskid){
        var taskurl = 'https://api.pyrus.com/v4/tasks/' + taskid;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', `${taskurl}`, false);
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        try {
            xhr.send();
            if (xhr.status != 200) {
                alert(`Ошибка ${xhr.status}: ${xhr.statusText}`);
            } else {
                response_data = xhr.responseText;
                let dateclose = strToObj(response_data).task.close_date;
                return dateclose;
            }
        } catch(err) {
            alert("Запрос не удался");
        }
    }



    function addComment(taskid, json){
        var taskurl = 'https://api.pyrus.com/v4/tasks/' + taskid + '/comments';
        var xhr = new XMLHttpRequest();
        xhr.open('POST', `${taskurl}`, false);
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        try {
            xhr.send(json);
            if (xhr.status != 200) {
                alert(`Ошибка ${xhr.status}: ${xhr.statusText}`);
            }
        } catch(err) {
            alert("Запрос не удался");
        }
    }

     var checkshablon = function(){
        text = document.getElementsByName('CFV[1086147]')[0].value;
        shablon = document.getElementsByClassName('control--select--button-inner')[5].textContent.replace(/\s+/g, ' ').trim();
        if (shablon == 'Выбрать'){
            shablon = '';
        }
    }

     var checksto = function(){
        stotext = document.getElementsByName('CFV[1092651]')[0].value;
        stoshablon = document.getElementsByClassName('control--select--button-inner')[6].textContent.replace(/\s+/g, ' ').trim();
        if (stoshablon == 'Выбрать'){
            stoshablon = '';
        }
    }

    //Оповещение о работе скриптов
    var notification = new Notification("Скрипты работают", {body: "пользуйся"});
    setTimeout(function() {notification.close()}, 1000);
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Вспомогательный список для кнопок
    var navbar = document.getElementsByClassName('linked-forms__group-wrapper linked-forms__group-wrapper_main js-cf-group-wrapper')[2];
    var newul = document.createElement('ul');
    //newul.style.margin = '0 auto';
    newul.style.maxWidth = '300px';
    navbar.appendChild(newul);
    newul.classList.add('dxbx');
    // console.log(newul);

    //Делаем кнопки
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
     var toButton = document.createElement('li');
    toButton.innerHTML = "БОТ: Содействие";
    toButton.style.padding = '2px';
    toButton.style.marginTop = '5px';
    toButton.style.width = '115px';
    toButton.style.color = '#0A2468';
    toButton.style.fontWeight = 'bold';
    toButton.style.cursor = 'pointer';
    toButton.style.borderRadius = '8px';
    toButton.style.border = '4px groove #3883ED'
    toButton.setAttribute('target', '_blank');
    newul.appendChild(toButton);

    var tonewButton = document.createElement('li');
    tonewButton.innerHTML = "БОТ: Передача на подключение";
    tonewButton.style.padding = '2px';
    tonewButton.style.marginTop = '5px';
    tonewButton.style.width = '215px';
    tonewButton.style.color = '#0A2468';
    tonewButton.style.fontWeight = 'bold';
    tonewButton.style.cursor = 'pointer';
    tonewButton.style.borderRadius = '8px';
    tonewButton.style.border = '4px groove #3883ED'
    tonewButton.setAttribute('target', '_blank');
    newul.appendChild(tonewButton);

    var toPyrusSodeistvieButton = document.createElement('li');
    toPyrusSodeistvieButton.style.padding = '2px';
    toPyrusSodeistvieButton.style.marginTop = '5px';
    toPyrusSodeistvieButton.style.width = '218px';
    toPyrusSodeistvieButton.style.color = '#0A2468';
    toPyrusSodeistvieButton.style.fontWeight = 'bold';
    toPyrusSodeistvieButton.style.cursor = 'pointer';
    toPyrusSodeistvieButton.style.border = '4px groove #3883ED'
    toPyrusSodeistvieButton.style.borderRadius = '8px';
    toPyrusSodeistvieButton.innerHTML = "Отправить запрос на содействие";
    toPyrusSodeistvieButton.setAttribute('target', '_blank');
    newul.appendChild(toPyrusSodeistvieButton);

    var toPyrusTaskButton = document.createElement('li');
    toPyrusTaskButton.innerHTML = "Создать задачу в Pyrus";
    toPyrusTaskButton.style.padding = '2px';
    toPyrusTaskButton.style.marginTop = '5px';
    toPyrusTaskButton.style.width = '155px';
    toPyrusTaskButton.style.color = '#0A2468';
    toPyrusTaskButton.style.fontWeight = 'bold';
    toPyrusTaskButton.style.cursor = 'pointer';
    toPyrusTaskButton.style.borderRadius = '8px';
    toPyrusTaskButton.style.border = '4px groove #3883ED'
    toPyrusTaskButton.setAttribute('target', '_blank');
    newul.appendChild(toPyrusTaskButton);

    var stoButton = document.createElement('li');
    stoButton.innerHTML = "Отправить в СТО";
    stoButton.style.padding = '2px';
    stoButton.style.marginTop = '5px';
    stoButton.style.width = '120px';
    stoButton.style.color = '#0A2468';
    stoButton.style.fontWeight = 'bold';
    stoButton.style.cursor = 'pointer';
    stoButton.style.borderRadius = '8px';
    stoButton.style.border = '4px groove #3883ED'
    stoButton.setAttribute('target', '_blank');
    newul.appendChild(stoButton);
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //Переменные
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var INN = document.getElementsByName('CFV[969033]')[0].value;
    var supplier = document.getElementById('person_n').value;
    var link = document.getElementsByName('CFV[1080381]')[0].value;
    var shablon;
    var text;
    var stoshablon;
    var stotext;
    var tippodkluchenia;
    var tipobraba;
    var GdeNakli = document.getElementsByClassName('control--select--button-inner')[0].textContent.replace(/\s+/g, ' ').trim();
    var Kakaja1C = document.getElementsByClassName('control--select--button-inner')[1].textContent.replace(/\s+/g, ' ').trim();
    var KakPodkluchaem = document.getElementsByClassName('control--select--button-inner')[2].textContent.replace(/\s+/g, ' ').trim();
    var contact = document.getElementsByClassName('linked-form__cf js-linked-name-view js-form-changes-skip text-input')[0].value;
    var number = document.getElementsByClassName('js-control-phone control-phone')[0];
    var checknumber = number.getElementsByTagName('input')[0].value;
    var email = document.getElementsByClassName('control-wrapper control--suggest ')[2];
    var checkemail = email.getElementsByTagName('input')[0].value;
    var doljnost = document.getElementsByClassName('control--select--button-inner')[9].textContent.replace(/\s+/g, ' ').trim();
    var token;
    var response_data;
    var login = 'bot@532d0850-3d57-49b4-b1d8-c6f7a6c81a8b';
    var password = 'YS9acI1KF9I9CqXQyJ~pM3aYGqZIsoNJKx65y5p97dRfHRBRnqato8~MAr~1vhWKYTClmA5S8OmJ3d6kF2kSdacJjbVhP3J1';
    var ohotnik;
    var idohotnik;
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    //Программируем кнопки
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Отправить в СТО


    stoButton.onclick = async function(){
        checkshablon();
        checksto();
        await navigator.clipboard.writeText(stoshablon + ' ' + supplier + ' ИНН ' + INN + ' ' + shablon + ' ' + text + ' ' + stotext);
        if (link == ''){
            var notification = new Notification("Ссылки на pyrus нет", {body: "Я скопировал сообщение в буфер обмена"});
            setTimeout(function() {notification.close()}, 4000);
        } else {
            window.open(link);
        }}
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Отправить на содействие


    toPyrusSodeistvieButton.onclick = async function(){
        checkshablon();
        await navigator.clipboard.writeText('СОДЕЙСТВИЕ: ' + supplier + ' ИНН ' + INN + ' ' + shablon + ' ' + text);
        if (link == ''){
            var notification = new Notification("Ссылки на pyrus нет", {body: "Я скопировал сообщение в буфер обмена"});
            setTimeout(function() {notification.close()}, 4000);
        } else {
            window.open(link);
        }}
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Отправить задачу в Pyrus
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    if (Kakaja1C == 'Выбрать'){
        Kakaja1C = 'Забыл (а) узнать'
    }

    if (KakPodkluchaem.includes('Автомат')){
        tippodkluchenia = 'По обработчику';
        tipobraba = 'Автомат';
    } else if (KakPodkluchaem.includes('Ручной')){
        tippodkluchenia = 'По обработчику';
        tipobraba = 'Ручной';
    } else {tippodkluchenia = KakPodkluchaem}

    toPyrusTaskButton.href = `https://pyrus.com/t#uf603501?f256=${INN}&f20=${contact}&f92=${doljnost}&f22=${checknumber}&f21=${checkemail}&f24=${GdeNakli}&f25=${Kakaja1C}&f85=${tippodkluchenia}&f205=${tipobraba}&f282=${window.location.href}`;

    toPyrusTaskButton.onclick = async function(){
        window.open(toPyrusTaskButton.href);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //НОВЫЕ ФИЧИ
    //Отправить коммент в содействие
    var findohotnik = function(){
        ohotnik = document.getElementsByClassName('linked-form__field__value')[1].textContent.replace(/\s+/g, ' ').trim();
        if (ohotnik.includes('m.polivaev@docsinbox.ru')){idohotnik = 567305}
        else if (ohotnik.includes('Бородин')) {idohotnik = 534939}
        else if (ohotnik.includes('Савинов')) {idohotnik = 543161}
        else if (ohotnik.includes('Чирушкина')) {idohotnik = 601282}
        else if (ohotnik.includes('Томников')) {idohotnik = 720528}
    }
    toButton.onclick = async function(){
        if (link == ''){
            navigator.clipboard.writeText('СОДЕЙСТВИЕ: ' + supplier + ' ИНН ' + INN + ' ' + shablon + ' ' + text);
            var notification1 = new Notification("Ссылки на pyrus нет", {body: "Я скопировал сообщение в буфер обмена"});
            setTimeout(function() {notification1.close()}, 4000);
            return null;
        }
        token = getToken(login, password);
        checkshablon();
        findohotnik();
        var taskid = link.split('id')[1];
        var taskurl = 'https://api.pyrus.com/v4/tasks/' + taskid + '/comments';
        var json = JSON.stringify({
            text: ohotnik + ': СОДЕЙСТВИЕ: ' + supplier + ' ИНН ' + INN + ' ' + shablon + ' ' + text
        });

        //Проверка на закрытую задачу
        let close = checkClose(taskid);
        if (close == undefined){
            
            addComment(taskid, json);
            alert('Коммент был отправлен');
        } else {alert('Задача ОПП/внедрения уже закрыта')}


    }
    //Создать задачу в пайрус
    tonewButton.onclick = async function(){
         var date = document.getElementsByName('CFV[1093939]')[0].value;
        //"2017-03-16T14:53:23Z" 31.05.2022 15:15
        var arr = date.split(' ');
        var datearr = arr[0].split('.');
        var arrtime = arr[1].split(':');
        var hour;
        if ((arrtime[0]-3) < 10){
        hour = '0' + (arrtime[0]-3)
        }else { hour = (arrtime[0]-3);
        }
        var needDate = datearr[2] + '-' + datearr[1]+ '-' + datearr[0] + 'T' + hour + ':' + arrtime[1] + ':00Z';

        if (date == ' ' || date == null){
            alert ('Не проставлена дата следующего шага');
            return
        }

        var taskid;
        token = getToken(login, password);
        var formid = '603501';
        var url = 'https://api.pyrus.com/v4/tasks';

        var pyrusidSuplier = 256;
        var pyrusidContact = 20;
        var pyrusidDoljnost = 92;
        var pyrusidchecknumber = 22;
        var pyrusidcheckemail = 21;
        var pyrusidGdeNakli = 24;
        var pyrusidKakaja1C = 25;
        var pyrusidtippodkluchenia = 85;
        var pyrusidtipobraba = 205;
        var pyrusidAMOlink = 282;


        findohotnik();

        var json = JSON.stringify({
            form_id: formid,
            fill_defaults: true,
            fields: [
                //Следующий шаг
                {
                    id: 184, //не забудь поменять
                    value: needDate
                },
               //Охотник
                {
                    id: 123, //не забудь поменять
                    value: {id: idohotnik}
                },
                //Поставщик
                {id: pyrusidSuplier,
                 value: INN},
                //Контакт
                {id: pyrusidContact,
                 value: contact},
                //Должность
                {id: pyrusidDoljnost,
                 value: {
                     choice_id: getDolgnost(doljnost)
                 }},
                //Телефон
                {id: pyrusidchecknumber,
                 value: checknumber},
                //Email
                {id: pyrusidcheckemail,
                 value: checkemail},
                //Тип подключения
                {id: pyrusidtippodkluchenia,
                 value: {
                     choice_id: getTippodkluchenia(KakPodkluchaem)}
                },
                {id: pyrusidtipobraba,
                 value: {
                     choice_id: getKakPodkluchaem(KakPodkluchaem)}
                },
                //Где накладные?
                {id: pyrusidGdeNakli,
                 value: {
                     choice_id: getGdeNakli(GdeNakli)}},
                //Какая 1С?
                {id: pyrusidKakaja1C,
                 value: {
                     choice_id: getKakaja1C(Kakaja1C)}},
                //Ссылка на АМО
                {id: pyrusidAMOlink,
                 value: window.location.href}
            ]
        });


        var xhr = new XMLHttpRequest();
        xhr.open('POST', `${url}`, false);
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        try {
            xhr.send(json);
            if (xhr.status != 200) {
                alert(`Ошибка ${xhr.status}: ${xhr.statusText}`);
            } else {
                taskid = strToObj(xhr.responseText).task.id;
                alert('Задача была создана');
                if (link != ''){
                    var linktaskid = link.split('id')[1];
                    //Проверка на закрытую задачу
                    let close = checkClose(linktaskid);

                    if (close == undefined){
                        //Написать коммент в форму ОПП
                        json = JSON.stringify({
                            text: ohotnik + ': ПЕРЕДАН НА ПОДКЛЮЧЕНИЕ: ' + supplier + ' ИНН ' + INN + ' https://pyrus.com/t#id' + taskid
                        });
                        addComment(linktaskid, json);
                        alert('Коммент был отправлен');
                    } else {alert('Задача ОПП/внедрения уже закрыта')}
                }
            }
        } catch(err) {
            alert("Запрос не удался");
        }

        var newjson = JSON.stringify({
            text: link
        });
        addComment(taskid, newjson);

        window.open('https://pyrus.com/t#id' + taskid);
    }


})();
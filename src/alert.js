var USERNAME = '';
var flag = true;
// возвращает cookie с именем name, если есть, если нет, то undefined
function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    '(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}


function drf_get() {
    fetch('api/course/', {
      method: 'GET',
      credentials: 'same-origin',
      headers: {'Content-Type': 'application/json'}
    }).then(function(res) {
        res.headers.forEach(function(val, key) { console.log(key + ' -> ' + val)});
        });
    //console.log(document.cookie); // nope
    console.log('Token: '+getCookie('csrftoken'));
}


function check_auth() {
    fetch('api/course/', {
      method: 'GET',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'}
    }).then(function(res) {
        //console.log(res.status);
        console.log('STATUS ' + res.status );
        if (res.status == 200){
            document.location.href = '/';
            console.log('USERNAME ' + USERNAME);
        }
        else {};
        });
}



function drf_get1(){
    fetch('api/course/', {
      method: 'GET',
      credentials: 'same-origin',
      headers: {'Content-Type': 'application/json'}
    }).then( ans => ans.json())
      .then(function(res){
          console.log(res);
          console.log(res.length);
          var outstr = '';
          if(res.length){
                  for(var i = 0; i< res.length; i++){
                      outstr = '<h4>' + res[i].title +'</h4>';
                      $(outstr).insertBefore( '.push');
                  }
                  flag = false;
          }
          else{$('<p>Авторизуйтесь пожалуйста</p>').insertBefore( '.push')}
        })
      .catch(error => console.error('Ошибка:', error));
}

function logout(){
    fetch('api/api-auth/logout/', {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
      }
    }).then(reload => location.reload())
    .catch(error => console.error('Ошибка:', error));
    USERNAME = '';
    localStorage.setItem('cur_user', USERNAME);
    if (USERNAME){
        console.log('USERNAME ' + USERNAME);
    }
    console.log('Anonimus')
}

$('#log_form').on('submit', function (event) {
    event.preventDefault();
    //var values = {};
    //var formData = JSON.stringify($('#log_form').serializeArray());
    var data = '';
    var fields = $.each($('#log_form').serializeArray(), function (i, field) {
        if (i<1) {
            data += field.name + '=' + field.value + '&';
            USERNAME = field.value;
        }
        else {data += field.name + '=' + field.value};
        //values[field.name] = field.value;
    });
    //var jsonString = JSON.stringify(values);
    console.log(data)
    console.log('USERNAME ' + USERNAME)
    localStorage.setItem('cur_user', USERNAME);
    auth_post(data);
    //console.log($.map(fields, function(n, i) { return i; }).length);
});

$(function(){
    if($('#login_form').length > 0){
        $('login.html').ready(function()
        {
            console.log('Check status');
            //drf_get();
            check_auth();
        });
    }
});

$(function()
{
   $('#add').click(function()
   {
       if(flag) {drf_get1()}
   });
});

$(function()
{
   $('#btn3').click(function()
   {
     drf_get1();
   });
});

$(function()
{
   $('#log').click(function()
   {
     logout();
     //location.reload();
   });
});


function auth_post(data) {
    fetch('api/api-auth/login/', {
        method: 'POST',
        credentials: 'include', // include, *same-origin, omit
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            'Content-type': 'application/x-www-form-urlencoded'
        },
        redirect: 'follow',
        referrer: 'no-referrer', // no-referrer, *client
        body: data
        //body: 'username=mihan&password=123'
    })
        .then( chk => check_auth())
        //.then( ans => ans.text())
        .then( res => console.log(res))
        .catch(error => console.error('Ошибка:', error));
}

$(function(){
   if($('#log').length > 0){
       $('index.html').ready(function(){
           //var newElems = $('<ul><li><a href="#">Name<ul><li><a href = "/" id="logout">Logout</a></li></ul></a></li></ul>');
           var newElems = $('<ul><li><a href="#">Выход</a></li></ul>');
           var oldElems = $('<ul><li><a href="login.html">Вход</a></li></ul>')
           USERNAME = localStorage.getItem('cur_user')
           console.log('Check USERNAME' + USERNAME);
           if (USERNAME){
             $('#log').children().first().replaceWith(newElems);
           }
           else{
               $('#log').children().first().replaceWith(oldElems);
           }
           
       });
   }
});

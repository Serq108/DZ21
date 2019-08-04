let USERNAME = '';
let flag = true;
const oldElems = $('<ul><li><a href="login.html">Вход</a></li></ul>');

// возвращает cookie с именем name, если есть, если нет, то undefined
// function getCookie(name){
const getCookie = (name) => {
  const matches = document.cookie.match(new RegExp(
      '(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
};

const checkAuth = () => {
  fetch('api/course/', {
    method: 'GET',
    credentials: 'include',
    headers: {'Content-Type': 'application/json'},
  }).then((res) => {
    console.log('STATUS ' + res.status );
    if (res.status == 200) {
      console.log('USERNAME ' + USERNAME);
      document.location.href = '/';
    } else {
      USERNAME = '';
      localStorage.setItem('cur_user', USERNAME);
      $('#log').children().first().replaceWith(oldElems);
      console.log('Anonimus');
    }
  })
      .catch((error) => console.error('Ошибка:', error));
};

const drfGet1 = () => {
  fetch('api/course/', {
    method: 'GET',
    credentials: 'same-origin',
    headers: {'Content-Type': 'application/json'},
  }).then( (ans) => ans.json())
      .then((res) => {
        console.log(res);
        console.log(res.length);
        let outstr = '';
        if (res.length) {
          for (let i = 0; i< res.length; i++) {
            outstr = '<h4>' + res[i].title +'</h4>';
            $(outstr).insertBefore( '.push');
          }
          flag = false;
        } else {
          $('<p>Авторизуйтесь пожалуйста</p>').insertBefore( '.push');
        }
      })
      .catch((error) => console.error('Ошибка:', error));
};

const logout = () => {
  fetch('api/api-auth/logout/', {
    method: 'GET',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
    },
  }).then((chck) => checkAuth())
      .catch((error) => console.error('Ошибка:', error));
};

$('#log_form').on('submit', (event) => {
  event.preventDefault();
  // var values = {};
  // var formData = JSON.stringify($('#log_form').serializeArray());
  let data = '';
  const fields = $.each($('#log_form').serializeArray(), (i, field) => {
    if (i<1) {
      data += field.name + '=' + field.value + '&';
      USERNAME = field.value;
    } else {
      data += field.name + '=' + field.value;
    }
    // values[field.name] = field.value;
  });
  console.log(data);
  console.log('USERNAME ' + USERNAME);
  localStorage.setItem('cur_user', USERNAME);
  authPost(data);
  // console.log($.map(fields, function(n, i) { return i; }).length);
});

$(() => {
  if ($('#login_form').length > 0) {
    $('login.html').ready(() => {
      console.log('Check status');
      checkAuth();
    });
  }
});

$(() => {
  $('#add').click(() => {
    if (flag) {
      drfGet1();
    }
  });
});

$(() => {
  $('#log').click(() => {
    if (USERNAME) {
      logout();
    }
  });
});

$(() => {
  $('#btn5').click(() => {
    logout();
    // location.reload();
  });
});

const authPost = (data) => {
  fetch('api/api-auth/login/', {
    method: 'POST',
    credentials: 'include', // include, *same-origin, omit
    headers: {
      'X-CSRFToken': getCookie('csrftoken'),
      'Content-type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow',
    referrer: 'no-referrer', // no-referrer, *client
    body: data,
    // body: 'username=mihan&password=123'
  })
      .then( (chk) => checkAuth())
  // .then( ans => ans.text())
      .then( (res) => console.log(res))
      .catch((error) => console.error('Ошибка:', error));
};

$(() => {
  if ($('#log').length > 0) {
    $('index.html').ready(() => {
      // var newElems = $('<ul><li><a href="#">Name<ul><li><a href = "/" id="logout">Logout</a></li></ul></a></li></ul>');
      const newElems = $('<ul><li><a  href="#">Выход</a></li></ul>');
      // var newElems = $('<div id="unlog" style ="z-index: 3">Выход</div>');
      USERNAME = localStorage.getItem('cur_user');
      console.log('Check USERNAME' + USERNAME);
      if (USERNAME) {
        $('#log').children().first().replaceWith(newElems);
      } else {
        $('#log').children().first().replaceWith(oldElems);
      }
    });
  }
});

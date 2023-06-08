import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL, listAll, deleteObject} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, set, child, update, remove, onValue, get, push } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDn6uyQDwQNXtKQdOe0YqwZoQHTiMAI2-k",
    authDomain: "med-center-65eaf.firebaseapp.com",
    databaseURL: "https://med-center-65eaf-default-rtdb.firebaseio.com",
    projectId: "med-center-65eaf",
    storageBucket: "med-center-65eaf.appspot.com",
    messagingSenderId: "902696139474",
    appId: "1:902696139474:web:faca781b678748b20fcb0b"
};

initializeApp(firebaseConfig);

const db = getDatabase();

const doctorAuthBtn = document.querySelector('.doctor-auth-btn');
const signAsDoctorBtn = document.querySelector('.sign-as-doctor-btn');
const signAsDoctorCont = document.querySelector('.sign-as-doctor-cont');
const doctorAuthItems = document.querySelectorAll('.doctor-auth-item');
const doctorLogin = document.querySelector('.doctor-login');
const doctorPass = document.querySelector('.doctor-password');
const logOut = document.querySelector('.log-out');
const thirdHeaderNav = document.querySelector('.third-header-nav');

// site onload sys

window.onload = async function() {
    let currentDoctor = JSON.parse(localStorage.getItem('currentDoctor') || null);

    if(currentDoctor != null && await authDoctor(currentDoctor.doctorUsername, currentDoctor.doctorPassword)) {
        logOut.style.display = 'flex';
        showDoctorPanel();
    }
    else {
        signAsDoctorBtn.style.display = 'flex';
    }
}

// --------------------

signAsDoctorCont.onclick = function(e) {
    for(let item of doctorAuthItems) {
        if(item == e.target) {
            return;
        }
    }
    signAsDoctorCont.style.display = 'none';
}

signAsDoctorBtn.onclick = function() {
    signAsDoctorCont.style.display = 'flex';
}

// auth doctor sys

function authDoctor(username, password) {
    return get(ref(db, 'doctors/')).then((snap) => {
        for(let doctor in snap.val()) {
            if(snap.val()[doctor].username === username && snap.val()[doctor].password === password) {
                return true;
            }
        }
        return false
    })
}

// --------------------

function addDoctorToLocalStorage(username, password) {
    localStorage.setItem('currentDoctor', JSON.stringify({
        doctorUsername: username,
        doctorPassword: password
    }))
}

// log out

logOut.onclick = function(e) {
    localStorage.removeItem('currentDoctor');
    e.target.style.display = 'none';
    signAsDoctorBtn.style.display = 'flex';
    document.querySelector('.doctor-panel').remove();
    location.reload();
}

function showDoctorPanel() {
    let linkToDoctorPanel = document.createElement('a');
    linkToDoctorPanel.setAttribute('class', 'third-header-nav-item doctor-panel');
    linkToDoctorPanel.innerHTML = 'ПАНЕЛЬ ВРАЧА';
    linkToDoctorPanel.href = '/doctorpanel/index.html';
    thirdHeaderNav.appendChild(linkToDoctorPanel);
}

// --------------------

doctorAuthBtn.onclick = async function(e) {
    e.preventDefault();
    e.target.disabled = true;
    if(await authDoctor(doctorLogin.value, doctorPass.value)) {
        addDoctorToLocalStorage(doctorLogin.value, doctorPass.value);
        e.target.disabled = false;
        signAsDoctorBtn.style.display = 'none';
        logOut.style.display = 'flex';
        signAsDoctorCont.style.display = 'none';
        showDoctorPanel();
    }
}

// calendar

function calendar(id, year, month) {
    var Dlast = new Date(year, month + 1, 0).getDate(),
      D = new Date(year, month, Dlast),
      DNlast = new Date(D.getFullYear(), D.getMonth(), Dlast).getDay(),
      DNfirst = new Date(D.getFullYear(), D.getMonth(), 1).getDay(),
      calendar = '<tr>',
      month = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    if (DNfirst != 0) {
      for (var i = 1; i < DNfirst; i++) calendar += '<td>';
    } else {
       for (var i = 0; i < 6; i++) calendar += '<td>';
    }
    for (var i = 1; i <= Dlast; i++) {
       if (i == new Date().getDate() && D.getFullYear() == new Date().getFullYear() && D.getMonth() == new Date().getMonth()) {
        calendar += '<td class="today">' + i;
       } else {
         calendar += '<td>' + i;
       }
       if (new Date(D.getFullYear(), D.getMonth(), i).getDay() == 0) {
         calendar += '<tr>';
       }
    }
    for (var i = DNlast; i < 7; i++) calendar += '<td> ';
    document.querySelector('#' + id + ' tbody').innerHTML = calendar;
    document.querySelector('#' + id + ' thead td:nth-child(2)').innerHTML = month[D.getMonth()] + ' ' + D.getFullYear();
    document.querySelector('#' + id + ' thead td:nth-child(2)').dataset.month = D.getMonth();
    document.querySelector('#' + id + ' thead td:nth-child(2)').dataset.year = D.getFullYear();
    if (document.querySelectorAll('#' + id + ' tbody tr').length < 6) { 
        // чтобы при перелистывании месяцев не "подпрыгивала" вся страница, добавляется ряд пустых клеток. Итог: всегда 6 строк для цифр
    document.querySelector('#' + id + ' tbody').innerHTML += '<tr><td> <td> <td> <td> <td> <td> <td> ';
    }
  }
  calendar("calendar", new Date().getFullYear(), new Date().getMonth());
        // переключатель минус месяц
  document.querySelector('#calendar thead tr:nth-child(1) td:nth-child(1)').onclick = function() {
    calendar("calendar", document.querySelector('#calendar thead td:nth-child(2)').dataset.year, parseFloat(document.querySelector('#calendar thead td:nth-child(2)').dataset.month) - 1);
  }
        // переключатель плюс месяц
  document.querySelector('#calendar thead tr:nth-child(1) td:nth-child(3)').onclick = function() {
    calendar("calendar", document.querySelector('#calendar thead td:nth-child(2)').dataset.year, parseFloat(document.querySelector('#calendar thead td:nth-child(2)').dataset.month) + 1);
  }
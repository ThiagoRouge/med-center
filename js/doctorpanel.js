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

const signAsDoctorBtn = document.querySelector('.sign-as-doctor-btn');
const signAsDoctorCont = document.querySelector('.sign-as-doctor-cont');
const doctorAuthItems = document.querySelectorAll('.doctor-auth-item');
const logOut = document.querySelector('.log-out');
const applicationsContForDoctor = document.querySelector('.applications-cont-for-doctor');
const applicationsForDoctorsActive = document.querySelector('.applications-for-doctors-active');
const applicationsForDoctorsInActive = document.querySelector('.applications-for-doctors-inactive');

// site onload sys

window.onload = async function() {
    let currentDoctor = JSON.parse(localStorage.getItem('currentDoctor') || null);
    if(currentDoctor != null && await authDoctor(currentDoctor.doctorUsername, currentDoctor.doctorPassword)) {
        logOut.style.display = 'flex';
        showListOfApplications(currentDoctor.doctorUsername);
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

function showListOfApplications(doctorLogin) {
    applicationsContForDoctor.style.display = 'flex';
    onValue(ref(db, "appointments/"), (snap) => {
        applicationsForDoctorsActive.innerHTML = '';
        applicationsForDoctorsInActive.innerHTML = '';
        for(let appItem in snap.val()) {
            let objectOfApp = snap.val()[appItem];
            if(objectOfApp.selectedDoctor === doctorLogin) {
                if(!objectOfApp.closed) {
                    const applicationItem = document.createElement('div');
                    const appNameOfUser = document.createElement('h2');
                    const appSurnameOfUser = document.createElement('h2');
                    const appAddressOfUser = document.createElement('h2');
                    const dateOfBirthOfUser = document.createElement('h2');
                    const dateOfAppointment = document.createElement('h2');
                    const healthComplaintsOfUser = document.createElement('p');
                    const finishReceptionBtn = document.createElement('button');
                    appNameOfUser.innerHTML = 'Имя: ' + objectOfApp.name;
                    appSurnameOfUser.innerHTML = 'Фамилия: ' + objectOfApp.surname;
                    appAddressOfUser.innerHTML = 'Адресс: ' + objectOfApp.userAddress;
                    healthComplaintsOfUser.innerHTML = 'Жалобы: ' + objectOfApp.healthComplaints;
                    dateOfBirthOfUser.innerHTML = 'Дата рождения: ' + objectOfApp.dateOfBirth;
                    dateOfAppointment.innerHTML = 'Дата записи: ' + objectOfApp.selectedTime;
                    finishReceptionBtn.innerHTML = 'Закрыть запись';
                    healthComplaintsOfUser.setAttribute('class', 'health-complaints-for-user');
                    applicationItem.setAttribute('class', 'application-item');
                    finishReceptionBtn.setAttribute('class', 'finish-reception-btn');
                    finishReceptionBtn.onclick = function() {
                        console.log('asd');
                        objectOfApp.closed = true;
                        objectOfApp.closedTime = new Date().getHours() + ':' + new Date().getMinutes();
                        update(ref(db, 'appointments/' + appItem), objectOfApp);
                        set(ref(db, 'availabletimes/' + objectOfApp.selectedTime), true);
                    }
                    applicationItem.appendChild(appNameOfUser);
                    applicationItem.appendChild(appSurnameOfUser);
                    applicationItem.appendChild(appAddressOfUser);
                    applicationItem.appendChild(dateOfBirthOfUser);
                    applicationItem.appendChild(dateOfAppointment);
                    applicationItem.appendChild(healthComplaintsOfUser);
                    applicationItem.appendChild(finishReceptionBtn);
                    applicationsForDoctorsActive.appendChild(applicationItem);
                }
                else {
                    const applicationItem = document.createElement('div');
                    const appNameOfUser = document.createElement('h2');
                    const appSurnameOfUser = document.createElement('h2');
                    const appAddressOfUser = document.createElement('h2');
                    const dateOfBirthOfUser = document.createElement('h2');
                    const dateOfAppointment = document.createElement('h2');
                    const dateOfClose = document.createElement('h2');
                    const healthComplaintsOfUser = document.createElement('p');
                    appNameOfUser.innerHTML = 'Имя: ' + objectOfApp.name;
                    appSurnameOfUser.innerHTML = 'Фамилия: ' + objectOfApp.surname;
                    appAddressOfUser.innerHTML = 'Адресс: ' + objectOfApp.userAddress;
                    healthComplaintsOfUser.innerHTML = 'Жалобы: ' + objectOfApp.healthComplaints;
                    dateOfBirthOfUser.innerHTML = 'Дата рождения: ' + objectOfApp.dateOfBirth;
                    dateOfAppointment.innerHTML = 'Время записи: ' + objectOfApp.selectedTime;
                    dateOfClose.innerHTML = 'Время закрытия: ' + objectOfApp.closedTime;
                    healthComplaintsOfUser.setAttribute('class', 'health-complaints-for-user');
                    applicationItem.setAttribute('class', 'application-item');
                    applicationItem.appendChild(appNameOfUser);
                    applicationItem.appendChild(appSurnameOfUser);
                    applicationItem.appendChild(appAddressOfUser);
                    applicationItem.appendChild(dateOfBirthOfUser);
                    applicationItem.appendChild(dateOfAppointment);
                    applicationItem.appendChild(dateOfClose);
                    applicationItem.appendChild(healthComplaintsOfUser);
                    applicationsForDoctorsInActive.appendChild(applicationItem);
                }
            }
        }
    })
}

// log out

logOut.onclick = function(e) {
    localStorage.removeItem('currentDoctor');
    e.target.style.display = 'none';
    signAsDoctorBtn.style.display = 'flex';
    window.location.href = '/index.html';
}

// --------------------

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
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
const doctorAuthCont = document.querySelector('.doctor-auth-cont');
const doctorAuthItems = document.querySelectorAll('.doctor-auth-item');
const doctorLogin = document.querySelector('.doctor-login');
const doctorPass = document.querySelector('.doctor-password');
const logOut = document.querySelector('.log-out');

// appointment

const appointmentCont = document.querySelector('.appointment-cont');
const makeAppointmentBtn = document.querySelector('.make-appointment-btn');
const nameInp = document.querySelector('.name-inp');
const surnameInp = document.querySelector('.surname-inp');
const healthComplaints = document.querySelector('.health-complaints');
const userAddress = document.querySelector('.user-address');
const selectDoctor = document.querySelector('.select-doctor');
const applicationsContForDoctor = document.querySelector('.applications-cont-for-doctor');
const applicationsForDoctors = document.querySelector('.applications-for-doctors');
const dateOfBirth = document.querySelector('.date-of-birth');

makeAppointmentBtn.onclick = async function(e) {
    e.preventDefault();
    if(nameInp.value.length != 0 && surnameInp.value.length != 0 && healthComplaints.value.length > 6 && userAddress.value.length > 6) {
        e.target.disabled = true;
        await push(ref(db, "appointments"), {
            name: nameInp.value,
            surname: surnameInp.value,
            healthComplaints: healthComplaints.value,
            userAddress: userAddress.value,
            dateOfBirth: dateOfBirth.value.split('-').reverse().join('/'),
            selectedDoctor: selectDoctor.value
        });
        e.target.disabled = false;
        const succesfulSendingAnAppCont = document.createElement('div');
        const succesfulSendingAnAppText = document.createElement('h1');
        succesfulSendingAnAppText.innerHTML = 'Успешно отправлено!';
        succesfulSendingAnAppCont.setAttribute('class', 'succesful-sending-an-app-cont');
        succesfulSendingAnAppText.setAttribute('class', 'succesful-sending-an-app-text');
        succesfulSendingAnAppCont.appendChild(succesfulSendingAnAppText);
        document.body.appendChild(succesfulSendingAnAppCont);
        succesfulSendingAnAppCont.onclick = function(e) {
            e.target.remove();
        }
    }
}

// --------------------

// site onload sys

window.onload = async function() {
    let currentDoctor = JSON.parse(localStorage.getItem('currentDoctor') || null);

    if(currentDoctor != null && await authDoctor(currentDoctor.doctorUsername, currentDoctor.doctorPassword)) {
        logOut.style.display = 'flex';
        showListOfApplications(currentDoctor.doctorUsername);
    }
    else {
        signAsDoctorBtn.style.display = 'flex';
        appointmentCont.style.display = 'flex';
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
    appointmentCont.style.display = 'none';
    applicationsContForDoctor.style.display = 'flex';
    onValue(ref(db, "appointments/"), (snap) => {
        applicationsForDoctors.innerHTML = '';
        for(let appItem in snap.val()) {
            let objectOfApp = snap.val()[appItem];
            if(objectOfApp.selectedDoctor === doctorLogin) {
                const applicationItem = document.createElement('div');
                const appNameOfUser = document.createElement('h2');
                const appSurnameOfUser = document.createElement('h2');
                const appAddressOfUser = document.createElement('h2');
                const dateOfBirthOfUser = document.createElement('h2');
                const healthComplaintsOfUser = document.createElement('p');
                const deleteAppBtn = document.createElement('button');
                deleteAppBtn.onclick = function() {
                    remove(ref(db, 'appointments/' + appItem));
                }
                deleteAppBtn.innerHTML = 'Удалить запись';
                appNameOfUser.innerHTML = 'Имя: ' + objectOfApp.name;
                appSurnameOfUser.innerHTML = 'Фамилия: ' + objectOfApp.surname;
                appAddressOfUser.innerHTML = 'Адресс: ' + objectOfApp.userAddress;
                healthComplaintsOfUser.innerHTML = 'Жалобы: ' + objectOfApp.healthComplaints;
                dateOfBirthOfUser.innerHTML = 'Дата рождения: ' + objectOfApp.dateOfBirth;
                healthComplaintsOfUser.setAttribute('class', 'health-complaints-for-user');
                applicationItem.setAttribute('class', 'application-item');
                deleteAppBtn.setAttribute('class', 'delete-app-btn');
                dateOfBirthOfUser.setAttribute('class', 'date-of-birth-of-user');
                applicationItem.appendChild(appNameOfUser);
                applicationItem.appendChild(appSurnameOfUser);
                applicationItem.appendChild(appAddressOfUser);
                applicationItem.appendChild(dateOfBirthOfUser);
                applicationItem.appendChild(healthComplaintsOfUser);
                applicationItem.appendChild(deleteAppBtn);
                applicationsForDoctors.appendChild(applicationItem);
            }
        }
    })
}

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
    location.reload();
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
        showListOfApplications(doctorLogin.value);
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
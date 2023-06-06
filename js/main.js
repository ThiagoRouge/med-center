import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL, listAll, deleteObject} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, set, child, update, remove, onValue, get, push } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

const firebaseConfig = {

  apiKey: "AIzaSyAfOoHp9mqw8rr0blaUcnIR3hQZI8JzAOw",

  authDomain: "med-center-67e0e.firebaseapp.com",

  databaseURL: "https://med-center-67e0e-default-rtdb.firebaseio.com",

  projectId: "med-center-67e0e",

  storageBucket: "med-center-67e0e.appspot.com",

  messagingSenderId: "192967316779",

  appId: "1:192967316779:web:969b13871db080ba1b216e"

};

initializeApp(firebaseConfig);

const storage = getStorage();
const db = getDatabase();

const doctorAuthBtn = document.querySelector('.doctor-auth-btn');
const signAsDoctorBtn = document.querySelector('.sign-as-doctor-btn');
const signAsDoctorCont = document.querySelector('.sign-as-doctor-cont');
const doctorAuthCont = document.querySelector('.doctor-auth-cont');
const doctorAuthItems = document.querySelectorAll('.doctor-auth-item');
const doctorLogin = document.querySelector('.doctor-login');
const doctorPass = document.querySelector('.doctor-password');

// site onload sys

window.onload = async function() {
    let currentDoctor = JSON.parse(localStorage.getItem('currentDoctor') || null);

    if(currentDoctor != null && await authDoctor(currentDoctor.doctorUsername, currentDoctor.doctorPassword)) {
        showListOfApplications();
    }
}

// --------------------

// appointment

const appointmentCont = document.querySelector('.appointment-cont');
const makeAppointmentBtn = document.querySelector('.make-appointment-btn');
const nameInp = document.querySelector('.name-inp');
const surnameInp = document.querySelector('.surname-inp');
const healthComplaints = document.querySelector('.health-complaints');
const userAddress = document.querySelector('.user-address');
const selectDoctor = document.querySelector('.select-doctor');
const applicationsContForDoctor = document.querySelector('.applications-cont-for-doctor');

makeAppointmentBtn.onclick = async function(e) {
    e.preventDefault();
    if(nameInp.value.length != 0 && surnameInp.value.length != 0 && healthComplaints.value.length > 6 && userAddress.value.length > 6) {
        push(ref(db, "appointments"), {
            name: nameInp.value,
            surname: surnameInp.value,
            healthComplaints: healthComplaints.value,
            userAddress: userAddress.value,
            selectedDoctor: selectDoctor.value
        });
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

function showListOfApplications() {
    appointmentCont.style.display = 'none';
    applicationsContForDoctor.style.display = 'flex';
    get(ref(db, "appointments/")).then((snap) => {
        for(let appItem in snap.val()) {
            let objectOfApp = snap.val()[appItem];
            
        }
    })
}

function addDoctorToLocalStorage(username, password) {
    localStorage.setItem('currentDoctor', JSON.stringify({
        doctorUsername: username,
        doctorPassword: password
    }))
}

doctorAuthBtn.onclick = async function(e) {
    e.preventDefault();
    e.target.disabled = true;
    if(await authDoctor(doctorLogin.value, doctorPass.value)) {
        addDoctorToLocalStorage(doctorLogin.value, doctorPass.value);
        e.target.disabled = false;
        signAsDoctorCont.style.display = 'none';
        showListOfApplications();
    }
}
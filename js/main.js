import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL, listAll, deleteObject} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, set, child, update, remove, onValue, get } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

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


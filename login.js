
const firebaseConfig = {
    apiKey: "AIzaSyD56CxsMe42N9de6hkPGeLN789jHZWZQgo",
    authDomain: "project1-99aca.firebaseapp.com",
    databaseURL: "https://project1-99aca-default-rtdb.firebaseio.com",
    projectId: "project1-99aca",
    storageBucket: "project1-99aca.appspot.com",
    messagingSenderId: "19902059854",
    appId: "1:19902059854:web:856d5d937a0fbefb353a1f",
    measurementId: "G-NGQNT314JK"
};

firebase.initializeApp(firebaseConfig);

// Đăng nhập
function log() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var errorMessage = document.getElementById("error-message");

    // Xác thực người dùng sử dụng Firebase Authentication
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function (userCredential) {
            // Đăng nhập thành công
            var user = userCredential.user;
            alert("Đăng nhập thành công:", user);
            window.location.href = "main.html";
        })
        .catch(function (error) {
            // Đăng nhập thất bại
            var errorMessage = error.message;
            console.log("Đăng nhập thất bại:", errorMessage);
            document.getElementById("error-message").textContent = errorMessage;
        });
}
const firebaseConfig = {
  apiKey: "AIzaSyBOuDm2ldusS_uiPAQXkrrPZLcKTKT5zUQ",
  authDomain: "talabaktamweb.firebaseapp.com",
  projectId: "talabaktamweb",
  storageBucket: "talabaktamweb.firebasestorage.app",
  messagingSenderId: "1050529698307",
  appId: "1:1050529698307:web:a8d1307ae666e2c79a3436"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
db.enablePersistence({synchronizeTabs:true}).catch(()=>{});
const USE_FIREBASE = true;

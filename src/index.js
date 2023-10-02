import { initializeApp} from 'firebase/app'
import { 
    getFirestore,collection, onSnapshot,
    addDoc, deleteDoc, doc,
    query, where,
    orderBy, serverTimestamp,
    getDoc,updateDoc
} from 'firebase/firestore'

import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut,signInWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDOCqO5OiQCi4UgpeBd5GLDsvkB931eNRI",
    authDomain: "fir-9-c767e.firebaseapp.com",
    projectId: "fir-9-c767e",
    storageBucket: "fir-9-c767e.appspot.com",
    messagingSenderId: "222575661883",
    appId: "1:222575661883:web:2c42b27179fe8ea48ddd1e"
  };

//init firebase app
initializeApp(firebaseConfig)

//init services
const db = getFirestore()
const auth = getAuth()

//collection ref
const colRef = collection(db,'books')

//querie
const q = query(colRef,where("author",'==','dipson'),orderBy('createdAt'))

//get real time collection data
const unsubCol = onSnapshot(q, (snapshot)=>{
    let books =[]
    snapshot.docs.forEach((doc)=>{
    books.push({ ...doc.data(),id:doc.id})
    })
    console.log(books)
})

//adding docs
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    addDoc(colRef,{
        title:addBookForm.title.value,
        author:addBookForm.author.value,
        createdAt: serverTimestamp()
    })
    .then(()=>{
        addBookForm.reset()
    })
})

//deleting
const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    const docRef = doc(db,'books',deleteBookForm.id.value)

    deleteDoc(docRef)
    .then(()=>{
        deleteBookForm.reset()
    })
})

// get a single document
const docRef = doc(db,'books','jIOKlRX7nuELoPa7bQyO')

const unsubDoc = onSnapshot(docRef, (doc)=>{
    console.log(doc.data(), doc.id)
})

//update a doc
const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const docRef = doc(db,'books',updateForm.id.value)
    update(docRef,{
        title:'updated title'
    })
    .then(()=>{
        updateForm.reset()
    })
})

//signing up
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    const email = signupForm.email.value
    const password = signupForm.password.value
    createUserWithEmailAndPassword(auth,email,password)
    .then((cred)=>{
        console.log('user created',cred.user)
        signupForm.reset()
    })
    .catch((err)=>{
        console.log(err.message)
    })

})

//signing up
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click',()=>{
    signOut(auth)
    .then(()=>{
        //console.log('the user signed out')
    })
    .catch((e)=>{
        console.log(e.message)
    })
})

//login
const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    const email = loginForm.email.value
    const password = loginForm.password.value
    signInWithEmailAndPassword(auth,email,password)
    .then((cred)=>{
        console.log('user logged in:',cred.user)
    })
    .catch((err)=>{
        console.log(err.message)
    })
})

//subscribing to auth chnages
const unsubAuth = onAuthStateChanged(auth,(user)=>{
    console.log('user status chnages:', user)
})

const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click',()=>{
    console.log('unsubscribing')
    unsubCol()
    unsubDoc()
    unsubAuth()
})
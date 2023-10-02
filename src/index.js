import { initializeApp} from 'firebase/app'
import { 
    getFirestore,collection, onSnapshot,
    addDoc, deleteDoc, doc
} from 'firebase/firestore'

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

//collection ref
const colRef = collection(db,'books')

//get real time collection data
onSnapshot(colRef, (snapshot)=>{
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
        author:addBookForm.author.value
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
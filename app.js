window.onload=()=>{
    firebase.auth().onAuthStateChanged((user)=>{
        if (user){
            loggedIn.style.display="block";
            loggedOut.style.display="none";
            username.innerText=user.displayName;
        }else{
            loggedIn.style.display="none";
            loggedOut.style.display="block";
        }
        console.log ("User>"+JSON.stringify(user));
    })

    firebase.database().ref('gifs/-LH5-CjufIiYNlhgxTN0/creator')    
    .once('value')
    .then((gifs)=>{
        console.log("gifs >"+JSON.stringify(creator.value));
    })
    .catch((error)=>{
        console.log("Database >"+error);
    });

    firebase.database().ref('gifs')
    .limitToLast(3)
    .once('value')
    .then((gifs)=>{
        console.log("gifs >"+JSON.stringify(gifs));
    })
    .catch((error)=>{
        console.log("Database >"+error);
    });


    // base de datos 
    firebase.database().ref('gifs')
    .limitToLast(3)
    .on('child_added',(newGif)=>{
        gifContainer.innerHTML +=`
        <p>${newGif.val().creatorName}</p>
        <img style="width:200px" src="${newGif.val().gifURL}">
        </img>
        `
    })

}

function   registerWithFirebase(){
    const emailValue=email.value;
    const passwordValue=password.value;

    firebase.auth().createUserWithEmailAndPassword(emailValue,passwordValue)
    .then(()=>{
        console.log ('Usuario creado con éxito');
    })
    .catch((error)=>{
        // es muy importante imprimir los errores 
        console.log('Error de firebase >código>' +error.code);
        console.log('Error de firebase >codigo>' +error.message);
    })
}
function loginWithFirebase(){
    const emailValue =email.value;
    const passwordValue=password.value;

    firebase.auth().signInWithEmailAndPassword(emailValue,passwordValue)
    .then(()=>{
        console.log('usuario creo cuenta con exito ')
    })
    .catch((error)=>{
        console.log('Error de firebase >código>' +error.code);
        console.log('Error de firebase >codigo>' +error.message);
    })
}

function logoutWithFirebase(){
    firebase.auth().signOut()
    .then(()=>{
        console.log('Usuario Finalizó sesión con exito')
    })
    .catch((error)=>{
        console.log('Error de firebase >código>' +error.code);
        console.log('Error de firebase >codigo>' +error.message);
    })
}

function facebookLoginWithFirebase(){
    const provider= new firebase.auth.FacebookAuthProvider();
    provider.setCustomParameters({
        "display":"popup"
    });
    firebase.auth().signInWithPopup(provider)
    .then(()=>{
        console.log("Login con Facebook Exitoso")
    })
    .catch((error)=>{
        console.log('Error de firebase >código>' +error.code);
        console.log('Error de firebase >codigo>' +error.message);
    })
}

function sendGif(){
    const gifValue=gifArea.value;
    const newGifKey=firebase.database().ref().child("gifs").push().key;
    const currentUser=firebase.auth().currentUser;
    firebase.database().ref(`gifs/${newGifKey}`).set({
        gifURL : gifValue,
        creatorName : currentUser.displayName,
        creator : currentUser.uid

    });
}
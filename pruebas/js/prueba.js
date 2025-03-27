
//Validador de formularios

//Creamos el objeto

try{

    const userData = {
        dato1__input : '',
        dato2__input : '',
        dato3__input : '',
        dato4__input : '',
        dato4__input : '',
        dato5__input : '',
        dato6__input : '',
        dato7__input : ''
    }
    //Seleccionamos elementos del DOM
    let activo = true;
    const useForm = document.querySelector('.cardRight__form');
    const dato1__input = document.querySelector('.dato1__input');
    const dato2__input = document.querySelector('.dato2__input');
    const dato3__input = document.querySelector('.dato3__input');
    const dato4__input = document.querySelector('.dato4__input');
    const dato5__input = document.querySelector('.dato5__input');
    const dato6__input = document.querySelector('.dato6__input');
    const dato7__input = document.querySelector('.dato7__input');
    // Evento submit
    useForm.addEventListener('submit', function (e) {
        e.preventDefault();
    
        const { dato1__input, dato2__input, dato3__input, dato4__input  } = userData;
    
        console.log('Enviando formulario...');
    
        if (dato1__input === '' || dato2__input === '' || dato3__input === '' || dato4__input === ''  ) {
            showAlert('Todos los campos son obligatorios');
            
            
            
        }else{
            showAlert('Todos los campos son correctos', true); 
        }
    
    
        // Limpia el formulario después del envío
    });
    
    //Escuchamos el evento
    dato1__input.addEventListener('input', readText);
    dato2__input.addEventListener('input', readText);
    dato3__input.addEventListener('input', readText);
    dato4__input.addEventListener('input', readText);
    dato5__input.addEventListener('input', readText);
    dato6__input.addEventListener('input', readText);
    dato7__input.addEventListener('input', readText);
    
    
    //callback o funcion
    function readText(e){
        if(e.target.classList.contains('dato1__input')){
            userData.dato1__input = e.target.value;
    
        }
        if(e.target.classList.contains('dato2__input')){
            userData.dato2__input = e.target.value;
        }
        if(e.target.classList.contains('dato3__input')){
            userData.dato3__input = e.target.value;
        }
        if(e.target.classList.contains('dato4__input')){
            userData.dato4__input = e.target.value;
        }
        if(e.target.classList.contains('dato5__input')){
            userData.dato4__input = e.target.value;
        }
        if(e.target.classList.contains('dato6__input')){
            userData.dato4__input = e.target.value;
        }
        if(e.target.classList.contains('dato7__input')){
            userData.dato4__input = e.target.value;
        }
    
        // console.log(userData);
    }
     
    function showAlert(message, error = null){
        if (activo) {
            
        //Se comento la variable de las otras dos funciones
        const alert = document.createElement('P');
        console.log(message)
        alert.textContent = message;
        if(error == null){
            alert.classList.add('error');
        }
        else{
            alert.classList.add('correcto');
        }
        useForm.appendChild(alert);
        setTimeout(()=>{
            alert.remove();
        },2000)
        return activo = false;
         }
    }
}catch(error){
    console.log(error)
}
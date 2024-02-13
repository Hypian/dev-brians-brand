const forms= document.querySelector(".forms"),
       passcodeShowHide = document.querySelector(".eye-icon"),
       links = document.querySelectorAll(".eye-icon");


       passcodeShowHide.forEach(eyeIcon => {
        eyeIcon.addEventListener("click",()=> {
            let pwfields = eyeIcon.parentElement.parentElement.querySelectorAll(".password");
          
            pwfields.forEach(password =>{
                if(password.type === "password"){
                    password.type = "text";
                    eyeIcon.classList.replace("bx-hide","bx-show");
                    return;
                }
                password.type = "password";
                eyeIcon.classList.replace("bx-show","bx-hide");   
        })
       })
    })
    links.forEach
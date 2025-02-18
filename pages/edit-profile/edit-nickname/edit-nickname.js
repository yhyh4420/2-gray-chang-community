document.addEventListener("DOMContentLoaded", function(){
    const nickname = document.querySelector(".user-nickname")
    const helperText = document.querySelector(".helper-text")
    const editButton = document.getElementById("edit")
    const tostMessage = document.getElementById("tost-message")
    const resignButton = document.getElementById("resign")
    const modalBackGround = document.querySelector(".modal-background")
    const modalWrap = document.querySelector(".modal-wrap")
    const modalCancel = document.getElementById("modal-cancel")
    const modalResign = document.getElementById("modal-resign")

    editButton.addEventListener("click", function(){
        if (nickname.value.trim() === ""){
            helperText.textContent = "* 닉네임을 입력하세요."
            helperText.style.display = "block"
        } else if(nickname.value.length > 10){
            helperText.textContent = "* 닉네임은 최대 10글자 까지 작성 가능합니다."
            helperText.style.display = "block"
        } else {
            tostMessage.classList.add('active')
            setTimeout(function(){
                tostMessage.classList.remove('active')
            }, 2000)
        }
    })

    resignButton.addEventListener("click", function(){
        modalBackGround.style.display = "flex"
        modalWrap.style.display = "flex"
    })

    modalResign.addEventListener("click", function(){
        modalBackGround.style.display = "none"
        modalWrap.style.display = "none"
    })

    modalCancel.addEventListener("click", function(){
        modalBackGround.style.display = "none"
        modalWrap.style.display = "none"
    })
})
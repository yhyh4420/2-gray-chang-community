document.addEventListener("DOMContentLoaded", function(){
    const comment = document.querySelector(".input-comment")
    const addButton = document.querySelector(".add-comment")
    const userDeleteButton = document.getElementById("user-delete")
    const commentDeleteButton = document.getElementById("comment-delete")
    const modalBackGround = document.querySelector(".modal-background")
    const modalWrap = document.querySelector(".modal-wrap")
    const modalCancel = document.getElementById("modal-cancel")
    const modalDelete = document.getElementById("modal-delete")

    function isNotEmpty(comment){
        return comment != ""
    }

    function updateButtonState(){
        if (isNotEmpty(comment.value)){
            addButton.style.backgroundColor="#7F6AEE"
            addButton.style.cursor = "pointer"
            addButton.disable = false
        } else {
            addButton.style.backgroundColor = "#ACA0EB";
            addButton.style.cursor = "default";
            addButton.disabled = true;
        }
    }

    comment.addEventListener("input", function(){
        updateButtonState()
    })

    userDeleteButton.addEventListener("click", function(){
        modalBackGround.style.display = "flex"
        modalWrap.style.display = "flex"
    })

    commentDeleteButton.addEventListener("click", function(){
        modalBackGround.style.display = "flex"
        modalWrap.style.display = "flex"
    })

    modalDelete.addEventListener("click", function(){
        modalBackGround.style.display = "none"
        modalWrap.style.display = "none"
    })

    modalCancel.addEventListener("click", function(){
        modalBackGround.style.display = "none"
        modalWrap.style.display = "none"
    })
})
document.addEventListener("DOMContentLoaded", function(){
    const title = document.getElementById("title-field")
    const content = document.getElementById("content-field")
    
    const finishButton = document.querySelector(".finish-posting")

    function validEmpty(title, content){
        return title.value != "" && content.value != ""
    }

    function updateButtonState(){
        const isNotEmpty = validEmpty(title, content)
        if (isNotEmpty) {
            finishButton.style.backgroundColor = "#7F6AEE"
            finishButton.style.cursor = "pointer"
            finishButton.disabled = false;
            finishButton.addEventListener("click", function(){
                window.location.href = '/pages/community-main/community-main.html'
            })
        } else {
            finishButton.style.backgroundColor = "#ACA0EB"
            finishButton.style.cursor = "default"
            finishButton.disabled = true;
        }
    }

    title.addEventListener("input", function(){
        updateButtonState()
    })

    content.addEventListener("input", function(){
        updateButtonState()
    })
})
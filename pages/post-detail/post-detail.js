document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    if (!postId) {
        alert("잘못된 접근입니다.");
        window.location.href = "/pages/community-main/community-main.html";
        return;
    }

    const postTitleElement = document.querySelector(".post-title");
    const authorElement = document.querySelector(".user-name");
    const dateElement = document.querySelector(".date");
    const postContentElement = document.querySelector(".post-content");
    const postImageContainer = document.querySelector(".post-image-container"); // 이미지 컨테이너 추가
    const postImageElement = document.createElement("img"); // 이미지 태그 생성
    const likesElement = document.querySelector("#like-box");
    const viewsElement = document.querySelector(".status-box:nth-child(2)");
    const commentsElement = document.querySelector(".status-box:nth-child(3)");
    const editButton = document.getElementById("user-edit");
    const deleteButton = document.getElementById("user-delete");
    const commentInput = document.querySelector(".input-comment");
    const addCommentButton = document.querySelector(".add-comment");
    const commentList = document.querySelector(".comment-lists");
    const modalBackGround = document.querySelector(".modal-background");
    const modalWrap = document.querySelector(".modal-wrap");
    const modalCancel = document.getElementById("modal-cancel");
    const modalDelete = document.getElementById("modal-delete");

    try{
        const postResponse = await fetch(`${BASE_URL}/posts/${postId}`, {
            method:"GET",
            credentials:"include"
        })
        if (!postResponse.ok){
            throw new Error(`게시글 불러오기 실패: ${postResponse.status}`);
        }

        const postData = await postResponse.json()

        postTitleElement.textContent = postData.post.title;
        authorElement.textContent = postData.post.nickname;
        dateElement.textContent = postData.post.createdAt;
        postContentElement.textContent = postData.post.content;
        likesElement.innerHTML = `${postData.post.likes}<br>좋아요수`;
        viewsElement.innerHTML = `${postData.post.views}<br>조회수`;
        

        if (postData.post.image) {
            const postImageElement = document.createElement("img");
            postImageElement.src = BASE_URL + postData.post.image;
            postImageElement.alt = "게시글 이미지";
            postImageContainer.appendChild(postImageElement);
        } else {
            postImageContainer.innerHTML = "";
        }

        const userData = await fetchSessionUser()
        if (userData.userId === postData.post.userId) {
            editButton.style.display = "inline-block";
            deleteButton.style.display = "inline-block";
        } else {
            editButton.style.display = "none";
            deleteButton.style.display = "none";
        } 

        editButton.addEventListener("click", function () {
            console.log("✅ 수정 버튼 클릭 - 이동할 URL:", `/pages/edit-post/edit-post.html?id=${postId}`);
            window.location.href = `/pages/edit-post/edit-post.html?id=${postId}`; // 🔥 postId 포함!
        });

        deleteButton.addEventListener("click", function () {
            modalBackGround.style.display = "flex";
            modalWrap.style.display = "flex";
        });

        modalDelete.addEventListener("click", async function () {
            try {
                const deleteResponse = await fetch(`${BASE_URL}/posts/${postId}`, {
                    method: "DELETE",
                    credentials: "include"
                });

                if (!deleteResponse.ok) {
                    throw new Error("게시글 삭제 실패");
                }

                alert("게시글이 삭제되었습니다.");
                window.location.href = "/pages/community-main/community-main.html";
            } catch (error) {
                console.error("게시글 삭제 오류:", error);
            }

            modalCancel.addEventListener("click", function () {
                modalBackGround.style.display = "none";
                modalWrap.style.display = "none";
            });
        });
    } catch(error){
        console.error("게시글 로딩 중 오류 발생:", error);
        alert("게시글을 불러오는 중 오류가 발생했습니다.");
        window.location.href = "/pages/community-main/community-main.html";
    }

    function displayComments(comments) {
        const commentList = document.querySelector(".comment-lists");
        commentList.innerHTML = "";
    
        comments.forEach(comment => {
            const commentItem = document.createElement("div");
            commentItem.classList.add("comment-item");
            commentItem.innerHTML = `
                <div class="comment-user">
                    <span class="comment-author">${comment.userNickname}</span>
                    <span class="comment-date">${comment.commentDate}</span>
                </div>
                <div class="comment-content">${comment.comment}</div>
                <hr class="post-divider">
            `;
            commentList.appendChild(commentItem);
        });
    }

    async function updateComment(){
        try{
            console.log("📌 updateComment() 실행됨!");
            const comments = await fetchComment(postId);
            commentsElement.innerHTML = `${comments.length}<br>댓글`;
            displayComments(comments);
        } catch(error){
            console.error("댓글 로딩 중 오류 발생:", error);
            alert("댓글을 불러오는 중 오류가 발생했습니다.");
        }
    }

    updateComment()
    
    likesElement.addEventListener("click", async function () {
        try {
            // ✅ UI 먼저 업데이트 (임시 증가)
            let currentLikes = parseInt(likesElement.innerHTML) || 0;
            likesElement.innerHTML = `${currentLikes + 1}<br>좋아요수`;
    
            // ✅ 서버에 좋아요 요청
            const likeResponse = await fetch(`${BASE_URL}/posts/${postId}/likes`, {
                method: "PUT",
                credentials: "include"
            });

            if (likeResponse.status === 400){
                alert("이미 좋아요를 눌렀습니다.")
                likesElement.innerHTML = `${currentLikes}<br>좋아요수`;
            }
    
            if (!likeResponse.ok) {
                throw new Error("좋아요 실패");
            }
    
            // ✅ 서버에서 받은 최신 좋아요 수 반영
            const likeData = await likeResponse.json();
            likesElement.innerHTML = `${likeData.likes}<br>좋아요수`;
        } catch (error) {
            console.error("좋아요 오류:", error);
    
            // 🔥 에러 발생 시 UI 원상복구 (좋아요 취소)
            let currentLikes = parseInt(likesElement.innerHTML) || 0;
            likesElement.innerHTML = `${currentLikes}<br>좋아요수`;
        }
    });

    addCommentButton.addEventListener("click", async function(){
        try{
            const content = commentInput.value.trim()
            if (content == ""){
                alert("댓글을 입력하세요")
                return
            }
            const commentResponse = await fetch(`${BASE_URL}/posts/${postId}/comment`, {
                method: "POST",
                credentials: "include",
                headers : {"Content-Type": "application/json"},
                body: JSON.stringify({content})
                })
            if (commentResponse.status === 404) {
                throw new Error("댓글 작성 오류(404)")
            }
            if (!commentResponse.ok){
                throw new Error("댓글 작성 오류")
            }
            alert("댓글이 성공적으로 작성되었습니다!");
            await updateComment()
            commentInput.value = ""
        } catch(error){
            console.error("댓글 작성 오류:", error)
        }
    })
}
)
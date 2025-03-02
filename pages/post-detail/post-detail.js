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

    try {
        // 게시글 가져오기
        const postResponse = await fetch("/data/posts.json");
        const posts = await postResponse.json();
        const post = posts.find(p => p.id == postId);

        if (!post) {
            alert("게시글을 찾을 수 없습니다.");
            window.location.href = "/pages/community-main/community-main.html";
            return;
        }

        // 사용자 정보 가져오기
        const userResponse = await fetch("/data/users.json");
        const users = await userResponse.json();
        const author = users.find(user => user.username === post.username);
        const loggedInUserEmail = localStorage.getItem("loggedInUser");
        const loggedInUser = users.find(user => user.email === loggedInUserEmail);

        // 게시글 데이터 적용
        postTitleElement.textContent = post.title;
        authorElement.textContent = post.username;
        dateElement.textContent = post.createdAt;
        postContentElement.textContent = post.content;
        likesElement.innerHTML = `${post.likes}<br>좋아요수`;
        viewsElement.innerHTML = `${post.views}<br>조회수`;

        // 수정/삭제 버튼 보이기 (로그인한 사용자와 작성자가 같을 때만)
        if (loggedInUser && loggedInUser.username === post.username) {
            editButton.style.display = "inline-block";
            deleteButton.style.display = "inline-block";
        } else {
            editButton.style.display = "none";
            deleteButton.style.display = "none";
        }

        // 게시글 삭제 기능
        deleteButton.addEventListener("click", function () {
            modalBackGround.style.display = "flex";
            modalWrap.style.display = "flex";
        });

        modalDelete.addEventListener("click", function () {
            alert("게시글이 삭제되었습니다.");
            window.location.href = "/pages/community-main/community-main.html";
        });

        modalCancel.addEventListener("click", function () {
            modalBackGround.style.display = "none";
            modalWrap.style.display = "none";
        });

        // 댓글 가져오기
        const commentResponse = await fetch("/data/comments.json");
        const comments = await commentResponse.json();
        const filteredComments = comments.filter(comment => comment.postId == postId);

        // 댓글 개수 반영
        updateCommentCount(filteredComments.length);

        // 댓글 목록 렌더링
        filteredComments.forEach(comment => {
            addCommentToUI(comment, loggedInUser);
        });

        // 댓글 추가 기능
        addCommentButton.addEventListener("click", function () {
            const commentText = commentInput.value.trim();

            if (!commentText) {
                alert("댓글을 입력해주세요!");
                return;
            }

            if (!loggedInUser) {
                alert("로그인이 필요합니다.");
                return;
            }

            const newComment = {
                id: Date.now(),
                postId: postId,
                username: loggedInUser.username,
                content: commentText,
                createdAt: new Date().toISOString().slice(0, 19).replace("T", " ")
            };

            addCommentToUI(newComment, loggedInUser);
            updateCommentCount(commentList.children.length); // 댓글 수 업데이트
            commentInput.value = "";
        });

        // 좋아요 기능
        likesElement.addEventListener("click", function () {
            if (!loggedInUser) {
                alert("로그인이 필요합니다.");
                return;
            }

            const likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || [];
            if (likedPosts.includes(postId)) {
                alert("이미 좋아요를 누르셨습니다.");
                return;
            }

            post.likes += 1;
            likesElement.innerHTML = `${post.likes}<br>좋아요수`;
            likedPosts.push(postId);
            localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
        });

    } catch (error) {
        console.error("게시글 로딩 중 오류 발생:", error);
        alert("게시글을 불러오는 중 오류가 발생했습니다.");
        window.location.href = "/pages/community-main/community-main.html";
    }
});

// 댓글 수 업데이트 함수
function updateCommentCount(count) {
    const commentsElement = document.querySelector(".status-box:nth-child(3)");
    commentsElement.innerHTML = `${count}<br>댓글`;
}

// 댓글 UI 추가 함수
function addCommentToUI(comment, loggedInUser) {
    const commentList = document.querySelector(".comment-lists");

    const newComment = document.createElement("div");
    newComment.classList.add("comment-item");
    newComment.innerHTML = `
        <div class="user-info">
            <div class="user-name">${comment.username}</div>
            <div class="comment-date">${comment.createdAt}</div>
            ${loggedInUser && loggedInUser.username === comment.username ? `
                <button class="edit-delete-button comment-edit">수정</button>
                <button class="edit-delete-button comment-delete">삭제</button>
            ` : ""}
        </div>
        <div class="comment-content">${comment.content}</div>
    `;

    // 댓글 수정 기능
    const editButton = newComment.querySelector(".comment-edit");
    if (editButton) {
        editButton.addEventListener("click", function () {
            const commentContent = newComment.querySelector(".comment-content");
            const textarea = document.createElement("textarea");
            textarea.classList.add("comment-edit-input");
            textarea.value = commentContent.textContent;
            commentContent.replaceWith(textarea);

            const saveButton = document.createElement("button");
            saveButton.classList.add("edit-delete-button");
            saveButton.textContent = "저장";
            editButton.replaceWith(saveButton);

            saveButton.addEventListener("click", function () {
                if (textarea.value.trim() === "") {
                    alert("댓글 내용을 입력해주세요.");
                    return;
                }
                commentContent.textContent = textarea.value.trim();
                textarea.replaceWith(commentContent);
                saveButton.replaceWith(editButton);
            });
        });
    }

    // 댓글 삭제 기능
    const deleteButton = newComment.querySelector(".comment-delete");
    if (deleteButton) {
        deleteButton.addEventListener("click", function () {
            if (confirm("댓글을 삭제하시겠습니까?")) {
                newComment.remove();
                updateCommentCount(document.querySelectorAll(".comment-item").length); // 댓글 수 업데이트
            }
        });
    }

    commentList.appendChild(newComment);
    updateCommentCount(document.querySelectorAll(".comment-item").length); // 댓글 수 업데이트
}

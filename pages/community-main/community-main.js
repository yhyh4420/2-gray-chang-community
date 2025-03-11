document.addEventListener("DOMContentLoaded", async () => {
    const profileImage = document.getElementById("profile-image");
    const dropdownMenu = document.getElementById("dropdown-menu");
    const nicknameBtn = document.getElementById("edit-nickname");
    const passwordBtn = document.getElementById("edit-password");
    const logoutBtn = document.getElementById("logout-btn");
    const postListElement = document.querySelector(".post-list");

    try {
        // ✅ 세션 사용자 정보 가져오기
        const userData = await fetchSessionUser();
        console.log("세션으로부터 받은 데이터 : " + userData)

        // ✅ 세션에서 받아온 데이터를 `localStorage`에 저장
        if (userData) {
            localStorage.setItem("userId", userData.userId);
            localStorage.setItem("nickname", userData.nickname);
            localStorage.setItem("profileImage", userData.profileImage);
        }

        // ✅ 저장된 값으로 UI 업데이트
        const loggedInUserId = localStorage.getItem("userId");
        if (!loggedInUserId) {
            alert("로그인이 필요합니다.");
            window.location.href = "/pages/login/login.html";
            return;
        }
        profileImage.src = BASE_URL + localStorage.getItem("profileImage");
    } catch (error) {
        console.error("사용자 정보를 불러오는 중 오류 발생:", error);
        window.location.href = "/pages/login/login.html";
    }

    const posts = await fetchPosts();
    console.log("게시글 목록:", posts);

    try{
        posts.forEach(post => {
        // 게시글 작성자의 프로필 이미지 찾기
        const authorName = post.nickname || "탈퇴한 사용자"
        const authorProfileImage = BASE_URL + post.profileImagePath
        console.log(authorName)

        const postItem = document.createElement("article");
        postItem.classList.add("post-item");
        postItem.innerHTML = `
            <h2 class="post-title" onclick="location.href='/pages/post-detail/post-detail.html?id=${post.id}'">${post.title}</h2>
            <div class="post-info-wrapper">
                <div class="post-info">
                    <span>좋아요 ${post.likes}</span>
                    <span>댓글 ${post.comments.length}</span>
                    <span>조회수 ${post.views}</span>
                </div>
                <div class="post-time">${post.postDate}</div>
            </div>
            <hr class="post-divider">
            <div class="post-user-info">
                <img class="author-avatar" src="${authorProfileImage}" alt="프로필 이미지">
                <span class="author-name">${authorName}</span>
            </div>
        `;
        postListElement.appendChild(postItem);
    });
} catch (error){
    console.error("데이터를 불러오는 중 오류 발생:", error);
    postListElement.innerHTML = "<p>게시글을 불러오는 중 문제가 발생했습니다.</p>";
}

    // 4. 프로필 이미지 클릭 시 드롭다운 메뉴 토글
    profileImage.addEventListener("click", (event) => {
        event.stopPropagation();
        dropdownMenu.classList.toggle("visible");
    });

    // 5. 회원정보 수정 버튼
    nicknameBtn.addEventListener("click", () => {
        window.location.href = "/pages/edit-profile/edit-nickname/edit-nickname.html";
    });

    passwordBtn.addEventListener("click", () => {
        window.location.href = "/pages/edit-profile/edit-password/edit-password.html";
    });

    // 6. 로그아웃 기능
    logoutBtn.addEventListener("click", async () => {
        try {
            const response = await fetch(`${BASE_URL}/auth/logout`, {
                method: "POST",
                credentials: "include" // ✅ 쿠키 포함
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            // ✅ localStorage 삭제
            localStorage.clear();
    
            alert("로그아웃 되었습니다.");
            window.location.href = "/pages/login/login.html";
        } catch (error) {
            console.error("로그아웃 오류", error);
            alert("로그아웃 중 오류가 발생했습니다");
        }
    });
    

    // 7. 바깥 영역 클릭하면 드롭다운 닫기
    document.addEventListener("click", (event) => {
        if (!profileImage.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove("visible");
        }
    });
});
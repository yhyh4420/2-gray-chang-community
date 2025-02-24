document.addEventListener("DOMContentLoaded", () => {
    const profileImage = document.getElementById("profile-image");
    const dropdownMenu = document.getElementById("dropdown-menu");
    const nicknameBtn = document.getElementById("edit-nickname");
    const passwordBtn = document.getElementById("edit-password");
    const logoutBtn = document.getElementById("logout-btn");

    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        // 프로필 이미지가 없으면 기본 이미지 사용
        const profileImageUrl = user.profileImage || "/assets/profiles/default-avatar.png";

        // 로그인된 경우 사용자 정보 표시
        profileImage.src = profileImageUrl;
    } else {
        // 로그인되지 않은 경우 로그인 페이지로 강제 이동
        alert("로그인이 필요합니다.");
        window.location.href = "/pages/login/login.html";
    }
    // 프로필 이미지 클릭 시 드롭다운 메뉴 토글
    profileImage.addEventListener("click", (event) => {
        event.stopPropagation(); // 바깥 영역 클릭 방지
        if (dropdownMenu) {
            dropdownMenu.classList.toggle("visible");
        }
    });

    nicknameBtn.addEventListener("click", () => {
        window.location.href = "/pages/edit-profile/edit-nickname/edit-nickname.html";
    });

    passwordBtn.addEventListener("click", () => {
        window.location.href = "/pages/edit-profile/edit-password/edit-password.html";
    });

    // 로그아웃 기능
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("user"); // 로그인 정보 삭제
        window.location.href = "/pages/login/login.html"; // 로그인 페이지로 이동
    });

    // 바깥 영역 클릭하면 드롭다운 닫기
    document.addEventListener("click", (event) => {
        if (!profileImage.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove("visible");
        }
    });
});

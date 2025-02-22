document.addEventListener("DOMContentLoaded", () => {
    const profileImage = document.getElementById("profile-image");
    const dropdownMenu = document.getElementById("dropdown-menu");
    const nicknameBtn = document.getElementById("edit-nickname");
    const passwordBtn = document.getElementById("edit-password");
    const logoutBtn = document.getElementById("logout-btn");

    // 프로필 이미지 클릭 시 드롭다운 메뉴 토글
    profileImage.addEventListener("click", () => {
        dropdownMenu.classList.toggle("visible");
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

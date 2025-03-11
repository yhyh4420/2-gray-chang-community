const BASE_URL = "http://localhost:8080"; // API 베이스 URL

async function fetchSessionUser() {
    try {
        const response = await fetch("http://localhost:8080/auth/session-user", {
            method: "GET",
            credentials: "include" // ✅ 쿠키 포함
        });

        // ✅ 서버 응답 상태 체크
        if (!response.ok) {
            if (response.status === 401) {
                alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
                window.location.href = "/pages/login/login.html";
            } else {
                throw new Error(`오류 발생: ${response.status} ${response.statusText}`);
            }
        }

        const userData = await response.json();
        
        // ✅ 데이터가 유효한지 확인
        if (!userData || !userData.userId) {
            throw new Error("유효한 사용자 정보가 없습니다.");
        }

        console.log("로그인된 사용자:", userData);
        return userData;
    } catch (error) {
        console.error("사용자 정보를 불러오는 중 오류 발생:", error);
        alert("사용자 정보를 가져오는 중 오류가 발생했습니다. 다시 로그인해주세요.");
        window.location.href = "/pages/login/login.html";
    }
}

async function fetchPosts() {
    try {
        const response = await fetch(`${BASE_URL}/posts`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(`게시글 불러오기 실패: ${response.status}`);
        }

        const posts = await response.json();
        console.log("불러온 게시글:", posts);
        return posts;
    } catch (error) {
        console.error("게시글을 불러오는 중 오류 발생:", error);
        return [];
    }
}

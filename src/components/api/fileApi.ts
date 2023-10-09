export const fetchFileContent = async (path, fileName) => {
  try {
    const url = new URL(
      "http://ec2-3-34-131-210.ap-northeast-2.compute.amazonaws.com:8080/api/v1/file-tree/file"
    );
    url.searchParams.append("path", path);
    url.searchParams.append("fileName", fileName);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer [YOUR_ACCESS_TOKEN]", // 토큰이 필요하다면 이렇게 추가
      },
    });

    if (response.status === 401) {
      // 토큰 만료
      alert("토큰이 만료되었습니다.");
      // 토큰 재발급 로직이나 로그인 페이지로 리다이렉트 하는 로직 추가
      return;
    }

    const data = await response.json();
    console.log("서버에서 받은 데이터", data);
    if (data.status === "Error") {
      throw new Error(data.message);
    }

    return data; // 성공적으로 데이터를 받아왔다면 반환
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);
  }
};

export const fetchFileContent = async (path, fileName) => {
  try {
    const url = new URL(
      "http://ec2-3-34-131-210.ap-northeast-2.compute.amazonaws.com:8080/api/v1/file-tree/file"
    );
    url.searchParams.append("path", path);
    url.searchParams.append("fileName", fileName);

    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MiwiZW1haWwiOiJza2luaGVhZEBiYWxkLmNvbSIsIm5pY2tuYW1lIjoi7LWc6rCV64yA66i466asIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE2OTY4Njk3OTgsImV4cCI6MTY5NjkxMjk5OH0.qPKG2jqOn97e4qW6gfpbTdZJVLxnELTtmbQJo1fjoag`,
      },
    });

    if (response.status === 401) {
      // 토큰 만료
      alert("토큰이 만료되었습니다.");
      //로그인 페이지로 리다이렉트 하는 로직 추가
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

export const createFileOnServer = async (path: string, fileName: string) => {
  const endpoint =
    "http://ec2-3-34-131-210.ap-northeast-2.compute.amazonaws.com:8080/api/v1/file-tree/file";

  const requestBody = {
    path: path,
    fileName: fileName,
  };

  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("토큰이 없습니다. 로그인해주세요.");
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MiwiZW1haWwiOiJza2luaGVhZEBiYWxkLmNvbSIsIm5pY2tuYW1lIjoi7LWc6rCV64yA66i466asIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE2OTY4Njk3OTgsImV4cCI6MTY5NjkxMjk5OH0.qPKG2jqOn97e4qW6gfpbTdZJVLxnELTtmbQJo1fjoag`,
      },
      body: JSON.stringify(requestBody),
    });

    // 여기서 응답의 상태를 체크
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error creating file:`, error);
    throw error;
  }
};

export const createFolderOnServer = async (
  path: string,
  folderName: string
) => {
  const endpoint =
    "http://ec2-3-34-131-210.ap-northeast-2.compute.amazonaws.com:8080/api/v1/file-tree/folder";

  const requestBody = {
    path: path,
    folderName: folderName,
  };
  console.log(requestBody);

  const token = localStorage.getItem("accessToken");
  console.log("Token:", token); // 이렇게 로그로 토큰을 출력해서

  if (!token) {
    throw new Error("토큰이 없습니다. 로그인해주세요.");
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MiwiZW1haWwiOiJza2luaGVhZEBiYWxkLmNvbSIsIm5pY2tuYW1lIjoi7LWc6rCV64yA66i466asIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE2OTY4Njk3OTgsImV4cCI6MTY5NjkxMjk5OH0.qPKG2jqOn97e4qW6gfpbTdZJVLxnELTtmbQJo1fjoag`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log(`Response status code: ${response.status}`);

    // 여기서 응답의 상태를 체크
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error creating folder:`, error);
    throw error;
  }
};

// api.ts
export const fetchFileTree = async (path: string = "/src") => {
  const endpoint = `http://ec2-3-34-131-210.ap-northeast-2.compute.amazonaws.com:8080/api/v1/file-tree`;

  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("토큰이 없습니다. 로그인해주세요.");
  }

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MiwiZW1haWwiOiJza2luaGVhZEBiYWxkLmNvbSIsIm5pY2tuYW1lIjoi7LWc6rCV64yA66i466asIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE2OTY4Njk3OTgsImV4cCI6MTY5NjkxMjk5OH0.qPKG2jqOn97e4qW6gfpbTdZJVLxnELTtmbQJo1fjoag`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Unknown error");
  }

  return await response.json();
};

/**
 * 중첩된 JSON 객체를 "auth.login.btn": "완료" 형태로 평탄화(Flatten)합니다.
 */
export function flattenObject(
  obj: any,
  prefix = "",
  res: Record<string, string> = {},
) {
  for (const key in obj) {
    const propName = prefix ? `${prefix}.${key}` : key;

    if (typeof obj[key] === "object" && obj[key] !== null) {
      flattenObject(obj[key], propName, res);
    } else {
      res[propName] = String(obj[key]);
    }
  }
  return res;
}
/**
 * 브라우저의 FileReader를 사용해 업로드된 File 객체를 읽고 JSON으로 파싱합니다.
 */
export async function readJsonFile(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        // 읽어들인 텍스트를 자바스크립트 객체(JSON)로 변환
        const json = JSON.parse(e.target?.result as string);
        resolve(json);
      } catch (err) {
        reject(new Error("올바른 JSON 형식이 아닙니다."));
      }
    };

    reader.onerror = () =>
      reject(new Error("파일을 읽는 도중 에러가 발생했습니다."));

    // 파일을 텍스트 형태로 읽기 시작
    reader.readAsText(file);
  });
}

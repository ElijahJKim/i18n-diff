// 1. 팝업에서 보낸 메세지 듣기
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "REPLACE_TEXT") {
    // 텍스트 교체 및 레이아웃 검사 실행
    replaceAndCheckLayout(request.payload);

    // 팝업에게 잘 처리했다고 답장 보내기
    sendResponse({ status: "완료(Done)!" });
  }
  return true; // 비동기 응답을 위해 필요
});

// 2. 화면 글자 싹 바꾸고 깨짐 검사하기
function replaceAndCheckLayout(textMap: Record<string, string>) {
  // TreeWalker: 웹페이지의 모든 '텍스트 노드(글자)'만 쏙쏙 골라내는 브라우저 내장 기능
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
  );

  let node;
  const elementsToCheck = new Set<HTMLElement>();

  // 화면의 모든 텍스트를 하나씩 훑어봅니다.
  while ((node = walker.nextNode())) {
    const originalText = node.nodeValue?.trim();

    // 만약 화면의 글자가 우리가 가진 번역 사전(textMap)에 있다면?
    if (originalText && textMap[originalText]) {
      // 글자를 타겟 언어(예: 독일어)로 싹 바꿉니다!
      node.nodeValue = node.nodeValue!.replace(
        originalText,
        textMap[originalText],
      );

      // 글자가 바뀐 부모 태그(div, button 등)를 검사 목록에 추가
      if (node.parentElement) {
        elementsToCheck.add(node.parentElement);
      }
    }
  }

  // 3. 텍스트가 바뀐 요소들이 화면을 뚫고 나갔는지(Overflow) 검사
  elementsToCheck.forEach((el) => {
    // scrollWidth(실제 내용물 길이)가 clientWidth(보여지는 박스 크기)보다 크다면? = 삐져나감!
    if (el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight) {
      // 🚨 빨간색 점선으로 위험 표시! (border 대신 outline을 써야 레이아웃이 밀리지 않습니다)
      el.style.outline = "2px dashed red";
      el.style.outlineOffset = "2px";
      el.style.backgroundColor = "rgba(255, 0, 0, 0.1)"; // 살짝 붉은 배경
      el.style.position = "relative";

      console.warn("레이아웃 깨짐 감지:", el);
    }
  });
}

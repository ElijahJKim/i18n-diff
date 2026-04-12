<main class="dashboard">
  <header class="header-box">
    <h1>환영합니다!</h1>
  </header>

  <section class="info-card">
    <p class="description">여기에 세부 정보를 입력해 주세요.</p>

    <div class="action-buttons">
      <button class="btn btn-cancel">취소</button>
      <button class="btn btn-done">완료</button>
    </div>
  </section>
</main>

<style>
  /* 🚨 핵심: 독일어가 들어오면 100% 깨지도록 CSS를 아주 타이트하게 잡았습니다. */

  .dashboard {
    height: 100vh;
    padding: 50px;
    background-color: #f4f4f9;
    font-family: sans-serif;
  }

  .header-box h1 {
    overflow: visible; /* 삐져나간 글자가 보이도록 설정 */

    /* 1. 제목 박스 너비를 150px로 고정하고 줄바꿈을 막았습니다. */
    width: 150px;
    margin: 0;
    padding: 10px;
    border-radius: 4px;
    background: #e0e0e0;
    font-size: 24px;
    white-space: nowrap;
  }

  .info-card {
    /* 2. 카드 전체 너비도 300px로 좁게 고정했습니다. */
    width: 300px;
    margin-top: 30px;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgb(0 0 0 / 10%);
    background: white;
  }

  .description {
    overflow: visible;
    width: 100%;

    /* 3. 설명글의 높이를 딱 1줄 크기(24px)로 고정했습니다. */
    height: 24px;
    margin-bottom: 30px;
    color: #555;
  }

  .action-buttons {
    display: flex;
    gap: 10px;
  }

  .btn {
    /* 4. 버튼 너비를 60px로 아주 좁게 고정했습니다! ("완료"는 딱 맞지만 독일어는 넘칩니다) */
    width: 60px;
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    white-space: nowrap;
  }

  .btn-cancel {
    background: #ccc;
    color: black;
  }

  .btn-done {
    background: #4a90e2;
    color: white;
  }
</style>

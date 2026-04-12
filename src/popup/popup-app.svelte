<script lang="ts">
  import { flattenObject, readJsonFile } from "$lib/utils";

  type StoredPopupState = {
    baseFileName?: string;
    targetFileName?: string;
    baseRaw?: unknown;
    targetRaw?: unknown;
    hasSimulated?: boolean;
  };

  // 1. File 객체 대신 파일명과 실제 데이터를 상태로 분리합니다.
  let baseFileName = $state<string | null>(null);
  let targetFileName = $state<string | null>(null);
  let baseRaw = $state<any>(null);
  let targetRaw = $state<any>(null);

  let isSimulating = $state(false);
  let hasSimulated = $state(false);

  $effect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get(
        [
          "baseFileName",
          "targetFileName",
          "baseRaw",
          "targetRaw",
          "hasSimulated",
        ],
        (result: StoredPopupState) => {
          if (result.baseFileName) baseFileName = result.baseFileName;
          if (result.targetFileName) targetFileName = result.targetFileName;
          if (result.baseRaw) baseRaw = result.baseRaw;
          if (result.targetRaw) targetRaw = result.targetRaw;
          if (result.hasSimulated) hasSimulated = result.hasSimulated;
        },
      );
    }
  });

  async function handleFileUpload(e: Event, type: "base" | "target") {
    const file = (e.currentTarget as HTMLInputElement).files?.[0];
    if (!file) return;

    if (file.size > 512 * 1024 * 1024) {
      alert("File size exceeds 512MB");
      return;
    }

    try {
      const rawData = await readJsonFile(file);

      if (type === "base") {
        baseFileName = file.name;
        baseRaw = rawData;
      } else {
        targetFileName = file.name;
        targetRaw = rawData;
      }

      // 스토리지에 백업
      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.set({
          baseFileName,
          targetFileName,
          baseRaw,
          targetRaw,
        });
      }
    } catch (err: any) {
      alert("Failed to read file: " + err.message);
    }
  }

  function handleReset() {
    baseFileName = null;
    targetFileName = null;
    baseRaw = null;
    targetRaw = null;
    isSimulating = false;
    hasSimulated = false;

    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.clear();
    }
  }

  async function handleSimulate() {
    if (!baseRaw || !targetRaw) return;

    try {
      const baseFlat = flattenObject(baseRaw);
      const targetFlat = flattenObject(targetRaw);

      const textMap: Record<string, string> = {};
      for (const key in baseFlat) {
        if (baseFlat[key] && targetFlat[key]) {
          textMap[baseFlat[key]] = targetFlat[key];
        }
      }

      isSimulating = true;

      if (typeof chrome !== "undefined" && chrome.tabs) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0].id) {
            chrome.tabs.sendMessage(
              tabs[0].id,
              {
                action: "REPLACE_TEXT",
                payload: textMap,
              },
              (response) => {
                isSimulating = false;
                hasSimulated = true;
                chrome.storage.local.set({ hasSimulated: true });
              },
            );
          }
        });
      } else {
        isSimulating = false;
        hasSimulated = true;
      }
    } catch (err: any) {
      alert(err.message);
    }
  }
</script>

<main class="popup-container">
  <header>
    <h1>i18n Diff</h1>
  </header>

  <section class="upload-section">
    <div class="drop-zone" class:active={baseFileName}>
      <input
        type="file"
        accept=".json"
        onchange={(e) => handleFileUpload(e, "base")}
      />
      <p>{baseFileName ? baseFileName : "Base JSON"}</p>
    </div>

    <div class="drop-zone" class:active={targetFileName}>
      <input
        type="file"
        accept=".json"
        onchange={(e) => handleFileUpload(e, "target")}
      />
      <p>{targetFileName ? targetFileName : "Target JSON"}</p>
    </div>
  </section>

  <footer>
    {#if hasSimulated}
      <button onclick={handleReset} class="secondary-btn">
        Reset & New Test
      </button>
    {:else}
      <button
        onclick={handleSimulate}
        disabled={!baseRaw || !targetRaw || isSimulating}
        class="primary-btn"
      >
        {isSimulating ? "Simulating..." : "Simulate on Page"}
      </button>
    {/if}
  </footer>
</main>

<style>
  .popup-container {
    width: 200px;
    padding: 1rem;
    font-family: sans-serif;
  }

  header h1 {
    margin: 0;
    font-size: 1.25rem;
  }

  .upload-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .drop-zone {
    position: relative;
    padding: 1rem;
    border: 2px dashed #ccc;
    border-radius: 8px;
    text-align: center;
    transition: all 0.2s;
  }

  .drop-zone.active {
    border-color: #4a90e2;
    background: #f0f7ff;
  }

  .drop-zone input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  /* 기존 기본 버튼 (파란색) */
  .primary-btn {
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 6px;
    background: #4a90e2;
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s;
  }

  .primary-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  /* ✨ 새로 추가된 리셋 버튼 (회색 테두리) */
  .secondary-btn {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #ccc;
    border-radius: 6px;
    background: transparent;
    color: #555;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
  }

  .secondary-btn:hover {
    border-color: #aaa;
    background: #f4f4f9;
  }
</style>

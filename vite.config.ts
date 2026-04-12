import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	css: {
    preprocessorOptions: {
      scss: {
        // 1. prependData 대신 additionalData를 사용합니다.
        // 2. 경로는 $lib을 사용하여 정확하게 지정합니다.
        // 3. 파일명이 _variable.scss(단수)인지 _variables.scss(복수)인지 꼭 확인하세요!
        additionalData: `
          @use '$lib/styles/_variables.scss' as *;
          @use '$lib/styles/_mixins.scss' as *;
        `
      }
    }
  }
});

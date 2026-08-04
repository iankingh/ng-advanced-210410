# Angular 11 開發實戰：進階開發篇 實作練習專案

Angular 11 課程練習專案，將 Start Bootstrap 的 SB Admin 2 後台版型整合為 Angular 應用程式，並示範路由、守衛、表單與自訂台灣身分證字號驗證。

## 練習範圍

- SB Admin 2 dashboard、layout、components、utilities 與 404 頁面
- Hash-based routing、巢狀子路由與 `components` lazy-loaded module
- `CanActivateChild` 守衛；以瀏覽器 `localStorage` 的 `token` 判斷並導向 `/login`
- Template-driven login form
- Reactive login form、動態 `FormArray`、欄位驗證與表單 reset
- `taiwan-id-validator2` 自訂 validator
- Karma／Jasmine unit tests 與 Protractor E2E scaffold

## 技術棧

- Angular `11.2.x`、Angular CLI `11.2.x`
- TypeScript `~4.1.5`、RxJS `~6.6.7`
- Karma／Jasmine、TSLint／Codelyzer、Protractor
- SB Admin 2 靜態 assets

## 環境需求

此專案使用已停止維護的 Angular 11 工具鏈。套件 metadata 要求 Node.js `>=10.13.0`，npm `^6.11.0` 或 `^7.5.6`；建議使用與當時相容的 Node.js 12 LTS + npm 6，而非目前最新版 Node.js。

瀏覽器測試與 E2E 另需可用的 Chrome／Chromium。專案不需 API server、`.env` 或秘密設定。

## 安裝

目前 `package-lock.json` 是空檔，且新版 npm 會遇到 `codelyzer` peer dependency 衝突，因此不能使用 `npm ci`。使用：

```bash
npm install --legacy-peer-deps
```

## 開發與建置

```bash
npm start              # ng serve --open；預設 http://localhost:4200
npm run build          # production build 至 dist/demo1
npm test               # Karma/Jasmine；需要 Chrome
npm run lint           # TSLint
npm run e2e            # Protractor E2E；需要 Chrome／WebDriver
```

## 主要結構

```text
src/app/
├── app-routing.module.ts       # hash routes、守衛、lazy module
├── layout/                     # SB Admin 2 共用殼層
├── dashboard/                  # dashboard 首頁
├── login/                      # template-driven form
├── login2/                     # reactive form、FormArray、TW ID validator
├── components/                 # lazy-loaded cards/buttons pages
├── utilities/colors/           # 色彩 utilities 頁面
├── auth.guard.ts               # CanActivate 範例
├── auth2.guard.ts              # CanActivateChild 範例
└── twid-validator.directive.ts # template-driven TW ID validator directive
```

Angular CLI 會以 `src/environments/environment.ts` 建置開發版，production build 則替換為 `environment.prod.ts`；兩者目前只有 `production` flag。

## 主要路由

- `/#/dashboard`、`/#/page1`、`/#/page2`
- `/#/utilities/color`、`/#/utilities/color/:type`
- `/#/components`、`/#/components/cards`、`/#/components/buttons`
- `/#/login`、`/#/login2`
- 其他路徑顯示 404 頁面

## 已知狀態與限制

- Angular 11、TSLint、Protractor 與多項相依套件均已過維護期。
- 在 Node.js 26 上 production build 會因舊版 webpack/OpenSSL 相容性而失敗；請使用上述舊版 Node.js 環境。
- unit tests 需要 Chrome；未安裝瀏覽器時 `npm test` 無法啟動 `ChromeHeadless`。
- 守衛只檢查本地 `token` 是否存在，沒有真正的登入或後端驗證流程；login forms 目前只將資料輸出到 console。

## 課程資源

- 可從本專案的 [Releases](https://github.com/coolrare/ng-advanced-210410/releases) 取得課程素材。
- [SB Admin 2 靜態版型轉成 Angular 應用程式示範](https://www.youtube.com/watch?v=KdNX2q7FvpU)

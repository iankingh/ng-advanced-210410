# Angular 11 開發實戰：進階開發篇 實作練習專案

Angular 11 課程練習專案，將 Start Bootstrap 的 SB Admin 2 後台版型整合為 Angular 應用程式，並示範路由、守衛、表單與自訂台灣身分證字號驗證。

> **安全提醒：此專案的登入與路由守衛僅為前端教學示範，不提供任何安全性或真正的使用者驗證。**
> 表單只做欄位驗證，送出後在 `localStorage` 寫入固定字串 `demo-session`；使用者可自行建立、修改或刪除它，
> 也可直接呼叫應用程式或後端資源。請勿用於保護真實資料或部署為可依賴的登入系統。

## 練習範圍

- SB Admin 2 dashboard、layout、components、utilities 與 404 頁面
- Hash-based routing、巢狀子路由與 `components` lazy-loaded module
- `CanActivateChild` 守衛；以瀏覽器 `localStorage` 的 demo token 展示路由導向（不是存取控制）
- Template-driven login form
- Reactive login form、動態 `FormArray`、欄位驗證與表單 reset
- `taiwan-id-validator2` 自訂 validator
- Karma／Jasmine unit tests 與 Protractor E2E 流程

## 技術棧

- Angular `11.2.x`、Angular CLI `11.2.x`
- TypeScript `~4.1.5`、RxJS `~6.6.7`
- Karma／Jasmine、TSLint／Codelyzer、Protractor
- SB Admin 2 靜態 assets

## 環境需求

此專案使用已停止維護的 Angular 11 工具鏈。套件 metadata 要求 Node.js `>=10.13.0`，npm `^6.11.0` 或 `^7.5.6`；建議使用與當時相容的 Node.js 12 LTS + npm 6，而非目前最新版 Node.js。

瀏覽器測試與 E2E 另需可用的 Chrome／Chromium。專案不需 API server、`.env` 或秘密設定。

## 安裝

目前 `package-lock.json` 已不存在（原為空檔），且新版 npm 會遇到 `codelyzer` peer dependency 衝突，因此不能使用 `npm ci`。使用：

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

2026-10-05 以 Node 22.22.3、`NODE_OPTIONS=--openssl-legacy-provider` 和 Chrome
154 實跑 lint、42 個 Karma browser tests、8 個 Protractor E2E 與 build 通過。
這是舊工具鏈的相容性驗收，不代表 Angular 11 正式支援 Node 22 或消除停止維護的限制。
E2E 覆蓋 token／巢狀 lazy guard、帶 query／fragment 的 returnUrl、兩種表單與
台灣身分證驗證、動態欄位／reset、logout modal／back navigation 及 404。

```bash
export NODE_OPTIONS=--openssl-legacy-provider
export CHROME_BIN=/absolute/path/to/chrome
export CHROMEDRIVER_BIN=/absolute/path/to/matching/chromedriver
export E2E_HEADLESS=1
npm run lint
npm test -- --watch=false --browsers=ChromeHeadless
npm run e2e -- --webdriver-update=false --port=4210
npm run build
```

ChromeDriver 必須與 Chrome 相容；上述命令使用已準備好的 driver，不執行舊版
webdriver-manager 的線上更新。

- Angular 11、TSLint、Protractor 與多項相依套件均已過維護期。
- 在 Node.js 26 上 production build 會因舊版 webpack/OpenSSL 相容性而失敗；請使用上述舊版 Node.js 環境。
- unit tests 需要 Chrome；未安裝瀏覽器時 `npm test` 無法啟動 `ChromeHeadless`。
- 兩個 login form 驗證通過後會建立本機 demo token，導回守衛保存的 `returnUrl`；
  Logout 會清除 token。這些步驟只有示範表單驗證、路由導向和 `localStorage`，沒有檢查帳密、
  使用者身份或權限；Angular route guard 可被繞過，後端也完全沒有認證／授權。不可視為安全邊界。

## 課程資源

- 可從本專案的 [Releases](https://github.com/coolrare/ng-advanced-210410/releases) 取得課程素材。
- [SB Admin 2 靜態版型轉成 Angular 應用程式示範](https://www.youtube.com/watch?v=KdNX2q7FvpU)

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

- Angular `11.2.14`、Angular CLI `11.2.19`、Angular DevKit `0.1102.19`
- TypeScript `4.1.6`、RxJS `6.6.7`、Zone.js `0.10.3`、tslib `2.8.1`
- Karma／Jasmine、TSLint／Codelyzer、Protractor
- SB Admin 2 靜態 assets

## 環境需求

此專案使用已停止維護的 Angular 11 工具鏈。Angular CLI 11 metadata 要求 Node.js `>=10.13.0`，npm `^6.11.0` 或 `^7.5.6`；這些是舊套件的 engine 宣告，不代表目前仍受安全維護。Node 22 曾用於本專案相容性驗收，但不在 Angular 11 的官方支援範圍內。

瀏覽器測試與 E2E 另需可用的 Chrome／Chromium。專案不需 API server、`.env` 或秘密設定。

## 安裝

目前不提交 `package-lock.json`（原檔為空），且新版 npm 會遇到 `codelyzer` peer dependency 衝突，因此不能使用 `npm ci`。使用：

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

2026-10-07 本次覆核以 Node 20.15.0 和 `NODE_OPTIONS=--openssl-legacy-provider` 執行 lint、
build 並通過。另以 Node 26.5.0、npm 12.1.0、相同 OpenSSL 相容選項及快取 Chrome Headless 153
重跑 46 個 Karma browser tests，全數通過。這些是舊工具鏈的相容性驗收，不代表 Angular 11
正式支援 Node 20／22／26 或消除停止維護的限制。
本次沒有重跑 Protractor E2E：缺少 WebDriver `update-config.json`。工作區 `FLEET_STATUS`
記錄的 8 個 E2E 通過是 2026-10-05 在 Node 22.22.3／Chrome 154 環境的先前結果，不是本次驗證。

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

- Angular 11、TSLint、Protractor 與多項相依套件均已過維護期。2026-10-07 以當時 npm registry metadata 檢查，Angular 11.2.14、CLI 11.2.19、TypeScript 4.1.6 等已是各自相容版本線的最新版本；Angular 11 沒有可修復目前 Angular 安全公告的相容更新。此教學刻意保留 Angular 11 基線，視為歷史課程；不進行 app-wide／Angular-major migration，也不宣稱可安全部署或無漏洞。
- 專案刻意不提交 `package-lock.json`。直接執行 `npm audit` 需要 lockfile；要檢查目前相依解析，先以 `npm install --package-lock-only --legacy-peer-deps` 產生臨時 lockfile，再執行 `npm audit`，不要把臨時檔當成正式鎖定版本。本次以 npm `12.1.0`、2026-10-07 的臨時解析結果為 **99 項：4 critical、42 high、41 moderate、12 low**。
- Critical 項目包含 `form-data`、`loader-utils`、已棄用且無上游修補版的 `request`，以及 `tar`；它們經由 Angular CLI／DevKit、webpack loaders、Protractor／webdriver-manager 等建置與測試工具傳遞引入。`loader-utils` 與 `form-data` 有較新的 leaf 版本可供測試 override，但 `request` 沒有修補版，`tar` 的安全版跨 major 且提高 Node 要求；這類 override 不能完整清除風險或保證課程工具鏈相容。完整修復需要遷移至受支援的 Angular major，並更新／替換舊 build、lint、E2E 工具，不是安全的 Angular 11 patch。此為維持歷史課程用途的明確例外，殘留 advisory 必須被接受並限制於隔離的教學／開發環境。
- 登入頁只接受站內 `returnUrl`；外部、protocol-relative 或含反斜線的目的地會回到 dashboard。這只避免不安全的導向，不會讓教學用 localStorage token 變成認證或授權。
- 在 Node.js 26 上 production build 會因舊版 webpack/OpenSSL 相容性而失敗；請使用上述舊版 Node.js 環境。
- unit tests 需要 Chrome／Chromium；本次已使用快取 Chromium 執行成功。E2E 還需要 matching WebDriver；本次缺少 WebDriver `update-config.json`，未重跑 Protractor。
- 兩個 login form 驗證通過後會建立本機 demo token，導回守衛保存的 `returnUrl`；
  Logout 會清除 token。這些步驟只有示範表單驗證、路由導向和 `localStorage`，沒有檢查帳密、
  使用者身份或權限；Angular route guard 可被繞過，後端也完全沒有認證／授權。不可視為安全邊界。

## 課程資源

- 可從本專案的 [Releases](https://github.com/coolrare/ng-advanced-210410/releases) 取得課程素材。
- [SB Admin 2 靜態版型轉成 Angular 應用程式示範](https://www.youtube.com/watch?v=KdNX2q7FvpU)

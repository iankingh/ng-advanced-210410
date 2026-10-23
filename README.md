# Angular 進階開發篇實作練習專案（Angular 22）

Angular 22 進階開發練習專案，將 Start Bootstrap 的 SB Admin 2 後台版型整合為 Angular 應用程式，並示範路由、守衛、表單與自訂台灣身分證字號驗證。

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
- Karma／Jasmine unit tests 與 Playwright E2E 流程

## 技術棧

- Angular `22.2.3`、Angular CLI／build `22.2.4`
- TypeScript `6.0.x`（Angular 22 相容範圍）、RxJS `7.8.2`、Zone.js `0.16.3`
- Node.js `24.22.1` LTS、npm `11.20.0`；`.nvmrc` 與 `package.json` 同步固定環境
- Karma `6.4.4`／Jasmine `6`、ESLint `10`、Playwright `1.64.1`
- 保留 SB Admin 2 靜態 assets 與 NgModule 教學架構

## 安裝與執行

先準備 Node.js 24.22.1；使用 nvm 的環境可執行 `nvm use`。

```bash
npm ci
npm start                  # ng serve --open；http://localhost:4200
npm run build              # production build 至 dist/demo1/browser
npm run type-check         # TypeScript 相容性檢查
npm run lint               # ESLint 檢查 TypeScript
npm test -- --watch=false --browsers=ChromeHeadless
npx playwright install chromium
npm run e2e                # 自動啟動本機伺服器，執行 8 個瀏覽器案例
```

Karma 需要 Chrome／Chromium。可設定 `CHROME_BIN=/absolute/path/to/chrome`，
Karma 與 Playwright 都會使用該瀏覽器；Playwright 不需 ChromeDriver。
專案不需 API server、`.env` 或秘密設定。

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

## 升級與驗證

2026-10-23 更新至最新正式版 Angular 22，使用現行 application builder，
明確設定 NgModule components／directive 的 `standalone: false` 與 Zone change detection。
Reactive forms 使用 Angular 的 `UntypedForm*` 相容類別保留既有教材行為。
移除舊 webpack、TSLint／Codelyzer 與 Protractor 設定；ESLint 與 Playwright 接手檢查，
不再需要 `--legacy-peer-deps` 或 `--openssl-legacy-provider`。
`package-lock.json` 現在提交至版本控制，使用 `npm ci` 重現安裝。

既有單元測試保留登入、驗證器、路由守衛與站內 returnUrl 案例；8 個 E2E 案例涵蓋
兩種表單、動態欄位、lazy route、Bootstrap 登出 modal、token 清除與 404。
實際執行結果見工作區 `NODE_UPGRADE_REPORT.md`。

登入流程仍是可由使用者修改的 localStorage 教學示範，沒有後端認證或授權。
SB Admin 2 的既有靜態 vendor 檔案不由 npm 管理；此輪只升級應用程式與 npm 工具鏈。

## 課程資源

- 可從本專案的 [Releases](https://github.com/coolrare/ng-advanced-210410/releases) 取得課程素材。
- [SB Admin 2 靜態版型轉成 Angular 應用程式示範](https://www.youtube.com/watch?v=KdNX2q7FvpU)

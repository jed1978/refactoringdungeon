# Dogfood Report: 重構地城 — Refactoring Dungeon

| Field | Value |
|-------|-------|
| **Date** | 2026-03-22 |
| **App URL** | http://localhost:5173 |
| **Session** | refactoring-dungeon |
| **Scope** | 完整遊戲流程：探索、戰鬥、事件、升級 |

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 0 |
| Medium | 2 |
| Low | 2 |
| **Total** | **4** |

## Positive Findings (Working Correctly)

- ✅ 神壇事件：對話框顯示正確、選擇獎勵後 HP 回滿、返回探索模式
- ✅ 複製貼上靈分裂機制（50% HP 時分裂成 2 隻）
- ✅ 多目標選擇 UI（多隻怪物時出現「選擇目標」介面）
- ✅ 升級系統：LV.1→LV.2，max HP/MP 和金幣正確更新
- ✅ 戰鬥流程：攻擊→敵人回合→再攻擊，無凍結
- ✅ 地城探索：移動、鏡頭跟隨、霧戰系統、燈光效果
- ✅ 小地圖顯示正常
- ✅ 寶箱互動：開啟後獲得金幣
- ✅ HP/MP 條在戰鬥中正確更新
- ✅ 怪物名稱顯示在 HP 條下方

## Issues

---

### ISSUE-001: 戰鬥 UI 缺少「道具」按鈕

| Field | Value |
|-------|-------|
| **Severity** | medium |
| **Category** | functional |
| **URL** | http://localhost:5173 |
| **Repro Video** | N/A |

**Description**

CLAUDE.md 規格要求 4 個戰鬥操作按鈕：⚔攻擊 / 🔧技能 / 💊道具 / 🏃逃跑。但實際戰鬥 UI 只顯示 3 個按鈕，缺少「💊道具」按鈕。即使玩家背包有道具也無法在戰鬥中使用。

**Repro Steps**

1. 開始遊戲，走進任何怪物觸發戰鬥
   ![進入戰鬥後底部只有 3 個按鈕](screenshots/issue-001-no-item-button.png)

2. **Observe:** 底部只有 3 個按鈕：⚔ 攻擊 / 🔧 技能 / 🏃 逃跑，缺少 💊 道具

**Expected:** 4 buttons — ⚔ 攻擊 / 🔧 技能 / 💊 道具 / 🏃 逃跑
**Actual:** 3 buttons — 💊 道具 完全不存在

---

### ISSUE-002: 逃跑失敗造成 2 次敵人攻擊

| Field | Value |
|-------|-------|
| **Severity** | medium |
| **Category** | functional |
| **URL** | http://localhost:5173 |
| **Repro Video** | N/A |

**Description**

逃跑失敗時，玩家受到的傷害是一次正常攻擊的約 2 倍。

- 正常敵人攻擊：複製貼上靈造成 5–6 點傷害
- 逃跑失敗後：HP 從 94 → 83（減少 11 點，相當於約 2 次攻擊）

`strings.ts` 設計意圖是 `fleeFail: "逃跑失敗！{0} 趁虛而入攻擊了你！"` 僅 1 次懲罰性攻擊。但實際上觸發了「逃跑失敗免費攻擊」＋「正常敵人回合」共 2 次。

**Repro Steps**

1. 進入戰鬥，攻擊確認敵人單次傷害約 5–6 點
   ![攻擊後 HP 94](screenshots/combat-after-attack.png)

2. 點「🏃 逃跑」
   ![逃跑失敗後 HP 83](screenshots/after-flee.png)

3. **Observe:** HP 從 94 降至 83（掉了 11 點），遠超單次攻擊值

**Root Cause (suspected):** `combatStateMachine.ts` 中 flee fail 觸發 free hit 後，`processEnemyTurn` 仍繼續執行正常敵人回合。

---

### ISSUE-003: 事件對話框遮擋底部 HUD

| Field | Value |
|-------|-------|
| **Severity** | low |
| **Category** | visual |
| **URL** | http://localhost:5173 |
| **Repro Video** | N/A |

**Description**

觸發神壇/書架/咖啡機事件時，DialogueBox 從畫面底部彈出，其高度覆蓋了底部 HUD 的 HP/MP 數值顯示區，截圖中可見 HP 數字被截斷為 `71/`。

**Evidence**

![神壇事件中 HUD 被 DialogueBox 遮住](screenshots/shrine-event.png)

**Suggestion:** DialogueBox `bottom` 位置往上偏移，或在 event mode 時隱藏底部 HUD。

---

### ISSUE-004: 戰鬥 log 可見行數不足，無滾動提示

| Field | Value |
|-------|-------|
| **Severity** | low |
| **Category** | ux |
| **URL** | http://localhost:5173 |
| **Repro Video** | N/A |

**Description**

戰鬥 combat log 可見區域只有約 2 行，玩家的攻擊訊息在敵人回合後立即被推出可見範圍，且沒有滾動指示器。

遺漏訊息包括：
- 玩家攻擊造成的傷害訊息
- 逃跑失敗訊息 (`fleeFail`)
- 複製貼上靈分裂訊息 (`duplicateSplits`)

**Evidence**

![只顯示敵人攻擊訊息，玩家攻擊結果已消失](screenshots/combat-after-attack.png)

**Suggestion:** 加大 combat log 可見行數（至少 4 行），並加入「↑ 更多」視覺指示。

---

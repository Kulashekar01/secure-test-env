

# 🔐 Secure Test Environment Enforcement (React)

## 📌 Overview

This project is a **React-based proof of concept** for a **secure assessment environment**.
It enforces browser restrictions, blocks distracting actions, and maintains a **complete, auditable event trail** for employer review.

The focus is on **environment enforcement and audit logging**, not on building a full assessment platform.

---

## 🎯 Key Objectives

* Force fullscreen before test starts
* Block restricted actions (tab switch, blur, copy/paste)
* Warn users on violations
* Terminate test after configurable violations
* Capture and persist all events immutably

> Target browser: **Chrome**

---

## ✅ Features Implemented

### 1. Fullscreen Enforcement

* Mandatory fullscreen before assessment access
* Continuous monitoring of fullscreen state
* Warning modal on fullscreen exit
* Forced re-entry
* Configurable exit tolerance

**Events logged**

* `FULLSCREEN_REQUESTED`
* `FULLSCREEN_ENTERED`
* `FULLSCREEN_EXITED`
* `FULLSCREEN_RE_ENTERED`

---

### 2. Violation Handling

Blocked & logged actions:

* Fullscreen exit
* Tab switch / window blur
* Copy & paste attempts

Each violation:

* Shows a blocking warning modal
* Increments violation count
* Terminates test after threshold

```ts
MAX_VIOLATIONS = 3
```

---

### 3. Unified Audit Logging

All events follow a single schema:

```ts
{
  eventType,
  timestamp,
  attemptId,
  metadata
}
```

Captured events include:

* Fullscreen lifecycle
* Focus & visibility changes
* Clipboard attempts
* Violations
* Test termination

---

### 4. Log Persistence & Immutability

* Logs stored in `localStorage` (refresh & offline safe)
* Logs sent in **batches** to backend
* Final flush on test termination
* Logging locked post-submission (immutable)

---

## 🌐 Backend (Mock API)

Audit logs are sent to **MockAPI**.

### `.env`

```env
VITE_AUDIT_API_URL=https://698700308bacd1d773ec42ad.mockapi.io/api/v1
```

### Endpoint

```
POST /auditLogs
```

---

## ⚙️ Tech Stack

* React + TypeScript
* Vite
* Browser APIs (Fullscreen, Visibility, Clipboard)
* MockAPI
* LocalStorage

---

## 🧠 Design Notes

* Frontend-first by design (browser enforcement)
* Blocking where browser security allows
* System-level actions are logged + penalized, not force-disabled
* Clean separation of enforcement, logging, and UI

---

## ▶️ Run Locally

```bash
npm install
npm run dev
```

Open in **Chrome** and trigger violations to see enforcement and audit logs.



---

## ✅ Summary

This PoC demonstrates a **secure, auditable test environment** with realistic browser enforcement, configurable tolerance, and immutable event logging — suitable for high-stakes assessments.

---
# product-experience-lab

DWORKS / Cowork+ 시나리오 기반 **제품 체험관**.
실제 백엔드 없이 더미 데이터로 PC Backoffice + Mobile 동시 시뮬레이션을 제공합니다.

## 개발

```bash
npm install
npm run dev          # http://localhost:5173/product-experience-lab/
npm run typecheck    # tsc --noEmit
npm run build        # dist/
npm run preview      # 빌드 산출 미리보기
```

## 배포 (GitHub Pages)

`main` 브랜치에 푸시하면 `.github/workflows/deploy.yml` 이 빌드 후 GitHub Pages 로 배포합니다.

저장소 설정에서 한 번만 활성화 필요:
**Settings → Pages → Source = `GitHub Actions`**

배포 URL 예시: `https://<owner>.github.io/product-experience-lab/`

`vite.config.ts` 의 `base: '/product-experience-lab/'` 가 서브패스 정적 자산을 처리합니다. SPA 라우팅은 HashRouter 를 사용하므로 GH Pages 의 404 fallback 우회 설정이 필요하지 않습니다.

## 구조 개요

- `src/routes/` — Home / ScenarioList / ScenarioExperience / NotFound
- `src/layouts/` — AppShell, ExperienceLayout
- `src/features/scenario/` — 시나리오 step machine, runner, controls
- `src/features/talk/` — Talk 도메인 타임라인 store
- `src/features/coworkplus/` — Cowork+ 워크스페이스 셸 (사이드바/대화방/우측 레일)
- `src/features/device/` — PC / Mobile 디바이스 프레임
- `src/data/scenarios/` — 시나리오 JSON + zod 검증
- `src/lib/mock-api.ts` — fake async 데이터 어댑터

설계 상세는 `/Users/sycho/.claude/plans/immutable-knitting-abelson.md` 참조.

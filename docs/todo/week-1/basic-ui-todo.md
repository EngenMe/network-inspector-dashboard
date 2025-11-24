# Basic UI – To-Do List

## 1. App Structure
- [ ] Create `/frontend/app` base structure
- [ ] Add files:
    - [ ] `app/layout.tsx`
    - [ ] `app/page.tsx`
    - [ ] `app/results/page.tsx`
- [ ] Setup `/frontend/components`:
    - [ ] `components/layout/AppShell.tsx`
    - [ ] `components/layout/Header.tsx`
    - [ ] `components/layout/Footer.tsx`

## 2. Layout & Routing
- [ ] Implement `AppShell` with basic layout
    - [ ] Header, content, footer
- [ ] Add navigation:
    - [ ] Brand/title
    - [ ] Home link
- [ ] Wire routes:
    - [ ] `/` → Home
    - [ ] `/results` → Results placeholder

## 3. UI Libraries & Theme
- [ ] Integrate TailwindCSS
- [ ] Configure basic color palette
- [ ] Install and setup `shadcn/ui`
- [ ] Create base `Card` component

## 4. Home Page – Scan Form
- [ ] Hero section with title + subtitle
- [ ] Input form:
    - [ ] Text input for domain/IP
    - [ ] Optional scan type selector
    - [ ] Scan button
- [ ] Inline required-field validation

## 5. Results Dashboard – Skeleton UI
- [ ] Create placeholder cards:
    - [ ] DNS
    - [ ] Ping
    - [ ] Traceroute
    - [ ] TLS
    - [ ] HTTP
    - [ ] MTU/MSS
    - [ ] Docker Network
- [ ] Each card:
    - [ ] Title
    - [ ] Short description
    - [ ] “No data yet” placeholder

## 6. State & Navigation Flow
- [ ] On “Scan” submit → navigate to `/results?target=...`
- [ ] Show scanned target on Results page
- [ ] Prepare loading/empty states for all cards

## 7. Basic Styling & Responsiveness
- [ ] Tailwind grid for dashboard:
    - [ ] Mobile: 1 column
    - [ ] Tablet: 2 columns
    - [ ] Desktop: 3+ columns
- [ ] Spacing, padding, readable layout
- [ ] Dark-mode compatible tokens

## 8. Minimal Testing & Cleanup
- [ ] Add smoke tests for:
    - [ ] `AppShell`
    - [ ] Home page form
    - [ ] Results cards rendering
- [ ] Run lint + format
- [ ] Add “Basic UI” section in README

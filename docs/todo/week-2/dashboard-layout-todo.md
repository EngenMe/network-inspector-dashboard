# Dashboard Layout – To-Do List

## 1. Layout Structure
- [ ] Create `docs/todo/week-2/dashboard-layout-todo.md`
- [ ] Review existing layout components:
    - [ ] `frontend/components/layout/AppShell.tsx`
    - [ ] `frontend/components/layout/Header.tsx`
    - [ ] `frontend/components/layout/Footer.tsx`
- [ ] Ensure `AppShell` is applied to:
    - [ ] `frontend/app/page.tsx` (Home)
    - [ ] `frontend/app/results/page.tsx` (Results Dashboard)
- [ ] Define base dashboard layout inside `results/page.tsx`:
    - [ ] Top section: scanned target (domain/IP) + timestamp placeholder
    - [ ] Main grid for result cards
    - [ ] Responsive behavior: single-column mobile, multi-column desktop

## 2. Results Page Sections
- [ ] Add sections to `results/page.tsx`:
    - [ ] DNS section
    - [ ] Ping section
    - [ ] Traceroute section
    - [ ] TLS section
    - [ ] HTTP section
    - [ ] MTU/MSS placeholder section
    - [ ] Docker Network Map placeholder section
- [ ] Add page-level heading:
    - [ ] Title: “Scan Results”
    - [ ] Short description under the title

## 3. Components & Styling
- [ ] Create card containers using `ui/card.tsx`:
    - [ ] DNSCard wrapper (uses existing `dns-card.tsx`)
    - [ ] PingCard placeholder
    - [ ] TracerouteCard placeholder
    - [ ] TLSCard placeholder
    - [ ] HttpCard placeholder
    - [ ] MTU/MSSCard placeholder
    - [ ] DockerNetworkCard placeholder
- [ ] Add card headers with titles + optional status badges
- [ ] Add card body placeholders for incoming data
- [ ] Ensure consistent padding and spacing:
    - [ ] Card padding
    - [ ] Grid gap between cards
    - [ ] Max-width container with centered layout
- [ ] Add loading skeletons:
    - [ ] Use `ui/skeleton.tsx` for placeholder states

## 4. Layout Behavior & Navigation
- [ ] Connect Home → Results navigation:
    - [ ] Home page redirects to `/results?target=...`
    - [ ] Results page reads `target` from search params
    - [ ] Display scanned target in header section
- [ ] Optional scroll behavior:
    - [ ] Wrap dashboard area using `ui/scroll-area.tsx` if needed
- [ ] Mobile layout verification:
    - [ ] Cards stack vertically correctly
- [ ] Desktop layout verification:
    - [ ] Cards form a clean grid with 2–3 columns

## 5. Tests
- [ ] Update `frontend/app/results/__test__/results-page.test.tsx`:
    - [ ] Renders all main dashboard sections (DNS, Ping, Traceroute, TLS, HTTP)
    - [ ] Displays scanned target from URL params
    - [ ] Renders MTU/MSS and Docker placeholder cards
    - [ ] Layout renders without errors on narrow/mobile widths

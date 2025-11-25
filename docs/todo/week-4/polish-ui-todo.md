# Polish UI – To-Do List

## 1. Global Styles & Theme
- [ ] Review `frontend/tailwind.config.js`:
    - [ ] Ensure consistent color palette usage
    - [ ] Verify spacing and font scale consistency
- [ ] Update `frontend/app/globals.css`:
    - [ ] Ensure proper base typography
    - [ ] Standardize focus and background styling

## 2. Layout Shell (Header / Footer / AppShell)
- [ ] Update `AppShell.tsx`:
    - [ ] Ensure consistent padding and max-width
    - [ ] Add balanced spacing between layout sections
- [ ] Polish `Header.tsx`:
    - [ ] Align logo and elements cleanly
    - [ ] Improve mobile responsiveness
- [ ] Polish `Footer.tsx`:
    - [ ] Add subtle separation styling
    - [ ] Standardize text size and spacing

## 3. Home Page Scan UI
- [ ] Update `app/page.tsx`:
    - [ ] Center scan form using a card layout
    - [ ] Use consistent input and button components
    - [ ] Add helper text under input
- [ ] Improve scan button:
    - [ ] Add loading state styles
    - [ ] Disable during request
- [ ] Add minimal validation UI:
    - [ ] Inline message for invalid input
    - [ ] Error styling consistent with theme

## 4. Results Page Layout
- [ ] Update `results/page.tsx`:
    - [ ] Add heading and description at top
    - [ ] Ensure consistent layout spacing
- [ ] Improve `dashboard-cards.tsx`:
    - [ ] Use responsive grid layout
    - [ ] Standardize card headers
    - [ ] Ensure consistent card height and spacing

## 5. DNS Card UI
- [ ] Update `dns-card.tsx`:
    - [ ] Add clear headings per record type
    - [ ] Use table-like layout for records
    - [ ] Apply monospace font for IPs/domains
    - [ ] Add scroll area for long lists
- [ ] Improve loading and error states:
    - [ ] Add skeleton
    - [ ] Add inline error message

## 6. Docker Network Map UI
- [ ] Update `docker-network-map.tsx`:
    - [ ] Improve spacing between nodes
    - [ ] Add subtle background panel
    - [ ] Ensure label readability
    - [ ] Add brief legend/description
- [ ] Add scroll handling for overflow
- [ ] Add loading and empty states

## 7. Loading & Skeleton States
- [ ] Apply skeleton components across dashboard:
    - [ ] DNS
    - [ ] Ping / Traceroute / TLS / HTTP
    - [ ] Docker map
- [ ] Match skeleton dimensions to real cards
- [ ] Add conditional rendering in results page

## 8. Error & Empty States
- [ ] Standardize error UI:
    - [ ] Create a small reusable error message pattern
- [ ] Add empty state messages for partial/missing data

## 9. Responsiveness & Layout Testing
- [ ] Verify mobile layout:
    - [ ] Scan form usability
    - [ ] Dashboard cards stack properly
    - [ ] Header/footer readable
- [ ] Verify tablet/desktop:
    - [ ] Grid breaks correctly
    - [ ] No horizontal scroll
- [ ] Ensure long domain/IP strings wrap safely

## 10. Accessibility & Semantics
- [ ] Update heading hierarchy (`h1`, `h2`, `h3`)
- [ ] Add ARIA labels for inputs and async content
- [ ] Verify tab order and focus states

## 11. UI Tests
- [ ] Update `home-page.test.tsx`:
    - [ ] Assert layout, helper text, disabled states
- [ ] Update `results-page.test.tsx`:
    - [ ] Assert grid layout, loading, and error states
- [ ] Update `AppShell.test.tsx`:
    - [ ] Validate layout consistency
- [ ] Update `dns-card.test.tsx`:
    - [ ] Test scroll area and record rendering
- [ ] Update `docker-network-map.test.tsx`:
    - [ ] Test legend, loading, and empty states

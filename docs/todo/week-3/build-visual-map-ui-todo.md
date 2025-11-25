# Docker Network Visual Map UI – To-Do List

## 1. Component Structure
- [ ] Create `/frontend/components/docker` directory
- [ ] Add files:
    - [ ] `docker-network-map.tsx`
    - [ ] `__test__/docker-network-map.test.tsx`

## 2. Component API & Types
- [ ] Define `DockerNetworkMapProps` in `docker-network-map.tsx`:
    - [ ] `networks` array (bridge name, driver, subnet)
    - [ ] `containers` array (name, id, status, networks joined)
- [ ] Use existing Docker types from `@/lib/types/docker`
- [ ] Add minimal UI-node and edge types inside component

## 3. Visual Layout
- [ ] Implement base layout using `Card` and `ScrollArea`
- [ ] Group containers by network:
    - [ ] Render network as labeled header
    - [ ] Render containers as nodes below each network
- [ ] Add small legend:
    - [ ] Container status indicators
    - [ ] Network type indicators

## 4. Node & Edge Rendering
- [ ] Render each container as a clickable node (name + short ID)
- [ ] Render networks as hubs/labels
- [ ] Draw connection lines between containers and their networks
- [ ] Support containers belonging to multiple networks
- [ ] Add responsive fallback for mobile (stack layout)

## 5. States & UX
- [ ] Add loading state
- [ ] Add empty state (no networks/containers)
- [ ] Add error state (show error banner/message)
- [ ] Add small interactions:
    - [ ] Tooltip on container hover
    - [ ] Highlight connected containers on network hover

## 6. Integration with Results Dashboard
- [ ] Update `dashboard-cards.tsx` to include Docker map section
- [ ] Pass Docker data props from `results/page.tsx`
- [ ] Ensure loading/error states flow from parent

## 7. Tests
### Component Tests
- [ ] Renders networks and containers
- [ ] Shows loading state correctly
- [ ] Shows empty state for no data
- [ ] Shows error message when provided
- [ ] Highlights containers on network hover

### Results Page Tests
- [ ] Docker card becomes visible with Docker data
- [ ] Shows fallback/disabled message when Docker data missing

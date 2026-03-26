

project name is  : Lockr 

You are an expert full-stack TypeScript developer. Build a complete, production-ready web application called **DB Locker** — a secure digital ID locker where users can store and manage their personal documents like Aadhaar, Driving Licence, PAN Card, Bank Accounts, SSLC marksheet, etc.

### PROJECT OVERVIEW
- Users can create **categories** (Aadhaar, Licence, Bank, PAN, SSLC, etc.).
- Each category displays as beautiful **cards**.
- Clicking a category card opens the list of items inside it.
- Users can add multiple items per category (e.g., multiple bank accounts, parents’ accounts, etc.).
- Every item has: title, custom fields (dynamic), photo upload (show image if uploaded, else fallback UI with category icon).
- Responsive design, perfect on mobile, tablet, and desktop.
- Dark mode + Olive Green + White theme.

### TECH STACK (strictly follow)
**Backend:**
- Node.js + Express + TypeScript
- MongoDB (Mongoose)
- Repository Pattern (separate Repository, Service, Controller layers)
- Follow SOLID principles strictly
- All routes, messages, and status codes must be defined as constants in a single file (constants.ts)
- Every file must use proper TypeScript interfaces
- Folder structure: src/controllers, src/services, src/repositories, src/models, src/routes, src/middlewares, src/utils, src/constants

**Frontend:**
- React 18 + Vite
- Redux Toolkit (for state management)
- shadcn/ui components
- Tailwind CSS
- Lenis for smooth scrolling on all pages
- All UI must be based on the official prompts from https://21st.dev/community/components (use their exact component prompts for Sidebar, Navbar, Card, Form, Dialog, Table, etc.)
- Service layer for API calls (constants for routes and messages)
- Responsive, pixel-perfect UI that matches on all screen sizes

### FEATURES (must implement all)
1. **Authentication**
     - google auth 
     - Protected routes

2. **Categories**
   - Sidebar list of categories
   - Add new category (name + icon selection)
   - Pre-filled default categories: Aadhaar, Driving Licence, PAN Card, Bank Account, SSLC, Voter ID, Passport

3. **Items / Cards**
   - Inside a category → grid/list of cards
   - Each card shows: title, photo (or fallback), short info
   - Click card → modal or detail page with full information
   - “Add New” button inside category → form to add new item

4. **Dynamic Fields**
   - Bank category example: Bank Name, Account Number, IFSC, Branch, UPI ID, etc.
   - User can add custom key-value fields for any item
   - Photo upload field (single image) for every item with preview

5. **UI/UX Requirements**
   - Color palette: Olive Green (#4A7043 or #5C8A5E) as primary + White + Dark mode
   - Sidebar (collapsible on mobile) + Top Navbar
   - Use Lenis for buttery smooth scrolling everywhere
   - Every major component (Sidebar, Navbar, Card, Form inputs, Dialog, Empty state) must be generated using the exact prompts from https://21st.dev/community/components + shadcn/ui
   - Modern, clean, minimalist design with subtle shadows and hover effects
   - Perfect mobile responsiveness

### ADDITIONAL REQUIREMENTS
- All sensitive data (bank AC, Aadhaar number, etc.) must be stored encrypted (use crypto library).
- Proper error handling with constant messages.
- Clean, commented, maintainable code.
- .env example file.
- README.md with setup instructions.

### FOLDER STRUCTURE (exactly)
**Backend:**
src/
├── constants/
├── controllers/
├── models/
├── repositories/
├── routes/
├── services/
├── middlewares/
├── utils/
├── server.ts

**Frontend:**
src/
├── components/
├── features/ (redux slices)
├── services/ (api service)
├── pages/
├── lib/
├── constants.ts
├── App.tsx

Generate the **complete project** in two folders: `backend` and `frontend`.
First output the full backend, then the full frontend.
Start with package.json for both, then all files.

Begin now.
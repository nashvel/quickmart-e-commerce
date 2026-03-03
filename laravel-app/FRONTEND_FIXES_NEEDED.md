# Frontend UI/UX Fixes Needed

**Date**: March 2, 2026  
**Status**: Issues identified during detailed comparison

---

## Critical Issues to Fix

### 1. Icon Migration Incomplete

**Problem**: Many pages still use React Icons instead of Lucide icons

**Affected Files**:
- `laravel-app/resources/js/Pages/Home/components/HeroSection.tsx`
  - FaArrowRight, FaDownload, FaRegNewspaper → ArrowRight, Download, Newspaper
- `laravel-app/resources/js/Pages/Home/components/BrandsSection.tsx`
  - No icons (OK)
- `laravel-app/resources/js/Pages/Home/components/FeaturedProductsSection.tsx`
  - FaStar → Star
- `laravel-app/resources/js/Pages/Home/components/CategoriesSection.tsx`
  - FaShoppingBag → ShoppingBag
- `laravel-app/resources/js/Pages/Home/components/ConvenienceStoresSection.tsx`
  - FaStore → Store
- `laravel-app/resources/js/Pages/Home/components/RestaurantsSection.tsx`
  - FaShoppingBag → ShoppingBag
- `laravel-app/resources/js/Pages/Home/components/MobileAppSection.tsx`
  - FaMobileAlt → Smartphone
- `laravel-app/resources/js/Pages/Products/Index.tsx`
  - FaSearch, FaChevronDown, FaChevronUp → Search, ChevronDown, ChevronUp

**Action**: Replace all React Icons with Lucide equivalents

---

### 2. Missing Features in Home Page

**Problem**: New Home page missing some features from old version

**Missing Items**:
1. ❌ "Patch Notes" button in Hero Section (old has 3 buttons, new has 2)
2. ❌ Banner text split into two colors (old splits text, new doesn't)
3. ❌ PromoBanner section (old has promotions banner with data from API)
4. ❌ Female Wears section logic (old filters by category, new just slices products)

**Action**: Add missing features to match old implementation exactly

---

### 3. Missing Features in Products Page

**Problem**: Products page missing filter UI elements

**Missing Items**:
1. ❌ Active filters display with remove buttons (chips showing applied filters)
2. ❌ "Clear All Filters" button
3. ❌ Search suggestion feature ("Did you mean...?")
4. ❌ ScrollToTopButton component
5. ❌ Filter removal with FaTimes icon

**Action**: Add missing filter UI components

---

### 4. Color Scheme Inconsistency

**Problem**: Some pages use hardcoded `blue-600` instead of `primary` color

**Affected Files**:
- Home page components
- Products page
- Various other pages

**Action**: Replace `text-blue-600`, `bg-blue-600`, etc. with `text-primary`, `bg-primary`

---

## Detailed Fix Plan

### Phase 1: Icon Migration (Priority: HIGH)

Replace all React Icons with Lucide icons:

```typescript
// React Icons → Lucide Icons mapping
FaArrowRight → ArrowRight
FaDownload → Download
FaRegNewspaper → Newspaper
FaStar → Star
FaShoppingBag → ShoppingBag
FaStore → Store
FaMobileAlt → Smartphone
FaSearch → Search
FaChevronDown → ChevronDown
FaChevronUp → ChevronUp
FaTimes → X
```

### Phase 2: Home Page Fixes (Priority: HIGH)

1. **HeroSection.tsx**:
   - Add "Patch Notes" button back
   - Implement banner text split logic (split into two colors)
   - Convert icons to Lucide

2. **Home/Index.tsx**:
   - Add PromoBanner section back (fetch from API)
   - Fix Female Wears section to filter by category properly

3. **All Home Components**:
   - Convert all React Icons to Lucide
   - Replace `blue-600` with `primary` color

### Phase 3: Products Page Fixes (Priority: HIGH)

1. **Products/Index.tsx**:
   - Add active filters display with remove chips
   - Add "Clear All Filters" button
   - Add search suggestion feature
   - Add ScrollToTopButton component
   - Convert all icons to Lucide
   - Replace `blue-600` with `primary` color

### Phase 4: Comprehensive Check (Priority: MEDIUM)

Check remaining 36 pages for:
- Icon usage (React Icons vs Lucide)
- Color scheme consistency
- Missing features
- Layout differences

---

## Files to Update

### Immediate Priority:
1. `laravel-app/resources/js/Pages/Home/components/HeroSection.tsx`
2. `laravel-app/resources/js/Pages/Home/components/FeaturedProductsSection.tsx`
3. `laravel-app/resources/js/Pages/Home/components/CategoriesSection.tsx`
4. `laravel-app/resources/js/Pages/Home/components/ConvenienceStoresSection.tsx`
5. `laravel-app/resources/js/Pages/Home/components/RestaurantsSection.tsx`
6. `laravel-app/resources/js/Pages/Home/components/MobileAppSection.tsx`
7. `laravel-app/resources/js/Pages/Home/Index.tsx`
8. `laravel-app/resources/js/Pages/Products/Index.tsx`

### Secondary Priority:
- All other pages (need to check each one)

---

## Testing Checklist

After fixes:
- [ ] All React Icons replaced with Lucide
- [ ] Home page has all 3 buttons in hero
- [ ] Home page banner text split into two colors
- [ ] PromoBanner section displays
- [ ] Products page shows active filters
- [ ] Products page has "Clear All Filters" button
- [ ] Search suggestions work
- [ ] ScrollToTopButton appears
- [ ] All colors use `primary` instead of `blue-600`
- [ ] UI matches old React app exactly

---

## Notes

- The Seller Dashboard is already perfect (icons converted correctly)
- Need to check all 39 pages systematically
- Focus on icon migration first as it's the most widespread issue
- Then fix missing features
- Finally ensure color consistency

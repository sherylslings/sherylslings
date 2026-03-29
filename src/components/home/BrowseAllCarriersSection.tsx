import { useState, useMemo } from 'react';
import { CarrierCard } from '@/components/carrier/CarrierCard';
import { useCarriers } from '@/hooks/useCarriers';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Filter, X, Search, SlidersHorizontal } from 'lucide-react';
import { CATEGORIES } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

type SortOption = 'newest' | 'price-low' | 'price-high' | 'name';

export const BrowseAllCarriersSection = () => {
  const { data: carriers, isLoading } = useCarriers();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedAgeRanges, setSelectedAgeRanges] = useState<string[]>([]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filterOptions = useMemo(() => {
    if (!carriers) return { brands: [], ageRanges: [] };
    const brands = [...new Set(carriers.map(c => c.brand_name))].sort();
    const ageRanges = [...new Set(carriers.map(c => c.age_range))].sort();
    return { brands, ageRanges };
  }, [carriers]);

  const filteredCarriers = useMemo(() => {
    if (!carriers) return [];

    let result = carriers.filter(carrier => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          carrier.brand_name.toLowerCase().includes(query) ||
          carrier.model_name.toLowerCase().includes(query) ||
          carrier.description?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      if (selectedCategories.length > 0 && !selectedCategories.includes(carrier.category)) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(carrier.brand_name)) return false;
      if (selectedAgeRanges.length > 0 && !selectedAgeRanges.includes(carrier.age_range)) return false;
      if (showAvailableOnly && carrier.availability_status !== 'available') return false;
      return true;
    });

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.weekly_rent - b.weekly_rent);
        break;
      case 'price-high':
        result.sort((a, b) => b.weekly_rent - a.weekly_rent);
        break;
      case 'name':
        result.sort((a, b) => a.brand_name.localeCompare(b.brand_name));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return result;
  }, [carriers, searchQuery, selectedCategories, selectedBrands, selectedAgeRanges, showAvailableOnly, sortBy]);

  const toggleFilter = (value: string, selected: string[], setSelected: (val: string[]) => void) => {
    if (selected.includes(value)) {
      setSelected(selected.filter(v => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  const toggleCategory = (slug: string) => {
    setSelectedCategories(prev =>
      prev.includes(slug) ? prev.filter(v => v !== slug) : [...prev, slug]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedAgeRanges([]);
    setShowAvailableOnly(false);
  };

  const hasActiveFilters = searchQuery || selectedCategories.length > 0 || selectedBrands.length > 0 || selectedAgeRanges.length > 0 || showAvailableOnly;

  // Count of active non-category filters (for badge on filter button)
  const activeFilterCount = (selectedBrands.length > 0 ? 1 : 0) + (selectedAgeRanges.length > 0 ? 1 : 0) + (showAvailableOnly ? 1 : 0);

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium mb-3 block">Availability</Label>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="home-available-only"
            checked={showAvailableOnly}
            onCheckedChange={(checked) => setShowAvailableOnly(checked === true)}
          />
          <label htmlFor="home-available-only" className="text-sm cursor-pointer">
            Show available only
          </label>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">Category</Label>
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <div key={category.slug} className="flex items-center space-x-2">
              <Checkbox
                id={`home-category-${category.slug}`}
                checked={selectedCategories.includes(category.slug)}
                onCheckedChange={() => toggleFilter(category.slug, selectedCategories, setSelectedCategories)}
              />
              <label htmlFor={`home-category-${category.slug}`} className="text-sm cursor-pointer">
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {filterOptions.brands.length > 0 && (
        <div>
          <Label className="text-sm font-medium mb-3 block">Brand</Label>
          <div className="space-y-2">
            {filterOptions.brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={`home-brand-${brand}`}
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={() => toggleFilter(brand, selectedBrands, setSelectedBrands)}
                />
                <label htmlFor={`home-brand-${brand}`} className="text-sm cursor-pointer">
                  {brand}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {filterOptions.ageRanges.length > 0 && (
        <div>
          <Label className="text-sm font-medium mb-3 block">Age Range</Label>
          <div className="space-y-2">
            {filterOptions.ageRanges.map((ageRange) => (
              <div key={ageRange} className="flex items-center space-x-2">
                <Checkbox
                  id={`home-age-${ageRange}`}
                  checked={selectedAgeRanges.includes(ageRange)}
                  onCheckedChange={() => toggleFilter(ageRange, selectedAgeRanges, setSelectedAgeRanges)}
                />
                <label htmlFor={`home-age-${ageRange}`} className="text-sm cursor-pointer">
                  {ageRange}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <Button variant="outline" onClick={clearAllFilters} className="w-full">
          <X className="w-4 h-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <section id="browse-all" className="py-16 md:py-24 bg-background scroll-mt-20">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
            Browse All Carriers
          </h2>
          <p className="text-muted-foreground">
            Use filters to quickly find the right carrier for your family.
          </p>
        </div>

        {/* Search and Sort/Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by brand, model, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 shrink-0">
            {/* Filter Button (Sheet) — visible on all screen sizes */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 flex flex-col">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6 overflow-y-auto flex-1">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground hidden sm:block" />
              <Select value={sortBy} onValueChange={(val) => setSortBy(val as SortOption)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low</SelectItem>
                  <SelectItem value="price-high">Price: High</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Category Quick-Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategories([])}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              selectedCategories.length === 0
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-foreground border-border hover:border-primary hover:text-primary'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => toggleCategory(cat.slug)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                selectedCategories.includes(cat.slug)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-foreground border-border hover:border-primary hover:text-primary'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results */}
        <div>
          <div className="mb-4 text-sm text-muted-foreground">
            {isLoading ? 'Loading...' : `${filteredCarriers.length} carrier${filteredCarriers.length !== 1 ? 's' : ''} found`}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[4/3] rounded-lg" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : filteredCarriers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCarriers.map((carrier, index) => (
                <div
                  key={carrier.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CarrierCard carrier={carrier} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No carriers found matching your criteria.
              </p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearAllFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

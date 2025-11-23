"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaSearch, FaTimes } from "react-icons/fa";

interface FilterOptions {
  categories: string[];
  tags: string[];
}

interface SearchFiltersProps {
  initialParams?: { q?: string; categories?: string; tags?: string };
}

export default function SearchFilters({ initialParams }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState(initialParams?.q || "");
  const [selectedCategory, setSelectedCategory] = useState(
    initialParams?.categories?.split(',')[0] || ""
  );
  const [selectedTag, setSelectedTag] = useState(
    initialParams?.tags?.split(',')[0] || ""
  );
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    categories: [],
    tags: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  async function fetchFilterOptions() {
    try {
      const response = await fetch('/api/forum/filters');
      if (response.ok) {
        const data = await response.json();
        setFilterOptions(data);
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function updateURL() {
    const params = new URLSearchParams();
    
    if (query.trim()) {
      params.set('q', query.trim());
    }
    
    if (selectedCategory.trim()) {
      params.set('categories', selectedCategory.trim());
    }
    
    if (selectedTag.trim()) {
      params.set('tags', selectedTag.trim());
    }

    const newURL = params.toString() ? `/forum?${params.toString()}` : '/forum';
    router.push(newURL);
  }

  function clearAllFilters() {
    setQuery("");
    setSelectedCategory("");
    setSelectedTag("");
    router.push('/forum');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateURL();
  }

  const hasActiveFilters = query.trim() || selectedCategory.trim() || selectedTag.trim();

  return (
    <div className="mb-8 space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search discussions..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-6 py-4 pl-12 pr-20 focus:outline-none focus:border-primary transition"
        />
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
        >
          Search
        </button>
      </form>

      {/* Filter Options */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Categories Dropdown */}
          {filterOptions.categories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  // Auto-update URL when selection changes
                  setTimeout(() => {
                    const params = new URLSearchParams();
                    if (query.trim()) params.set('q', query.trim());
                    if (e.target.value) params.set('categories', e.target.value);
                    if (selectedTag.trim()) params.set('tags', selectedTag.trim());
                    const newURL = params.toString() ? `/forum?${params.toString()}` : '/forum';
                    router.push(newURL);
                  }, 0);
                }}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition text-white"
              >
                <option value="" className="bg-neutral-900">All Categories</option>
                {filterOptions.categories.map((category) => (
                  <option key={category} value={category} className="bg-neutral-900">
                    {category}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Tags Dropdown */}
          {filterOptions.tags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Tag</label>
              <select
                value={selectedTag}
                onChange={(e) => {
                  setSelectedTag(e.target.value);
                  // Auto-update URL when selection changes
                  setTimeout(() => {
                    const params = new URLSearchParams();
                    if (query.trim()) params.set('q', query.trim());
                    if (selectedCategory.trim()) params.set('categories', selectedCategory.trim());
                    if (e.target.value) params.set('tags', e.target.value);
                    const newURL = params.toString() ? `/forum?${params.toString()}` : '/forum';
                    router.push(newURL);
                  }, 0);
                }}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition text-white"
              >
                <option value="" className="bg-neutral-900">All Tags</option>
                {filterOptions.tags.map((tag) => (
                  <option key={tag} value={tag} className="bg-neutral-900">
                    #{tag}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <span>Active filters:</span>
            {query.trim() && (
              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                Search: "{query.trim()}"
              </span>
            )}
            {selectedCategory.trim() && (
              <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">
                {selectedCategory}
              </span>
            )}
            {selectedTag.trim() && (
              <span className="px-2 py-1 bg-accent/20 text-accent rounded text-xs">
                #{selectedTag}
              </span>
            )}
          </div>
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 px-3 py-1 text-sm text-red-400 hover:text-red-300 transition"
          >
            <FaTimes className="w-3 h-3" />
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
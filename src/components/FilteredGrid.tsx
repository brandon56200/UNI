'use client'

import { useState, useRef, useEffect } from 'react'
import { Check, ChevronsUpDown, Bookmark } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Switch } from "@/components/ui/switch"
import { useUnicorn } from '@/contexts/UnicornContext'
import { useFilter } from '@/contexts/FilterContext'

interface Unicorn {
  City: string;
  Company: string;
  Country: string;
  'Date Joined': string;
  Industry: string;
  'Select Investors': string;
  'Valuation ($B)': number;
}

// Sample cards for the carousel
const sampleCards = [
  { id: 1, title: 'Unicorn 1', description: 'An amazing startup', image: '/placeholder.svg' },
  { id: 2, title: 'Unicorn 2', description: 'Revolutionary technology', image: '/placeholder.svg' },
  { id: 3, title: 'Unicorn 3', description: 'Next-gen solution', image: '/placeholder.svg' },
  { id: 4, title: 'Unicorn 4', description: 'Innovative platform', image: '/placeholder.svg' },
  { id: 5, title: 'Unicorn 5', description: 'Disruptive service', image: '/placeholder.svg' },
  { id: 6, title: 'Unicorn 6', description: 'AI-powered analytics', image: '/placeholder.svg' },
  { id: 7, title: 'Unicorn 7', description: 'Blockchain innovation', image: '/placeholder.svg' },
  { id: 8, title: 'Unicorn 8', description: 'Cloud computing solution', image: '/placeholder.svg' },
  { id: 9, title: 'Unicorn 9', description: 'E-commerce platform', image: '/placeholder.svg' },
  { id: 10, title: 'Unicorn 10', description: 'Healthcare technology', image: '/placeholder.svg' },
  { id: 11, title: 'Unicorn 11', description: 'Sustainable energy', image: '/placeholder.svg' },
  { id: 12, title: 'Unicorn 12', description: 'Quantum computing', image: '/placeholder.svg' },
  { id: 13, title: 'Unicorn 13', description: 'Smart city solutions', image: '/placeholder.svg' },
  { id: 14, title: 'Unicorn 14', description: 'Cybersecurity platform', image: '/placeholder.svg' },
  { id: 15, title: 'Unicorn 15', description: 'Fintech revolution', image: '/placeholder.svg' },
  { id: 16, title: 'Unicorn 16', description: 'AR/VR experiences', image: '/placeholder.svg' },
  { id: 17, title: 'Unicorn 17', description: 'IoT innovations', image: '/placeholder.svg' },
  { id: 18, title: 'Unicorn 18', description: 'Machine learning tools', image: '/placeholder.svg' },
  { id: 19, title: 'Unicorn 19', description: 'Autonomous vehicle tech', image: '/placeholder.svg' },
  { id: 20, title: 'Unicorn 20', description: 'Space technology', image: '/placeholder.svg' },
]

type FilterOption = {
  label: string
  value: string
}

// Function to display the selected filter labels
const getSelectedLabels = (options: FilterOption[], selectedValues: string[]) => {
  if (selectedValues.length === 0) return 'Select...'
  if (selectedValues.length === 1) {
    return options.find(option => option.value === selectedValues[0])?.label
  }
  return `${selectedValues.length} selected`
}

// MultiSelect Filter Component
const MultiSelect = ({ 
  options, 
  selectedValues, 
  onSelect, 
  isOpen, 
  setIsOpen, 
  placeholder 
}: { 
  options: FilterOption[], 
  selectedValues: string[], 
  onSelect: (value: string) => void, 
  isOpen: boolean, 
  setIsOpen: (open: boolean) => void, 
  placeholder: string 
}) => {
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="justify-between w-[170px] border-neutral-950 text-neutral-950 hover:bg-gray-100 transition-colors"
        >
          <span className="truncate max-w-[120px] mr-2 overflow-hidden">
            {getSelectedLabels(options, selectedValues)}
          </span>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-neutral-950 shadow-md border-0 rounded-md text-neutral-50">
        <Command className="rounded-md bg-neutral-950">
          <CommandInput placeholder={placeholder} className="rounded-t-md text-neutral-50" />
          <CommandEmpty className="text-neutral-50">No results found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => onSelect(option.value)}
                className="flex items-center p-2 cursor-pointer text-neutral-50 hover:bg-neutral-900"
              >
                <div className="flex items-center gap-2 w-full">
                  <Checkbox 
                    checked={selectedValues.includes(option.value)} 
                    className="border-neutral-50 data-[state=checked]:bg-white data-[state=checked]:text-neutral-950"
                  />
                  <span className="ml-2 flex-grow">{option.label}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// Unicorn Card Component
const UnicornCard = ({ unicorn }: { unicorn: Unicorn }) => {
  const { savedUnicorns, addUnicorn, removeUnicorn } = useUnicorn();
  const isSaved = savedUnicorns?.includes(unicorn.Company);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleBookmarkClick = () => {
    setIsAnimating(true);
    if (isSaved) {
      removeUnicorn(unicorn.Company);
    } else {
      addUnicorn(unicorn.Company);
    }
    // Reset animation state after animation completes
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="relative p-[2px] rounded-lg overflow-hidden bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 animate-gradient shadow-lg h-[220px]">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 animate-gradient"></div>
      <Card className="h-full flex flex-col relative bg-white z-10 border-none shadow-md rounded-lg">
        <CardHeader className="pb-0 pt-0 relative">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold line-clamp-1 mb-0" style={{ fontFamily: 'var(--font-geist-sans)' }}>{unicorn.Company || 'Unnamed Company'}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="p-0 h-8 w-8 hover:bg-transparent"
              onClick={handleBookmarkClick}
            >
              <div className={cn(
                "relative rounded-full p-[2px]",
                isSaved && "bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 animate-gradient"
              )}>
                <Bookmark
                  className={cn(
                    "h-5 w-5 transition-all duration-300",
                    isAnimating && "scale-110",
                    isSaved 
                      ? "fill-white stroke-none"
                      : "stroke-[2.5px] stroke-black fill-none"
                  )}
                />
              </div>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden -mt-4">
          <div className="space-y-0.5 text-xs text-gray-500 h-[160px] overflow-y-auto">
            <p><span className="font-bold">Founded:</span> {new Date(unicorn['Date Joined']).getFullYear() || 'N/A'}</p>
            <p><span className="font-bold">Valuation:</span> {unicorn['Valuation ($B)'] ? `$${unicorn['Valuation ($B)']}B` : 'N/A'}</p>
            <p><span className="font-bold">Location:</span> {unicorn.City || 'N/A'}</p>
            <p><span className="font-bold">Country:</span> {unicorn.Country || 'N/A'}</p>
            <p><span className="font-bold">Industry:</span> {unicorn.Industry || 'N/A'}</p>
            {unicorn['Select Investors'] && (
              <p><span className="font-bold">Investors:</span> {unicorn['Select Investors']}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Add animation keyframes for the gradient
const gradientAnimation = `
@keyframes gradient {
  0% { background-position: 0% 50%; }
  25% { background-position: 100% 75%; }
  50% { background-position: 50% 100%; }
  75% { background-position: 0% 75%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient {
  background-size: 300% 300%;
  animation: gradient 4s ease-in-out infinite;
}

/* Custom carousel styles */
.carousel-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 1rem;
  height: 650px; /* Adjust based on your card height */
}

.carousel-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 1rem;
}
`;

export default function FilteredGrid() {
  // State for open/closed popovers
  const [cityOpen, setCityOpen] = useState(false)
  const [industryOpen, setIndustryOpen] = useState(false)
  const [investorOpen, setInvestorOpen] = useState(false)

  // Get filter state from context
  const { 
    selectedCities, 
    selectedIndustries, 
    selectedInvestors,
    setSelectedCities,
    setSelectedIndustries,
    setSelectedInvestors,
    clearAllFilters
  } = useFilter()

  // State for unicorns data
  const [allUnicorns, setAllUnicorns] = useState<Unicorn[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDataReady, setIsDataReady] = useState(false)

  // State for filter options
  const [cityOptions, setCityOptions] = useState<FilterOption[]>([])
  const [industryOptions, setIndustryOptions] = useState<FilterOption[]>([])
  const [investorOptions, setInvestorOptions] = useState<FilterOption[]>([])

  const [showContent, setShowContent] = useState(false)
  const { savedUnicorns, showFavorites, setShowFavorites } = useUnicorn()

  // Fetch unicorns data on component mount
  useEffect(() => {
    const loadData = async () => {
      // If we already have data, don't reload
      if (allUnicorns.length > 0) {
        setIsLoading(false);
        setIsDataReady(true);
        setShowContent(true);
        return;
      }

      try {
        const response = await fetch('/api/unicorns?limit=500');
        if (!response.ok) {
          throw new Error('Failed to fetch unicorns');
        }
        const data = await response.json();
        
        if (!data.unicorns) {
          throw new Error('Invalid response format');
        }
        
        // Set all unicorns data
        setAllUnicorns(data.unicorns);
        
        // Extract unique values for each filter
        const cities = new Set<string>();
        const industries = new Set<string>();
        const investors = new Set<string>();

        data.unicorns.forEach((unicorn: Unicorn) => {
          if (unicorn.City) cities.add(unicorn.City);
          if (unicorn.Industry) industries.add(unicorn.Industry);
          if (unicorn['Select Investors']) {
            unicorn['Select Investors'].split(', ').forEach(investor => investors.add(investor));
          }
        });

        // Create and set filter options
        const cityOpts = Array.from(cities).sort().map(city => ({ label: city, value: city }));
        const industryOpts = Array.from(industries).sort().map(industry => ({ label: industry, value: industry }));
        const investorOpts = Array.from(investors).sort().map(investor => ({ label: investor, value: investor }));

        setCityOptions(cityOpts);
        setIndustryOptions(industryOpts);
        setInvestorOptions(investorOpts);

        setIsLoading(false);
        setIsDataReady(true);
        setShowContent(true);
      } catch (error) {
        console.error('Error loading unicorns:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter unicorns based on selected filters and favorites
  const filteredUnicorns = allUnicorns.filter(unicorn => {
    // If favorites is enabled, only show saved unicorns
    if (showFavorites) {
      if (!savedUnicorns?.includes(unicorn.Company)) return false;
    }

    // If no filters are selected, show all unicorns (or saved ones if favorites is enabled)
    if (selectedCities.length === 0 && selectedIndustries.length === 0 && selectedInvestors.length === 0) {
      return true;
    }

    // Check each filter
    if (selectedCities.length > 0 && !selectedCities.includes(unicorn.City)) {
      return false;
    }
    if (selectedIndustries.length > 0 && !selectedIndustries.includes(unicorn.Industry)) {
      return false;
    }
    if (selectedInvestors.length > 0) {
      const unicornInvestors = unicorn['Select Investors']?.split(', ') || [];
      const hasMatchingInvestor = unicornInvestors.some(investor =>
        selectedInvestors.includes(investor)
      );
      if (!hasMatchingInvestor) return false;
    }
    return true;
  });

  // Log current state for debugging
  useEffect(() => {
    if (isDataReady) {
      console.log('Current state:', {
        allUnicorns: allUnicorns,
        totalUnicorns: allUnicorns.length,
        filteredCount: filteredUnicorns.length,
        cityOptions,
        industryOptions,
        investorOptions,
        selectedCities,
        selectedIndustries,
        selectedInvestors
      });
    }
  }, [allUnicorns, filteredUnicorns, cityOptions, industryOptions, investorOptions, selectedCities, selectedIndustries, selectedInvestors, isDataReady]);

  // Update localStorage when filters change
  useEffect(() => {
    localStorage.setItem('selectedCities', JSON.stringify(selectedCities));
  }, [selectedCities]);

  useEffect(() => {
    localStorage.setItem('selectedIndustries', JSON.stringify(selectedIndustries));
  }, [selectedIndustries]);

  useEffect(() => {
    localStorage.setItem('selectedInvestors', JSON.stringify(selectedInvestors));
  }, [selectedInvestors]);

  const handleCitySelect = (value: string) => {
    setSelectedCities(
      selectedCities.includes(value)
        ? selectedCities.filter(item => item !== value)
        : [...selectedCities, value]
    )
  }

  const handleIndustrySelect = (value: string) => {
    setSelectedIndustries(
      selectedIndustries.includes(value)
        ? selectedIndustries.filter(item => item !== value)
        : [...selectedIndustries, value]
    )
  }

  const handleInvestorSelect = (value: string) => {
    setSelectedInvestors(
      selectedInvestors.includes(value)
        ? selectedInvestors.filter(item => item !== value)
        : [...selectedInvestors, value]
    )
  }

  // Clear all filters using context
  const handleClearAll = () => {
    clearAllFilters()
    setShowFavorites(false)
  }

  // Add the animation to the document
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = gradientAnimation;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  if (isLoading) {
    return <div className="min-h-[400px] bg-white" />;
  }

  if (!isDataReady || allUnicorns.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No data available.</p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {showContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="container mx-auto px-4 pt-6 pb-6 flex flex-col items-center justify-start min-h-[calc(100vh-4rem)]"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="backdrop-blur-md bg-white/30 rounded-lg shadow-lg p-4 mb-12 border border-white/20 w-full max-w-7xl"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-900">Filter Unicorns</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  handleClearAll();
                  setShowFavorites(false);
                }}
                disabled={selectedCities.length === 0 && selectedIndustries.length === 0 && selectedInvestors.length === 0 && !showFavorites}
                className="text-xs bg-neutral-800 hover:bg-neutral-700 text-white border-none disabled:bg-neutral-300 disabled:text-neutral-500"
              >
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1">
                <Label className="text-sm font-medium text-gray-700 whitespace-nowrap">City:</Label>
                <MultiSelect
                  options={cityOptions}
                  selectedValues={selectedCities}
                  onSelect={handleCitySelect}
                  isOpen={cityOpen}
                  setIsOpen={setCityOpen}
                  placeholder="Select cities..."
                />
              </div>
              <div className="flex items-center gap-1">
                <Label className="text-sm font-medium text-gray-700 whitespace-nowrap">Industry:</Label>
                <MultiSelect
                  options={industryOptions}
                  selectedValues={selectedIndustries}
                  onSelect={handleIndustrySelect}
                  isOpen={industryOpen}
                  setIsOpen={setIndustryOpen}
                  placeholder="Select industries..."
                />
              </div>
              <div className="flex items-center gap-1">
                <Label className="text-sm font-medium text-gray-700 whitespace-nowrap">Investors:</Label>
                <MultiSelect
                  options={investorOptions}
                  selectedValues={selectedInvestors}
                  onSelect={handleInvestorSelect}
                  isOpen={investorOpen}
                  setIsOpen={setInvestorOpen}
                  placeholder="Select investors..."
                />
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <Label htmlFor="favorites" className="text-sm font-medium text-gray-700">Favorites</Label>
                <Switch
                  id="favorites"
                  checked={showFavorites}
                  onCheckedChange={setShowFavorites}
                  className="data-[state=checked]:bg-neutral-800 data-[state=unchecked]:bg-white data-[state=unchecked]:border-2 data-[state=unchecked]:border-neutral-300 [&>span]:bg-neutral-300 data-[state=checked]:[&>span]:bg-white"
                />
              </div>
            </div>
          </motion.div>

          {filteredUnicorns.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="space-y-12 w-full max-w-7xl"
            >
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-4">
                  {Array.from({ length: Math.ceil(filteredUnicorns.length / 6) }).map((_, pageIndex) => (
                    <CarouselItem key={pageIndex} className="pl-4 basis-full">
                      <div className="grid grid-cols-3 gap-4">
                        {filteredUnicorns.slice(pageIndex * 6, (pageIndex + 1) * 6).map((unicorn, index) => (
                          <div key={`${unicorn.City}-${index}`} className="h-[220px]">
                            <UnicornCard unicorn={unicorn} />
                          </div>
                        ))}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex items-center justify-center mt-12">
                  <CarouselPrevious className="relative static mr-2" />
                  <CarouselNext className="relative static ml-2" />
                </div>
              </Carousel>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="text-center py-6 w-full max-w-7xl"
            >
              <p className="text-gray-500">No unicorns found matching the selected filters.</p>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
} 
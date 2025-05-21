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
import { useUnicorns } from '@/contexts/UnicornsContext'

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
          className="justify-between w-[170px] xl:w-[200px] 2xl:w-[250px] 3xl:w-[300px] 4xl:w-[350px] 5xl:w-[400px] 6xl:w-[450px] border-neutral-950 text-neutral-950 hover:bg-gray-100 transition-colors"
        >
          <span className="truncate max-w-[120px] xl:max-w-[150px] 2xl:max-w-[200px] 3xl:max-w-[250px] 4xl:max-w-[300px] 5xl:max-w-[350px] 6xl:max-w-[400px] mr-2 overflow-hidden">
            {getSelectedLabels(options, selectedValues)}
          </span>
          <ChevronsUpDown className="ml-auto h-4 w-4 xl:h-5 xl:w-5 2xl:h-6 2xl:w-6 3xl:h-7 3xl:w-7 4xl:h-8 4xl:w-8 5xl:h-9 5xl:w-9 6xl:h-10 6xl:w-10 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] xl:w-[250px] 2xl:w-[300px] 3xl:w-[350px] 4xl:w-[400px] 5xl:w-[450px] 6xl:w-[500px] p-0 bg-neutral-950 shadow-md border-0 rounded-md text-neutral-50">
        <Command className="rounded-md bg-neutral-950">
          <CommandInput placeholder={placeholder} className="rounded-t-md text-neutral-50 xl:text-lg 2xl:text-xl 3xl:text-2xl 4xl:text-3xl 5xl:text-4xl 6xl:text-5xl" />
          <CommandEmpty className="text-neutral-50 xl:text-lg 2xl:text-xl 3xl:text-2xl 4xl:text-3xl 5xl:text-4xl 6xl:text-5xl">No results found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] xl:max-h-[400px] 2xl:max-h-[500px] 3xl:max-h-[600px] 4xl:max-h-[700px] 5xl:max-h-[800px] 6xl:max-h-[900px] overflow-y-auto">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => onSelect(option.value)}
                className="flex items-center p-2 xl:p-3 2xl:p-4 3xl:p-5 4xl:p-6 5xl:p-7 6xl:p-8 cursor-pointer text-neutral-50 hover:bg-neutral-900"
              >
                <div className="flex items-center gap-2 w-full">
                  <Checkbox 
                    checked={selectedValues.includes(option.value)} 
                    className="border-neutral-50 data-[state=checked]:bg-white data-[state=checked]:text-neutral-950 xl:scale-110 2xl:scale-125 3xl:scale-150 4xl:scale-175 5xl:scale-200 6xl:scale-225"
                  />
                  <span className="ml-2 flex-grow xl:text-lg 2xl:text-xl 3xl:text-2xl 4xl:text-3xl 5xl:text-4xl 6xl:text-5xl">{option.label}</span>
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
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="relative p-[2px] rounded-lg overflow-hidden bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 animate-gradient shadow-lg h-[220px] xl:h-[220px] 2xl:h-[255px] 3xl:h-[285px] 4xl:h-[320px] 5xl:h-[360px] 6xl:h-[400px]">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 animate-gradient"></div>
      <Card className="h-full flex flex-col relative bg-white z-10 border-none shadow-md rounded-lg">
        <CardHeader className="pb-0 pt-0 relative">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base xl:text-base 2xl:text-lg 3xl:text-xl 4xl:text-2xl 5xl:text-3xl 6xl:text-4xl font-semibold line-clamp-1 mb-0" style={{ fontFamily: 'var(--font-geist-sans)' }}>{unicorn.Company || 'Unnamed Company'}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="p-0 h-8 w-8 xl:h-8 xl:w-8 2xl:h-10 2xl:w-10 3xl:h-12 3xl:w-12 4xl:h-14 4xl:w-14 5xl:h-16 5xl:w-16 6xl:h-18 6xl:w-18 hover:bg-transparent"
              onClick={handleBookmarkClick}
            >
              <div className={cn(
                "relative rounded-full p-[2px] xl:p-[3px] 2xl:p-[3px] 3xl:p-[4px] 4xl:p-[5px] 5xl:p-[6px] 6xl:p-[7px]",
                isSaved && "bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 animate-gradient"
              )}>
                <Bookmark
                  className={cn(
                    "h-5 w-5 xl:h-5 xl:w-5 2xl:h-6 2xl:w-6 3xl:h-7 3xl:w-7 4xl:h-8 4xl:w-8 5xl:h-9 5xl:w-9 6xl:h-10 6xl:w-10 transition-all duration-300",
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
          <div className="space-y-0.5 text-xs xl:text-xs 2xl:text-sm 3xl:text-base 4xl:text-lg 5xl:text-xl 6xl:text-2xl text-gray-500 h-[160px] xl:h-[160px] 2xl:h-[190px] 3xl:h-[215px] 4xl:h-[250px] 5xl:h-[290px] 6xl:h-[330px] overflow-y-auto">
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

export default function FilteredGrid() {
  console.log('🎨 FilteredGrid component rendering...')
  
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

  // Get unicorns data from context
  const { 
    allUnicorns,
    isLoading,
    isDataReady,
    cityOptions,
    industryOptions,
    investorOptions
  } = useUnicorns()

  const [showContent, setShowContent] = useState(false)
  const { savedUnicorns, showFavorites, setShowFavorites } = useUnicorn()

  // Show content when data is ready
  useEffect(() => {
    if (isDataReady) {
      console.log('🎯 FilteredGrid: Data is ready, showing content')
      setShowContent(true)
    }
  }, [isDataReady])

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

  if (isLoading) {
    console.log('⏳ FilteredGrid: Still loading...')
    return <div className="min-h-[400px] bg-white" />
  }

  if (!isDataReady || allUnicorns.length === 0) {
    console.log('❌ FilteredGrid: No data available')
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No data available.</p>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      {showContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full px-4 pt-6 pb-6 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] xl:min-h-[calc(100vh-4rem)] 2xl:min-h-[calc(100vh-8rem)] 2xl:mt-0 max-w-7xl xl:max-w-7xl 2xl:max-w-[85%] translate-y-[-2.5%] xl:translate-y-[-2.5%] 2xl:translate-y-[-2.5%] 3xl:translate-y-[-2.5%] 4xl:translate-y-[-2.5%] 5xl:translate-y-[-2.5%] 6xl:translate-y-[-2.5%]"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="backdrop-blur-md bg-white/30 rounded-lg shadow-lg p-4 xl:p-5 2xl:p-6 3xl:p-7 4xl:p-8 5xl:p-9 6xl:p-10 mb-12 border border-white/20 w-full 2xl:mt-8 3xl:mt-12 4xl:mt-16 5xl:mt-20 6xl:mt-24"
          >
            <div className="flex items-center justify-between mb-2 xl:mb-3 2xl:mb-4 3xl:mb-5 4xl:mb-6 5xl:mb-7 6xl:mb-8">
              <h2 className="text-lg xl:text-lg 2xl:text-2xl 3xl:text-3xl 4xl:text-4xl 5xl:text-5xl 6xl:text-6xl font-semibold text-gray-900">Filter Unicorns</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  handleClearAll();
                  setShowFavorites(false);
                }}
                disabled={selectedCities.length === 0 && selectedIndustries.length === 0 && selectedInvestors.length === 0 && !showFavorites}
                className="text-xs xl:text-sm 2xl:text-base 3xl:text-lg 4xl:text-xl 5xl:text-2xl 6xl:text-3xl bg-neutral-800 hover:bg-neutral-700 text-white border-none disabled:bg-neutral-300 disabled:text-neutral-500 xl:py-2 xl:px-4 2xl:py-2.5 2xl:px-5 3xl:py-3 3xl:px-6 4xl:py-3.5 4xl:px-7 5xl:py-4 5xl:px-8 6xl:py-4.5 6xl:px-9"
              >
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-4 xl:gap-4 2xl:gap-6 3xl:gap-8 4xl:gap-10 5xl:gap-12 6xl:gap-14">
              <div className="flex items-center gap-1 xl:gap-2 2xl:gap-3 3xl:gap-4 4xl:gap-5 5xl:gap-6 6xl:gap-7">
                <Label className="text-sm xl:text-sm 2xl:text-base 3xl:text-lg 4xl:text-xl 5xl:text-2xl 6xl:text-3xl font-medium text-gray-700 whitespace-nowrap">City:</Label>
                <MultiSelect
                  options={cityOptions}
                  selectedValues={selectedCities}
                  onSelect={handleCitySelect}
                  isOpen={cityOpen}
                  setIsOpen={setCityOpen}
                  placeholder="Select cities..."
                />
              </div>
              <div className="flex items-center gap-1 xl:gap-2 2xl:gap-3 3xl:gap-4 4xl:gap-5 5xl:gap-6 6xl:gap-7">
                <Label className="text-sm xl:text-sm 2xl:text-base 3xl:text-lg 4xl:text-xl 5xl:text-2xl 6xl:text-3xl font-medium text-gray-700 whitespace-nowrap">Industry:</Label>
                <MultiSelect
                  options={industryOptions}
                  selectedValues={selectedIndustries}
                  onSelect={handleIndustrySelect}
                  isOpen={industryOpen}
                  setIsOpen={setIndustryOpen}
                  placeholder="Select industries..."
                />
              </div>
              <div className="flex items-center gap-1 xl:gap-2 2xl:gap-3 3xl:gap-4 4xl:gap-5 5xl:gap-6 6xl:gap-7">
                <Label className="text-sm xl:text-sm 2xl:text-base 3xl:text-lg 4xl:text-xl 5xl:text-2xl 6xl:text-3xl font-medium text-gray-700 whitespace-nowrap">Investors:</Label>
                <MultiSelect
                  options={investorOptions}
                  selectedValues={selectedInvestors}
                  onSelect={handleInvestorSelect}
                  isOpen={investorOpen}
                  setIsOpen={setInvestorOpen}
                  placeholder="Select investors..."
                />
              </div>
              <div className="flex items-center gap-2 xl:gap-2 2xl:gap-3 3xl:gap-4 4xl:gap-5 5xl:gap-6 6xl:gap-7 ml-auto">
                <Label htmlFor="favorites" className="text-sm xl:text-sm 2xl:text-base 3xl:text-lg 4xl:text-xl 5xl:text-2xl 6xl:text-3xl font-medium text-gray-700">Favorites</Label>
                <Switch
                  checked={showFavorites}
                  onCheckedChange={setShowFavorites}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500 data-[state=unchecked]:bg-gray-200 [&>span]:bg-white xl:scale-100 2xl:scale-110 3xl:scale-125 4xl:scale-150 5xl:scale-175 6xl:scale-200"
                  style={{
                    backgroundSize: '200% 100%',
                    backgroundPosition: showFavorites ? '5% 50%' : '100% 50%',
                    transition: 'background-position 1s ease-in-out'
                  }}
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
              className="space-y-12 w-full"
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
                      <AnimatePresence mode="wait">
                        <div className="grid grid-cols-3 gap-4 xl:gap-6 2xl:gap-8">
                          {filteredUnicorns.slice(
                            pageIndex * 6,
                            (pageIndex + 1) * 6
                          ).map((unicorn, index) => (
                            <motion.div
                              key={`${unicorn.City}-${index}`}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className="h-[220px] xl:h-[220px] 2xl:h-[255px] 3xl:h-[285px] 4xl:h-[320px] 5xl:h-[360px] 6xl:h-[400px]"
                            >
                              <UnicornCard unicorn={unicorn} />
                            </motion.div>
                          ))}
                        </div>
                      </AnimatePresence>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex items-center justify-center mt-8 xl:mt-16 2xl:mt-16">
                  <CarouselPrevious className="relative static mr-8 xl:mr-12 2xl:mr-16 xl:scale-110 2xl:scale-125 3xl:scale-150 4xl:scale-175 5xl:scale-200 6xl:scale-225 hover:bg-black hover:text-white transition-colors duration-300" />
                  <CarouselNext className="relative static ml-8 xl:ml-12 2xl:ml-16 xl:scale-110 2xl:scale-125 3xl:scale-150 4xl:scale-175 5xl:scale-200 6xl:scale-225 hover:bg-black hover:text-white transition-colors duration-300" />
                </div>
              </Carousel>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="text-center py-6 w-full"
            >
              <p className="text-gray-500 xl:text-lg 2xl:text-2xl">No unicorns found matching the selected filters.</p>
            </motion.div>
          )}

          {/* Debug Screen Size Indicator */}
          <div className="fixed bottom-4 right-4 z-50">
            <div className="hidden sm:block md:hidden">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold p-2">S</div>
            </div>
            <div className="hidden md:block lg:hidden">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold p-2">M</div>
            </div>
            <div className="hidden lg:block xl:hidden">
              <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold p-2">L</div>
            </div>
            <div className="hidden xl:block 2xl:hidden">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold p-2">XL</div>
            </div>
            <div className="hidden 2xl:block 3xl:hidden">
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold p-2">2XL</div>
            </div>
            <div className="hidden 3xl:block 4xl:hidden">
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold p-2">3XL</div>
            </div>
            <div className="hidden 4xl:block 5xl:hidden">
              <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold p-2">4XL</div>
            </div>
            <div className="hidden 5xl:block 6xl:hidden">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold p-2">5XL</div>
            </div>
            <div className="hidden 6xl:block">
              <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold p-2">6XL</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 
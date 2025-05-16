'use client'

import { useState, useRef, useEffect } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { motion } from 'framer-motion'
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

// Filter options
const cities = [
  { label: 'San Francisco', value: 'sf' },
  { label: 'New York', value: 'nyc' },
  { label: 'London', value: 'london' },
]

const industries = [
  { label: 'Enterprise Tech', value: 'enterprise-tech' },
  { label: 'Financial Services', value: 'financial-services' },
]

const investors = [
  { label: 'Sequoia Capital', value: 'sequoia' },
  { label: 'Google', value: 'google' },
]

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
          <CommandGroup>
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
const UnicornCard = ({ title, description }: { title: string, description: string }) => (
  <div className="relative p-[2px] rounded-lg overflow-hidden bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 animate-gradient shadow-lg">
    <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 animate-gradient"></div>
    <Card className="h-full flex flex-col relative bg-white z-10 border-none shadow-md rounded-lg">
      <CardHeader className="pb-1 pt-1">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden py-1">
        <p className="text-xs text-gray-600">{description}</p>
      </CardContent>
      <CardFooter className="mt-auto pt-1 pb-1">
        <Button size="sm" className="text-xs py-0.5 h-7">View Details</Button>
      </CardFooter>
    </Card>
  </div>
)

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
`;

export default function FilteredGrid() {
  // State for selected filters
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
  const [selectedInvestors, setSelectedInvestors] = useState<string[]>([])
  
  // State for open/closed popovers
  const [cityOpen, setCityOpen] = useState(false)
  const [industryOpen, setIndustryOpen] = useState(false)
  const [investorOpen, setInvestorOpen] = useState(false)

  const handleCitySelect = (value: string) => {
    setSelectedCities(current => 
      current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value]
    )
  }

  const handleIndustrySelect = (value: string) => {
    setSelectedIndustries(current => 
      current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value]
    )
  }

  const handleInvestorSelect = (value: string) => {
    setSelectedInvestors(current => 
      current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value]
    )
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

  return (
    <div className="flex items-center justify-center h-full w-full overflow-hidden max-h-screen">
      <motion.div
        className="w-full grid grid-rows-[auto_1fr_1fr] gap-10 h-full max-h-[95vh] pt-8 pb-4 overflow-hidden"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Filter Bar (Row 1 - smaller) */}
        <motion.div 
          className="bg-neutral-50 py-4 px-10 rounded-lg shadow-sm flex flex-wrap gap-3 items-center justify-between mb-2 mt-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ 
            duration: 0.4, 
            delay: 0.2, 
            exit: { delay: 0.4 }
          }}
        >
          <div className="font-medium">Filter By:</div>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-500">City:</span>
              <MultiSelect
                options={cities}
                selectedValues={selectedCities}
                onSelect={handleCitySelect}
                isOpen={cityOpen}
                setIsOpen={setCityOpen}
                placeholder="Search cities..."
              />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-500">Industry:</span>
              <MultiSelect
                options={industries}
                selectedValues={selectedIndustries}
                onSelect={handleIndustrySelect}
                isOpen={industryOpen}
                setIsOpen={setIndustryOpen}
                placeholder="Search industries..."
              />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-500">Investors:</span>
              <MultiSelect
                options={investors}
                selectedValues={selectedInvestors}
                onSelect={handleInvestorSelect}
                isOpen={investorOpen}
                setIsOpen={setInvestorOpen}
                placeholder="Search investors..."
              />
            </div>
          </div>
          
          <div className="ml-auto">
            <Button 
              variant="default"
              onClick={() => {
                setSelectedCities([])
                setSelectedIndustries([])
                setSelectedInvestors([])
              }}
              size="sm"
              className="text-sm font-medium bg-neutral-950 text-neutral-50 hover:bg-neutral-900 transition-colors"
              disabled={selectedCities.length === 0 && selectedIndustries.length === 0 && selectedInvestors.length === 0}
            >
              Clear All
            </Button>
          </div>
        </motion.div>

        {/* Carousel 1 (Row 2) - Middle row */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: 0.3,
            exit: { delay: 0.2 }
          }}
          className="relative flex flex-col mb-0 overflow-hidden"
        >
          <h2 className="text-lg font-semibold mb-1">Featured Unicorns</h2>
          <div className="relative mx-auto max-w-5xl overflow-visible px-16">
            <div className="relative">
              <Carousel
                className="w-full relative"
                opts={{
                  align: "start",
                  slidesToScroll: 1,
                }}
              >
                <CarouselContent className="-ml-6">
                  {sampleCards.map((card) => (
                    <CarouselItem key={card.id} className="pl-6 md:basis-1/3 flex-grow-0 flex-shrink-0">
                      <div className="p-4 h-full">
                        <UnicornCard title={card.title} description={card.description} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="bg-white border-2 border-neutral-300 shadow-md -left-16 top-1/2 z-10 size-10" />
                <CarouselNext className="bg-white border-2 border-neutral-300 shadow-md -right-16 top-1/2 z-10 size-10" />
              </Carousel>
            </div>
          </div>
        </motion.div>

        {/* Carousel 2 (Row 3) - Bottom row */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: 0.4,
            exit: { delay: 0 }
          }}
          className="relative flex flex-col overflow-hidden mt-[-24px]"
        >
          <h2 className="text-lg font-semibold mb-1">Trending Unicorns</h2>
          <div className="relative mx-auto max-w-5xl overflow-visible px-16">
            <div className="relative">
              <Carousel
                className="w-full relative"
                opts={{
                  align: "start",
                  slidesToScroll: 1,
                }}
              >
                <CarouselContent className="-ml-6">
                  {sampleCards.map((card) => (
                    <CarouselItem key={card.id} className="pl-6 md:basis-1/3 flex-grow-0 flex-shrink-0">
                      <div className="p-4 h-full">
                        <UnicornCard title={card.title} description={card.description} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="bg-white border-2 border-neutral-300 shadow-md -left-16 top-1/2 z-10 size-10" />
                <CarouselNext className="bg-white border-2 border-neutral-300 shadow-md -right-16 top-1/2 z-10 size-10" />
              </Carousel>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
} 
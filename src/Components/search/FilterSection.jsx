import React, { useState } from 'react';
import { Filter} from 'lucide-react';
import Button from '../common/Button';
import Select from '../common/Select';

// FilterSection Component
const FilterSection = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    departureTime: '',
    busType: [],
    amenities: []
  });

  const busTypes = [
    { label: 'All Types', value: 'all' },
    { label: 'Standard', value: 'standard' },
    { label: 'Luxury', value: 'luxury' },
    { label: 'Sleeper', value: 'sleeper' }
  ];

  const amenitiesList = [
    'WiFi',
    'USB Charging',
    'Air Conditioning',
    'Snacks',
    'Toilet'
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    onFilter({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Filter className="text-gray-500" />
      </div>

      <div className="space-y-4">
        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium mb-2">Price Range</label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="0"
              max="1000"
              value={filters.priceRange[1]}
              onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
              className="w-full"
            />
            <span className="text-sm text-gray-600">
              ${filters.priceRange[0]} - ${filters.priceRange[1]}
            </span>
          </div>
        </div>

        {/* Departure Time */}
        <div>
          <label className="block text-sm font-medium mb-2">Departure Time</label>
          <Select
            options={[
              { label: 'Any Time', value: 'any' },
              { label: 'Morning (6AM-12PM)', value: 'morning' },
              { label: 'Afternoon (12PM-6PM)', value: 'afternoon' },
              { label: 'Night (6PM-6AM)', value: 'night' }
            ]}
            value={filters.departureTime}
            onChange={(e) => handleFilterChange('departureTime', e.target.value)}
          />
        </div>

        {/* Bus Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Bus Type</label>
          <Select
            options={busTypes}
            value={filters.busType}
            onChange={(e) => handleFilterChange('busType', e.target.value)}
          />
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium mb-2">Amenities</label>
          <div className="space-y-2">
            {amenitiesList.map((amenity) => (
              <label key={amenity} className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  checked={filters.amenities.includes(amenity)}
                  onChange={(e) => {
                    const newAmenities = e.target.checked
                      ? [...filters.amenities, amenity]
                      : filters.amenities.filter(a => a !== amenity);
                    handleFilterChange('amenities', newAmenities);
                  }}
                />
                <span className="ml-2 text-sm text-gray-600">{amenity}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <Button 
        className="w-full mt-4"
        onClick={() => onFilter(filters)}
      >
        Apply Filters
      </Button>
    </div>
  );
};



export default FilterSection;
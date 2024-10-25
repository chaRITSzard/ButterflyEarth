import React, { useState } from 'react';

const EMISSION_FACTORS = {
    "India": {
        "Transportation": 0.14,  // kgCO2/km
        "Electricity": 0.82,    // kgCO2/kWh
        "Diet": 1.25,          // kgCO2/meal
        "Waste": 0.1           // kgCO2/kg
    }
};

const Carbon = () => {
    const [inputs, setInputs] = useState({
        distance: 0,
        electricity: 0,
        waste: 0,
        meals: 0
    });

    const [results, setResults] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({
            ...prev,
            [name]: parseFloat(value) || 0
        }));
    };

    const calculateEmissions = (e) => {
        e.preventDefault();

        // Normalize inputs to yearly values
        const yearlyValues = {
            distance: inputs.distance * 365,    // daily to yearly
            electricity: inputs.electricity * 12, // monthly to yearly
            waste: inputs.waste * 52,           // weekly to yearly
            meals: inputs.meals * 365           // daily to yearly
        };

        // Calculate emissions for each category
        const transportation = (EMISSION_FACTORS.India.Transportation * yearlyValues.distance) / 1000;
        const electricity = (EMISSION_FACTORS.India.Electricity * yearlyValues.electricity) / 1000;
        const diet = (EMISSION_FACTORS.India.Diet * yearlyValues.meals) / 1000;
        const waste = (EMISSION_FACTORS.India.Waste * yearlyValues.waste) / 1000;

        // Calculate total emissions
        const total = transportation + electricity + diet + waste;

        setResults({
            transportation: transportation.toFixed(2),
            electricity: electricity.toFixed(2),
            diet: diet.toFixed(2),
            waste: waste.toFixed(2),
            total: total.toFixed(2)
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold text-center mb-6">Personal Carbon Calculator ⚠️</h1>

                <form onSubmit={calculateEmissions} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-lg font-medium mb-2">
                                    🚗 Daily commute distance (km)
                                </label>
                                <input
                                    type="range"
                                    name="distance"
                                    min="0"
                                    max="100"
                                    value={inputs.distance}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                                <span className="block text-center">{inputs.distance} km</span>
                            </div>

                            <div>
                                <label className="block text-lg font-medium mb-2">
                                    💡 Monthly electricity consumption (kWh)
                                </label>
                                <input
                                    type="range"
                                    name="electricity"
                                    min="0"
                                    max="1000"
                                    value={inputs.electricity}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                                <span className="block text-center">{inputs.electricity} kWh</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-lg font-medium mb-2">
                                    🗑️ Waste generated per week (kg)
                                </label>
                                <input
                                    type="range"
                                    name="waste"
                                    min="0"
                                    max="100"
                                    value={inputs.waste}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                                <span className="block text-center">{inputs.waste} kg</span>
                            </div>

                            <div>
                                <label className="block text-lg font-medium mb-2">
                                    🍽️ Number of meals per day
                                </label>
                                <input
                                    type="number"
                                    name="meals"
                                    min="0"
                                    value={inputs.meals}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors"
                    >
                        Calculate CO2 Emissions
                    </button>
                </form>

                {results && (
                    <div className="mt-8">
                        <h2 className="text-xl font-bold mb-4">Results</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="font-medium">Carbon Emissions by Category</h3>
                                <div className="bg-blue-50 p-4 rounded-md">
                                    🚗 Transportation: {results.transportation} tonnes CO2/year
                                </div>
                                <div className="bg-blue-50 p-4 rounded-md">
                                    💡 Electricity: {results.electricity} tonnes CO2/year
                                </div>
                                <div className="bg-blue-50 p-4 rounded-md">
                                    🍽️ Diet: {results.diet} tonnes CO2/year
                                </div>
                                <div className="bg-blue-50 p-4 rounded-md">
                                    🗑️ Waste: {results.waste} tonnes CO2/year
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium mb-4">Total Carbon Footprint</h3>
                                <div className="bg-green-50 p-4 rounded-md">
                                    🌍 Your total carbon footprint is: {results.total} tonnes CO2/year
                                </div>
                                <div className="mt-4 bg-yellow-50 p-4 rounded-md text-sm">
                                    In 2021, CO2 emissions per capita for India was 1.9 tons of CO2 per capita.
                                    Between 1972 and 2021, CO2 emissions per capita of India grew substantially
                                    from 0.39 to 1.9 tons of CO2 per capita rising at an increasing annual rate
                                    that reached a maximum of 9.41% in 2021
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Carbon;

const createTour = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/tours', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: "Test Tour With Meals",
                location: "Test Location",
                price: 1000,
                duration: "2 Days / 1 Night",
                availabilityDate: "Flexible",
                minPeople: 1,
                maxPeople: 10,
                overview: "Test overview",
                image: ["http://example.com/image.jpg"],
                meals: ["Breakfast", "Dinner"]
            }),
        });

        const data = await response.json();
        console.log('Response Status:', response.status);
        console.log('Response Data:', JSON.stringify(data, null, 2));

        if (data.success && data.data.meals && data.data.meals.length === 2) {
            console.log('SUCCESS: Meals were saved correctly!');
        } else {
            console.log('FAILURE: Meals were NOT saved correctly.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

createTour();

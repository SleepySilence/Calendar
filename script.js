document.addEventListener('DOMContentLoaded', function () {
    const monthYear = document.getElementById('month-year');
    const datesContainer = document.getElementById('dates');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    const eventInput = document.getElementById('event-text');
    const addEventButton = document.getElementById('add-event');
    const eventDetails = document.getElementById('event-details');

    const months = ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"];
    let currentDate = new Date(2025, 4); // Start with May 2025
    let events = {}; // Store events as { "YYYY-MM-DD": ["event1", "event2"] }
    let selectedDateElement = null; // Track the selected date element

    // Mouse movement background animation
    const body = document.body;
    body.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        body.style.backgroundPosition = `${50 + x * 20}% ${50 + y * 20}%`;
    });

    function generateCalendar(month, year) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Adjust for Monday start

        monthYear.textContent = `${months[month]} ${year}`;
        datesContainer.innerHTML = '';

        // Fill in the blanks for the first week
        for (let i = 0; i < startingDay; i++) {
            datesContainer.innerHTML += '<div></div>';
        }

        // Fill in the days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            const dateString = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
            const dayElement = document.createElement('div');
            dayElement.textContent = i;

            // Highlight days with events
            if (events[dateString]) {
                dayElement.classList.add('has-event');
            }

            // Add click event to select date
            dayElement.addEventListener('click', () => {
                if (selectedDateElement) {
                    selectedDateElement.classList.remove('selected'); // Deselect previous date
                }
                selectedDateElement = dayElement;
                dayElement.classList.add('selected'); // Highlight selected date

                // Show event details if the date has events
                if (events[dateString]) {
                    eventDetails.innerHTML = `
                        <p>Evenementen op ${i} ${months[month]}: ${events[dateString].join(', ')}</p>
                        <button onclick="closeEventDetails()">Sluiten</button>
                    `;
                    eventDetails.classList.add('active'); // Slide in the popup
                } else {
                    eventDetails.classList.remove('active'); // Slide out the popup
                }
            });

            datesContainer.appendChild(dayElement);
        }
    }

    // Close event details popup
    window.closeEventDetails = function () {
        eventDetails.classList.remove('active'); // Slide out the popup
    };

    // Navigation between months
    prevMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar(currentDate.getMonth(), currentDate.getFullYear());
    });

    nextMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar(currentDate.getMonth(), currentDate.getFullYear());
    });

    // Add event button
    addEventButton.addEventListener('click', () => {
        const eventText = eventInput.value.trim();
        if (eventText && selectedDateElement) {
            const date = new Date(currentDate);
            date.setDate(parseInt(selectedDateElement.textContent));
            const dateString = date.toISOString().split('T')[0];

            if (!events[dateString]) {
                events[dateString] = [];
            }
            events[dateString].push(eventText);
            selectedDateElement.classList.add('has-event');
            selectedDateElement.classList.remove('selected'); // Deselect after adding event
            eventInput.value = ''; // Clear input
            generateCalendar(currentDate.getMonth(), currentDate.getFullYear()); // Refresh calendar
        }
    });

    // Generate initial calendar
    generateCalendar(currentDate.getMonth(), currentDate.getFullYear());
});
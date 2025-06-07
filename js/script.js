// js/script.js

document.addEventListener('DOMContentLoaded', function() {

    // --- 1. "Today" Feature ---
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    const formattedToday = `${year}-${month}-${day}`;

    const allRows = document.querySelectorAll('main table tbody tr');
    let todayRow = null; // To store the row for today
    let todayWeekHeader = null; // To store the header of today's week
    let todayWeekContent = null; // To store the content div of today's week

    // Iterate through all rows to find today's row and its week container
    allRows.forEach(row => {
        if (row.dataset.date === formattedToday) {
            row.classList.add('today-row');
            todayRow = row; // Found today's row

            // Get the containing week's header and content div
            todayWeekContent = row.closest('.week-content');
            if (todayWeekContent) {
                todayWeekHeader = todayWeekContent.previousElementSibling; // The h2 is the previous sibling
            }
        }
    });

    // --- Initial State for all Week Sections (Collapse/Expand/Overflow) ---
    const allWeekContents = document.querySelectorAll('.week-content');
    const allWeekHeaders = document.querySelectorAll('.week-header');

    allWeekContents.forEach(content => {
        const header = content.previousElementSibling; // Get the associated header
        
        // Check if this is the week for "today"
        if (content === todayWeekContent) {
            // This is today's week: ensure it's expanded and visible
            if (header) header.classList.remove('collapsed'); // Remove collapsed class from header
            content.classList.remove('collapsed'); // Remove collapsed class from content
            content.classList.add('expanded'); // Add expanded class to content
            content.style.overflow = 'visible'; // Allow scrolling immediately for today's week
        } else {
            // All other weeks: ensure they are collapsed and overflow is hidden
            if (header) header.classList.add('collapsed'); // Add collapsed class to header
            content.classList.add('collapsed'); // Add collapsed class to content
            content.classList.remove('expanded'); // Ensure expanded class is not present
            content.style.overflow = 'hidden'; // Ensure overflow is hidden for collapsed state
        }
    });
    
    // --- Scroll to Today's Week ---
    // Use a slight delay to ensure layout is rendered before scrolling
    setTimeout(() => {
        if (todayWeekHeader) {
            todayWeekHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 100);


    // --- 2. "Completed" Checkbox Persistence and Styling ---
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        // Function to apply/remove completed styling
        function applyCompletedStyle(cb) {
            const td = cb.closest('td');
            const activityTd = td.previousElementSibling; // The 'Planned Activity' TD

            if (cb.checked) {
                activityTd.classList.add('completed-activity');
            } else {
                activityTd.classList.remove('completed-activity');
            }
        }

        // Load saved state from localStorage
        const savedState = localStorage.getItem(checkbox.id);
        if (savedState === 'true') {
            checkbox.checked = true;
            applyCompletedStyle(checkbox); // Apply style on load
        
        }

        // Save state and apply style when checkbox changes
        checkbox.addEventListener('change', function() {
            localStorage.setItem(this.id, this.checked);
            applyCompletedStyle(this); // Apply style on change
        });
    });

    // --- 3. Weekly Collapse/Expand Feature ---
    allWeekHeaders.forEach(header => { // Use the 'allWeekHeaders' nodeList found above
        header.addEventListener('click', function() {
            const weekContent = this.nextElementSibling; // The div.week-content right after the header
            
            // Toggle the 'collapsed' class on the header for arrow rotation
            this.classList.toggle('collapsed');

            if (weekContent.classList.contains('expanded')) {
                // Currently expanded, so collapse it
                weekContent.style.overflow = 'hidden'; // Hide overflow immediately for smooth collapse
                weekContent.classList.remove('expanded'); // Remove expanded class
                weekContent.classList.add('collapsed'); // Add collapsed class
            } else {
                // Currently collapsed, so expand it
                weekContent.classList.remove('collapsed'); // Remove collapsed class
                weekContent.classList.add('expanded'); // Add expanded class for max-height
                
                // After the transition ends, allow overflow to visible for natural scrolling
                // Use a one-time event listener for transitionend
                weekContent.addEventListener('transitionend', function handler() {
                    // Check if it's still expanded *after* the transition (user might have clicked again quickly)
                    if (weekContent.classList.contains('expanded')) {
                        weekContent.style.overflow = 'visible'; // Allow scrolling
                    }
                    weekContent.removeEventListener('transitionend', handler); // Remove listener to avoid multiple calls
                });
            }
        });
    });

    // --- 4. "Go to Today" Floating Button ---
    // Ensure the button is created only once (since DOMContentLoaded could potentially run multiple times in some edge cases)
    let goToTodayBtn = document.getElementById('goToTodayBtn');
    if (!goToTodayBtn) {
        goToTodayBtn = document.createElement('button');
        goToTodayBtn.id = 'goToTodayBtn';
        goToTodayBtn.innerHTML = '&#8982;'; // Compass icon
        goToTodayBtn.title = "Go to today's activity";
        document.body.appendChild(goToTodayBtn);

        window.addEventListener('scroll', function() {
            if (window.scrollY > 200) { // Show button after scrolling down 200px
                goToTodayBtn.style.display = 'flex'; // Use flex to center icon
            } else {
                goToTodayBtn.style.display = 'none';
            }
        });

        goToTodayBtn.addEventListener('click', function() {
            if (todayWeekHeader) {
                todayWeekHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                // Fallback: If today's week wasn't found, scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
});

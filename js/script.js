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

    allRows.forEach(row => {
        if (row.dataset.date === formattedToday) {
            row.classList.add('today-row');
            todayRow = row; // Found today's row

            // Automatically expand the week containing today's row
            const weekContent = row.closest('.week-content');
            if (weekContent) {
                weekContent.classList.remove('collapsed');
                todayWeekHeader = weekContent.previousElementSibling;
                if (todayWeekHeader && todayWeekHeader.classList.contains('week-header')) {
                    todayWeekHeader.classList.remove('collapsed');
                }
            }
        }
    });

    // If today's row wasn't found (e.g., plan is in the future), collapse all weeks by default
    if (!todayRow) {
         document.querySelectorAll('.week-content').forEach(content => {
             content.classList.add('collapsed');
             content.previousElementSibling.classList.add('collapsed');
         });
    } else {
        // --- Scroll to Today's Week ---
        // Use a slight delay to ensure layout is rendered before scrolling
        setTimeout(() => {
            if (todayWeekHeader) {
                todayWeekHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }


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
    const weekHeaders = document.querySelectorAll('.week-header');

    weekHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const weekContent = this.nextElementSibling; // The div.week-content right after the header
            
            this.classList.toggle('collapsed');
            weekContent.classList.toggle('collapsed');
        });
    });

    // --- 4. "Go to Today" Floating Button ---
    const goToTodayBtn = document.createElement('button');
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
});
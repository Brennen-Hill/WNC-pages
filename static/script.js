document.addEventListener('DOMContentLoaded', function () {
    const fadeInElements = document.querySelectorAll('.fade-in');

    fadeInElements.forEach(element => {
        element.classList.remove('visible');
        element.offsetHeight;
        element.classList.add('visible');
    });

    const logo = document.querySelector('.logo');
    const logoSpans = logo.querySelectorAll('h1 span');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const dropdownCTA = document.querySelector('.dropdown-cta .cta');
    const mainCTA = document.querySelector('.cta.main-cta');
    const header = document.querySelector('header');
    const heroSection = document.querySelector('#hero');
    const heroHeight = heroSection ? heroSection.offsetHeight : 0;
    let lastScrollTop = 0;

    logoSpans.forEach(span => {
        span.classList.add('initial-animation');

        span.addEventListener('animationend', function (event) {
            if (event.animationName === 'initialFadeIn') {
                span.style.opacity = '1';
                span.style.backgroundPosition = '0% 0%';
            }
        });
    });

    setTimeout(() => {
        logo.classList.add('hover-active');
    }, 1000);

    logo.addEventListener('mouseenter', function () {
        if (logo.classList.contains('hover-active')) {
            logoSpans.forEach(span => {
                span.style.transform = 'scale(1.1)';
                span.style.padding = '0 3px';
                span.style.backgroundPosition = '0% 0%';
            });
        }
    });

    logo.addEventListener('mouseleave', function () {
        if (logo.classList.contains('hover-active')) {
            logoSpans.forEach(span => {
                span.style.transform = 'scale(1)';
                span.style.padding = '0';
                span.style.backgroundPosition = '200% 0';
            });
        }
    });

    menuToggle.addEventListener('click', function () {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            navLinks.classList.add('inactive');
        } else {
            navLinks.classList.remove('inactive');
            navLinks.classList.add('active');
        }

        // Animate the toggle icon into an "X" shape
        menuToggle.classList.toggle('open');

        if (window.innerWidth <= 1024) {
            mainCTA.style.display = 'none';
            dropdownCTA.parentElement.style.display = 'block';
        } else {
            mainCTA.style.display = 'flex';
            dropdownCTA.parentElement.style.display = 'none';
        }
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 1024) {
            mainCTA.style.display = 'flex';
            dropdownCTA.parentElement.style.display = 'none';
            menuToggle.style.display = "none"; // Hide toggle on wide screens
        } else {
            mainCTA.style.display = 'none';
            dropdownCTA.parentElement.style.display = 'block';
            menuToggle.style.display = "flex"; // Show toggle on smaller screens
        }
    });

    if (window.innerWidth > 1024) {
        dropdownCTA.parentElement.style.display = 'none';
        menuToggle.style.display = "none"; // Hide toggle on wide screens
    } else {
        mainCTA.style.display = 'none';
        dropdownCTA.parentElement.style.display = 'block';
        menuToggle.style.display = "flex"; // Show toggle on smaller screens
    }

    // Handle the scroll behavior for the header (sticky and shadow navigation)
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            // Scrolling down, hide the navigation
            header.style.top = "-100px"; // Hide header by moving it off-screen
            if (window.innerWidth <= 1024) {
                menuToggle.style.display = "none"; // Hide toggle menu
            }
        } else {
            // Scrolling up, show the navigation with shadow if past hero section
            if (scrollTop > heroHeight) {
                header.classList.add('header-shadow');
                if (window.innerWidth <= 1024) {
                    menuToggle.style.display = "flex"; // Show toggle menu only on smaller screens
                }
            } else {
                header.classList.remove('header-shadow');
                if (window.innerWidth <= 1024) {
                    menuToggle.style.display = "flex"; // Ensure toggle menu is visible in header/hero sections
                } else {
                    menuToggle.style.display = "none"; // Hide toggle menu on wide screens
                }
            }
            header.style.top = "0"; // Show header by moving it back to the top
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    }

    // Add event listener for scrolling
    window.addEventListener('scroll', handleScroll);

    // Ensure the navigation is correctly set when the page is loaded
    handleScroll();

    // Add logic for showing/hiding toggle menu based on screen size
    window.addEventListener('resize', function () {
        if (window.innerWidth > 1024) {
            menuToggle.style.display = "none"; // Hide toggle on wide screens
        } else {
            menuToggle.style.display = "flex"; // Show toggle on smaller screens
        }
    });

    // Initial check on page load
    if (window.innerWidth > 1024) {
        menuToggle.style.display = "none"; // Hide toggle on wide screens
    } else {
        menuToggle.style.display = "flex"; // Show toggle on smaller screens
    }

    // Function to load events from the .txt file
    function loadEventsFromTxt(startIndex = 0, loadAmount = 4) {
        fetch('static/events.txt')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.text();
            })
            .then(text => {
                const events = text.split('\n').filter(line => line.trim() !== '');
                const eventsContainer = document.querySelector('.events-container');
                const endIndex = Math.min(startIndex + loadAmount, events.length);

                for (let i = startIndex; i < endIndex; i++) {
                    const eventDetails = events[i].split("|");

                    const title = eventDetails[0]?.trim() || 'No Title';
                    const date = eventDetails[1]?.trim() || 'Date not available';
                    const address = eventDetails[2]?.trim() || 'Address not available';
                    let shortDesc = eventDetails[3]?.trim() || '';
                    const fullText = eventDetails[4]?.trim() || '';

                    // Add hyperlink for 'slides' in shortDesc
                    if (shortDesc.includes('slides')) {
                        shortDesc = shortDesc.replace(
                            'slides', 
                            '<a href="https://docs.google.com/presentation/d/11Ufb5dq4S8-EYx_9250Yi0ua0ViQpRMAb7C63HZXT7A/edit?usp=sharing" target="_blank">slides</a>'
                        );
                    }

                    const eventCard = document.createElement('div');
                    eventCard.classList.add('event-card');

                    const eventDate = new Date(date);
                    const currentDate = new Date();

                    if (eventDate < currentDate) {
                        eventCard.classList.add('past-event');
                    }

                    eventCard.innerHTML = `
                        <h3>${title}</h3>
                        <p><strong>Date:</strong> ${date}</p>
                        <p><strong>Address:</strong> ${address}</p>
                        <p>${shortDesc}</p>
                        ${fullText ? `<p>${fullText}</p>` : ''}
                    `;

                    eventsContainer.appendChild(eventCard);
                }

                if (endIndex >= events.length) {
                    document.getElementById('load-more').style.display = 'none';
                }
            })
            .catch(error => console.error('Error loading events:', error));
    }

    // Load initial events
    let loadedEvents = 0;
    loadEventsFromTxt(loadedEvents, 4);
    loadedEvents += 4;

    // Load more events on button click
    document.getElementById('load-more').addEventListener('click', function () {
        loadEventsFromTxt(loadedEvents, 4);
        loadedEvents += 4;
    });

});

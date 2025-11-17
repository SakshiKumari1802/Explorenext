document.addEventListener("DOMContentLoaded", () => {
    // Sign In Modal
    const signinBtn = document.getElementById('signinBtn');
    const signinModal = document.getElementById('signinModal');
    const closeSigninModal = signinModal.querySelector('.close-modal');

    signinBtn.addEventListener('click', () => {
        signinModal.style.display = 'block';
    });

    closeSigninModal.addEventListener('click', () => {
        signinModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === signinModal) {
            signinModal.style.display = 'none';
        }
    });

    // Sign Up Modal
    const signupBtn = document.getElementById('signupBtn');
    const signupModal = document.getElementById('signupModal');
    const closeSignupModal = signupModal.querySelector('.close-modal');

    signupBtn.addEventListener('click', () => {
        signupModal.style.display = 'block';
    });

    closeSignupModal.addEventListener('click', () => {
        signupModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === signupModal) {
            signupModal.style.display = 'none';
        }
    });

    // Temperature slider display update
    const temperatureRange = document.getElementById('temperatureRange');
    const temperatureValue = document.getElementById('temperatureValue');

    if (temperatureRange && temperatureValue) {
        temperatureRange.addEventListener('input', () => {
            temperatureValue.textContent = temperatureRange.value;
        });
    }
    // Accommodation budget slider display update
    const accommodationSlider = document.getElementById('accommodationBudget');
    const accommodationValue = document.getElementById('accommodationValue');

    if (accommodationSlider && accommodationValue) {
          accommodationSlider.addEventListener('input', () => {
        accommodationValue.textContent = accommodationSlider.value;
    });
}
// Background Carousel Auto Slide
const slides = document.querySelectorAll(".carousel-slide");
let currentSlide = 0;

function showNextSlide() {
  slides[currentSlide].classList.remove("active");
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add("active");
}

setInterval(showNextSlide, 5000); // Change image every 5 seconds


    // Form submission to backend
    const form = document.getElementById('preferencesForm');
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsContent = document.getElementById('resultsContent');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const getCheckboxValues = (name) => 
            Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(cb => cb.value);

        const data = {
            continent: form.continent.value,
            destinationType: getCheckboxValues("destinationType"),
            temperatureRange: form.temperatureRange.value,
            weatherType: getCheckboxValues("weatherType"),
            tripPurpose: form.tripPurpose.value,
            activities: getCheckboxValues("activities"),
            totalBudget: form.totalBudget.value,
            accommodationBudget: form.accommodationBudget.value,
            tripDuration: form.tripDuration.value,
            amenities: getCheckboxValues("amenities"),
            foodPreference: form.foodPreference.value,
            localityRating: form.localityRating.value,
            additionalNotes: form.additionalNotes.value
        };

        try {
            const res = await fetch('http://localhost:3000/api/recommendations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const recommendations = await res.json();

            if (!Array.isArray(recommendations)) {
                resultsContent.innerHTML = `<p>Error: ${recommendations.error || 'Unexpected response'}</p>`;
                resultsContainer.style.display = 'block';
                return;
            }

            resultsContent.innerHTML = recommendations.map(dest => `
                <div class="result-card">
                    <img src="${dest.image_url || 'https://via.placeholder.com/400x200'}" alt="${dest.name}" class="result-image">
                    <div class="result-content">
                        <h3 class="result-title">${dest.name}</h3>
                        <p class="result-description">${dest.description}</p>
                        <div class="result-meta">
                            <div class="meta-item"><i class="fas fa-thermometer-half"></i><span class="meta-label">Temp:</span> ${dest.temperature_min}–${dest.temperature_max}°C</div>
                            <div class="meta-item"><i class="fas fa-dollar-sign"></i><span class="meta-label">Budget:</span> $${dest.avg_budget}/night</div>
                            <div class="meta-item"><i class="fas fa-star"></i><span class="meta-label">Rating:</span> ${dest.rating}★</div>
                        </div>
                    </div>
                </div>
            `).join('');

            resultsContainer.style.display = 'block';

        } catch (err) {
            console.error('Fetch error:', err);
            resultsContent.innerHTML = `<p>Something went wrong. Try again later.</p>`;
            resultsContainer.style.display = 'block';
        }
    });

        // ------------------- STICKY CHATBOT ------------------- //
    const chatIcon = document.getElementById('chat-icon');
    const chatbox = document.getElementById('chatbox');
    const toggleChat = document.getElementById('toggle-chat');
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const messages = document.getElementById('messages');

    chatIcon.addEventListener('click', () => {
        chatbox.classList.add('expanded');
        chatIcon.style.display = 'none';
    });

    toggleChat.addEventListener('click', () => {
        chatbox.classList.toggle('expanded');
        if (!chatbox.classList.contains('expanded')) chatIcon.style.display = 'flex';
    });

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });

    function appendMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender);
        msgDiv.textContent = text;
        messages.appendChild(msgDiv);
        messages.scrollTop = messages.scrollHeight;
    }

    function sendMessage() {
        const text = userInput.value.trim();
        if (!text) return;
        appendMessage(text, 'user');
        userInput.value = '';

        setTimeout(() => {
            const reply = generateBotReply(text);
            appendMessage(reply, 'bot');
        }, 600);
    }

    function generateBotReply(text) {
        text = text.toLowerCase();
        if (text.includes("hello") || text.includes("hi")) return "Hi! I'm TravelMate 🤖. Where would you like to go?";
        else if (text.includes("beach")) return "🏖️ Beaches like Goa, Bali, or Maldives are amazing!";
        else if (text.includes("cold")) return "❄️ Cold destinations: Manali, Shimla, or Switzerland!";
        else if (text.includes("hot")) return "☀️ Hot destinations: Dubai, Rajasthan, or Egypt!";
        else if (text.includes("budget")) return "💰 Budget-friendly places: Thailand, Vietnam, Nepal!";
        else return "I'm learning! Ask me about destinations, climate, or budget 🌍";
    }

});

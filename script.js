const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const clearButton = document.getElementById("clearButton");

const strengthText = document.getElementById("strengthText");
const strengthProgress = document.getElementById("strengthProgress");
const scoreDisplay = document.getElementById("score");

const requirements = {
    length: document.getElementById("length"),
    uppercase: document.getElementById("uppercase"),
    lowercase: document.getElementById("lowercase"),
    number: document.getElementById("number"),
    special: document.getElementById("special")
};

const suggestionsList = document.getElementById("suggestionsList");

// Show or hide password
togglePassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.textContent = "🙈";
    } else {
        passwordInput.type = "password";
        togglePassword.textContent = "👁️";
    }

});

// Analyze password whenever the user types
passwordInput.addEventListener("input", analyzePassword);

function analyzePassword() {

    const password = passwordInput.value;

    if (password.length === 0) {
        resetAnalyzer();
        return;
    }

    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password)
    };

    updateRequirements(checks);

    const score = calculateScore(password, checks);

    updateStrength(score);

    generateSuggestions(password, checks);

}

// Update requirement indicators
function updateRequirements(checks) {

    for (const key in checks) {

        const requirement = requirements[key];
        const icon = requirement.querySelector(".icon");

        if (checks[key]) {
            requirement.classList.add("valid");
            icon.textContent = "✓";
        } else {
            requirement.classList.remove("valid");
            icon.textContent = "✖";
        }

    }

}

// Calculate password strength score
function calculateScore(password, checks) {

    let score = 0;

    // Length points
    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;
    if (password.length >= 20) score += 5;

    // Character variety
    if (checks.uppercase) score += 15;
    if (checks.lowercase) score += 15;
    if (checks.number) score += 15;
    if (checks.special) score += 15;

    // Penalize common passwords and obvious patterns
    const commonPasswords = [
        "password",
        "password123",
        "12345678",
        "123456789",
        "qwerty",
        "qwerty123",
        "admin",
        "letmein",
        "welcome",
        "iloveyou"
    ];

    const lowerPassword = password.toLowerCase();

    if (commonPasswords.includes(lowerPassword)) {
        score = Math.min(score, 10);
    }

    if (/^(.)\1+$/.test(password)) {
        score = Math.min(score, 10);
    }

    if (/^(0123456789|1234567890|9876543210)$/.test(password)) {
        score = Math.min(score, 10);
    }

    return Math.min(score, 100);

}

// Display strength result
function updateStrength(score) {

    scoreDisplay.textContent = score;
    strengthProgress.style.width = score + "%";

    if (score <= 25) {

        strengthText.textContent = "Very Weak";
        strengthText.style.color = "#dc2626";
        strengthProgress.style.background = "#dc2626";

    } else if (score <= 50) {

        strengthText.textContent = "Weak";
        strengthText.style.color = "#ea580c";
        strengthProgress.style.background = "#ea580c";

    } else if (score <= 70) {

        strengthText.textContent = "Medium";
        strengthText.style.color = "#ca8a04";
        strengthProgress.style.background = "#ca8a04";

    } else if (score <= 85) {

        strengthText.textContent = "Strong";
        strengthText.style.color = "#16a34a";
        strengthProgress.style.background = "#16a34a";

    } else {

        strengthText.textContent = "Very Strong";
        strengthText.style.color = "#15803d";
        strengthProgress.style.background = "#15803d";

    }

}

// Generate security suggestions
function generateSuggestions(password, checks) {

    const suggestions = [];

    if (password.length < 12) {
        suggestions.push("Use a password or passphrase of at least 12 characters.");
    }

    if (!checks.uppercase) {
        suggestions.push("Add uppercase letters such as A, B, or C.");
    }

    if (!checks.lowercase) {
        suggestions.push("Add lowercase letters such as a, b, or c.");
    }

    if (!checks.number) {
        suggestions.push("Include at least one number.");
    }

    if (!checks.special) {
        suggestions.push("Include a special character such as !, @, or #.");
    }

    if (/^(.)\1+$/.test(password)) {
        suggestions.push("Avoid repeating the same character multiple times.");
    }

    const commonPasswords = [
        "password",
        "password123",
        "12345678",
        "123456789",
        "qwerty",
        "qwerty123",
        "admin",
        "letmein",
        "welcome",
        "iloveyou"
    ];

    if (commonPasswords.includes(password.toLowerCase())) {
        suggestions.push("Avoid common passwords that attackers can easily guess.");
    }

    if (suggestions.length === 0) {
        suggestions.push("Your password meets the basic strength checks.");
        suggestions.push("Avoid reusing this password on multiple websites.");
        suggestions.push("Consider using a password manager.");
    }

    suggestionsList.innerHTML = "";

    suggestions.forEach(function (suggestion) {

        const li = document.createElement("li");
        li.textContent = suggestion;
        suggestionsList.appendChild(li);

    });

}

// Reset analyzer
function resetAnalyzer() {

    scoreDisplay.textContent = "0";
    strengthText.textContent = "No password";
    strengthText.style.color = "#777";

    strengthProgress.style.width = "0%";
    strengthProgress.style.background = "#ddd";

    for (const key in requirements) {

        requirements[key].classList.remove("valid");
        requirements[key].querySelector(".icon").textContent = "✖";

    }

    suggestionsList.innerHTML =
        "<li>Enter a password to receive suggestions.</li>";

}

// Clear password
clearButton.addEventListener("click", function () {

    passwordInput.value = "";
    passwordInput.type = "password";
    togglePassword.textContent = "👁️";

    resetAnalyzer();

    passwordInput.focus();

});
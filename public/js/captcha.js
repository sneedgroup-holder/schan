/**
 * Simple Captcha System for sChan
 */

// Generate a random captcha code
function generateCaptchaCode(length = 6) {
  const characters = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Create SVG captcha image
function createCaptchaSVG(code) {
  const width = 200;
  const height = 50;
  const fontSize = 24;
  
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
  
  // Add background
  svg += `<rect width="100%" height="100%" fill="#f0f0f0"/>`;
  
  // Add noise (random lines)
  for (let i = 0; i < 10; i++) {
    const x1 = Math.random() * width;
    const y1 = Math.random() * height;
    const x2 = Math.random() * width;
    const y2 = Math.random() * height;
    const color = `rgb(${Math.floor(Math.random() * 200)}, ${Math.floor(Math.random() * 200)}, ${Math.floor(Math.random() * 200)})`;
    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1"/>`;
  }
  
  // Add the captcha text with distortion
  for (let i = 0; i < code.length; i++) {
    const x = 20 + i * (width / (code.length + 1));
    const y = height / 2 + Math.random() * 10 - 5;
    const rotation = Math.random() * 30 - 15;
    const color = `rgb(${Math.floor(Math.random() * 80)}, ${Math.floor(Math.random() * 80)}, ${Math.floor(Math.random() * 80)})`;
    
    svg += `<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${fontSize}" 
             fill="${color}" transform="rotate(${rotation} ${x} ${y})">${code.charAt(i)}</text>`;
  }
  
  svg += `</svg>`;
  return svg;
}

// Init captcha on forms
function initCaptcha() {
  const captchaContainers = document.querySelectorAll('.captcha-container');
  
  captchaContainers.forEach(container => {
    const captchaCode = generateCaptchaCode();
    const captchaImage = createCaptchaSVG(captchaCode);
    const captchaInput = container.querySelector('.captcha-input');
    const captchaDisplay = container.querySelector('.captcha-image');
    const refreshButton = container.querySelector('.refresh-captcha');
    
    // Set the current captcha code as a data attribute
    container.dataset.captchaCode = captchaCode;
    
    // Display the captcha image
    captchaDisplay.innerHTML = captchaImage;
    
    // Add refresh button functionality
    if (refreshButton) {
      refreshButton.addEventListener('click', (e) => {
        e.preventDefault();
        const newCode = generateCaptchaCode();
        container.dataset.captchaCode = newCode;
        captchaDisplay.innerHTML = createCaptchaSVG(newCode);
      });
    }
  });
}

// Validate captcha before form submission
function validateCaptcha(form) {
  const container = form.querySelector('.captcha-container');
  const captchaInput = form.querySelector('.captcha-input');
  const expectedCode = container.dataset.captchaCode;
  const userInput = captchaInput.value;
  
  if (userInput.toLowerCase() !== expectedCode.toLowerCase()) {
    alert('Incorrect captcha code. Please try again.');
    return false;
  }
  
  return true;
}

// Initialize captchas when DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
  initCaptcha();
  
  // Add form validation
  const postForms = document.querySelectorAll('form[data-validate-captcha="true"]');
  postForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      if (!validateCaptcha(form)) {
        e.preventDefault();
      }
    });
  });
}); 
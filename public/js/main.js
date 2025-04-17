/**
 * Main JavaScript for sChan
 */

document.addEventListener('DOMContentLoaded', () => {
  // Image preview for uploads
  const imageInputs = document.querySelectorAll('input[type="file"]');
  imageInputs.forEach(input => {
    input.addEventListener('change', function() {
      const preview = this.parentElement.querySelector('.file-preview');
      preview.innerHTML = '';
      
      if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const img = document.createElement('img');
          img.src = e.target.result;
          img.style.maxWidth = '150px';
          img.style.maxHeight = '150px';
          img.style.margin = '10px 0';
          preview.appendChild(img);
        }
        reader.readAsDataURL(this.files[0]);
      }
    });
  });
  
  // Post content preview with greentext support
  const contentTextareas = document.querySelectorAll('textarea[name="content"]');
  contentTextareas.forEach(textarea => {
    const previewDiv = textarea.parentElement.querySelector('.post-preview');
    
    // Create preview div if it doesn't exist
    if (!previewDiv) {
      const newPreview = document.createElement('div');
      newPreview.className = 'post-preview';
      newPreview.style.marginTop = '10px';
      newPreview.style.padding = '10px';
      newPreview.style.border = '1px solid #ddd';
      newPreview.style.borderRadius = '4px';
      newPreview.style.backgroundColor = '#f8f8f8';
      newPreview.style.whiteSpace = 'pre-wrap';
      newPreview.style.wordWrap = 'break-word';
      newPreview.style.display = 'none';
      newPreview.innerHTML = '<div class="preview-header">Preview:</div>';
      textarea.parentElement.appendChild(newPreview);
    }
    
    // Format content with greentext
    function formatContent(content) {
      if (!content) return '';
      
      // Process each line and wrap greentext with span tags
      return content
        .split('\n')
        .map(line => {
          if (line.trim().startsWith('>')) {
            return `<span class="greentext">${line}</span>`;
          }
          return line;
        })
        .join('\n');
    }
    
    // Update preview on input
    textarea.addEventListener('input', function() {
      const previewEl = this.parentElement.querySelector('.post-preview');
      const content = this.value.trim();
      
      if (content) {
        previewEl.style.display = 'block';
        const previewContent = previewEl.querySelector('.preview-content') || document.createElement('div');
        previewContent.className = 'preview-content';
        previewContent.innerHTML = formatContent(content);
        
        // Add to preview container if not already there
        if (!previewEl.querySelector('.preview-content')) {
          previewEl.appendChild(previewContent);
        }
      } else {
        previewEl.style.display = 'none';
      }
    });
  });

  // Add a hint for special users
  function initSpecialUserHint() {
    // Add event handlers to name fields
    const nameInputs = document.querySelectorAll('input[name="name"]');
    
    // Base64 encoded special names
    const encodedSpecialNames = [
      "tF2U",                         // Ruben
      "==wYih0bGhheGl4TWVkb04",       // NoMixer
      "p21vcnVL",                     // Big Special K
      "==Q51bWFza3JhcFM",             // Sparky
      "=bbmFoQ3MgZGVtYU4gcmVrY2FIIGVoVA" // 1337 hax0rs
    ];
    
    // Function to decode base64 string
    function decodeBase64(str) {
      // Unreverse the string first, then decode
      return atob(str.split('').reverse().join(''));
    }
    
    nameInputs.forEach(input => {
      input.addEventListener('change', function() {
        const name = this.value;
        const specialNames = encodedSpecialNames.map(decodeBase64);
        
        // Add a hint next to the captcha for special users
        const captchaLabel = this.closest('form').querySelector('label[for="captcha"]');
        const specialHint = this.closest('form').querySelector('.special-captcha-hint');
        
        if (specialNames.includes(name)) {
          // If there's no hint element yet, create one
          if (!specialHint) {
            const hint = document.createElement('small');
            hint.className = 'special-captcha-hint';
            hint.style.display = 'block';
            hint.style.color = '#666';
            hint.style.marginTop = '2px';
            hint.textContent = 'Life, the Universe, and Everything';
            captchaLabel.appendChild(hint);
          }
        } else {
          // Remove hint if user changes to non-special name
          if (specialHint) {
            specialHint.remove();
          }
        }
      });
    });
  }

  // Initialize special user hint
  initSpecialUserHint();
}); 
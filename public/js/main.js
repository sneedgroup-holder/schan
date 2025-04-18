/**
 * Main JavaScript for sChan
 */

document.addEventListener('DOMContentLoaded', () => {
  // Load DOMPurify
  let purifyScript = document.createElement('script');
  purifyScript.src = '/js/lib/purify.min.js';
  document.head.appendChild(purifyScript);

  // Wait for DOMPurify to load before proceeding with features that need it
  purifyScript.onload = () => {
    initImagePreviews();
    initPostPreviews();
    initSpecialUserHint();
  };
  
  // Image preview for uploads
  function initImagePreviews() {
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
  }
  
  // Post content preview with greentext support
  function initPostPreviews() {
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
      
      // Format content with greentext and sanitize
      function formatContent(content) {
        if (!content) return '';
        
        // Check if DOMPurify is loaded
        if (typeof DOMPurify === 'undefined') {
          console.error('DOMPurify is not loaded yet');
          return '';
        }
        
        // Process each line and wrap greentext with span tags
        const formattedContent = content
          .split('\n')
          .map(line => {
            if (line.trim().startsWith('>')) {
              return `<span class="greentext">${DOMPurify.sanitize(line)}</span>`;
            }
            return DOMPurify.sanitize(line);
          })
          .join('\n');
        
        // Final sanitization
        return DOMPurify.sanitize(formattedContent, {
          ALLOWED_TAGS: ['span', 'br'],
          ALLOWED_ATTR: ['class']
        });
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
  }

  // Add a hint for special users
  function initSpecialUserHint() {
    // Add event handlers to name fields
    const nameInputs = document.querySelectorAll('input[name="name"]');
    
    // Base64 encoded special names
    const encodedSpecialNames = [
      "U2Ft",                         // Ruben
      "Tm9kZU1peGFob2xpYw==",         // NoMixer
      "S3Vyb21p",                     // Big Special K
      "U3BhcmtzYW1teQ==",             // Sparky
      "VGhlIEhhY2tlciBOYW1lZCBzQ2hhbg==" // 1337 hax0rs
    ];
    
    // Function to decode base64 string
    function decodeBase64(str) {
      return atob(str);
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
            hint.textContent = 'Life, the Universe, and Everything, as well as a mysterious name, weed number, and nice number';
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
}); 
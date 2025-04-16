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
}); 
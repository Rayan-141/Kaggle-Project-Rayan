// // Upload Modal Functionality
// document.addEventListener('DOMContentLoaded', function() {
//     // Create modal overlay
//     const modalOverlay = document.createElement('div');
//     modalOverlay.className = 'upload-modal-overlay';
//     modalOverlay.innerHTML = `
//         <div class="upload-modal">
//             <div class="upload-modal-header">
//                 <h2 class="upload-modal-title">Upload Data</h2>
//                 <button class="upload-modal-close" aria-label="Close">&times;</button>
//             </div>
//             <div class="upload-modal-tabs">
//                 <button class="upload-modal-tab active" data-tab="file">
//                     <i class="fas fa-file-upload"></i> File
//                 </button>
//                 <button class="upload-modal-tab" data-tab="link">
//                     <i class="fas fa-link"></i> Link
//                 </button>
//             </div>
//             <div class="upload-modal-content">
//                 <!-- File Tab Content -->
//                 <div class="upload-tab-content active" id="file-tab">
//                     <div class="upload-option-card" id="dropzone">
//                         <div class="upload-option-icon">
//                             <i class="fas fa-file-upload"></i>
//                         </div>
//                         <h3 class="upload-option-title">Upload files</h3>
//                         <p class="upload-option-description">
//                             Upload a file from your computer
//                             <span class="upload-option-note">(Max 10GB per file)</span>
//                         </p>
//                         <button class="upload-browse-btn">Browse files</button>
//                         <input type="file" class="upload-file-input" id="fileInput" multiple>
//                     </div>
//                     <div class="uploaded-files" id="uploadedFiles">
//                         <!-- Uploaded files will be added here -->
//                     </div>
//                 </div>
                
//                 <!-- Link Tab Content -->
//                 <div class="upload-tab-content" id="link-tab">
//                     <div class="upload-option-card">
//                         <div class="upload-option-icon">
//                             <i class="fas fa-link"></i>
//                         </div>
//                         <h3 class="upload-option-title">Add data using web URL</h3>
//                         <p class="upload-option-description">
//                             Add data from a URL
//                         </p>
//                         <div class="link-input-container">
//                             <input type="url" class="link-input" id="datasetLink" placeholder="https://" aria-label="Dataset URL">
//                             <button class="add-link-btn">Add</button>
//                         </div>
//                     </div>
//                     <div class="added-links" id="addedLinks">
//                         <!-- Added links will be added here -->
//                     </div>
//                 </div>
//             </div>
//         </div>
//     `;

//     // Add modal to the DOM
//     document.body.appendChild(modalOverlay);

//     // Get modal elements
//     const modal = modalOverlay.querySelector('.upload-modal');
//     const closeBtn = modalOverlay.querySelector('.upload-modal-close');
//     const dropzone = modalOverlay.querySelector('#dropzone');
//     const fileInput = modalOverlay.querySelector('.upload-file-input');
//     const browseBtn = modalOverlay.querySelector('.upload-browse-btn');
//     const uploadedFilesContainer = modalOverlay.querySelector('#uploadedFiles');
//     const linkInput = modalOverlay.querySelector('#datasetLink');
//     const addLinkBtn = modalOverlay.querySelector('.add-link-btn');
//     const addedLinksContainer = modalOverlay.querySelector('#addedLinks');
    
//     // Track uploaded files and links
//     let uploadedFiles = [];
//     let addedLinks = [];

//     // Function to open the modal
//     function openModal() {
//         document.body.style.overflow = 'hidden';
//         document.body.classList.add('modal-open');
//         const sidebar = document.querySelector('.sidebar');
//         if (sidebar) sidebar.classList.add('hidden');
//         modalOverlay.classList.add('active');
//     }

//     // Function to close the modal
//     function closeModal() {
//         document.body.style.overflow = '';
//         document.body.classList.remove('modal-open');
//         const sidebar = document.querySelector('.sidebar');
//         if (sidebar) sidebar.classList.remove('hidden');
//         modalOverlay.classList.remove('active');
//         resetForm();
//     }

//     // Helper functions
//     function preventDefaults(e) {
//         e.preventDefault();
//         e.stopPropagation();
//     }

//     function highlight() {
//         dropzone.classList.add('highlight');
//     }

//     function unhighlight() {
//         dropzone.classList.remove('highlight');
//     }

//     function handleDrop(e) {
//         const dt = e.dataTransfer;
//         const files = dt.files;
//         handleFiles(files);
//     }

//     function handleFileSelect(e) {
//         const files = e.target.files;
//         handleFiles(files);
//     }

//     function handleFiles(files) {
//         [...files].forEach(file => {
//             uploadedFiles.push(file);
//             addFileToList(file);
//         });
//     }

//     function addFileToList(file) {
//         const fileItem = document.createElement('div');
//         fileItem.className = 'uploaded-file';
//         fileItem.innerHTML = `
//             <div class="file-icon">
//                 <i class="fas fa-file"></i>
//             </div>
//             <div class="file-info">
//                 <div class="file-name">${file.name}</div>
//                 <div class="file-size">${formatFileSize(file.size)}</div>
//             </div>
//             <button class="remove-file" aria-label="Remove file">
//                 <i class="fas fa-times"></i>
//             </button>
//         `;
        
//         const removeBtn = fileItem.querySelector('.remove-file');
//         removeBtn.addEventListener('click', () => {
//             uploadedFiles = uploadedFiles.filter(f => f !== file);
//             fileItem.remove();
//         });
        
//         uploadedFilesContainer.appendChild(fileItem);
//     }

//     function addLink(link) {
//         const linkItem = document.createElement('div');
//         linkItem.className = 'added-link';
//         linkItem.innerHTML = `
//             <div class="link-icon">
//                 <i class="fas fa-link"></i>
//             </div>
//             <div class="link-url">${link}</div>
//             <button class="remove-link" aria-label="Remove link">
//                 <i class="fas fa-times"></i>
//             </button>
//         `;
        
//         const removeBtn = linkItem.querySelector('.remove-link');
//         removeBtn.addEventListener('click', () => {
//             addedLinks = addedLinks.filter(l => l !== link);
//             linkItem.remove();
//         });
        
//         addedLinks.push(link);
//         addedLinksContainer.appendChild(linkItem);
//     }

//     function formatFileSize(bytes) {
//         if (bytes === 0) return '0 Bytes';
//         const k = 1024;
//         const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
//         const i = Math.floor(Math.log(bytes) / Math.log(k));
//         return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//     }

//     function resetForm() {
//         // Clear file input
//         if (fileInput) fileInput.value = '';
        
//         // Clear uploaded files
//         uploadedFiles = [];
//         if (uploadedFilesContainer) {
//             uploadedFilesContainer.innerHTML = '';
//         }
        
//         // Clear added links
//         addedLinks = [];
//         if (addedLinksContainer) {
//             addedLinksContainer.innerHTML = '';
//         }
        
//         // Reset to first tab
//         if (tabButtons.length > 0) {
//             tabButtons[0].click();
//         }
//     }

//     // Event Listeners
    
//     // Open modal when clicking New Dataset button
//     document.querySelectorAll('.host-btn').forEach(btn => {
//         btn.addEventListener('click', function(e) {
//             e.preventDefault();
//             e.stopPropagation();
//             openModal();
//         });
//     });
    
//     // Handle tab switching
//     const tabButtons = modalOverlay.querySelectorAll('.upload-modal-tab');
//     const tabContents = modalOverlay.querySelectorAll('.upload-tab-content');
    
//     tabButtons.forEach(button => {
//         button.addEventListener('click', () => {
//             // Remove active class from all buttons and contents
//             tabButtons.forEach(btn => btn.classList.remove('active'));
//             tabContents.forEach(content => content.classList.remove('active'));
            
//             // Add active class to clicked button and corresponding content
//             button.classList.add('active');
//             const tabId = button.getAttribute('data-tab');
//             document.getElementById(`${tabId}-tab`).classList.add('active');
//         });
//     });

//     // Handle file input click
//     if (browseBtn && fileInput) {
//         browseBtn.addEventListener('click', () => fileInput.click());
//     }

//     // Handle file selection
//     if (fileInput) {
//         fileInput.addEventListener('change', handleFileSelect);
//     }
    
//     // Handle drag and drop
//     if (dropzone) {
//         ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
//             dropzone.addEventListener(eventName, preventDefaults, false);
//         });
        
//         ['dragenter', 'dragover'].forEach(eventName => {
//             dropzone.addEventListener(eventName, highlight, false);
//         });
        
//         ['dragleave', 'drop'].forEach(eventName => {
//             dropzone.addEventListener(eventName, unhighlight, false);
//         });
        
//         dropzone.addEventListener('drop', handleDrop, false);
//     }

//     // Handle link addition
//     if (addLinkBtn && linkInput) {
//         addLinkBtn.addEventListener('click', () => {
//             const link = linkInput.value.trim();
//             if (link) {
//                 addLink(link);
//                 linkInput.value = '';
//             }
//         });
        
//         // Allow Enter key to add link
//         linkInput.addEventListener('keypress', (e) => {
//             if (e.key === 'Enter') {
//                 const link = linkInput.value.trim();
//                 if (link) {
//                     addLink(link);
//                     linkInput.value = '';
//                 }
//             }
//         });
//     }
    
//     // Close modal when clicking close button or outside
//     if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
//     modalOverlay.addEventListener('click', (e) => {
//         if (e.target === modalOverlay) closeModal();
//     });
    
//     // Close with Escape key
//     document.addEventListener('keydown', (e) => {
//         if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
//             closeModal();
//         }
//     });
    
//     // Prevent clicks inside modal from closing it
//     if (modal) {
//         modal.addEventListener('click', (e) => {
//             e.stopPropagation();
//         });
//     }
// });

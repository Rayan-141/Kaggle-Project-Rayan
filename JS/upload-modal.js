// Upload Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Function to open the modal
    function openModal() {
        document.body.style.overflow = 'hidden';
        document.body.classList.add('modal-open');
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) sidebar.classList.add('hidden');
        modalOverlay.classList.add('active');
    }

    // Function to close the modal
    function closeModal() {
        document.body.style.overflow = '';
        document.body.classList.remove('modal-open');
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) sidebar.classList.remove('hidden');
        modalOverlay.classList.remove('active');
        resetForm();
    }

    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'upload-modal-overlay';
    modalOverlay.innerHTML = `
        <div class="upload-modal">
            <div class="upload-modal-header">
                <h2 class="upload-modal-title">Upload Data</h2>
                <button class="upload-modal-close" aria-label="Close">&times;</button>
            </div>
            <div class="upload-modal-tabs">
                <button class="upload-modal-tab active" data-tab="file">
                    <i class="fas fa-file-upload"></i> File
                </button>
                <button class="upload-modal-tab" data-tab="link">
                    <i class="fas fa-link"></i> Link
                </button>
            </div>
            <div class="upload-modal-content">
                <!-- File Tab Content -->
                <div class="upload-tab-content active" id="file-tab">
                    <div class="upload-option-card" id="dropzone">
                        <div class="upload-option-icon">
                            <i class="fas fa-file-upload"></i>
                        </div>
                        <h3 class="upload-option-title">Upload files</h3>
                        <p class="upload-option-description">
                            Upload a file from your computer
                            <span class="upload-option-note">(Max 10GB per file)</span>
                        </p>
                        <button class="upload-browse-btn">Browse files</button>
                        <input type="file" class="upload-file-input" id="fileInput" multiple>
                    </div>
                    
                    <div class="uploaded-files" id="uploadedFiles">
                        <!-- Uploaded files will be added here -->
                    </div>
                </div>
                
                <!-- Link Tab Content -->
                <div class="upload-tab-content" id="link-tab">
                    <div class="upload-option-card">
                        <div class="upload-option-icon">
                            <i class="fas fa-link"></i>
                        </div>
                        <h3 class="upload-option-title">Add data using web URL</h3>
                        <p class="upload-option-description">
                            Add data from a URL
                        </p>
                        <div class="link-input-container">
                            <input type="url" class="link-input" id="datasetLink" placeholder="https://" aria-label="Dataset URL">
                            <button class="add-link-btn">Add</button>
                        </div>
                    </div>
                    
                    <div class="added-links" id="addedLinks">
                        <!-- Added links will be added here -->
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add modal to the DOM
    document.body.appendChild(modalOverlay);
    
    // Get modal elements
    const modal = modalOverlay.querySelector('.upload-modal');
    const closeBtn = modalOverlay.querySelector('.upload-modal-close');
    const dropzone = modalOverlay.querySelector('#dropzone');
    const fileInput = modalOverlay.querySelector('.upload-file-input');
    const browseBtn = modalOverlay.querySelector('.upload-browse-btn');
    const uploadedFilesContainer = modalOverlay.querySelector('#uploadedFiles');
    const linkInput = modalOverlay.querySelector('#datasetLink');
    const addLinkBtn = modalOverlay.querySelector('.add-link-btn');
    const addedLinksContainer = modalOverlay.querySelector('#addedLinks');
    
    // Track uploaded files and links
    let uploadedFiles = [];
    let addedLinks = [];
    
    // Open modal when clicking New Dataset button
    document.querySelectorAll('.host-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openModal();
        });
    });
    
    // Handle tab switching
    const tabButtons = modalOverlay.querySelectorAll('.upload-modal-tab');
    const tabContents = modalOverlay.querySelectorAll('.upload-tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // Handle file input click
    if (browseBtn && fileInput) {
        browseBtn.addEventListener('click', () => fileInput.click());
    }
    
    // Handle file selection
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }
    
    // Drag and drop functionality
    if (dropzone) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, preventDefaults, false);
        });
        
        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, unhighlight, false);
        });
        
        dropzone.addEventListener('drop', handleDrop, false);
    }
    
    // Handle dropped files
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight() {
        dropzone.classList.add('active');
    }
    
    function unhighlight() {
        dropzone.classList.remove('active');
    }
    
    function handleFileSelect(e) {
        const files = e.target.files;
        handleFiles(files);
    }
    
    function handleFiles(files) {
        [...files].forEach(file => {
            addFileToList(file);
        });
        updateCreateButtonState();
    }
    
    function addFileToList(file) {
        // Show uploaded files section if it's hidden
        const uploadedFilesSection = document.getElementById('uploadedFilesSection');
        uploadedFilesSection.style.display = 'block';
        
        const fileElement = document.createElement('div');
        fileElement.className = 'uploaded-file';
        
        const fileSize = formatFileSize(file.size);
        const fileExtension = file.name.split('.').pop().toLowerCase();
        let fileIcon = 'file';
        
        // Set appropriate icon based on file extension
        const fileIcons = {
            'pdf': 'file-pdf',
            'doc': 'file-word',
            'docx': 'file-word',
            'xls': 'file-excel',
            'xlsx': 'file-excel',
            'ppt': 'file-powerpoint',
            'pptx': 'file-powerpoint',
            'jpg': 'file-image',
            'jpeg': 'file-image',
            'png': 'file-image',
            'gif': 'file-image',
            'zip': 'file-archive',
            'rar': 'file-archive',
            'csv': 'file-csv',
            'json': 'file-code',
            'js': 'file-code',
            'html': 'file-code',
            'css': 'file-code',
            'txt': 'file-alt'
        };
        
        if (fileIcons[fileExtension]) {
            fileIcon = fileIcons[fileExtension];
        }
        
        fileElement.innerHTML = `
            <div class="uploaded-file-icon">
                <i class="far fa-${fileIcon}"></i>
            </div>
            <div class="uploaded-file-info">
                <div class="uploaded-file-name">${file.name}</div>
                <div class="uploaded-file-meta">
                    <span class="uploaded-file-size">${fileSize}</span>
                    <span class="uploaded-file-status">
                        <i class="fas fa-check-circle"></i> Uploaded
                    </span>
                </div>
                <div class="upload-progress">
                    <div class="upload-progress-bar" style="width: 100%"></div>
                </div>
            </div>
            <button class="uploaded-file-remove" data-file-name="${file.name}" title="Remove file">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        uploadedFilesContainer.appendChild(fileElement);
        
        // Add event listener to remove button
        const removeBtn = fileElement.querySelector('.uploaded-file-remove');
        removeBtn.addEventListener('click', function() {
            fileElement.remove();
            updateCreateButtonState();
        });
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Handle link addition
    if (addLinkBtn && linkInput) {
        addLinkBtn.addEventListener('click', () => {
            const link = linkInput.value.trim();
            if (link) {
                addLink(link);
                linkInput.value = '';
            }
        });
        
        // Allow Enter key to add link
        linkInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const link = linkInput.value.trim();
                if (link) {
                    addLink(link);
                    linkInput.value = '';
                }
            }
        });
    }
    });
    
    function resetForm() {
        // Clear file input
        fileInput.value = '';
        
        // Clear uploaded files list
        uploadedFilesContainer.innerHTML = '';
        
        // Reset form fields
        const formInputs = modalOverlay.querySelectorAll('input[type="text"], input[type="url"], textarea');
        formInputs.forEach(input => {
            input.value = '';
        });
        
        // Reset selects
        const selects = modalOverlay.querySelectorAll('select');
        selects.forEach(select => {
            select.selectedIndex = 0;
        });
        
        // Switch back to first tab
        tabButtons[0].click();
        
        // Disable create button
        createBtn.disabled = true;
    }
    
    // Update create button state based on form validity
    function updateCreateButtonState() {
        const activeTab = modalOverlay.querySelector('.upload-modal-tab.active');
        if (!activeTab) return;
        
        const tabId = activeTab.getAttribute('data-tab');
        const isValid = isFormValid(tabId);
        
        // No need to update a button that doesn't exist anymore
        if (createBtn) {
            createBtn.disabled = !isValid;
        }
    }
    
    // Close modal when clicking close button or outside
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    
    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Prevent clicks inside modal from closing it
    if (modal) {
        modal.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
        input.addEventListener('change', updateCreateButtonState);
        
        // Handle form submission when pressing Enter in input fields
        if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const activeTab = modalOverlay.querySelector('.upload-modal-tab.active');
                    const tabId = activeTab.getAttribute('data-tab');
                    
                    // Only submit if all required fields are filled
                    if (isFormValid(tabId)) {
                        submitForm(tabId);
                    }
                }
            });
        }
    });
    
    // Function to check if form is valid
    function isFormValid(tabId) {
        if (tabId === 'file') {
            const title = document.getElementById('datasetTitle').value.trim();
            const hasFiles = uploadedFilesContainer.children.length > 0;
            return title !== '' && hasFiles;
        } else if (tabId === 'link') {
            const url = document.getElementById('datasetUrl').value.trim();
            const title = document.getElementById('linkDatasetTitle').value.trim();
            return url !== '' && title !== '';
        }
        return false;
    }
    
    // Function to submit the form
    function submitForm(tabId) {
        let datasetData = {};
        
        if (tabId === 'file') {
            datasetData = {
                type: 'file',
                title: document.getElementById('datasetTitle').value.trim(),
                description: document.getElementById('datasetDescription').value.trim(),
                visibility: document.querySelector('input[name="visibility"]:checked').value,
                files: Array.from(uploadedFilesContainer.children).map(fileEl => ({
                    name: fileEl.querySelector('.uploaded-file-name').textContent,
                    size: fileEl.querySelector('.uploaded-file-size').textContent
                }))
            };
            
            // Here you would typically upload the files to a server
            console.log('Creating dataset with files:', datasetData);
            
        } else if (tabId === 'link') {
            datasetData = {
                type: 'link',
                url: document.getElementById('datasetUrl').value.trim(),
                title: document.getElementById('linkDatasetTitle').value.trim(),
                description: document.getElementById('linkDatasetDescription').value.trim(),
                visibility: document.querySelector('input[name="linkVisibility"]:checked').value
            };
            
            console.log('Creating dataset from link:', datasetData);
        }
        
        // Show success message and close modal
        showSuccessMessage();
    }
    
    // Function to show success message
    function showSuccessMessage() {
        // Create success message element
        const successMessage = document.createElement('div');
        successMessage.className = 'upload-success-message';
        successMessage.innerHTML = `
            <div class="upload-success-content">
                <div class="upload-success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Dataset created successfully!</h3>
                <p>Your dataset is being processed and will be available shortly.</p>
                <button class="upload-success-close">Done</button>
            </div>
        `;
        
        // Add to modal
        modalOverlay.appendChild(successMessage);
        
        // Close modal when Done is clicked
        const closeBtn = successMessage.querySelector('.upload-success-close');
        closeBtn.addEventListener('click', function() {
            closeModal();
            resetForm();
        });
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            if (modalOverlay.contains(successMessage)) {
                closeModal();
                resetForm();
            }
        }, 5000);
    }
    
    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    

});

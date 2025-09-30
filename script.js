// Global variables
let currentHandwriting = null;
let handwritingStyle = {
    size: 20,
    spacing: 2,
    angle: 0
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeHandwritingUpload();
    initializeTextConversion();
    initializeSampleHandwriting();
    initializeSettings();
});

// Handwriting upload handling
function initializeHandwritingUpload() {
    const uploadInput = document.getElementById('handwritingUpload');
    const previewImage = document.getElementById('handwritingPreview');
    const dropZone = document.querySelector('.upload-zone');

    uploadInput.addEventListener('change', function(e) {
        handleFileUpload(e.target.files[0]);
    });

    // Drag and drop functionality
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        handleFileUpload(e.dataTransfer.files[0]);
    });
}

function handleFileUpload(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('handwritingPreview').src = e.target.result;
        currentHandwriting = e.target.result;
        // Store the handwriting image in localStorage
        localStorage.setItem('userHandwriting', e.target.result);
    };
    reader.readAsDataURL(file);
}

// Text conversion handling
function initializeTextConversion() {
    document.getElementById('convertBtn').addEventListener('click', convertText);
    document.getElementById('clearBtn').addEventListener('click', clearAll);
}

function convertText() {
    const inputText = document.getElementById('inputText').value;
    if (!inputText.trim()) {
        alert('Please enter some text to convert');
        return;
    }

    if (!currentHandwriting && !document.querySelector('.sample-item.selected')) {
        alert('Please upload or select a handwriting style');
        return;
    }

    showLoading(true);
    
    // Simulate processing time
    setTimeout(() => {
        applyHandwritingStyle(inputText);
        showLoading(false);
    }, 1000);
}

function applyHandwritingStyle(text) {
    const outputDiv = document.getElementById('outputText');
    outputDiv.style.fontFamily = 'Handwriting, cursive';
    outputDiv.style.fontSize = `${handwritingStyle.size}px`;
    outputDiv.style.letterSpacing = `${handwritingStyle.spacing}px`;
    outputDiv.style.transform = `rotate(${handwritingStyle.angle}deg)`;
    outputDiv.textContent = text;
}

// Sample handwriting handling
function initializeSampleHandwriting() {
    const sampleContainer = document.querySelector('.sample-handwriting');
    
    // Add click handlers for sample handwriting styles
    sampleContainer.addEventListener('click', (e) => {
        const sampleItem = e.target.closest('.sample-item');
        if (sampleItem) {
            const samples = document.querySelectorAll('.sample-item');
            samples.forEach(sample => sample.classList.remove('selected'));
            sampleItem.classList.add('selected');
            
            // Get the image source from the clicked sample
            const img = sampleItem.querySelector('img');
            if (img) {
                currentHandwriting = img.src;
                // Show the selected style in the preview
                document.getElementById('handwritingPreview').src = img.src;
            }
        }
    });
    
    // Verify image loading
    const images = document.querySelectorAll('.sample-item img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.parentElement.style.display = 'none'; // Hide items with missing images
        });
        img.addEventListener('load', function() {
            this.parentElement.style.display = 'block'; // Show items with successful images
        });
    });
}

// Settings panel handling
function initializeSettings() {
    const sizeInput = document.getElementById('fontSize');
    const spacingInput = document.getElementById('letterSpacing');
    const angleInput = document.getElementById('textAngle');

    sizeInput.addEventListener('input', updateSettings);
    spacingInput.addEventListener('input', updateSettings);
    angleInput.addEventListener('input', updateSettings);
}

function updateSettings() {
    handwritingStyle.size = document.getElementById('fontSize').value;
    handwritingStyle.spacing = document.getElementById('letterSpacing').value;
    handwritingStyle.angle = document.getElementById('textAngle').value;

    if (document.getElementById('outputText').textContent) {
        applyHandwritingStyle(document.getElementById('outputText').textContent);
    }
}

// Utility functions
function showLoading(show) {
    document.querySelector('.loading').style.display = show ? 'block' : 'none';
}

function clearAll() {
    document.getElementById('inputText').value = '';
    document.getElementById('outputText').textContent = '';
    document.getElementById('handwritingPreview').src = '';
    currentHandwriting = null;
    localStorage.removeItem('userHandwriting');
    
    // Reset settings
    document.getElementById('fontSize').value = 20;
    document.getElementById('letterSpacing').value = 2;
    document.getElementById('textAngle').value = 0;
    updateSettings();
}

// Load saved handwriting on page load
window.addEventListener('load', () => {
    const savedHandwriting = localStorage.getItem('userHandwriting');
    if (savedHandwriting) {
        document.getElementById('handwritingPreview').src = savedHandwriting;
        currentHandwriting = savedHandwriting;
    }
});
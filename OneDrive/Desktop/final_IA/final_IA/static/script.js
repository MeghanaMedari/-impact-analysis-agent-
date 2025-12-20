// Store file contents
let fileContents = {
    architecture: '',
    prd: ''
};

// Handle file uploads
async function handleFileUpload(fileInputId, fileType, contentKey) {
    console.log(`Handling file upload for ${fileType}`);
    const fileInput = document.getElementById(fileInputId);
    const file = fileInput.files[0];
    if (!file) {
        fileContents[contentKey] = '';
        console.log('No file selected');
        return;
    }
    
    console.log(`File selected: ${file.name}, size: ${file.size}, type: ${file.type}`);
    const status = document.getElementById('status');
    status.innerHTML = `<div style="color: #007bff;">📄 Processing ${fileType} file...</div>`;
    
    try {
        const formData = new FormData();
        formData.append('file', file);
        console.log('Sending file to server...');
        
        const response = await fetch('/upload-file', {
            method: 'POST',
            body: formData
        });
        
        console.log(`Response status: ${response.status}`);
        const data = await response.json();
        console.log('Response data:', data);
        
        if (data.success) {
            fileContents[contentKey] = data.extracted_text;
            status.innerHTML = `<div class="success">✅ ${fileType} file processed successfully!</div>`;
            console.log(`${fileType} file processed successfully`);
        } else {
            throw new Error(data.error || 'File processing failed');
        }
        
    } catch (error) {
        console.error('File upload error:', error);
        fileContents[contentKey] = '';
        status.innerHTML = `<div class="error">❌ ${fileType} File Error: ${error.message}</div>`;
    }
}

document.getElementById('archFile').addEventListener('change', (e) => {
    console.log('Architecture file input changed');
    const fileName = e.target.files[0]?.name || 'No file';
    console.log('Selected file:', fileName);
    handleFileUpload('archFile', 'Architecture', 'architecture');
});

document.getElementById('prdFile').addEventListener('change', (e) => {
    console.log('PRD file input changed');
    const fileName = e.target.files[0]?.name || 'No file';
    console.log('Selected file:', fileName);
    handleFileUpload('prdFile', 'PRD', 'prd');
});

document.getElementById('analysisForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const repoUrl = document.getElementById('repoUrl').value;
    const analyzeBtn = document.getElementById('analyzeBtn');
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');
    const status = document.getElementById('status');
    
    // Check if architecture file is uploaded
    if (!fileContents.architecture) {
        status.innerHTML = '<div class="error">❌ Please upload an Architecture document first!</div>';
        return;
    }
    
    // Show loading state
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = '🔄 Analyzing...';
    loading.style.display = 'block';
    results.style.display = 'none';
    status.innerHTML = '';
    
    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                repo_url: repoUrl,
                architecture_content: fileContents.architecture,
                prd_content: fileContents.prd
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayResults(data.analysis, data.document_id);
            status.innerHTML = '<div class="success">✅ Analysis completed successfully!</div>';
        } else {
            throw new Error(data.error || 'Analysis failed');
        }
        
    } catch (error) {
        status.innerHTML = `<div class="error">❌ Error: ${error.message}</div>`;
    } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.textContent = '🔍 Analyze Project';
        loading.style.display = 'none';
    }
});

let currentDocumentId = null;

function displayResults(analysis, documentId) {
    currentDocumentId = documentId;
    
    // Display the generated prompt
    document.getElementById('codingPromptContent').innerHTML = `
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; font-family: monospace; white-space: pre-wrap; max-height: 500px; overflow-y: auto;">${analysis}</div>
    `;
    
    document.getElementById('results').style.display = 'block';
}

async function downloadDocument(docType, format) {
    if (!currentDocumentId) {
        alert('No documents available for download');
        return;
    }
    
    try {
        const url = `/download/${currentDocumentId}/${docType}/${format}`;
        console.log('Downloading from:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Download failed: ${response.status} ${response.statusText}`);
        }
        
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${docType}_${currentDocumentId}.${format === 'doc' ? 'docx' : format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(downloadUrl);
        
    } catch (error) {
        console.error('Download error:', error);
        alert(`Download failed: ${error.message}`);
    }
}
import os
import re

src_dir = r"c:\Users\suher\OneDrive\Documents\project06\frontend\src\pages"

mocks = {
    "UsersAndRoles.jsx": {
        "pattern": r"const\s+fetchUsers\s*=\s*async\s*\(\)\s*=>\s*\{.*?\};",
        "replacement": """const fetchUsers = () => {
        setLoading(true);
        setTimeout(() => {
            setUsers([
                { id: 1, name: 'Budi Santoso', email: 'budi@lexa.com', role: 'admin', team: 'IT', status: 'active', last_login: new Date().toISOString() },
                { id: 2, name: 'Siti Aminah', email: 'siti@lexa.com', role: 'member', team: 'Finance', status: 'active', last_login: new Date(Date.now() - 3600000).toISOString() }
            ]);
            setLoading(false);
        }, 500);
    };"""
    },
    "Templates.jsx": {
        "pattern": r"const\s+handleUseTemplate\s*=\s*async\s*\(id\)\s*=>\s*\{.*?\};",
        "replacement": """const handleUseTemplate = (id) => {
        alert('Menggunakan template ' + id + ' (Mode Mock)');
    };"""
    },
    "Documents.jsx": {
        "pattern": r"const\s+fetchDocuments\s*=\s*async\s*\(\)\s*=>\s*\{.*?\};",
        "replacement": """const fetchDocuments = () => {
        setLoading(true);
        setTimeout(() => {
            setDocuments([
                { id: 1, title: 'Perjanjian Kerja Sama Vendor', type: 'Kontrak', status: 'signed', uploaded_by: { name: 'Budi Santoso' } },
                { id: 2, title: 'Surat Keputusan Direksi', type: 'SOP', status: 'pending', uploaded_by: { name: 'Siti Aminah' } },
                { id: 3, title: 'NDA Project Phoenix', type: 'General', status: 'signed', uploaded_by: { name: 'Admin' } }
            ]);
            setLoading(false);
        }, 500);
    };"""
    },
    "Certificates.jsx": {
        "pattern": r"const\s+fetchCertificates\s*=\s*async\s*\(\)\s*=>\s*\{.*?\};",
        "replacement": """const fetchCertificates = () => {
        setLoading(true);
        setTimeout(() => {
            setCertificates([
                { id: 1, common_name: 'LEXA Root CA', type: 'root', expires_at: new Date(Date.now() + 31536000000).toISOString(), is_active: true },
                { id: 2, common_name: 'Budi Santoso - Signer', type: 'user', expires_at: new Date(Date.now() + 15536000000).toISOString(), is_active: true }
            ]);
            setLoading(false);
        }, 500);
    };"""
    },
    "Signatures.jsx": {
        "pattern": r"const\s+fetchData\s*=\s*async\s*\(\)\s*=>\s*\{.*?\};",
        "replacement": """const fetchData = () => {
        setLoading(true);
        setTimeout(() => {
            setSignatures([
                { id: 1, document_id: 1, document: { title: 'Perjanjian Kerja Sama' }, requested_by: { name: 'Admin' }, status: 'signed' },
                { id: 2, document_id: 2, document: { title: 'Surat Keputusan Direksi' }, requested_by: { name: 'Budi' }, status: 'pending' }
            ]);
            setDocuments([{ id: 1, title: 'Perjanjian Kerja Sama' }, { id: 2, title: 'Surat Keputusan Direksi' }]);
            setUsers([{ id: 1, name: 'Admin' }, { id: 2, name: 'Budi' }]);
            setLoading(false);
        }, 500);
    };"""
    },
    "Teams.jsx": {
        "pattern": r"const\s+fetchData\s*=\s*async\s*\(\)\s*=>\s*\{.*?\};",
        "replacement": """const fetchData = () => {
        setLoading(true);
        setTimeout(() => {
            setTeams([
                { id: 1, name: 'IT Department', description: 'Tim IT', members: [{id: 1, name: 'Admin', role: 'admin'}] },
                { id: 2, name: 'Finance', description: 'Tim Keuangan', members: [] }
            ]);
            setUsers([{ id: 1, name: 'Admin' }, { id: 2, name: 'Budi' }]);
            setLoading(false);
        }, 500);
    };"""
    },
    "Settings.jsx": {
        "pattern": r"import axios from 'axios';",
        "replacement": ""
    },
    "Integrations.jsx": {
        "pattern": r"const\s+fetchApiKeys\s*=\s*async\s*\(\)\s*=>\s*\{.*?\};",
        "replacement": """const fetchApiKeys = () => {
        setLoading(true);
        setTimeout(() => {
            setApiKeys([
                { id: 1, name: 'Production App', key: 'lexa_prod_xxx', is_active: true, created_at: new Date().toISOString(), last_used_at: new Date().toISOString() },
                { id: 2, name: 'Development', key: 'lexa_dev_xxx', is_active: false, created_at: new Date().toISOString(), last_used_at: null }
            ]);
            setLoading(false);
        }, 500);
    };"""
    }
}

for filename, config in mocks.items():
    filepath = os.path.join(src_dir, filename)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Remove axios import
        content = re.sub(r"import axios from 'axios';\n?", "", content)
        content = re.sub(r"const API_BASE = .*?;\n?", "", content)
        
        # Replace specific pattern if it exists
        if "pattern" in config:
            # We use DOTALL to match across newlines
            content = re.sub(config["pattern"], config["replacement"], content, flags=re.DOTALL)
            
            # Simple fallback for handling submit/delete logic inside to just avoid crashing
            # We will just replace axios.post/put/delete with a mock promise or alert
            content = re.sub(r"await axios\.post\([^)]+\);", "await new Promise(r => setTimeout(r, 500));", content)
            content = re.sub(r"await axios\.delete\([^)]+\);", "await new Promise(r => setTimeout(r, 500));", content)
            content = re.sub(r"await axios\.put\([^)]+\);", "await new Promise(r => setTimeout(r, 500));", content)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filename}")

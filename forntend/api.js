const API_BASE = "http://localhost:5000/api";

async function getProjects() {
    const res = await fetch(`${API_BASE}/projects`);
    return await res.json();
}

async function getReport(projectId) {
    const res = await fetch(`${API_BASE}/projects/${projectId}/report`);
    return await res.json();
}

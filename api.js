const API_URL = "https://group-project-fairness-auditor.onrender.com/api";

// Get all projects
async function getProjects() {
    try {
        const response = await fetch(`${API_URL}/projects`);
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
}

// Create a new project
async function createProject(project) {
    try {
        const response = await fetch(`${API_URL}/projects`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(project)
        });

        return await response.json();
    } catch (error) {
        console.error("Error creating project:", error);
        return null;
    }
}
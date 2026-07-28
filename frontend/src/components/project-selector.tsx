import { useEffect, useState } from "react";
import { useFilters } from "../context/filter-context";

type Project = { key: string; name: string };

export const ProjectSelector = () => {
  const { filters, setFilters } = useFilters();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<Project[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Load available projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.status}`);
        }
        const data = (await response.json()) as { projects: Project[] };
        setProjects(data.projects);

        // Set initial input value to current project name
        if (data.projects.length > 0) {
          const currentProject = data.projects.find((p) => p.key === filters.projects[0]);
          if (currentProject) {
            setInputValue(currentProject.name);
          }
        }

        // If current selection is not in available projects, reset to first project
        if (
          data.projects.length > 0 &&
          !data.projects.some((p) => p.key === filters.projects[0])
        ) {
          setFilters({
            ...filters,
            projects: [data.projects[0].key]
          });
          setInputValue(data.projects[0].name);
        }
      } catch (err) {
        console.error("[ProjectSelector] Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Handle input change with autocomplete filtering
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(true);

    if (value.trim() === "") {
      setSuggestions(projects);
    } else {
      const filtered = projects.filter(
        (p) =>
          p.name.toLowerCase().includes(value.toLowerCase()) ||
          p.key.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (project: Project) => {
    setInputValue(project.name);
    setShowSuggestions(false);
    setFilters({
      ...filters,
      projects: [project.key]
    });
  };

  // Handle blur to validate selection
  const handleInputBlur = () => {
    setTimeout(() => {
      const selected = projects.find((p) => p.name === inputValue || p.key === inputValue);
      if (!selected && projects.length > 0) {
        // Reset to first project if invalid input
        setInputValue(projects[0].name);
        setFilters({
          ...filters,
          projects: [projects[0].key]
        });
      }
      setShowSuggestions(false);
    }, 150);
  };

  return (
    <div className="project-selector-wrapper">
      <span className="project-label">Project</span>
      <div className="project-autocomplete-container">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={() => {
            setShowSuggestions(true);
            setSuggestions(projects);
          }}
          disabled={loading}
          className="project-input"
          placeholder={loading ? "Loading projects..." : "Select or type project..."}
          aria-label="Search or select project"
        />
        {showSuggestions && suggestions.length > 0 && (
          <div className="project-suggestions">
            {suggestions.map((project) => (
              <div
                key={project.key}
                className="project-suggestion-item"
                onClick={() => handleSuggestionClick(project)}
              >
                <strong>{project.name}</strong>
                <span className="project-key">({project.key})</span>
              </div>
            ))}
          </div>
        )}
        {showSuggestions && suggestions.length === 0 && inputValue.trim() !== "" && (
          <div className="project-suggestions">
            <div className="project-suggestion-no-match">No matching projects</div>
          </div>
        )}
      </div>
    </div>
  );
};

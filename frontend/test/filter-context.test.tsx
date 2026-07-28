import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FilterProvider, useFilters } from "../src/context/filter-context";
import { ProjectSelector } from "../src/components/project-selector";

// Renders the current filters so the test can assert context updates without
// depending on DashboardPage, which no longer owns project selection UI.
const FiltersProbe = () => {
  const { filters } = useFilters();
  return <span data-testid="projects-probe">{filters.projects.join(",")}</span>;
};

describe("filter_context", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          projects: [
            { key: "A", name: "Project A" },
            { key: "B", name: "Project B" }
          ]
        })
      }))
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("updates_filters_from_shared_context", async () => {
    render(
      <FilterProvider>
        <ProjectSelector />
        <FiltersProbe />
      </FilterProvider>
    );

    const input = (await screen.findByLabelText("Search or select project")) as HTMLInputElement;
    await waitFor(() => expect(input).not.toBeDisabled());

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Project B" } });
    fireEvent.click(await screen.findByText("Project B"));

    await waitFor(() => expect(screen.getByTestId("projects-probe").textContent).toBe("B"));
  });
});

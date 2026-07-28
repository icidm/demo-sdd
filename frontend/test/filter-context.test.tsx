import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FilterProvider } from "../src/context/filter-context";
import { DashboardPage } from "../src/pages/dashboard-page";

describe("filter_context", () => {
  it("updates_filters_from_shared_context", async () => {
    const client = {
      load: async () => ({
        status: "invalid-filter" as const,
        message: "x",
        fallbackPayload: null
      })
    };

    render(
      <FilterProvider>
        <DashboardPage client={client as never} />
      </FilterProvider>
    );

    const input = screen.getByLabelText("Projects") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "A,B" } });
    expect(input.value).toBe("A,B");
  });
});

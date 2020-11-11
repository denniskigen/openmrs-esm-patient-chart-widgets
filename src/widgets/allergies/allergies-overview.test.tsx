import React from "react";

import { BrowserRouter } from "react-router-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { of } from "rxjs/internal/observable/of";

import { useCurrentPatient } from "@openmrs/esm-api";

import AllergiesOverview from "./allergies-overview.component";
import AllergyForm from "./allergy-form.component";
import { performPatientAllergySearch } from "./allergy-intolerance.resource";
import {
  patient,
  mockPatientAllergies
} from "../../../__mocks__/allergies.mock";
import { openWorkspaceTab } from "../shared-utils";

const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockPerformPatientAllergySearch = performPatientAllergySearch as jest.Mock;
const mockOpenWorkspaceTab = openWorkspaceTab as jest.Mock;

jest.mock("./allergy-intolerance.resource", () => ({
  performPatientAllergySearch: jest.fn()
}));

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

jest.mock("../shared-utils", () => ({
  openWorkspaceTab: jest.fn()
}));

describe("<AllergiesOverview />", () => {
  beforeEach(() => {
    mockUseCurrentPatient.mockReset;
    mockOpenWorkspaceTab.mockReset;
    mockPerformPatientAllergySearch.mockReset;
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
  });

  it("should display the patient's allergic reactions and their manifestations", async () => {
    mockPerformPatientAllergySearch.mockReturnValue(of(mockPatientAllergies));

    render(
      <BrowserRouter>
        <AllergiesOverview basePath="/" />
      </BrowserRouter>
    );

    await screen.findByText("Allergies");

    expect(screen.getByText("Allergies")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
    expect(screen.getByText("Cephalosporins")).toBeInTheDocument();
    expect(screen.getByText("Angioedema (Severe)")).toBeInTheDocument();
    expect(screen.getByText("Peanuts")).toBeInTheDocument();
    expect(screen.getByText("Anaphylaxis (Mild)")).toBeInTheDocument();
    expect(screen.getByText("ACE inhibitors")).toBeInTheDocument();
    expect(
      screen.getByText("Angioedema, Anaphylaxis (Severe)")
    ).toBeInTheDocument();

    // Clicking "Add" launches the allergies form in a new workspace tab
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(mockOpenWorkspaceTab).toHaveBeenCalled();
    expect(mockOpenWorkspaceTab).toHaveBeenCalledWith(
      AllergyForm,
      "Allergies Form"
    );
  });

  it("renders an empty state view when allergies are absent", async () => {
    mockPerformPatientAllergySearch.mockReturnValue(of([]));

    render(
      <BrowserRouter>
        <AllergiesOverview basePath="/" />
      </BrowserRouter>
    );

    await screen.findByRole("heading", { name: "Allergies" });

    expect(screen.getByText("Allergies")).toBeInTheDocument();
    expect(
      screen.getByText(
        /There are no allergy intolerances to display for this patient/
      )
    ).toBeInTheDocument();
<<<<<<< Updated upstream
=======
    expect(screen.getByText(/Record allergy intolerances/)).toBeInTheDocument();
>>>>>>> Stashed changes
  });
});

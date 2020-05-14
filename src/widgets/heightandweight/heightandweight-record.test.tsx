import React from "react";
import { BrowserRouter, useParams } from "react-router-dom";
import HeightAndWeightRecord from "./heightandweight-record.component";
import { getDimensions } from "./heightandweight.resource";
import { useCurrentPatient } from "@openmrs/esm-api";
import { mockDimensionsResponse } from "../../../__mocks__/dimensions.mock";
import { mockPatient } from "../../../__mocks__/patient.mock";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { of } from "rxjs";

const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockGetDimensions = getDimensions as jest.Mock;
const mockUseParams = useParams as jest.Mock;

jest.mock("./heightandweight.resource", () => ({
  getDimensions: jest.fn()
}));

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn(),
  fhirConfig: { baseUrl: "/ws/fhir2" }
}));

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useParams: jest.fn()
}));

describe("<HeightAndWeightRecord/>", () => {
  let patient: fhir.Patient = mockPatient;
  beforeEach(() => {
    mockUseCurrentPatient.mockReset();
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
    mockUseParams.mockReturnValue("6113f91d-e30c-4b65-a8d8-cc04dd7b1db3");
  });

  it("renders without dying", async () => {
    mockGetDimensions.mockReturnValue(of(mockDimensionsResponse));

    render(
      <BrowserRouter>
        <HeightAndWeightRecord />
      </BrowserRouter>
    );

    await screen.findByText("Height & Weight");
  });

  it("should display the height, weight, bmi correctly", async () => {
    mockGetDimensions.mockReturnValue(of(mockDimensionsResponse));

    render(
      <BrowserRouter>
        <HeightAndWeightRecord />
      </BrowserRouter>
    );

    await screen.findByText("Height & Weight");
    expect(screen.getByText("Measured at")).toBeInTheDocument();
    expect(screen.getByText("Weight")).toBeInTheDocument();
    expect(screen.getByText("85")).toBeInTheDocument();
    expect(screen.getByText("kg")).toBeInTheDocument();
    expect(screen.getByText("187.43")).toBeInTheDocument();
    expect(screen.getByText("lbs")).toBeInTheDocument();
    expect(screen.getByText("Height")).toBeInTheDocument();
    expect(screen.getByText("165")).toBeInTheDocument();
    expect(screen.getByText("cm")).toBeInTheDocument();
    expect(screen.getByText("feet")).toBeInTheDocument();
    expect(screen.getByText("inches")).toBeInTheDocument();
    expect(screen.getByText("BMI")).toBeInTheDocument();
    expect(screen.getByText("31.2")).toBeInTheDocument();
    expect(screen.getByText("Kg/m2")).toBeInTheDocument();
    expect(screen.getByText("Details")).toBeInTheDocument();
    expect(screen.getByText("Last updated")).toBeInTheDocument();
    expect(screen.getByText("Last updated by")).toBeInTheDocument();
    expect(screen.getByText("Last updated location")).toBeInTheDocument();
  });

  it("should display error message when response is empty", async () => {
    mockGetDimensions.mockReturnValue(of([]));

    const { getByText } = render(
      <BrowserRouter>
        <HeightAndWeightRecord />
      </BrowserRouter>
    );

    await screen.findByText(
      "The patient's Height and Weight is not documented."
    );
    expect(getByText("add patient height and weight")).toBeTruthy();
  });
});

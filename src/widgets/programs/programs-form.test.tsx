import React from "react";
import { render, screen } from "@testing-library/react";
import { useCurrentPatient } from "@openmrs/esm-api";
import {
  fetchPrograms,
  fetchEnrolledPrograms,
  fetchLocations,
  getPatientProgramByUuid,
  getSession
} from "./programs.resource";
import ProgramsForm from "./programs-form.component";
import { mockPatient } from "../../../__mocks__/patient.mock";
import {
  mockCareProgramsResponse,
  mockEnrolledProgramsResponse,
  mockLocationsResponse,
  mockOncProgramResponse
} from "../../../__mocks__/programs.mock";
import { mockSessionDataResponse } from "../../../__mocks__/session.mock";
import { BrowserRouter } from "react-router-dom";
import { of } from "rxjs/internal/observable/of";
import "@testing-library/jest-dom/extend-expect";

const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockFetchLocations = fetchLocations as jest.Mock;
const mockFetchCarePrograms = fetchPrograms as jest.Mock;
const mockFetchEnrolledPrograms = fetchEnrolledPrograms as jest.Mock;
const mockGetProgramByUuid = getPatientProgramByUuid as jest.Mock;
const mockGetSession = getSession as jest.Mock;

jest.mock("./programs.resource", () => ({
  fetchEnrolledPrograms: jest.fn(),
  fetchPrograms: jest.fn(),
  fetchLocations: jest.fn(),
  getPatientProgramByUuid: jest.fn(),
  getSession: jest.fn(),
  saveProgramEnrollment: jest.fn()
}));

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

describe("<ProgramsForm />", () => {
  let match = { params: {}, isExact: false, path: "/", url: "/" };

  beforeEach(() => {
    mockUseCurrentPatient.mockReturnValue([
      false,
      mockPatient,
      mockPatient.id,
      null
    ]);
    mockGetSession.mockReturnValue(Promise.resolve(mockSessionDataResponse));
    mockFetchCarePrograms.mockReturnValue(of(mockCareProgramsResponse));
    mockFetchLocations.mockReturnValue(of(mockLocationsResponse));
    mockGetProgramByUuid.mockReturnValue(of(mockOncProgramResponse));
  });

  it("renders without dying", async () => {
    mockFetchEnrolledPrograms.mockReturnValue(of(mockEnrolledProgramsResponse));

    render(
      <BrowserRouter>
        <ProgramsForm match={match} />
      </BrowserRouter>
    );

    await screen.findByText("Add a new program");
  });

  it("renders the program form with all the appropriate fields and values", async () => {
    mockFetchEnrolledPrograms.mockReturnValue(of(mockEnrolledProgramsResponse));

    render(
      <BrowserRouter>
        <ProgramsForm match={match} />
      </BrowserRouter>
    );

    await screen.findByText("Add a new program");
    expect(screen.getByText("Add a new program")).toBeInTheDocument();
    expect(screen.getByText("Program")).toBeInTheDocument();
    expect(screen.getByText("Choose a program:")).toBeInTheDocument();
    expect(
      screen.getByText("Oncology Screening and Diagnosis")
    ).toBeInTheDocument();
    expect(screen.getByText("HIV Differentiated Care")).toBeInTheDocument();
    expect(screen.getByLabelText("Date enrolled")).toBeInTheDocument();
    expect(screen.getByLabelText("Date completed")).toBeInTheDocument();
    expect(screen.getByLabelText("Enrollment location")).toBeInTheDocument();
    expect(screen.getByText("Amani Hospital")).toBeInTheDocument();
    expect(screen.getByText("Inpatient Ward")).toBeInTheDocument();
    expect(screen.getByText("Isolation Ward")).toBeInTheDocument();
    expect(screen.getByText("Laboratory")).toBeInTheDocument();
    expect(screen.getByText("Mosoriot Pharmacy")).toBeInTheDocument();
    expect(screen.getByText("Mosoriot Subcounty Hospital")).toBeInTheDocument();
    expect(screen.getByText("MTRH")).toBeInTheDocument();
    expect(screen.getByText("MTRH Module 4")).toBeInTheDocument();
    expect(screen.getByText("Outpatient Clinic")).toBeInTheDocument();
    expect(screen.getByText("Pharmacy")).toBeInTheDocument();
    expect(screen.getByText("Registration Desk")).toBeInTheDocument();
    expect(screen.getByText("Unknown Location")).toBeInTheDocument();
    expect(screen.getAllByRole("button").length).toEqual(2);
    expect(screen.getAllByRole("button")[0].textContent).toEqual("Cancel");
    expect(screen.getAllByRole("button")[1].textContent).toEqual("Enroll");
  });

  it("renders the edit program form when the edit button is clicked on an existing program", async () => {
    mockFetchEnrolledPrograms.mockReturnValue(of(mockEnrolledProgramsResponse));
    match = {
      params: {
        program: "Oncology Screening and Diagnosis",
        programUuid: "46bd14b8-2357-42a2-8e16-262e8f0057d7",
        enrollmentDate: "2020-03-25T00:00:00.000+0000",
        completionDate: "2020-03-25T00:00:00.000+0000",
        location: "58c57d25-8d39-41ab-8422-108a0c277d98"
      },
      isExact: false,
      path: "/",
      url: "/"
    };

    render(
      <BrowserRouter>
        <ProgramsForm match={match} />
      </BrowserRouter>
    );

    await screen.findByText("Edit Program");
    expect(screen.getByText("Edit Program")).toBeInTheDocument();
    expect(
      screen.getByText("Oncology Screening and Diagnosis")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Date enrolled")).toBeInTheDocument();
    expect(screen.getByLabelText("Date completed")).toBeInTheDocument();
    expect(screen.getByLabelText("Enrollment location")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });
});

import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import styles from "./programs-overview.css";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import SummaryCardRow from "../../ui-components/cards/summary-card-row.component";
import SummaryCardRowContent from "../../ui-components/cards/summary-card-row-content.component";
import { fetchEnrolledPrograms } from "./programs.resource";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import HorizontalLabelValue from "../../ui-components/cards/horizontal-label-value.component";
import { useCurrentPatient, newWorkspaceItem } from "@openmrs/esm-api";
import SummaryCardFooter from "../../ui-components/cards/summary-card-footer.component";
import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";
import ProgramsForm from "./programs-form.component";

export default function ProgramsOverview(props: ProgramsOverviewProps) {
  const [patientPrograms, setPatientPrograms] = useState(null);
  const [
    isLoadingPatient,
    patient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();
  const { t } = useTranslation();
  const match = useRouteMatch();
  const chartBasePath =
    match.url.substr(0, match.url.search("/chart/")) + "/chart";
  const programsPath = chartBasePath + "/" + props.basePath;

  useEffect(() => {
    if (patientUuid) {
      const subscription = fetchEnrolledPrograms(patientUuid).subscribe(
        programs => setPatientPrograms(programs),
        createErrorHandler()
      );

      return () => subscription.unsubscribe();
    }
  }, [patientUuid]);

  const openProgramsWorkspaceTab = (componentToAdd, componentName) => {
    newWorkspaceItem({
      component: componentToAdd,
      name: componentName,
      props: {
        match: { params: {} }
      },
      inProgress: false,
      validations: (workspaceTabs: any[]) =>
        workspaceTabs.findIndex(tab => tab.component === componentToAdd)
    });
  };

  function displayCarePrograms() {
    return (
      <SummaryCard
        name={t("care programs", "Care Programs")}
        link={`/patient/${patientUuid}/chart/programs`}
        styles={{ margin: "1.25rem, 1.5rem" }}
        addComponent={ProgramsForm}
        showComponent={() =>
          openProgramsWorkspaceTab(ProgramsForm, "Programs Form")
        }
      >
        <SummaryCardRow>
          <SummaryCardRowContent>
            <HorizontalLabelValue
              label={t("Active Programs", "Active Programs")}
              labelStyles={{
                color: "var(--omrs-color-ink-medium-contrast)",
                fontFamily: "Work Sans"
              }}
              value={t("Since", "Since")}
              valueStyles={{
                color: "var(--omrs-color-ink-medium-contrast)",
                fontFamily: "Work Sans"
              }}
            />
          </SummaryCardRowContent>
        </SummaryCardRow>
        {patientPrograms &&
          patientPrograms.map(program => {
            return (
              <SummaryCardRow
                key={program.uuid}
                linkTo={`${programsPath}/${program.uuid}`}
              >
                <HorizontalLabelValue
                  label={program.display}
                  labelStyles={{ fontWeight: 500 }}
                  value={dayjs(program.dateEnrolled).format("MMM-YYYY")}
                  valueStyles={{ fontFamily: "Work Sans" }}
                />
              </SummaryCardRow>
            );
          })}
        <SummaryCardFooter linkTo={`${programsPath}`} />
      </SummaryCard>
    );
  }

  return (
    <>
      {patientPrograms && patientPrograms.length ? (
        displayCarePrograms()
      ) : (
        <SummaryCard name={t("care programs", "Care Programs")}>
          <div className={styles.emptyPrograms}>
            <p className="omrs-type-body-regular">
              No Program enrollments recorded.
            </p>
          </div>
        </SummaryCard>
      )}
    </>
  );
}

type ProgramsOverviewProps = {
  basePath: string;
};

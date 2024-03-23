import React from "react";
import Section from "./Section";
import Container from "@material-ui/core/Container";
import SectionHeader from "./SectionHeader";
import EmployeeDashboard from "./EmployeeDashboard";
import HrDashboard from "./HrDashboard";
import { employeeSections, hrSections } from "./../data/sections";
import { useAuth } from "./../util/auth.js";

function DashboardSection(props) {
  const auth = useAuth();

  const sections =
    auth.user.role === "employee"
      ? employeeSections
      : auth.user.role === "hr"
      ? hrSections
      : [];

  console.info(auth.user.role);
  return (
    <Section
      bgColor={props.bgColor}
      size={props.size}
      bgImage={props.bgImage}
      bgImageOpacity={props.bgImageOpacity}
    >
      <Container>
        <SectionHeader
          title={props.title}
          subtitle={props.subtitle}
          size={4}
          textAlign="center"
        />

        {auth.user.role === "hr" && <HrDashboard sections={sections} />}
        {auth.user.role === "employee" && (
          <EmployeeDashboard sections={sections} />
        )}
      </Container>
    </Section>
  );
}

export default DashboardSection;

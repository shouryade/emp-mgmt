import React from "react";
import HrTables from "./HrTables";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { useAuth } from "../util/auth.js";
import {
  useUsersByOwner,
  useSalariesByOwner,
  useAllLeaveApplicationsByOwner,
} from "../util/db";

const AdminDashboard = ({ sections }) => {
  const auth = useAuth();
  const [activeSection, setActiveSection] = React.useState(sections[0]);
  const {
    data: usersData,
    status: usersStatus,
    error: usersError,
  } = useUsersByOwner(auth.user.uid);
  const {
    data: leaveApplicationsData,
    status: leaveApplicationsStatus,
    error: leaveApplicationsError,
  } = useAllLeaveApplicationsByOwner(auth.user.uid);

  const {
    data: salariesData,
    status: salarieStatus,
    error: salariesError,
  } = useSalariesByOwner(auth.user.uid);

  const getSectionData = (activeSection) => {
    let i;
    for (i = 0; i < sections.length; i++) {
      if (activeSection === sections[i].name) {
        return sections[i];
      }
    }
  };

  const handleClick = (e, sectionName) => {
    e.preventDefault();
    const section = getSectionData(sectionName);
    setActiveSection(section);
  };

  return (
    <Grid container={true} spacing={4}>
      <Grid
        item={true}
        xs={12}
        sm={3}
        md={2}
        lg={2}
        xl={2}
        style={{ position: "fixed", left: 10 }}
      >
        <header>
          <h3>{auth.user.role}</h3>
        </header>
        <ul>
          {sections
            ? sections.map((section, i) => (
                <li key={i}>
                  <Button
                    variant="text"
                    className="btn"
                    onClick={(e) => handleClick(e, section.name)}
                  >
                    {section.name}
                  </Button>
                </li>
              ))
            : console.log("No sections available.")}
        </ul>
      </Grid>
      <Grid
        item={true}
        xs={12}
        sm={9}
        md={10}
        lg={10}
        xl={10}
        style={{ marginLeft: "auto" }}
      >
        {activeSection.name === "User" && (
          <HrTables activeSection={activeSection} data={usersData} />
        )}
        {activeSection.name === "Leave Application" && (
          <HrTables
            activeSection={activeSection}
            data={leaveApplicationsData}
          />
        )}
        {activeSection.name === "Salary" && (
          <HrTables activeSection={activeSection} data={salariesData} />
        )}
      </Grid>
    </Grid>
  );
};

export default AdminDashboard;

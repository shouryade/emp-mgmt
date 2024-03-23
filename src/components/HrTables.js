import * as React from "react";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import EditUsersModal from "./hr-forms/EditUsersModal";
import EditSalariesModal from "./hr-forms/EditSalariesModal";
import EditAllLeaveApplicationsModal from "./hr-forms/EditAllLeaveApplicationsModal";
import { updateAllLeaveApplications } from "../util/db";
import Title from "./Title";

import { HrUsersRow, HrSalaryRow, HrLeaveApplicationRow } from "./hr/Rows";
import { ButtonGroup } from "@material-ui/core";
function preventDefault(event) {
  event.preventDefault();
}

export default function Orders(props) {
  const [creatingProject, setCreatingProject] = React.useState(false);
  const [updatingProject, setUpdateProject] = React.useState(false);
  const [rowId, setRowId] = React.useState(0);

  console.info(creatingProject, props.activeSection.name, props.data);
  return (
    <React.Fragment>
      <div className="display-flex">
        <Title>{props.activeSection.name} Details</Title>
        <Button
          variant="contained"
          size="medium"
          color="primary"
          onClick={() => setCreatingProject(true)}
        >
          + Add
        </Button>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            {props.activeSection.headCells &&
              props.activeSection.headCells.map((cell) => (
                <TableCell align="left">
                  <b>{cell.name}</b>
                </TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data && props.data.length !== 0
            ? props.data
                .filter((role) => role.section === props.activeSection.name)
                .map((row) => (
                  <TableRow key={row.id}>
                    {row.section === "User" && (
                      <>
                        <HrUsersRow row={row} />
                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            onClick={() => {
                              setUpdateProject(true);
                              setRowId(row.id);
                            }}
                          >
                            Update
                          </Button>
                        </TableCell>
                      </>
                    )}
                    {row.section === "Leave Application" && (
                      <>
                        <HrLeaveApplicationRow row={row} />
                        <TableCell>
                          <ButtonGroup>
                            <Button
                              variant="contained"
                              style={{
                                backgroundColor: "#66bb6a",
                              }}
                              onClick={() => {
                                updateAllLeaveApplications(
                                  row.id,
                                  row,
                                  "Approved"
                                );
                              }}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="contained"
                              style={{
                                backgroundColor: "#dd3e33",
                              }}
                              onClick={() => {
                                updateAllLeaveApplications(
                                  row.id,
                                  row,
                                  "Rejected"
                                );
                              }}
                            >
                              Reject
                            </Button>
                          </ButtonGroup>
                        </TableCell>
                      </>
                    )}
                    {row.section === "Salary" && (
                      <>
                        <HrSalaryRow row={row} />
                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            onClick={() => {
                              setUpdateProject(true);
                              setRowId(row.id);
                            }}
                          >
                            Update
                          </Button>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))
            : "Sorry, no data available at this time."}
        </TableBody>
      </Table>

      {creatingProject && props.activeSection.name === "User" && (
        <EditUsersModal
          section={props.activeSection.name}
          onDone={() => setCreatingProject(false)}
        />
      )}
      {updatingProject && props.activeSection.name === "User" && (
        <EditUsersModal
          section={props.activeSection.name}
          vals={rowId}
          onDone={() => setUpdateProject(false)}
        />
      )}
      {creatingProject && props.activeSection.name === "Leave Application" && (
        <EditAllLeaveApplicationsModal
          section={props.activeSection.name}
          onDone={() => setCreatingProject(false)}
        />
      )}

      {creatingProject && props.activeSection.name === "Salary" && (
        <EditSalariesModal
          section={props.activeSection.name}
          onDone={() => setCreatingProject(false)}
        />
      )}
      {updatingProject && props.activeSection.name === "Salary" && (
        <EditSalariesModal
          section={props.activeSection.name}
          id={rowId}
          onDone={() => setUpdateProject(false)}
        />
      )}
    </React.Fragment>
  );
}

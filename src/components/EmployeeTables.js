import * as React from "react";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import EditInfoModal from "./employee-forms/EditInfoModal";
import EditLeaveApplicationsModal from "./employee-forms/EditLeaveApplicationsModal";
import Title from "./Title";

function preventDefault(event) {
  event.preventDefault();
}

export default function EmployeeTables(props) {
  const [creatingProject, setCreatingProject] = React.useState(false);
  const [hasData, setData] = React.useState(false);

  console.info(props);
  return (
    <React.Fragment>
      <div className="display-flex">
        <Title>{props.activeSection.name} Details</Title>
        {!hasData && (
          <Button
            variant="contained"
            size="medium"
            color="primary"
            onClick={() => setCreatingProject(true)}
          >
            + Add
          </Button>
        )}
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
                        <TableCell>{row.firstName && row.firstName}</TableCell>
                        <TableCell>
                          {row.middleName && row.middleName}
                        </TableCell>
                        <TableCell>{row.lastName && row.lastName}</TableCell>
                        <TableCell>{row.gender && row.gender}</TableCell>
                        <TableCell>{row.number && row.number}</TableCell>
                        <TableCell>{row.email && row.email}</TableCell>
                        <TableCell>{row.pan && row.pan}</TableCell>
                        <TableCell>{row.jobDate && row.jobDate}</TableCell>
                      </>
                    )}
                    {row.section === "Leave Application" && (
                      <>
                        <TableCell>{row.name && row.name}</TableCell>
                        <TableCell>{row.leaveType && row.leaveType}</TableCell>
                        <TableCell>{row.fromDate && row.fromDate}</TableCell>
                        <TableCell>{row.toDate && row.toDate}</TableCell>
                        <TableCell>
                          {row.leaveReason && row.leaveReason}
                        </TableCell>
                        <TableCell
                          style={{
                            backgroundColor:
                              row.status === "Approved"
                                ? "green"
                                : row.status === "Rejected"
                                ? "red"
                                : "yellow",
                          }}
                        >
                          {row.status && row.status}
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))
            : "Sorry, no data available at this time."}
        </TableBody>
      </Table>

      {creatingProject && props.activeSection.name === "User" && (
        <EditInfoModal
          section={props.activeSection.name}
          onDone={() => setCreatingProject(false)}
        />
      )}

      {creatingProject && props.activeSection.name === "Leave Application" && (
        <EditLeaveApplicationsModal
          section={props.activeSection.name}
          onDone={() => setCreatingProject(false)}
        />
      )}
    </React.Fragment>
  );
}

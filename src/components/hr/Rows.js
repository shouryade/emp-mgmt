import TableCell from "@material-ui/core/TableCell";
export const HrUsersRow = ({ row }) => {
  return (
    <>
      <TableCell>{row.id && row.id}</TableCell>
      <TableCell>{row.firstName && row.firstName}</TableCell>
      <TableCell>{row.middleName && row.middleName}</TableCell>
      <TableCell>{row.lastName && row.lastName}</TableCell>
      <TableCell>{row.gender && row.gender}</TableCell>
      <TableCell>{row.contact && row.contact}</TableCell>
      <TableCell>{row.email && row.email}</TableCell>
      <TableCell>{row.jobDate && row.jobDate}</TableCell>
    </>
  );
};

export const HrSalaryRow = ({ row }) => {
  return (
    <>
      <TableCell>{row.employeeName && row.employeeName}</TableCell>
      <TableCell>{row.salary && row.salary}</TableCell>
      <TableCell>{row.bankName && row.bankName}</TableCell>
      <TableCell>{row.accountNo && row.accountNo}</TableCell>
      <TableCell>{row.accountHolder && row.accountHolder}</TableCell>
      <TableCell>{row.ifsc && row.ifsc}</TableCell>
      <TableCell>{row.taxDeduction && row.taxDeduction}</TableCell>
    </>
  );
};

export const HrLeaveApplicationRow = ({ row }) => {
  return (
    <>
      <TableCell>{row.id && row.id}</TableCell>
      <TableCell>{row.name && row.name}</TableCell>
      <TableCell>{row.leaveType && row.leaveType}</TableCell>
      <TableCell>{row.fromDate && row.fromDate}</TableCell>
      <TableCell>{row.toDate && row.toDate}</TableCell>
      <TableCell>{row.leaveReason && row.leaveReason}</TableCell>
      <TableCell>{row.status && row.status}</TableCell>
    </>
  );
};

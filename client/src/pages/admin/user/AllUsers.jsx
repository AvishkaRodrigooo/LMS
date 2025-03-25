import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllUsersQuery } from "@/features/api/authApi"; // Ensure you import the correct hook
import { Edit } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const AllUsers = () => {
  
  const { data, isLoading, isError } = useGetAllUsersQuery();
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);//dob ekt date format ek gnn 
    return date.toLocaleDateString(); // This will format it as 'MM/DD/YYYY'
  };
// Format the lastLogin time
const formatLoginTime = (dateString) => {
  if (!dateString) return "Never logged in"; // Handle case when lastLogin is null or undefined
  const date = new Date(dateString);
  return date.toLocaleString(); // This will format it as 'MM/DD/YYYY, HH:MM:SS'
};

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>Something went wrong...</h1>;

  return (
    <div>
      <Button>Generate Report</Button>
      <Table>
        <TableCaption>A list of all users.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Dob</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Login Time</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.users?.map((user) => (
            
            <TableRow key={user.id}> {/* Add a key for better React performance */}
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{formatDate(user.dob)}</TableCell>
              <TableCell>{user.path}</TableCell>
              <TableCell>{formatLoginTime(user.lastLogin)}</TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="ghost" onClick={() => navigate(`/edit-user/${user.id}`)}>
                  <Edit />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AllUsers;

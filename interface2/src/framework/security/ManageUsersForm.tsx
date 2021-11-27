import React, { FC, useContext, useState } from 'react';

import {
  Box, Button, IconButton, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, Typography,
  useTheme, useMediaQuery
} from '@mui/material';

import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import * as SecurityApi from "../../api/security";
import { ButtonRow, FormLoader, SectionContent } from '../../components';
import { createUserValidator } from '../../validators';
import { useRest } from '../../utils';
import { SecuritySettings, User } from '../../types';
import { AuthenticatedContext } from '../../contexts/authentication';

import UserForm from './UserForm';

function compareUsers(a: User, b: User) {
  if (a.username < b.username) {
    return -1;
  }
  if (a.username > b.username) {
    return 1;
  }
  return 0;
}

const SecuritySettingsForm: FC = () => {

  const {
    loadData, saving, data, setData, saveData, errorMessage
  } = useRest<SecuritySettings>({ read: SecurityApi.readSecuritySettings, update: SecurityApi.updateSecuritySettings });

  const theme = useTheme();
  const narrow = useMediaQuery(theme.breakpoints.down('xs'));

  const [user, setUser] = useState<User>();
  const [creating, setCreating] = useState<boolean>(false);
  const authenticatedContext = useContext(AuthenticatedContext);

  const content = () => {
    if (!data) {
      return (<FormLoader loadData={loadData} errorMessage={errorMessage} />);
    }

    const noAdminConfigured = () => !data.users.find((u) => u.admin);

    const removeUser = (toRemove: User) => {
      const users = data.users.filter((u) => u.username !== toRemove.username);
      setData({ ...data, users });
    };

    const createUser = () => {
      setCreating(true);
      setUser({
        username: "",
        password: "",
        admin: true
      });
    };

    const editUser = (toEdit: User) => {
      setCreating(false);
      setUser({ ...toEdit });
    };

    const cancelEditingUser = () => {
      setUser(undefined);
    };

    const doneEditingUser = () => {
      if (user) {
        const users = [...data.users.filter((u) => u.username !== user.username), user];
        setData({ ...data, users });
        setUser(undefined);
      }
    };

    const onSubmit = async () => {
      await saveData();
      authenticatedContext.refresh();
    };

    return (
      <>
        <Table size="small" padding={narrow ? "none" : "normal"}>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell align="center">Admin?</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {data.users.sort(compareUsers).map((u) => (
              <TableRow key={u.username}>
                <TableCell component="th" scope="row">
                  {u.username}
                </TableCell>
                <TableCell align="center">
                  {
                    u.admin ? <CheckIcon /> : <CloseIcon />
                  }
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small" aria-label="Delete" onClick={() => removeUser(u)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton size="small" aria-label="Edit" onClick={() => editUser(u)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter >
            <TableRow>
              <TableCell colSpan={2} />
              <TableCell align="center" padding="normal">
                <Button startIcon={<PersonAddIcon />} variant="contained" color="secondary" onClick={createUser}>
                  Add
                </Button>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        {
          noAdminConfigured() &&
          (
            <Box bgcolor="error.main" color="error.contrastText" p={2} mt={2} mb={2}>
              <Typography variant="body1">
                You must have at least one admin user configured.
              </Typography>
            </Box>
          )
        }
        <ButtonRow>
          <Button
            startIcon={<SaveIcon />}
            disabled={saving || noAdminConfigured()}
            variant="contained"
            color="primary"
            type="submit"
            onClick={onSubmit}
          >
            Save
          </Button>
        </ButtonRow>
        <UserForm
          user={user}
          setUser={setUser}
          creating={creating}
          onDoneEditing={doneEditingUser}
          onCancelEditing={cancelEditingUser}
          validator={createUserValidator(data.users, creating)}
        />
      </>
    );
  };

  return (
    <SectionContent title='Manage Users' titleGutter>
      {content()}
    </SectionContent>
  );
};

export default SecuritySettingsForm;

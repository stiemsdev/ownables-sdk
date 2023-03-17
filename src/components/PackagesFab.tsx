import * as React from 'react';
import {Divider, Fab, ListItemIcon} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import {TypedPackage, TypedPackageStub} from "../interfaces/TypedPackage";
import If from "./If";
import selectFile from "../utils/selectFile";
import PackageService from "../services/Package.service";
import {useEffect} from "react";
import Tooltip from "./Tooltip";

interface PackagesDialogProps {
  packages: Array<TypedPackage|TypedPackageStub>;
  open: boolean;
  onClose: () => void;
  onSelect: (pkg: TypedPackage|TypedPackageStub) => void;
  onImport: () => void;
}

function PackagesDialog(props: PackagesDialogProps) {
  const {onClose, onSelect, onImport, open, packages} = props;

  return (
    <Dialog onClose={onClose} open={open}>
      <List sx={{pt: 0}} disablePadding>
        {packages.map((pkg) => (
          <ListItem disablePadding disableGutters key={pkg.name}>
            <Tooltip condition={"stub" in pkg} title={`Import ${pkg.name} example`} placement="right" arrow>
              <ListItemButton onClick={() => onSelect(pkg)} style={{textAlign: "center", color: "stub" in pkg ? "#666" : undefined }}>
                <ListItemText primary={pkg.name} />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
      <If condition={packages.length > 0}><Divider /></If>
      <List sx={{pt: 0}} disablePadding>
        <ListItem disablePadding disableGutters key="add">
          <ListItemButton autoFocus onClick={() => onImport()} style={{textAlign: "center"}}>
            <ListItemIcon><AddIcon/></ListItemIcon>
            <ListItemText primary="Import package"/>
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  );
}

interface PackagesFabProps {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSelect: (pkg: TypedPackage) => void;
}

export default function PackagesFab(props: PackagesFabProps) {
  const fabStyle = {
    position: 'fixed',
    bgcolor: 'common.white',
    bottom: 20,
    right: 20,
  };

  const {open, onOpen, onClose, onSelect} = props;
  const [packages, setPackages] = React.useState<Array<TypedPackage|TypedPackageStub>>([]);

  const updatePackages = () => setPackages(PackageService.list());
  useEffect(updatePackages, []);

  const importPackages = async () => {
    const files = await selectFile({ accept: '.zip', multiple: true });
    await Promise.all(Array.from(files).map(file => PackageService.import(file)));
    updatePackages();
  };

  const selectPackage = async (pkg: TypedPackage|TypedPackageStub) => {
    if ("stub" in pkg) {
      pkg = await PackageService.download(pkg.key);
      updatePackages();
    }

    onSelect(pkg);
  };

  return <>
    <Fab sx={fabStyle} aria-label="add" size="large" onClick={onOpen}>
      <AddIcon fontSize="large" />
    </Fab>
    <PackagesDialog
      packages={packages}
      open={open}
      onClose={onClose}
      onSelect={selectPackage}
      onImport={importPackages} />
  </>
}

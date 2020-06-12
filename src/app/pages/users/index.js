/* eslint-disable no-restricted-imports */
import { Checkbox, Chip, CircularProgress } from "@material-ui/core";
import {
  AddBox,
  AddCircleOutline,
  ArrowRightAlt,
  Edit,
  RemoveCircle,
} from "@material-ui/icons";
import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createData, headRows } from "../../mockData/users";
import CustomizedIconButton from "../../partials/content/CustomizedIconButton";
import MatTable from "../../partials/content/Table";
import * as Actions from "../../store/ducks/actions";
import AddUserForm from "./components/AddUserForm";
import EditUserForm from "./components/EditUserForm";
import LoadingProgress from "../../components/LoadingProgress";

const initialModalState = {
  modal: "",
  selected: {},
};
const Users = (props) => {
  const dispatch = useDispatch();
  const { users, isFetching, count } = useSelector((store) => store.userList);
  const [Modal, setModal] = React.useState(initialModalState);
  const [pagination, setPagination] = React.useState({ offset: 0, limit: 10 });
  const { modal, selected } = Modal;
  const { offset, limit } = pagination;

  React.useEffect(() => {
    dispatch(Actions.User.getUserList({ offset, limit }));
  }, [offset, limit]);

  const rows = React.useMemo(
    () =>
      Array.isArray(users) &&
      users.map((_item, index) => {
        const permissions =
          _item.permissions &&
          _item.permissions.map((_item) => ({
            name: _item.name,
            id: _item.pivot.permission_id,
          })) || [];
        const { id, email, name } = _item;
        const selectedItem = { id, email, name, permissions };
        return createData(
          _item.id,
          _item.name,
          _item.email,
          <Checkbox checked={Boolean(_item.is_active)} />,
          <>
            {permissions.map((_el) => (
              <Chip
                key={_el.id}
                style={{ marginBottom: "2px" }}
                label={_el.name}
                color="primary"
              />
            ))}
          </>,
          _item.updated_at && moment(_item.updated_at).format("DD/MM/YYYY"),
          _item.updated_at && moment(_item.created_at).format("DD/MM/YYYY"),
          <>
            <CustomizedIconButton
              onClick={() => handleSelectModal("edit", selectedItem)}
              Icon={<Edit />}
              title="Edit"
            />
            {_item.is_active ? (
              <CustomizedIconButton Icon={<AddBox />} title="Unblock" />
            ) : (
              <CustomizedIconButton Icon={<RemoveCircle />} title="Block" />
            )}
            <Link to={`/users/${_item.id}`}>
              <CustomizedIconButton Icon={<ArrowRightAlt />} title="Detail" />
            </Link>
          </>
        );
      }),
    [users]
  );
  console.log(rows);

  const handleSelectModal = (modal, selected = {}) => {
    setModal({
      modal,
      selected,
    });
  };

  const handleClose = () => {
    setModal(initialModalState);
  };

  return (
    <>
      <div className="layout-header-toolbar">
        <h1>User management</h1>
        <CustomizedIconButton
          onClick={() => handleSelectModal("add")}
          className="header-toolbar-btn"
          Icon={<AddCircleOutline />}
          title="Add User"
        />
      </div>
        <MatTable
          headRows={headRows}
          rows={rows}
          pagination={pagination}
          setPagination={setPagination}
          count={count}
          isFetching={isFetching}
        />
      {modal === "add" && (
        <AddUserForm open={modal === "add"} handleClose={handleClose} />
      )}
      {modal === "edit" && (
        <EditUserForm
          open={modal === "edit"}
          handleClose={handleClose}
          selected={selected}
        />
      )}
    </>
  );
};

export default Users;

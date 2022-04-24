//REACT
import React from "react";
import { useHistory } from "react-router-dom";
//REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../store/actions/index";
//CoreUI
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
//Api
import { API_URL } from "../util/Api";

const TheHeaderDropdown = ({ user, reset }) => {
  let history = useHistory();

  const Logout = () => {
    reset();
    history.push("/login");
  };

  return (
    <CDropdown inNav className="c-header-nav-items mx-2" direction="down">
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div className="c-avatar">
          <CImg
            src={
              "https://cdn.discordapp.com/attachments/300483456440336385/966400794167488622/default.png"
            }
            style={{ width: "50px" }}
            className="c-avatar-img"
            alt={"avatar"}
          />
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem divider />
        <CDropdownItem onClick={() => Logout()}>
          <CIcon name="cilAccountLogout" className="mfe-2" />
          Sair
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

const mapStateToProps = (state) => ({ user: state.user });
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(TheHeaderDropdown);

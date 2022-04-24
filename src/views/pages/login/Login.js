import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import * as actions from "../../../store/actions";
import { routeLogar } from "../../../util/Api";
import { getAdmin, expToken } from "../../../util/tokenFunction";
import CIcon from "@coreui/icons-react";

const Login = ({ history, setToken, setAdmin, token }) => {
  const [state, setState] = useState({
    login: "",
    password: "",
    error: "",
    message: "",
  });

  const handleKeys = (e, func) => {
    if (e.keyCode === 13) {
      func(e);
    }
  };

  const logar = () => {
    let msg = "";
    if (state.login === "")
      msg = msg + " - Nome de usuário ou email é obrigatório";
    if (state.password === "") msg = msg + " - Senha é obrigatória";
    let err = msg !== "" ? false : true;

    const data = {
      login: state.login,
      password: state.password,
    };
    if (err) {
      routeLogar(data)
        .then(function (data) {
          if (data.status === 0) {
            setState({
              ...state,
              error: false,
              message: " Aconteceu um erro Tente Novamente",
            });
          } else {
            setState({
              ...state,
              error: true,
              message: msg,
            });

            setToken(data.token);
            setAdmin(getAdmin(data.token));
            history.push("/list/");
          }
        })
        .catch((err) => {
          setState({
            ...state,
            error: false,
            message: " Aconteceu um erro Tente Novamente",
          });
        });
    } else {
      setState({
        ...state,
        error: err,
        message: msg,
      });
    }
  };
  // useEffect(() => {
  //   if (!expToken(token ?? null)) history.push("/list/");
  // }, [history, state, token]);

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        {state.error && (
          <CCard className="border-success" style={{ textAlign: "center" }}>
            Successs
          </CCard>
        )}
        {!state.error && state.message !== "" && (
          <CCard className="border-danger" style={{ textAlign: "center" }}>
            Erros :{state.message}
          </CCard>
        )}
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-muted">Entre na sua conta</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="text"
                        placeholder="Usuário"
                        autoComplete="username"
                        maxLength="15"
                        name="username"
                        onKeyUp={(e) => handleKeys(e, logar)}
                        value={state.login}
                        onChange={(e) => {
                          let login = { ...state.login };
                          login = e.target.value;
                          setState({ ...state, login });
                        }}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="password"
                        placeholder="Senha"
                        autoComplete="current-password"
                        maxLength="15"
                        name="password"
                        onKeyUp={(e) => handleKeys(e, logar)}
                        value={state.password}
                        onChange={(e) => {
                          let password = { ...state.password };
                          password = e.target.value;
                          setState({ ...state, password });
                        }}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol className="mb-4">
                        <CButton
                          color="primary"
                          onClick={() => logar()}
                          className="px-4"
                        >
                          Logar
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard
                className="text-white bg-primary py-5 d-md-down-none"
                style={{ width: "44%" }}
              >
                <CCardBody className="text-center">
                  <div>
                    <h2 color="primary">Não possui login?</h2>
                    <Link to="/register">
                      <CButton
                        color="primary"
                        className="mt-3"
                        active
                        tabIndex={-1}
                      >
                        Registre-se aqui
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

const mapStateToProps = (state) => ({ token: state.token, admin: state.admin });
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(Login);

//React
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../../store/actions";
//CoreUi
import {
  CCard,
  CRow,
  CCol,
  CCardBody,
  CCardHeader,
  CLabel,
  CInput,
  CFormGroup,
} from "@coreui/react";
//Api
import { routeGetClient } from "../../../util/Api";
import { routeEdit } from "../../../util/Api";
import { cpfMask, telMask } from "../mask";
import { expToken } from "../../../util/tokenFunction";
import {
  clearString,
  validate_address,
  validate_name,
  validate_telephone,
} from "../validate";
//Style
import "./edit.css";
import "../top.css";

const Edit = ({ token, history }) => {
  let { id } = useParams();
  const [state, setState] = useState({
    client: {
      name: "",
      cpf: "",
      street: "",
      home_num: "",
      district: "",
      telephone: "",
      obs: "",
    },
    error: "",
    message: "",
  });
  useEffect(() => {
    if (expToken(token)) history.push("/login/");

    if (!state.fetched) {
      let data = { id };
      routeGetClient(data, token).then(function (data) {
        if (data.status === 1) {
          let client_res = data.client[0];
          const client = {
            name: client_res.name,
            cpf: client_res.cpf,
            street: client_res.street,
            home_num: client_res.home_num,
            district: client_res.district,

            telephone: client_res.telephone,
            obs: client_res.obs,
          };
          setState({ ...state, fetched: true, client });
        }
      });
    }
  }, [history, id, state, token]);

  const editClient = () => {
    setState({
      ...state,
      error: "",
      message: "",
    });
    let msg = "";
    const client = {
      name: state.client.name,
      cpf: clearString(state.client.cpf),
      street: state.client.street,
      home_num: state.client.home_num,
      district: state.client.district,
      telephone: clearString(state.client.telephone),
      obs: state.client.obs,
    };

    // msg = validate_cpf(client.cpf, msg);
    msg = validate_name(client.name, msg);
    msg = validate_telephone(client.telephone, msg);
    msg = validate_address(
      client.street,
      client.home_num,
      client.district,
      msg
    );

    let err = msg !== "" ? false : true;
    setState({
      ...state,
      error: err,
      message: msg,
    });

    const data = {
      client: client,
      id: id,
    };

    if (err) {
      routeEdit(data, token)
        .then(function (data) {
          history.push("/profile/" + id);
          // history.go(0);
        })
        .catch((err) => {
          setState({
            ...state,
            error: false,
            message: " Aconteceu um erro Tente Novamente",
          });
        });
    }
  };
  const handleKeys = (e, func) => {
    if (e.keyCode === 13) {
      func(e);
    }
  };

  const handlechange = (e) => {
    let client = { ...state.client };
    client.cpf = cpfMask(e.target.value);
    setState({ ...state, client });
  };

  const telephoneChange = (e) => {
    let client = { ...state.client };
    client.telephone = telMask(e.target.value);
    setState({ ...state, client });
  };

  return (
    <div className="register">
      <body>
        <div id="title">
          <CCard>
            <CCardHeader>
              <h2>EDITANDO CLIENTE</h2>
            </CCardHeader>
            <CCardBody></CCardBody>
          </CCard>
        </div>
        <hr className="mt-0" />
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
        <CRow id="tablesEdit">
          <CCol sm="12">
            <CCard>
              <CCardHeader>
                <h5>CLIENTE</h5>
              </CCardHeader>
              <CCardBody>
                <CFormGroup>
                  <CLabel>Nome :</CLabel>
                  <CInput
                    type="text"
                    onKeyUp={(e) => handleKeys(e, editClient)}
                    placeholder="Thiago Jasen Sampaio"
                    value={state.client.name}
                    onChange={(e) => {
                      let client = { ...state.client };
                      client.name = e.target.value;
                      setState({ ...state, client });
                    }}
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel>CPF :</CLabel>
                  <CInput
                    placeholder="123.456.789-00"
                    maxLength="14"
                    name="cpf"
                    onKeyUp={(e) => handleKeys(e, editClient)}
                    value={state.client.cpf}
                    onChange={(e) => handlechange(e)}
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="street">Rua :</CLabel>
                  <CInput
                    type="text"
                    placeholder="Rua Elmer"
                    onKeyUp={(e) => handleKeys(e, editClient)}
                    value={state.client.street}
                    onChange={(e) => {
                      let client = { ...state.client };
                      client.street = e.target.value;
                      setState({ ...state, client });
                    }}
                  />
                </CFormGroup>
                <CFormGroup row className="my-0">
                  <CCol xs="4">
                    <CFormGroup>
                      <CLabel>Bairro :</CLabel>
                      <CInput
                        name="district"
                        onKeyUp={(e) => handleKeys(e, editClient)}
                        placeholder="Cidade Nova"
                        value={state.client.district}
                        onChange={(e) => {
                          let client = { ...state.client };
                          client.district = e.target.value;
                          setState({ ...state, client });
                        }}
                      />
                    </CFormGroup>
                  </CCol>
                  <CCol xs="4">
                    <CFormGroup>
                      <CLabel>Casa :</CLabel>
                      <CInput
                        type="text"
                        placeholder="131"
                        onKeyUp={(e) => handleKeys(e, editClient)}
                        value={state.client.home_num}
                        onChange={(e) => {
                          let client = { ...state.client };
                          client.home_num = e.target.value;
                          setState({ ...state, client });
                        }}
                      />
                    </CFormGroup>
                  </CCol>
                </CFormGroup>
                <CFormGroup row className="my-0">
                  <CCol xs="6">
                    <CFormGroup>
                      <CLabel>Telefone :</CLabel>
                      <CInput
                        type="tel"
                        maxLength="15"
                        name="tel"
                        onKeyUp={(e) => handleKeys(e, editClient)}
                        value={state.client.telephone}
                        onChange={(e) => telephoneChange(e)}
                        placeholder="(53) 981408183"
                      />
                    </CFormGroup>
                  </CCol>
                  <CCol xs="6">
                    <CFormGroup>
                      <CLabel>Observações :</CLabel>
                      <CInput
                        name="obs"
                        onKeyUp={(e) => handleKeys(e, editClient)}
                        value={state.client.obs}
                        onChange={(e) => {
                          let client = { ...state.client };
                          client.obs = e.target.value;
                          setState({ ...state, client });
                        }}
                        placeholder="Taxista"
                      />
                    </CFormGroup>
                  </CCol>
                </CFormGroup>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <div id="divBut">
          <submit type="submit" class="myButton" onClick={() => editClient()}>
            Editar
          </submit>
        </div>
      </body>
    </div>
  );
};

const mapStateToProps = (state) => ({ token: state.token });
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(Edit);

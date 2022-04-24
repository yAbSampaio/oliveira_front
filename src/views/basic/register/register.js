//React
import React, { useEffect, useState } from "react";
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
import { routeRegister } from "../../../util/Api";
import { expToken } from "../../../util/tokenFunction";
import IntlCurrencyInput from "react-intl-currency-input";
import { cpfMask, telMask } from "../mask";
import { stow_deadline, stow_debt, stow_payday } from "../stow";
import {
  clearString,
  validate_date,
  validate_address,
  validate_cpf,
  validate_name,
  validate_telephone,
} from "../validate";
//Style
import "./register.css";
import "../top.css";

const Register = ({ token, history, admin, reset }) => {
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
    payment: {
      balance: "",
      payday: "",
      due_date: "",
      deadline: "",
    },
    error: "",
    message: "",
  });

  const balanceConfig = {
    locale: "pt-BR",
    formats: {
      number: {
        BRL: {
          style: "currency",
          currency: "BRL",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      },
    },
  };

  const register = () => {
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

    const payment = {
      balance: stow_debt(state.payment.balance),
      payday: stow_payday(state.payment.payday),
      deadline: "",
    };
    payment.deadline = stow_deadline(
      state.payment.due_date,
      state.payment.deadline,
      payment.payday,
      payment.balance
    );
    msg = validate_cpf(client.cpf, msg);
    msg = validate_name(client.name, msg);
    msg = validate_telephone(client.telephone, msg);
    msg = validate_date(payment.payday, payment.deadline, msg, payment.balance);
    msg = validate_address(
      client.street,
      client.home_num,
      client.district,
      msg
    );
    let err = msg !== "" ? false : true;

    const data = {
      client: client,
      payment: payment,
    };
    console.log(data);
    console.log(err);
    console.log(msg);
    if (err) {
      routeRegister(data, token)
        .then(function (data) {
          setState({
            ...state,
            error: err,
            message: msg,
          });
          window.location.reload();
        })
        .catch((err) => {
          setState({
            ...state,
            error: false,
            message: " Aconteceu um erro Tente Novamente",
          });
        });
    }
    setState({
      ...state,
      error: err,
      message: msg,
    });
  };

  const handlechange = (e) => {
    let client = { ...state.client };
    client.cpf = cpfMask(e.target.value);
    setState({ ...state, client });
  };

  const handleKeys = (e, func) => {
    if (e.keyCode === 13) {
      func(e);
    }
  };

  const telephoneChange = (e) => {
    let client = { ...state.client };
    client.telephone = telMask(e.target.value);
    setState({ ...state, client });
  };

  const moneyChange = (e, value) => {
    e.preventDefault();
    let payment = { ...state.payment };
    payment.balance = value;
    setState({ ...state, payment });
  };

  useEffect(() => {
    if (!admin || expToken(token)) {
      reset();
      history.push("/login/");
    }
  }, [admin, history, reset, state, token]);

  return (
    <div className="register">
      <body>
        <div id="title">
          <CCard>
            <CCardHeader>
              <h2>REGISTRANDO CLIENTE</h2>
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
        <CRow id="label">
          <CCol xs="12" sm="6">
            <CCard>
              <CCardHeader>
                <h5>CLIENTE</h5>
              </CCardHeader>
              <CCardBody>
                <CFormGroup>
                  <CLabel>Nome :</CLabel>
                  <CInput
                    type="text"
                    placeholder="Thiago Jasen Sampaio"
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
                    value={state.client.cpf}
                    onChange={(e) => handlechange(e)}
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="street">Rua :</CLabel>
                  <CInput
                    type="text"
                    placeholder="Rua Elmer"
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
                        placeholder="Cidade Nova"
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
          <CCol xs="12" sm="6">
            <CCard>
              <CCardHeader>
                <h5>CONTA</h5>
              </CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol xs="12">
                    <CFormGroup>
                      <CLabel>Saldo :</CLabel>
                      <IntlCurrencyInput
                        id="inp"
                        currency="BRL"
                        autoFocus={true}
                        autoSelect={true}
                        value={state.payment.balance}
                        config={balanceConfig}
                        onChange={moneyChange}
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol xs="12">
                    <CFormGroup row className="my-0">
                      <CCol xs="6">
                        <CFormGroup>
                          <CLabel>Vencimento :</CLabel>
                          <CInput
                            type="date"
                            name="due_date"
                            onChange={(e) => {
                              let payment = { ...state.payment };
                              payment.due_date = e.target.value;
                              setState({ ...state, payment });
                            }}
                          />
                        </CFormGroup>
                      </CCol>
                      <CCol xs="6">
                        <CFormGroup>
                          <CLabel>Prazo :</CLabel>
                          <CInput
                            type="number"
                            min="0"
                            onChange={(e) => {
                              let payment = { ...state.payment };
                              payment.deadline = e.target.value;
                              setState({ ...state, payment });
                            }}
                            placeholder="15"
                          />
                        </CFormGroup>
                      </CCol>
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol xs="12">
                    <CFormGroup>
                      <CLabel>Ultima data :</CLabel>
                      <CInput
                        type="date"
                        name="payday"
                        onKeyUp={(e) => handleKeys(e, register)}
                        onChange={(e) => {
                          let payment = { ...state.payment };
                          payment.payday = e.target.value;
                          setState({ ...state, payment });
                        }}
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <div id="divBut">
          <submit type="submit" class="myButton" onClick={() => register()}>
            Registrar
          </submit>
        </div>
      </body>
    </div>
  );
};

const mapStateToProps = (state) => ({ token: state.token, admin: state.admin });
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(Register);

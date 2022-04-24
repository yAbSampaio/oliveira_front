//React
import React, { useEffect, useState } from "react";
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
  CInputCheckbox,
} from "@coreui/react";
//Api
import { routePay } from "../../../util/Api";
import { expToken } from "../../../util/tokenFunction";
import IntlCurrencyInput from "react-intl-currency-input";
// import { cpfMask, telMask, cepMask } from "../mask";
import { stow_deadline, stow_debt2, stow_payday } from "../stow";
import { validate_date } from "../validate";
//Style
import "./payment.css";
import "../top.css";

const Payment = ({ token, history, admin }) => {
  let { id } = useParams();
  const [state, setState] = useState({
    payment: {
      balance: "",
      payday: "",
      due_date: "",
      deadline: "",
    },
    error: "",
    message: "",
    buy: false,
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

  const handleKeys = (e, func) => {
    if (e.keyCode === 13) {
      func(e);
    }
  };

  const moneyChange = (e, value, maskedValue) => {
    e.preventDefault();
    let payment = { ...state.payment };
    payment.balance = value;
    setState({ ...state, payment });
  };

  const payAtt = () => {
    setState({
      ...state,
      error: "",
      message: "",
    });
    let msg = "";
    const payment = {
      balance: stow_debt2(state.payment.balance, state.buy),
      payday: stow_payday(state.payment.payday),
      deadline: "",
    };
    console.log(payment.balance);
    payment.deadline = stow_deadline(
      state.payment.due_date,
      state.payment.deadline,
      payment.payday,
      payment.balance
    );
    msg = validate_date(payment.payday, payment.deadline, msg, payment.balance);
    let err = msg !== "" ? false : true;
    setState({
      ...state,
      error: err,
      message: msg,
    });

    const data = {
      client_id: id,
      payment: payment,
    };

    if (err) {
      console.log(data);
      routePay(data, token)
        .then(function (data) {
          history.push("/profile/" + id);
          history.go(0);
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

  useEffect(() => {
    if (!admin || expToken(token)) history.push("/login/");
  }, [admin, history, state, token]);
  return (
    <div className="register">
      <body>
        <div id="title">
          <CCard>
            <CCardHeader>
              <h2>ATUALIZAR PAGAMENTO</h2>
            </CCardHeader>
            <CCardBody></CCardBody>
          </CCard>
        </div>
        <hr className="mt-0" />
        {state.error && (
          <CCard className="border-success" style={{ textAlign: "center" }}>
            Success
          </CCard>
        )}
        {!state.error && state.message !== "" && (
          <CCard className="border-danger" style={{ textAlign: "center" }}>
            Erros :{state.message}
          </CCard>
        )}
        <CRow id="tablesPay">
          <CCol xs="12">
            <CCard>
              <CCardHeader>
                <h5>CONTA</h5>
              </CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol xs="12">
                    <CFormGroup row className="my-0">
                      <CCol xs="8">
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
                      <CCol xs="4">
                        <CLabel>Pagamento</CLabel>
                        <CFormGroup>
                          <CRow>
                            <CCol xs="3">
                              <CLabel>Sim:</CLabel>
                            </CCol>
                            <CCol xs="2">
                              <CInputCheckbox
                                value={true}
                                id="inline"
                                name="inline"
                                onClick={(e) => {
                                  setState({ ...state, buy: e.target.checked });
                                }}
                              ></CInputCheckbox>
                            </CCol>
                          </CRow>
                        </CFormGroup>
                      </CCol>
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
                        onKeyUp={(e) => handleKeys(e, payAtt)}
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
          <submit type="submit" class="myButton" onClick={() => payAtt()}>
            Editar
          </submit>
        </div>
      </body>
    </div>
  );
};

const mapStateToProps = (state) => ({ token: state.token, admin: state.admin });
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(Payment);

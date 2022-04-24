//React
import React, { useState, useEffect, useCallback } from "react";
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
  CButton,
} from "@coreui/react";
//Api
import { routeBalance } from "../../../util/Api";
import { expToken } from "../../../util/tokenFunction";
import moment from "moment";
//Style
import "./balance.css";
import "../top.css";
import "react-confirm-alert/src/react-confirm-alert.css";

const Balance = ({ token, admin, history, reset }) => {
  const [state, setState] = useState({
    today: "",
    Aux: false,
    accu: 1,
    mouth: "",
    year: "",
    fetched: false,
    Vendas: [],
    Lucros: [],
    Legenda: [
      "Zero",
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ],
    aux: [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const NewDate = useCallback((data, number, aux) => {
    let buy = [0, 0, 0, 0, 0];
    let sell = [0, 0, 0, 0];
    let date = state.year + "-" + aux + "-" + 1;

    let day = moment(date);
    for (let i = 0; i < data.length; i++) {
      if (data[i].balance > 0) {
        buy[0] += data[i].balance;

        let duration = moment.duration(day.diff(data[i].payday));
        let days = -1 * duration.asDays();
        if (days <= 7) {
          buy[1] += data[i].balance;
        } else if (days <= 14) {
          buy[2] += data[i].balance;
        } else if (days <= 22) {
          buy[3] += data[i].balance;
        } else {
          buy[4] += data[i].balance;
        }
      } else {
        if (data[i].balance === -300 || data[i].balance === -290) {
          sell[0] += 1;
        } else if (data[i].balance === -600 || data[i].balance === -580) {
          sell[0] += 2;
        } else if (
          data[i].balance === -370 ||
          data[i].balance === -380 ||
          data[i].balance === -390 ||
          data[i].balance === -400
        ) {
          sell[1] += 1;
        } else if (
          data[i].balance === -740 ||
          data[i].balance === -760 ||
          data[i].balance === -780 ||
          data[i].balance === -800
        ) {
          sell[1] += 2;
        } else if (
          data[i].balance === -450 ||
          data[i].balance === -430 ||
          data[i].balance === -440
        ) {
          sell[2] += 1;
        } else if (
          data[i].balance === -900 ||
          data[i].balance === -860 ||
          data[i].balance === -880
        ) {
          sell[2] += 2;
        } else if (data[i].balance === -720) {
          sell[0] += 1;
          sell[2] += 1;
        } else if (data[i].balance === -700) {
          sell[0] += 1;
          sell[1] += 1;
        } else if (data[i].balance === -840) {
          sell[1] += 1;
          sell[2] += 1;
        } else if (data[i].balance !== 0) {
          sell[3] += 1;
        }
      }
    }
    let mou;
    if (
      (state.mouth === 1 && number === -1) ||
      (state.mouth === 12 && number === 1)
    ) {
      if (number === 1) {
        mou = 1;
      } else {
        mou = 12;
      }
    } else {
      mou = state.mouth + number;
    }

    setState({
      ...state,
      Vendas: sell,
      Lucros: buy,
      mouth: mou,
      fetched: true,
    });
  });

  const NewMouth = (number) => {
    let mou;
    let Aux;
    let date;
    if (
      state.mouth + number > state.today.getMonth() + 1 &&
      state.year === state.today.getFullYear()
    ) {
      Aux = false;
    } else if (
      (state.mouth === 1 && number === -1) ||
      (state.mouth === 12 && number === 1)
    ) {
      Aux = true;
      if (number === 1) {
        mou = 1;
      } else {
        mou = 12;
      }
      state.year += number;
      date = {
        mouth: mou,
        year: state.year,
        day: state.aux[mou],
      };
    } else {
      Aux = true;
      date = {
        mouth: state.mouth + number,
        year: state.year,
        day: state.aux[state.mouth + number],
      };
      mou = state.mouth + number;
    }
    let data = date;
    if (Aux) {
      routeBalance(data, token).then(function (data) {
        NewDate(data, number, mou);
      });
    }
  };

  useEffect(() => {
    if (!admin || expToken(token)) {
      reset();
      history.push("/login/");
    }

    state.today = new Date();
    state.mouth = state.today.getMonth() + 1;
    state.year = state.today.getFullYear();
    let date = {
      mouth: state.today.getMonth() + 1,
      year: state.today.getFullYear(),
      day: state.aux[state.today.getMonth() + 1],
    };
    let data = date;
    if (!state.fetched) {
      routeBalance(data, token).then(function (data) {
        NewDate(data.balance, 0, state.today.getMonth() + 1);
      });
    }
  }, [NewDate, admin, history, reset, state, token]);

  return (
    <div className="Balance">
      <div>
        <div id="title">
          <CCard>
            <CCardHeader>
              <h2>Saldos de Venda: {state.Legenda[state.mouth]}</h2>
            </CCardHeader>
            <CCardBody></CCardBody>
          </CCard>
        </div>
        <CRow id="table">
          <CCol>
            <CCard>
              <CCardHeader>
                <h1>Vendas</h1>
              </CCardHeader>
              <CCardBody>
                <table>
                  <tbody>
                    <tr>
                      <td>Pequena :</td>
                      <td>{state.Vendas[0]}</td>
                    </tr>
                    <tr>
                      <td>Media :</td>
                      <td>{state.Vendas[1]}</td>
                    </tr>
                    <tr>
                      <td>Grande :</td>
                      <td>{state.Vendas[2]}</td>
                    </tr>
                    <tr>
                      <td>Erros na Contagem :</td>
                      <td>{state.Vendas[3]}</td>
                    </tr>
                  </tbody>
                </table>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol>
            <CCard>
              <CCardHeader>
                <h1>Saldos</h1>
              </CCardHeader>
              <CCardBody>
                <table>
                  <tr>
                    <td>Total Atual :</td>
                    <td> R$ {state.Lucros[0]}</td>
                  </tr>
                  <tr>
                    <td>Semana 1 :</td>
                    <td> R$ {state.Lucros[1]}</td>
                  </tr>
                  <tr>
                    <td>Semana 2 :</td>
                    <td> R$ {state.Lucros[2]}</td>
                  </tr>
                  <tr>
                    <td>Semana 3 :</td>
                    <td> R$ {state.Lucros[3]}</td>
                  </tr>
                  <tr>
                    <td>Semana 4 :</td>
                    <td> R$ {state.Lucros[4]}</td>
                  </tr>
                </table>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <div id="divBut">
          <CButton onClick={() => NewMouth(-1)} class="myButton">
            Mês Anterior
          </CButton>
          <CButton onClick={() => NewMouth(1)} class="myButton">
            Proximo Mês
          </CButton>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({ token: state.token, admin: state.admin });
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(Balance);

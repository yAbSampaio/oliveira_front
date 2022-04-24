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
  CButton,
} from "@coreui/react";
//Api
import { routeGetClient, routeHistoric } from "../../../util/Api";
import { expToken } from "../../../util/tokenFunction";
import moment from "moment";

//Style
import "./profile.css";
import "../top.css";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { confirmAlert } from "react-confirm-alert"; // Import

const Profile = ({ token, history, admin, reset }) => {
  let { id } = useParams();

  const [state, setState] = useState({
    admin: false,
    fetched: false,
    List: [],
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
    },
    error: "",
    message: "",
  });

  const handleClick = (route) => {
    history.push("/" + route);
  };

  const NewDate = (data) => {
    let Lista = new Array(0);
    for (let index = 0; index < data.length; index++) {
      let hist = {
        payday: "",
        balance: "",
        due_date: "",
      };
      hist.payday = moment(data[index].payday).format("DD/MM/YYYY");
      if (data[index].balance === 0 && index !== 0) {
        hist.balance = "Adiou";
      } else {
        hist.balance = data[index].balance;
      }
      hist.due_date = moment(data[index].due_date).format("DD/MM/YYYY");
      Lista.push(hist);
    }
    pop(Lista);
    return Lista;
  };

  const pop = (dataLis) => {
    console.log(dataLis);
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <h1>Historico</h1>
            <div
              style={{
                height: "600px",
                width: "400px",
                display: "flex",
                flexDirection: "column",
                flexWrap: "nowrap",
                overflowY: "scroll",
              }}
            >
              <table
                className="table table-hover table-outline mb-0 d-none d-sm-table"
                id="list"
              >
                <thead className="thead-light">
                  <th>Data Inicial: </th>
                  <th>Valor: </th>
                  <th>Vencimento: </th>
                </thead>
                {dataLis.map((info, index) => (
                  <tbody>
                    <tr>
                      <td> {info.payday} </td>
                      <td>{info.balance}</td>
                      <td>{info.due_date} </td>
                    </tr>
                  </tbody>
                ))}
              </table>
            </div>

            <button class="myBut" onClick={onClose}>
              Sair
            </button>
          </div>
        );
      },
    });
  };

  const historic = () => {
    let data = { id };
    routeHistoric(data, token).then(function (data) {
      if (data.status === 1) {
        setState({
          ...state,
          List: NewDate(data.historic),
        });
      }
    });
  };

  useEffect(() => {
    if (expToken(token)) {
      reset();
      history.push("/login/");
    }

    if (!state.fetched) {
      let data = { id };
      routeGetClient(data, token).then(function (data) {
        if (data.status === 1) {
          let client_res = data.client[0];
          let payday = moment(new Date(client_res.payday)).format("DD/MM/YYYY");
          let due_date = moment(new Date(client_res.payday))
            .add(client_res.deadline, "day")
            .format("DD/MM/YYYY");
          const client = {
            name: client_res.name,
            cpf: client_res.cpf,
            street: client_res.street,
            home_num: client_res.home_num,
            district: client_res.district,

            telephone: client_res.telephone,
            obs: client_res.obs,
          };
          const payment = {
            balance:
              client_res.balance < 0
                ? parseFloat(client_res.balance) * -1
                : client_res.balance,
            payday: payday,
            due_date: due_date,
          };
          setState({ ...state, fetched: true, client, payment, admin: admin });
        }
      });
    }
  }, [admin, history, id, reset, state, token]);

  return (
    <div className="profile">
      <div>
        <div id="title">
          <CCard>
            <CCardHeader>
              <h2>INFO CLIENTE</h2>
            </CCardHeader>
            <CCardBody></CCardBody>
          </CCard>
        </div>
        <CRow id="table">
          <CCol>
            <CCard>
              <CCardHeader>
                <h1>CLIENTE</h1>
              </CCardHeader>
              <CCardBody>
                <table>
                  <tbody>
                    <tr>
                      <td>Nome :</td>
                      <td>{state.client.name}</td>
                    </tr>
                    <tr>
                      <td>CPF :</td>
                      <td>
                        {state.client.cpf.substring(0, 3)}.
                        {state.client.cpf.substring(3, 6)}.
                        {state.client.cpf.substring(6, 9)}-
                        {state.client.cpf.substring(9)}
                      </td>
                    </tr>
                    <tr>
                      <td>Endereço :</td>
                      <td>{state.client.street}</td>
                    </tr>
                    <tr>
                      <td>Numero :</td>
                      <td>{state.client.home_num}</td>
                    </tr>
                    <tr>
                      <td>Bairro :</td>
                      <td>{state.client.district}</td>
                    </tr>

                    <tr>
                      <td>Telefone :</td>
                      <td>
                        ({state.client.telephone.substring(0, 2)}){" "}
                        {state.client.telephone.substring(2, 7)}-
                        {state.client.telephone.substring(7)}
                      </td>
                    </tr>
                    <tr>
                      <td>Observações :</td>
                      <td>{state.client.obs}</td>
                    </tr>
                  </tbody>
                </table>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol>
            <CCard>
              <CCardHeader>
                <h1>CONTA</h1>
              </CCardHeader>
              <CCardBody>
                <table>
                  <tr>
                    <td>Débito Atual :</td>
                    <td> R$ {state.payment.balance}</td>
                  </tr>
                  <tr>
                    <td>Vencimento :</td>
                    <td>{state.payment.due_date}</td>
                  </tr>
                  <tr>
                    <td>Ultima data :</td>
                    <td>{state.payment.payday}</td>
                  </tr>
                </table>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <div id="divBut">
          <CButton onClick={() => handleClick("edit/" + id)} class="myButton">
            Editar
          </CButton>
          {state.admin && (
            <CButton onClick={() => handleClick("pay/" + id)} class="myButton">
              Pagamento
            </CButton>
          )}
          <CButton onClick={() => historic()} class="myButton">
            Historico
          </CButton>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({ token: state.token, admin: state.admin });
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(Profile);

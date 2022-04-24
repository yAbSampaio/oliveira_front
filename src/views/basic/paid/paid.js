//React
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../../store/actions";
//CoreUi
import {
  CCard,
  CRow,
  CButton,
  CCol,
  CCardBody,
  CCardHeader,
  CBadge,
  CDataTable,
} from "@coreui/react";
//Api
import { routeListLiqui } from "../../../util/Api";
import { expToken } from "../../../util/tokenFunction";
import moment from "moment";

//Style
import "./paid.css";
import "../top.css";

const Paid = ({ token, history, admin, reset }) => {
  const [state, setState] = useState({
    fetched: false,
    clientList: [],
    today: "",
    fields: ["Nome", "Vencimento", "Endereço", "Divida", "Mais-Info"],
    list_check: false,
  });

  const getBadge = (due) => {
    return "success";
  };
  const handleClick = (id) => {
    history.push("/profile/" + id);
  };
  const NewDate = (data) => {
    let Lista = new Array(0);
    for (let index = 0; index < data.length; index++) {
      let cliente = {
        Id: "",
        Nome: "",
        Vencimento: "",
        Endereço: "",
        Divida: "",
        Perfil: "",
      };
      cliente.Id = data[index].id;
      cliente.Nome = data[index].name;
      cliente.Vencimento = moment(data[index].due_date);
      cliente.Endereço =
        data[index].street +
        ", " +
        data[index].home_num +
        ", " +
        data[index].district;
      cliente.Divida = -1 * data[index].balance;

      Lista.push(cliente);
    }

    return Lista;
  };
  useEffect(() => {
    if (!admin || expToken(token)) {
      reset();
      history.push("/login/");
    }

    if (!state.fetched) {
      let today = new Date();
      let date = moment(today).format("DD/MM/YYYY");
      let data = { today: date };
      routeListLiqui(data, token).then(function (data) {
        if (data.status === 1) {
          setState({
            ...state,
            fetched: true,
            list_check: true,
            clientList: NewDate(data.list),
            today: date,
          });
        }
      });

      state.list_check = state.clientList !== "" ? true : false;
    }
  }, [admin, history, reset, state, token]);

  return (
    <div className="paid">
      <body>
        <div id="title">
          <CCard>
            <CCardHeader>
              <h2>VENCIMENTOS</h2>
            </CCardHeader>
            <CCardBody>
              <h1>Data: {state.today}</h1>
            </CCardBody>
          </CCard>
        </div>
        <hr className="mt-0" />
        <CRow>
          <CCol>
            <CCard>
              <CCardHeader>
                <h2>Clientes</h2>
                <h5>TOTAL: {state.clientList.length}</h5>
              </CCardHeader>
              <CCardBody>
                {state.list_check ? (
                  <CDataTable
                    items={state.clientList}
                    fields={state.fields}
                    tableFilter
                    footer
                    striped
                    itemsPerPageSelect
                    itemsPerPage={10}
                    pagination
                    scopedSlots={{
                      "Mais-Info": (item, index) => {
                        return (
                          <td className="py-2">
                            <CButton
                              color="primary"
                              letiant="outline"
                              id="outros"
                              shape="square"
                              size="sm"
                              onClick={() => {
                                handleClick(item.Id);
                              }}
                            >
                              Perfil
                            </CButton>
                          </td>
                        );
                      },
                      Vencimento: (item) => (
                        <td>
                          <CBadge
                            color={getBadge(item.Vencimento)}
                            id="tamanho"
                          >
                            {item.Vencimento.format("DD/MM/YYYY")}
                          </CBadge>
                        </td>
                      ),
                      Divida: (item) => <td id="outros">R$: {item.Divida}</td>,
                      Endereço: (item) => <td id="outros">{item.Endereço}</td>,
                      Nome: (item) => <td id="outros">{item.Nome}</td>,
                    }}
                  />
                ) : null}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </body>
    </div>
  );
};

const mapStateToProps = (state) => ({ token: state.token, admin: state.admin });
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(Paid);

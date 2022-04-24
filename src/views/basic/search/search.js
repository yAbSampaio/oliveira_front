//React
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../../store/actions";
//CoreUi
import {
  CBadge,
  CCard,
  CRow,
  CCol,
  CButton,
  CLabel,
  CInput,
  CFormGroup,
  CDataTable,
  CCardBody,
  CCardHeader,
} from "@coreui/react";
//Api
//Api
import { routeSearchClient } from "../../../util/Api";
import { expToken } from "../../../util/tokenFunction";
import { cpfMask } from "../mask";
import { clearString } from "../validate";
import moment from "moment";
//Style
import "./search.css";
import "../top.css";

const Search = ({ token, history, admin, reset }) => {
  const [state, setState] = useState({
    cpf: "",
    name: "",
    street: "",
    due_date: "",
    district: "",
    job: "",
    inpTxt: "",
    case: "",
    input_check: false,
    fields: ["Nome", "Vencimento", "Endereço", "Divida", "Perfil"],
    client_list: [],
    list_check: false,
  });

  const getBadge = (due) => {
    let today = new Date();
    today = moment(today);

    const duration = moment.duration(today.diff(due));

    let days = duration.asDays();
    if (days <= 3) {
      return "success";
    }
    if (days >= 30) {
      return "danger";
    } else {
      return "warning";
    }
  };
  const handlechange = (e) => {
    setState({
      ...state,
      cpf: cpfMask(e.target.value),
      inpTxt: cpfMask(e.target.value),
      case: 1,
    });
  };

  const handleClick = (id) => {
    history.push("/profile/" + id);
    history.go(0);
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
    // console.log(Lista);
    return Lista;
  };
  const researched = () => {
    let search;
    let index;
    if (state.cpf !== "") {
      index = state.case;
      search = clearString(state.cpf);
      state.cpf = "";
      state.inpTxt = "";
      state.input_check = true;
    } else if (state.inpTxt !== "") {
      index = state.case;
      search = state.inpTxt;
      state.inpTxt = "";
      state.input_check = true;
    } else {
      state.input_check = false;
    }

    if (state.input_check) {
      let data = { index, search };

      routeSearchClient(data, token).then(function (data) {
        if (data.status === 1) {
          setState({
            ...state,
            client_list: NewDate(data.result),
            list_check: true,
          });
        }
      });
    }
  };

  const handleKeys = (e, func) => {
    if (e.keyCode === 13) {
      func(e);
    }
  };

  useEffect(() => {
    if (!admin || expToken(token)) {
      reset();
      history.push("/login/");
    }
  }, [admin, history, reset, state, token]);

  return (
    <body>
      <div className="search">
        <div id="title">
          <CCard>
            <CCardHeader>
              <h2>PESQUISAR</h2>
            </CCardHeader>
            <CCardBody></CCardBody>
          </CCard>
        </div>
        <hr className="mt-0" />
        <div id="research">
          <CRow>
            <CCol>
              <CCard>
                <CCardBody>
                  <CFormGroup row className="my-0">
                    <CCol xs="3">
                      <CFormGroup>
                        <CLabel>CPF :</CLabel>
                        <CInput
                          id="Input"
                          maxLength="14"
                          name="documentId"
                          value={state.cpf}
                          onKeyUp={(e) => handleKeys(e, researched)}
                          onChange={(e) => handlechange(e)}
                          placeholder="123.456.789-00"
                        />
                      </CFormGroup>
                    </CCol>
                    <CCol xs="3">
                      <CFormGroup>
                        <CLabel>Nome :</CLabel>
                        <CInput
                          id="Input"
                          type="text"
                          name="nome"
                          onKeyUp={(e) => handleKeys(e, researched)}
                          placeholder="Thiago Jasen Sampaio"
                          // value={state.inpTxt}
                          onChange={(e) => {
                            setState({
                              ...state,
                              inpTxt: e.target.value,
                              case: 2,
                            });
                          }}
                        />
                      </CFormGroup>
                    </CCol>
                    <CCol xs="3">
                      <CFormGroup>
                        <CLabel>Vencimento :</CLabel>
                        <CInput
                          type="date"
                          name="due_date"
                          onKeyUp={(e) => handleKeys(e, researched)}
                          onChange={(e) => {
                            setState({
                              ...state,
                              inpTxt: e.target.value,
                              case: 3,
                            });
                          }}
                        />
                      </CFormGroup>
                    </CCol>
                    <CCol xs="3">
                      <CFormGroup>
                        <CLabel>Rua :</CLabel>
                        <CInput
                          id="Input"
                          type="text"
                          name="street"
                          placeholder="Elmer Lawsorense"
                          // value={state.inpTxt}
                          onKeyUp={(e) => handleKeys(e, researched)}
                          onChange={(e) => {
                            setState({
                              ...state,
                              inpTxt: e.target.value,
                              case: 4,
                            });
                          }}
                        />
                      </CFormGroup>
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row className="my-0">
                    <CCol xs="3">
                      <CFormGroup>
                        <CLabel>Bairro</CLabel>
                        <CInput
                          id="Input"
                          type="text"
                          name="district"
                          placeholder="Cidade Nova"
                          // value={state.district}
                          onKeyUp={(e) => handleKeys(e, researched)}
                          onChange={(e) => {
                            setState({
                              ...state,
                              inpTxt: e.target.value,
                              case: 5,
                            });
                          }}
                        />
                      </CFormGroup>
                    </CCol>
                    <CCol xs="3">
                      <CFormGroup>
                        <CLabel>Observações :</CLabel>
                        <CInput
                          id="Input"
                          type="text"
                          name="ob"
                          placeholder="Trabalho ou Erros"
                          onKeyUp={(e) => handleKeys(e, researched)}
                          // value={state.job}
                          onChange={(e) => {
                            setState({
                              ...state,
                              inpTxt: e.target.value,
                              case: 6,
                            });
                          }}
                        />
                      </CFormGroup>
                    </CCol>
                  </CFormGroup>
                  <submit
                    type="submit"
                    class="Button"
                    onClick={() => researched()}
                  >
                    Procurar
                  </submit>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </div>
        <CRow>
          <CCol>
            <CCard>
              <CCardHeader>
                <h2>Clientes</h2>
              </CCardHeader>
              <CCardBody>
                {state.list_check ? (
                  <CDataTable
                    items={state.client_list}
                    fields={state.fields}
                    tableFilter
                    footer
                    striped
                    itemsPerPageSelect
                    itemsPerPage={10}
                    pagination
                    scopedSlots={{
                      Perfil: (item, index) => {
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
      </div>
    </body>
  );
};

const mapStateToProps = (state) => ({ token: state.token, admin: state.admin });
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(Search);

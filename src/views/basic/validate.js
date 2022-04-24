import moment from "moment";

export const clearString = (string) => {
  string = string.split("(").join("");
  string = string.split(")").join("");
  string = string.split(" ").join("");
  string = string.split(".").join("");
  string = string.split("-").join("");
  string = string.split("_").join("");
  string = string.split("/").join("");
  return string;
};

export const validate_cpf = (cpf, message) => {
  var numeros, digitos, soma, i, resultado, digitos_iguais;
  digitos_iguais = 1;

  if (cpf.length !== 11) return message + " -> CPF Inválido";
  for (i = 0; i < cpf.length - 1; i++)
    if (cpf.charAt(i) !== cpf.charAt(i + 1)) {
      digitos_iguais = 0;
      break;
    }
  if (!digitos_iguais) {
    numeros = cpf.substring(0, 9);
    digitos = cpf.substring(9);
    soma = 0;
    for (i = 10; i > 1; i--) soma += numeros.charAt(10 - i) * i;
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    if (resultado !== parseInt(digitos.charAt(0)))
      return message + " -> CPF Inválido";
    numeros = cpf.substring(0, 10);
    soma = 0;
    for (i = 11; i > 1; i--) soma += numeros.charAt(11 - i) * i;
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(1)))
      return message + " -> CPF Inválido";
    return message;
  } else return message + " -> CPF Inválido";
};

export const validate_name = (name, message) => {
  var aux = new RegExp(/^[a-zA-Z-' ]*$/);
  if (name === "") {
    return message + " -> Nome Obrigatório";
  } else {
    if (!aux.test(name)) {
      return message + " -> Nome Inválido";
    } else {
      return message;
    }
  }
};

export const validate_address = (street, house, district, message) => {
  var aux = new RegExp(/^[0-9a-zA-Z-' ]*$/);

  if (street === "" || house === "" || district === "") {
    return message + " -> Endereço: rua,n° e bairro Obrigatório";
  } else {
    if (!aux.test(house)) {
      return message + " -> Endereço Inválido";
    } else {
      return message;
    }
  }
};

export const validate_telephone = (telephone, message) => {
  if (telephone.length !== 11 && telephone.length !== 10) {
    return message + " -> Telefone Inválido";
  }
  var aux = new RegExp(/[0-9]*$/);
  if (!aux.test(telephone)) {
    return message + " -> Telefone Inválido";
  } else {
    return message;
  }
};

export const validate_date = (payday, deadline, message, balance) => {
  if (moment(payday).isAfter(new Date()) && payday.length !== 0) {
    return message + " -> Ultimo pagamento Inválido";
  }
  if (balance === 0) {
    var today = new Date();
    // var dat =
    //   today.getFullYear() +
    //   "-" +
    //   (today.getMonth() + 1) +
    //   "-" +
    //   today.getDate();
    // if (payday === dat) {
    //   return message + " -> Saldo inválido";
    // } else {
    return message;
    // }
  } else {
    if (deadline === 0) {
      return message + " -> Prazo inválido";
    } else {
      return message;
    }
  }
};

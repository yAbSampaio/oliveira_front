import React from "react";

const Search = React.lazy(() => import("./views/basic/search/search"));
const Register = React.lazy(() => import("./views/basic/register/register"));
const Edit = React.lazy(() => import("./views/basic/edit/edit"));
const Dues = React.lazy(() => import("./views/basic/list/list"));
const Paid = React.lazy(() => import("./views/basic/paid/paid"));
const Profile = React.lazy(() => import("./views/basic/profile/profile"));
const Payment = React.lazy(() => import("./views/basic/payment/payment"));
const Balance = React.lazy(() => import("./views/basic/balance/balance"));
const Login = React.lazy(() => import("./views/pages/login/Login"));

const routes = [
  { path: "/edit/:id", name: "Edit", component: Edit },
  { path: "/list", exact: true, name: "Dues", component: Dues },
  { path: "/paid", exact: true, name: "Paid", component: Paid },
  { path: "/search", name: "Search", component: Search },
  { path: "/register", name: "Register", component: Register },
  { path: "/profile/:id", name: "Profile", component: Profile },
  { path: "/pay/:id", name: "Payment", component: Payment },
  { path: "/balance", name: "Balance", component: Balance },
  { path: "/login", name: "Login", component: Login },
];

export default routes;

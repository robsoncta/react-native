import React from "react";
import { createDrawerNavigator, createStackNavigator, createAppContainer } from "react-navigation";

import Home from "./screens/home.js";
import Login from "./screens/login.js";
import Contatos from "./screens/contatos.js";
import Condominios from "./screens/condominios.js";
import Servicos from "./screens/servicos.js";
import CadastroAcesso from "./screens/cadastroAcesso.js";
import CadastroComSenha from "./screens/cadastro_com_senha.js";
import TrocaSenha from "./screens/troca_senha";
import CadastroVisitante from "./screens/cadastro_visitante.js";
import Visitante from "./screens/visitante.js";
import AcessoVisitante from "./screens/acesso_visitante.js";
import LoginSenha from "./screens/login_senha";
import SideBar from "./screens/sidebar";
import EditaAcesso from "./screens/editaAcesso";
import CadastroDelivery from "./screens/cadastroDelivery";

const Drawer = createDrawerNavigator(
  {
    LoginSenha: {
      screen: LoginSenha,
      navigationOptions: ({navigation}) => ({
        drawerLockMode: 'locked-closed'
      })
    },
    Home: { screen: Home },
    Login: { screen: Login },
    Contatos: { screen: Contatos },
    Condominios: { screen: Condominios },
    Servicos: { screen: Servicos },
    CadastroAcesso: { screen: CadastroAcesso },
    CadastroVisitante: { screen: CadastroVisitante },
    Visitante: { screen: Visitante },
    CadastroComSenha: { screen: CadastroComSenha },
    AcessoVisitante: { screen: AcessoVisitante },
    EditaAcesso: {screen: EditaAcesso},
    CadastroDelivery: {screen: CadastroDelivery},
    TrocaSenha: { screen: TrocaSenha },
  },
  {
    initialRouteName: "Home",
    drawerType: "slide",
    contentOptions: {
      activeTintColor: "#e91e63",
    },
    contentComponent: props => <SideBar {...props} />
  }
  
);


const SignedInRoutesC = createStackNavigator(
    {
      Drawer: { screen: Drawer },
    },
    {
      initialRouteName: "Drawer",
      headerMode: "none"
    }
  );
  
  const SignedOutRoutesC = createStackNavigator(
    {
      LoginSenha: { screen: Drawer },
    },
    {
      initialRouteName: "LoginSenha",
      headerMode: "none"
    }
  );

  // const SignedOutRoutesC  = createStackNavigator(
  //   {
  //     Home: { screen: Home },
  //     LoginSenha: { screen: LoginSenha },
  //     TrocaSenha: { screen: TrocaSenha },
  //     Condominios: { screen: Condominios },
  //   },{
  //     initialRouteName: "LoginSenha",
  //     headerMode: 'none'
  //   }
  // );
  
  
  export const SignedInRoutes = createAppContainer(SignedInRoutesC);
  export const SignedOutRoutes = createAppContainer(SignedOutRoutesC);
import React, { Component } from "react";
import { Image, AsyncStorage } from "react-native";
import {
  Content,
  Text,
  List,
  ListItem,
  Container,
  Left,
  Right,
  Badge,
  View,
  Thumbnail
} from "native-base";
import { onSignOut } from "../../service/auth";
import styles from "./style";
import {NavigationActions} from 'react-navigation';
const perso = require("../../../assets/contacts/person-perfil.png");
const datas = [
  // {
  //   name: "Cadastrar Visitante",
  //   route: "CadastroVisitante",
  //   icon: require("../../../assets/ic_add_contato.png"),
  //   bg: "#AB6AED",
  // },
  // {
  //   name: "Minhas Visitantas",
  //   route: "Contatos",
  //   icon: require("../../../assets/ic_lista_cantatos.png"),
  //   bg: "#AB6AED",
  // },
  // {
  //   name: "Minhas Unidades",
  //   route: "Condominios",
  //   icon: require("../../../assets/ic_lista_cantatos.png"),
  //   bg: "#AB6AED",
  // },
  // {
  //   name: "Trocar Senha",
  //   route: "TrocaSenha",
  //   icon: require("../../../assets/ic_lista_cantatos.png"),
  //   bg: "#AB6AED",
  // },
  // {
  //   name: "Sair",
  //   route: "Anatomy",
  //   icon: require("../../../assets/sair.png"),
  //   bg: "#AB6AED",
  // } 

  {
    name: "Cadastro de Convidados",
    route: "CadastroVisitante",
    icon: require("../../../assets/ic_cadastro_visitante.png"),
    bg: "#AB6AED",
  },
  {
    name: "Meus Convidados",
    route: "Contatos",
    icon: require("../../../assets/ic_minhas_visitas.png"),
    bg: "#AB6AED",
  },
  {
    name: "Minhas Unidades",
    route: "Condominios",
    icon: require("../../../assets/local_menu.png"),
    bg: "#AB6AED",
  },
  {
    name: "Trocar Senha",
    route: "TrocaSenha",
    icon: require("../../../assets/ic_trocar_senha.png"),
    bg: "#AB6AED",
  },
  {
    name: "Sair",
    route: "Anatomy",
    icon: require("../../../assets/ic_sair.png"),
    bg: "#AB6AED",
  } 

];

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shadowOffsetWidth: 1,
      shadowRadius: 4,
      nomeUser:'',
      carregaNome: false
    };

  }
  componentDidUpdate = async(prevProps) => {
    //console.log(prevProps.isFocused);
    // console.log(prevProps);
    let nome = await AsyncStorage.getItem('userName');
    if(this.state.nomeUser != nome.split(" ")[0]){
      this.setState({ nomeUser:nome.split(" ")[0]	});
    }
    // 
    // 
    
  }

  componentDidMount= async() => {
    let nome = await AsyncStorage.getItem('userName');
    this.setState({ nomeUser:nome.split(" ")[0]	});
  }

  // carregaInfo = async() => {
  //   alert('cade')
	// 	//this.getListContacts(); 
	// }

	// willFocus = this.props.navigation.addListener(
	// 'willFocus',
	// (payload) => {
	// this.carregaInfo();
	// }
	// );

	// getListContacts = async () => {
    
	// }


  render() {
    return (
      <Container>
        <Content
          bounces={false}
          style={{ flex: 1, backgroundColor: "#fff", top: -1 }}
        >
          {/* <Image source={drawerCover} style={styles.drawerCover} /> */}
          <View style={styles.drawerCover}>
            <Left style={{flex:0.4}}>
              <Thumbnail square style={[styles.drawerImage, {width: 60, height: 60, marginLeft: 25}]} source={perso} />
            </Left>
            <Right style={{flex:0.6, alignItems: 'flex-start'}}>
              <Text style={{textAlign:'left', color:"#fff"}}>Olá,</Text>
              <Text style={{textAlign:'left', color:"#fff", fontSize:20}}>{this.state.nomeUser}</Text>
            </Right>
          </View>
          <List
            dataArray={datas}
            renderRow={data =>
              <ListItem
                button
                noBorder
                onPress={() => 
                        {data.name =="Sair"?
                        onSignOut().then(() => this.props.navigation.navigate("LoginSenha")):
                         this.props.navigation.navigate(data.route,{page: 'Sidebar'})
                        } 
                        }>
                <Left>
                  {/* <Icon
                    active
                    type="FontAwesome" 
                    name={data.icon}
                    style={{ color: "#777", fontSize: 18, width: 30 }}
                  /> */}
                  <Image
                    style={{ width: 22, height: 22, resizeMode: 'contain'}}
                    source={data.icon}
                  />
                  <Text style={styles.text}>
                    {data.name}
                  </Text>
                </Left>
                {data.types &&
                  <Right style={{ flex: 1 }}>
                    <Badge
                      style={{
                        borderRadius: 3,
                        height: 25,
                        width: 72,
                        backgroundColor: data.bg
                      }}
                    >
                      <Text
                        style={styles.badgeText}
                      >{`${data.types} Types`}</Text>
                    </Badge>
                  </Right>}
              </ListItem>}
          />
        </Content>
      </Container>
    );
  }
}

export default SideBar;

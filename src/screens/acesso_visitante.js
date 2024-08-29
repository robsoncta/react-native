import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Footer,
  FooterTab,
  Body,
  Left,
  Form,
  ListItem,
  Text,
  Item,
  Input,
  H3,
  Icon,
  Radio,
  View,
  CheckBox,
  Thumbnail
} from "native-base";
import styles from '../config/styles';

const varun = require("../../assets/contacts/varun.png");


class AcessoVisitante extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab1: true,
      tab2: false,
      radio1: false,
      radio2: false,
      radio3: false,
      radio4: true,
      areas: [
        {
          id:1,
          area:"Salão de Festa"
        }, 
        {
          id:1,
          area:"Portão 1"
        },
        {
          id:1,
          area:"Portão 2"
        },
        {
          id:1,
          area:"Portão 3"
        }
      ]
    };
  }
  toggleTab1() {
   
  }
  toggleTab2() {
    this.props.navigation.navigate('Servicos');
  }
  render() {
    return (
      <Container style={styles.container}>

        <Header style={styles.header}>
            <Left style={{width:10  }}>
                <Button transparent onPress={() => this.props.navigation.goBack()}>
                    <Icon name="arrow-back" />
                </Button>
            </Left>
            <Body style={{flex:3 , justifyContent:"center", alignContent: "center" }}>
                <Title style={{ alignSelf: "center", fontSize:16, textAlign:"center" }}></Title>
            </Body>
            {/* <Right style={{flex:1}}/> */}
        </Header>

        <Content>

            <H3 style={{ margin:15}}>Código de acesso</H3>
            
            <Text style={{borderWidth:1, padding:10, margin:10,fontSize:30, textAlign:"center"}}>098123</Text>
            
            <H3 style={{ margin:15}}>Seu visitante</H3>

            <View style={{ flexDirection: 'row', border:"none", margin:15}}>
                <Thumbnail small style={{width:50, height:50}} source={varun} /> 
                <View style={{marginLeft:30}}>
                    <Text style={styles.textPeriodo}>Nome</Text>
                    <Text notev style={{fontSize:20}}>Selma Diarista</Text>
                </View>     
            </View>
            <View style={{margin:15}}>
                <Text style={styles.textPeriodo}>Telefone</Text>
                <Text notev style={{fontSize:20}}>11 96325-6425</Text>
            </View>    
            <View style={{margin:15}}>
                <Text style={styles.textPeriodo}>Documento de identidade</Text>
                <Text notev style={{fontSize:20}}>413.403.358-67</Text>
            </View>    
            
            <Text style={styles.textQuando}>Quando?</Text>

            <View style={{ flexDirection: 'row', border:"none", margin:15}}>
                <Item style={{flex:1, borderColor: '#fff'}}>
                <Radio
                    selected={true}
                    // onPress={() => this.toggleRadio1()}
                    />
                    <Text> Permanente </Text>
                </Item>
                {/* <Item style={{flex:1,borderColor: '#fff'}}>
                <Radio
                    selected={this.state.radio1}
                    // onPress={() => this.toggleRadio1()}
                    />
                    <Text  style={{ border:"none"}}> Dia Especifico </Text>
                </Item> */}
            </View>
            <Text style={{ margin:15, fontSize:17}}>Intevalo de dias</Text>
            <Text style={{ marginLeft:30, marginTop:10, fontSize:16}}>De 9 de março  de 2019</Text>
            <Text style={{ marginLeft:30, marginTop:8, marginBottom:20, fontSize:16}}>Até 13 de março de 2019</Text>
            
            <View style={{ flexDirection: 'row', border:"none", margin:15}}>
              <Item style={{flex:1,borderColor: '#fff'}}>
                <CheckBox
                  checked={true}
                />
                  <Text  style={{ marginLeft:15}}> Toda Semana </Text>
              </Item>
            </View>
            
            <Text style={styles.textQuando}>Periodo</Text>

            <View style={{ flexDirection: 'row', border:"none", margin:15}}>
              <Item style={{flex:1,borderColor: '#fff'}}>
                <CheckBox
                  checked={true}
                />
                  <Text  style={{ marginLeft:15}}> Manhã </Text>
              </Item>
              <Item style={{flex:1,borderColor: '#fff'}}>
                <CheckBox
                  checked={true}
                />
                  <Text  style={{ marginLeft:15}}> Tarde </Text>
              </Item>
            </View> 
            
            <Text style={styles.textQuando}>Áreas de acesso</Text>

            <View style={styles.areasAcesso}>
				{this.state.areas.map(a => (
					<Item style={{borderColor: '#fff'}}>
						<CheckBox
						checked={true}
						/>
						<Text  style={{ marginLeft:15}}> {a.area} </Text>
					</Item>
				))}   
            </View>

            <Button bordered info style={{width:"90%", justifyContent:"center",   margin: 15, marginTop: 50 }}>
                <Text style={{textAlign:"center"}}>Editar</Text>
            </Button>
            
            <Button bordered danger style={{width:"90%", justifyContent:"center",   margin: 15 }}>
                <Text style={{textAlign:"center"}}>Cancelar</Text>
            </Button>

        </Content>
       
      </Container>
    );
  }
}

export default AcessoVisitante;

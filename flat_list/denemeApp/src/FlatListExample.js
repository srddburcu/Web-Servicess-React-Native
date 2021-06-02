import React, { Component } from 'react';
import { View, Text,StyleSheet,FlatList,Image,TouchableOpacity,TextInput,ActivityIndicator, Platform } from 'react-native';
import axios from 'axios';
const isIos=Platform.OS === 'ios';
export default class FlatListExample extends Component {
  state={
      text:' ',
      page:1,
      contacts:[],
      allContacts:[],
      loading:true,
      refreshing:false
  };
  constructor(props){
      super(props);
      this.duringMomentum=false;
  }
  componentDidMount(){
    this.getContacts();
}
  getContacts = async () => {
      this.setState({
          loading:true,
      });
        const {data:{results:contacts}}=await axios.get(`https://randomuser.me/api/?results=30&page=${this.state.page}`);
        const users=[...this.state.contacts,...contacts]; //ilk yüklenen verilerin üstünde değil de devamına yazması için ... eklenir

        if(this.state.refreshing){
            users.reverse();
        }
        this.setState({
            contacts:users,
            allContacts:users,
            loading:false,//kullanıcılar alındığı zaman loading animasyonu false yapılır
            refreshing:false
        });
  };

  loadMore =()=>{
      if(!this.duringMomentum){
        this.setState({
            page:this.state.page+1,
  
        },()=>{
            this.getContacts();
        });
        this.duringMomentum=false;
       
      }
  };
 onRefresh=()=>{
    this.setState({
        page:1,
        refreshing:true
    },()=>{
        this.getContacts();
    });
    this.duringMomentum=false;
 };
searchFilter= text =>{
    const newData=this.state.allContacts.filter(item=>{
        const listItem=`${item.name.first.toLowerCase()}  ${item.name.last.toLowerCase()}  ${item.location.state.toLowerCase()}`;
        return listItem.indexOf(text.toLowerCase()) > -1;
    });
    this.setState({
        contacts:newData,
    });
};
  renderContactsItem=({item,index})=>{
        return(
            <TouchableOpacity style={[styles.itemContainer,{backgroundColor: index % 2 === 1 ? '#87a7b3xs' : ''}]}>
            
            <Image style={styles.avatar}
            source={{uri:item.picture.thumbnail}}/>
            <View style={styles.textContainer}>
                <Text style={styles.textContainer}>{item.name.first} {item.name.last}</Text>
                <Text>{item.location.state} </Text>
            </View>
            </TouchableOpacity>
        )
  };
renderHeader=()=>{
    const {text}=this.state;
    return(
        <View style={styles.searchContainer}>
        
            <TextInput 
            placeholder={'Search...'}
            onFocus={()=> this.duringMomentum=true}//arama alanına focus olduğu zaman sonsuz scrol özelliği inaktif edilir
            onBlur={()=> this.duringMomentum=false}//arama alanından ayrıldığı zaman  sonsuz scrol özelliği aktif edilir
            onChangeText={text => {
                this.setState({
                    text,
                });
                this.searchFilter(text);
            }}
            style={styles.searchInput}/>
        </View>
    )
};
/**işletim sisteminin belirtilen loading animasyonunu gösterir*/
renderFooter =()=>{
    if(!this.state.loading) return null;
        return(
            <View style={{paddingVertical:0}}>
                <ActivityIndicator size="large"/> 

            </View>
        )
};
  render() {
    return (
      <FlatList
      ListFooterComponent={this.renderFooter}
      ListHeaderComponent={this.renderHeader()}
      renderItem={this.renderContactsItem}
      keyExtractor={item => item.login.uuid}
      data={this.state.contacts}
      onEndReached={this.loadMore}
        refreshing={this.state.refreshing}
        onRefresh={this.onRefresh}
      onEndReachedThreshold={isIos ? 0 : 0.2 } //sonsuz scroll ios ve androidde farklı olduğu için işletim sistemine göre değer veriyoruz
     
      />
    );
  }
}
const styles=StyleSheet.create({
itemContainer:{
    flex:1,
    flexDirection:'row',
    paddingVertical:10,
    borderBottomWidth:1,
    borderBottomColor:'#eee'

},
avatar:{
    width:50,
    height:50,
    borderRadius:25,
    marginHorizontal:10,
},
textContainer:{
    justifyContent:'space-around'
},
name:{
    fontSize:16,
    backgroundColor:'#f9f9f9',
    padding: 10,
},
searchContainer:{
    padding: 10,
    backgroundColor:'#87a7b3',
    color:'black'
},
searchInput:{
    fontSize:16,
    backgroundColor:'#f1f1f1',
    padding: 10,
    color:'black'
},SSSS:{
    marginTop:50,

}


});
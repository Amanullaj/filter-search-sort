import { StyleSheet, Text, View,TextInput,Image,TouchableOpacity,ScrollView,FlatList,Modal } from 'react-native'
import React,{useEffect, useRef, useState} from 'react'

const Search = () => {
   const searchRef = useRef();
    const[search,setSearch] = useState('');
    const[oldData, setOldData] = useState([]);
    const [visible, setVisible] = useState(false)
    const[data,setData] = useState([])
    
    const onSearch = (text) =>{
      if (text == ''){
        setData(oldData)        
     }
     else {
      let tempData = data.filter(item=>{
        return item.title.toLowerCase().match(text.toLowerCase())  ;
        // {inplace of match if we use indexOf use >-1}
       });
       setData(tempData)
     }
    }

    const getApi = async () => {
      fetch('https://fakestoreapi.com/products')
            .then(res=>res.json())
            .then(json=>{setData(json);
                          setOldData(json)})
    }
    useEffect(()=>{
      getApi();
    },[])
    
  return (
    <View style={{flex:1,backgroundColor:'white'}}>
     
      <View style={{flexDirection:'row',alignItems:'center'}}>
      <View style={styles.container}>
        <Image source={require('../filter/src/images/search.png')} style={styles.img}/>
        <TextInput placeholder='Search items here' 
        value={search} onChangeText={(text)=>{ onSearch(text);        
            setSearch(text)}}/>
        {
            search !== '' && ( 
            <TouchableOpacity style={{marginLeft:120}} onPress={()=>{onSearch('');setSearch('')}}>
                <Image source={require('../filter/src/images/close.png')} style={styles.img}/>
                </TouchableOpacity>
                )
        }
        </View>
        <TouchableOpacity onPress={()=>setVisible(true)}>
        <Image source={require('../filter/src/images/list.png')} style={{height:30,width:30}}/>
        </TouchableOpacity>
        </View>
        <View style={{flex:1}}>
       <FlatList data={data} renderItem={({item, index})=>{
        return(
            <TouchableOpacity style={styles.container1} >
            <Image source={{uri: item.image}} style={styles.img1}/>
            <View style={{margin:10,padding:5}}>
            <Text style={styles.title}>{item.title.length>20 ? item.title.substring(0,20) + 
            '...' : item.title}</Text> 
            {/* if name is larger      */}
             <Text style={styles.description}>{item.description.length>30 ? item.description.substring(0,30) + 
            '...' : item.description}</Text>
            <Text style={styles.price}>$.{item.price}</Text>
            <View style={{flexDirection:'row',alignItems:'center',}}>
            <Image source={require('../filter/src/images/star.png')} style={{height:20,width:20,tintColor:'orange'}}/>
            <Text style={{fontSize:18,color:'orange',padding:5}}>{item.rating.rate}</Text>
            </View>
            </View>
          </TouchableOpacity>
        )
       }}/>

       
        <Modal transparent={true} visible={visible} animationType='slide' onRequestClose={()=>setVisible(!visible)}>
          <View style={{flex:1,alignItems:'center',backgroundColor:'rgba(0,0,0,.5)',justifyContent:'center',}}>
            <View style={{width:'80%',height:200,backgroundColor:'white',borderRadius:10}}>
            <TouchableOpacity onPress={()=>{setVisible(false);
            let tempList = data.sort((a,b)=>
            a.title > b.title ? 1 : -1, )}}>
              <Text style={{fontSize:18,color:'black',borderBottomWidth:1,padding:10}}>Sort by Name</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{setVisible(false);
            setData(data.sort((a,b)=>a.price - b.price))}}>
              <Text style={{fontSize:18,color:'black',borderBottomWidth:1,padding:10}}>Low to High Price</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>{setVisible(false);
            setData(data.sort((a,b)=>b.price - a.price))}}>
              <Text style={{fontSize:18,color:'black',borderBottomWidth:1,padding:10}}>High to low Price</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>{setVisible(false);
            setData(data.sort((a,b)=>b.rating.rate - a.rating.rate))}}>
              <Text style={{fontSize:18,color:'black',padding:10}}>Sort by rating</Text></TouchableOpacity>
          </View>
          </View>
        </Modal> 
       
      </View>
    </View>

  )
}

export default Search

const styles = StyleSheet.create({
    img : {height:30,width:30,margin:10,},
    container : {flexDirection:'row',alignItems:'center',margin:20,height:50,width:"80%",borderWidth:0.7,
borderRadius:20,},
container1 : {flex:1,flexDirection:'row',margin:10,backgroundColor:'white',padding:10},
img1 : {height:150,width:120,alignSelf:'center',},
title: {fontSize:20,fontWeight:'600'},
price : {color:'green',fontSize:18,fontWeight:'600'}

})
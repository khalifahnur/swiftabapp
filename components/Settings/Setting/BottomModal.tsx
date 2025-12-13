import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { color } from "@/constants/Colors";

type bottomProps = {
  logOutHandle:()=>void
}
export default function BottomModal({logOutHandle}:bottomProps) {
  
  return (
    <BottomSheet snapPoints={[400]} enablePanDownToClose handleIndicatorStyle={{ backgroundColor: color.green }}>
      <BottomSheetView style={styles.container}>
        <Text style={{color:'#000',fontSize:16,fontWeight:'600'}}>Logout</Text>
        <View style={styles.divider} />
        <View>
          <Text style={{color:'#000',fontSize:16,fontWeight:'500',textAlign:'center'}}>Are you sure you want to logout?</Text>
          <View style={styles.footer}>
            <Pressable style={styles.cancelBtn}>
              <Text style={styles.txt}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.logoutBtn} onPress={logOutHandle}>
              <Text style={styles.txt}>Yes, Logout</Text>
            </Pressable>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  divider: {
    width: "100%",
    borderColor: "#eee",
    borderWidth: 1,
    marginVertical: 10,
  },
  footer:{
    flexDirection:'row',
    justifyContent:'space-between',
    marginTop:40,
  },
  cancelBtn:{
    padding:15,
    backgroundColor:color.gray,
    borderRadius:12,
    width:'40%'
  },
  logoutBtn:{
    padding:15,
    backgroundColor:color.green,
    borderRadius:12,
    width:'40%'
  },
  txt:{
    fontSize:12,
    fontWeight:'500',
    textAlign:'center',
    color:'#fff'
  },
});

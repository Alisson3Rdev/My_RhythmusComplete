import {View, StyleSheet, ScrollView, Image, Text} from "react-native"
import {Button} from "@/Components/button"
import {Input} from "@/Components/Input"
export default function desempenho(){
    return(
    <ScrollView>
        <View style={styles.container}>
            <Text style = {styles.title}>Desempenho</Text>

        </View>
    </ScrollView>
    )	
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    illustration: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
})
import { StyleSheet, TextInput, TextInputProps } from "react-native"

export function Input({ style, ...rest }: TextInputProps){
    return (
        <TextInput style={[styles.input, style]} {...rest}/>
    )
}

const styles = StyleSheet.create({
    input: {
        width: "100%",
        height: 46,
        borderWidth: 5,
        borderRadius: 28,
        borderColor: "#0c0c0c",
        fontSize: 16,
        paddingLeft: 18,
        paddingRight: 18,
        paddingBottom: 1,
        marginBottom: 8,
    }
})
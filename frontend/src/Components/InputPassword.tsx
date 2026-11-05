import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface InputPasswordProps extends TextInputProps {
  // Adicione quaisquer props específicas se necessário
}

export function InputPassword({ ...rest }: InputPasswordProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  function handleTogglePasswordVisibility() {
    setIsPasswordVisible(!isPasswordVisible);
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        secureTextEntry={!isPasswordVisible}
        {...rest}
      />
      <TouchableOpacity onPress={handleTogglePasswordVisibility} style={styles.iconContainer}>
        <Feather
          name={isPasswordVisible ? 'eye' : 'eye-off'}
          size={24}
          color="#000080"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 46,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#000080',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  iconContainer: {
    paddingHorizontal: 10,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

import {
    TextInput,
    View,
    Text,
    Image,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Platform,
  } from "react-native";
  
  import { InputFieldProps } from "@/types/type";
import React from "react";
  
  const InputField = ({
    label,
    icon,
    secureTextEntry = false,
    labelStyle,
    containerStyle,
    inputStyle,
    iconStyle,
    className,
    ...props
  }: InputFieldProps) => {
    return (
        // 键盘不会遮住这个KeyboardAvoidingView
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* if we click outside or if we click within this touchable opacity(不透明度) or thouchable without feedback, we'll close the keyboard */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="my-2 w-full">
            <Text className={`text-lg font-JakartaSemiBold mb-3 ${labelStyle}`}>
              {label}
            </Text>
            <View
              className={`flex flex-row justify-start items-center relative bg-neutral-100 rounded-full border border-neutral-100 focus:border-primary-500  ${containerStyle}`}
            >
              {icon && (
                <Image source={icon} className={`w-6 h-6 ml-4 ${iconStyle}`} />
              )}
              <TextInput
                className={`rounded-full p-4 font-JakartaSemiBold text-[15px] flex-1 ${inputStyle} text-left`}
                secureTextEntry={secureTextEntry}
                {...props}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  };
  
  export default InputField;
  
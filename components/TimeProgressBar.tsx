import React, { useEffect, useState } from "react";
import { View, Text } from './Themed'
import { Easing, ProgressBarAndroid, StyleSheet } from "react-native";
import Animated,{EasingNode} from "react-native-reanimated";


type Props = {
    startTime: number;
    endTime: number
}
const TimeProgressBar = () => {
    const [progress, setProgress] = useState(0);
  
    const anim = new Animated.Value(0);  

    const onAnimate = () =>{  
        anim.addListener(({value})=> {  
            this.setState({progressStatus: parseInt(value,10)});  
        });  
        Animated.timing(this.anim,{  
             toValue: 100,  
             duration: 50000,  
        }).start();  
    }  

    useEffect(() => {
      Animated.timing(progress, {
        toValue: 75,
        duration: 2000,
      }).start();
    }, []);
  
    const interpolatedWidth = progress.interpolate({
        inputRange: [0, 100],
        outputRange: [0, 200], // Replace desiredWidth with the width you want
        extrapolate: Animated.Extrapolate.CLAMP,
      });

    return (
      <View style={styles.container}>
        <Animated.View style={[styles.bar, { width: interpolatedWidth }]} />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      height: 20,
      backgroundColor: '#ccc',
      borderRadius: 10,
      margin: 10,
    },
    bar: {
      height: 20,
      backgroundColor: '#333',
      borderRadius: 10,
    },
  });

export default TimeProgressBar;
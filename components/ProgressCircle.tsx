import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Svg, Circle } from 'react-native-svg';

interface ProgressCircleProps {
  startTime: string; // Start time in ISO 8601 format (e.g., '2023-06-08T09:00:00.000Z')
  endTime: string; // End time in ISO 8601 format (e.g., '2023-06-08T17:00:00.000Z')
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({ startTime, endTime }) => {
  const [progress, setProgress] = useState<number>(0);

  // Calculate the progress based on the time difference between start and end time
  const calculateProgress = () => {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const totalTime = end - start;
    const elapsedTime = Date.now() - start;
    const calculatedProgress = (elapsedTime / totalTime) * 100;
    setProgress(Math.min(calculatedProgress, 100));
  };

  useEffect(() => {
    const timer = setInterval(calculateProgress, 1000);

    return () => clearInterval(timer);
  }, [startTime, endTime]);

  return (
    <View>
      <Svg width={100} height={100}>
        <Circle
          cx={50}
          cy={50}
          r={40}
          stroke="white"
          strokeWidth={10}
          fill="transparent"
          strokeDasharray={250}
          strokeDashoffset={((100 - progress) / 100) * 250}
          transform="rotate(-90 50 50)"
        />
      </Svg>
      <Text>{`${progress.toFixed(2)}%`}</Text>
    </View>
  );
};

export default ProgressCircle;

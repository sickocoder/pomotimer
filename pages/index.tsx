import { Box, Flex, Text, Button, HStack } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import Wave from 'react-wavify';
import Head from 'next/head';

const TIMER_LENGHT = 25;
interface Time {
  minute: number;
  seconds: number;
}

const PomoDoit: FC = () => {
  const [repeated, setRepeated] = useState(1);
  const [time, setTime] = useState<Time>({
    minute: TIMER_LENGHT,
    seconds: 0,
  });
  const [height, setHeigth] = useState(100);
  const [started, setStarted] = useState(false);
  const [isWavePaused, setIsWavePaused] = useState(true);

  const restoreTimer = () => {
    setTime({ minute: TIMER_LENGHT, seconds: 0 });
    setRepeated(1);
  };

  const showTimeFragment = (fragment: number) => {
    if (fragment < 0) return '00';
    if (fragment < 10) return '0' + fragment;
    return fragment.toString();
  };

  const onStop = () => {
    setStarted(false);
    setIsWavePaused(!isWavePaused);
    setHeigth(100);
    restoreTimer();
  };

  useEffect(() => {
    var timerInterval = setInterval(() => {
      if (isWavePaused) return;

      if (time.minute >= 0) {
        const seconds = time.seconds - 1;

        setTime({
          minute: seconds < 0 ? Math.max(-1, time.minute - 1) : time.minute,
          seconds: seconds < 0 ? (time.minute === 0 ? 0 : 59) : seconds,
        });
        setHeigth(
          ((time.minute * 60 + time.seconds) /
            (repeated % 2 === 0 ? 5 : TIMER_LENGHT * 60)) *
            100
        );
      } else {
        setHeigth(100);
        setRepeated(repeated + 1);
        setTime({
          minute: (repeated + 1) % 2 === 0 ? TIMER_LENGHT : 1,
          seconds: 0,
        });
        clearInterval(timerInterval);
      }
    }, 1000);

    return () => {
      clearInterval(timerInterval);
    };
  });

  return (
    <>
      <Head>
        <title>PomoDoit - Infinity Pomodoro</title>
        <meta
          name="description"
          content="A pomodoro add with infinity number os sessions, use it until you are done with your things."
        />
      </Head>
      <Flex width="100vw" height="100vh" direction="row" wrap="wrap">
        <Box
          width="100vw"
          position="absolute"
          top="15%"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Box p={2} pt={1} pb={1} bgColor="teal.400" borderRadius={6}>
            <Text color="black">
              {repeated % 2 !== 0 ? `Sessão ${repeated % 2}` : 'PAUSA'}
            </Text>
          </Box>
          <Text fontSize="9xl" fontWeight="black">
            {showTimeFragment(time.minute)}:{showTimeFragment(time.seconds)}
          </Text>
          <HStack spacing={6}>
            <Button
              disabled={!started && isWavePaused}
              colorScheme="teal"
              size="lg"
              onClick={() => onStop()}
            >
              Parar
            </Button>
            <Button
              colorScheme="teal"
              size="lg"
              onClick={() => {
                setIsWavePaused(!isWavePaused);
                setStarted(true);
              }}
            >
              {started ? 'Pausar' : 'Iniciar'}
            </Button>
          </HStack>
        </Box>
        <Wave
          fill="#f79902"
          paused={isWavePaused}
          style={{
            transition: `all ${height < 100 ? '0.1' : '.6s'} ease-in-out`,
            height: !started ? 'calc(50vh + 30px)' : height + 'vh',
            alignSelf: 'flex-end',
          }}
          options={{
            height: !isWavePaused ? 30 : 0,
            amplitude: !isWavePaused ? 30 : 0,
            speed: 0.25,
            points: 4,
          }}
        />
      </Flex>
    </>
  );
};

export default PomoDoit;

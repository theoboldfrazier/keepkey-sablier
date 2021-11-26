import "react-circular-progressbar/dist/styles.css";

import { DownloadIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import {
    Box,
    Divider,
    Flex,
    Link,
    List,
    ListItem,
    Progress,
    Spinner,
    Text,
    Tooltip,
    useTheme,
} from "@chakra-ui/react";
import BigNumber from "bignumber.js";
import { useEffect } from "react";
import {
    buildStyles,
    CircularProgressbar,
    CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import { useParams } from "react-router-dom";
import { useStreamContext } from "src/context/StreamProvider";
import { useWithdraw } from "src/context/WithdrawalProvider";
import { formatAddress, makeEtherscanLink } from "src/lib/string.utils";

const STROKE_WIDTH = 6;

export function StreamPage() {
    const theme = useTheme();
    const { onOpen } = useWithdraw();
    const { loading, stream, setStreamId } = useStreamContext();
    const params = useParams<{ id: string }>();
    
    useEffect(() => {
        setStreamId(params.id);
    }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps

    if (loading || !stream) {
        return (
            <Flex align="center" justify="center">
                <Spinner size="xl" color="secondary.500" />
            </Flex>
        );
    }

    const tooltip = `
        This is an active stream created by ${formatAddress(stream.sender)} 
        and paying ${formatAddress(stream.recipient)} ${stream.rate} ${
        stream.token.symbol
    }
        per second. The recipient has not yet withdrawn all the funds.
    `;

    return (
        <>
            <Box margin="auto">
                <Box w="32rem" maxW="100%" mb={16}>
                    <Box position="relative">
                        <Flex justify="center">
                            <Box h={300} w={300} zIndex={-1}>
                                <CircularProgressbarWithChildren
                                    value={stream?.percentStreamed || 0}
                                    strokeWidth={STROKE_WIDTH - 1}
                                    styles={buildStyles({
                                        pathColor: theme.colors.primary[500],
                                        trailColor: theme.colors.gray[50],
                                    })}
                                >
                                    <Box w={`${100 - 2 * (STROKE_WIDTH + 2)}%`}>
                                        <CircularProgressbar
                                            value={
                                                stream?.percentWithdrawn || 0
                                            }
                                            strokeWidth={STROKE_WIDTH}
                                            styles={buildStyles({
                                                pathColor:
                                                    theme.colors.secondary[500],
                                                trailColor:
                                                    theme.colors.gray[50],
                                            })}
                                        />
                                    </Box>
                                </CircularProgressbarWithChildren>
                            </Box>
                        </Flex>
                        <Flex
                            align="center"
                            flexDirection="column"
                            justify="center"
                            position="absolute"
                            left="50%"
                            top="50%"
                            transform="translate(-50%, -50%)"
                        >
                            <Flex
                                align="center"
                                bgGradient="linear(to-r, primary.100, secondary.200)"
                                color="blackAlpha.900"
                                borderRadius="lg"
                                boxShadow="2xl"
                                flexDirection="column"
                                px={16}
                                py={4}
                                zIndex={0}
                                maxW="100%"
                                w="30rem"
                            >
                                <Text
                                    textAlign="center"
                                    fontSize="3xl"
                                    fontWeight="bold"
                                >
                                    {Number(stream?.amountStreamed)?.toFixed(
                                        10
                                    )}
                                </Text>
                            </Flex>
                            <Text
                                textAlign="center"
                                fontSize="md"
                                fontWeight="bold"
                            >
                                / {Number(stream?.deposit)?.toLocaleString()}{" "}
                                {stream?.token?.symbol} Total
                            </Text>
                        </Flex>
                    </Box>
                </Box>
                <Box w="32rem" maxW="100%" margin="0 auto" mb={16}>
                    <Flex justify="center">
                        <Flex align="center" flexDirection="column" flex={1}>
                            <Box textAlign="center">
                                <Text as="span" fontWeight="bold">
                                    Streamed
                                </Text>
                                <Box>
                                    <Text as="span" mr={2}>
                                        {new BigNumber(stream?.amountStreamed || 0).toFixed(2)}
                                    </Text>
                                    <Text as="span" fontWeight="bold">
                                        {stream.token.symbol}
                                    </Text>
                                </Box>
                                <Text as="span" fontWeight="bold">
                                    {stream?.percentStreamed?.toFixed(2)} %
                                </Text>
                            </Box>
                            <Progress
                                bg="gray.50"
                                size="xs"
                                borderRadius="md"
                                w="10rem"
                                value={stream?.percentStreamed}
                            />
                        </Flex>
                        <Flex align="center" flexDirection="column" flex={1}>
                            <Box textAlign="center">
                                <Text as="span"  fontWeight="bold">
                                    Withdrawn
                                </Text>
                                <Box>
                                    <Text as="span" mr={2}>
                                        {new BigNumber(stream?.withdrawn || 0).toFixed(2)}
                                    </Text>
                                    <Text as="span" fontWeight="bold">
                                        {stream.token.symbol}
                                    </Text>
                                </Box>
                                <Text as="span" fontWeight="bold">
                                    {stream?.percentWithdrawn?.toFixed(2)} %
                                </Text>
                            </Box>
                            <Progress
                                bg="gray.50"
                                size="xs"
                                colorScheme="secondary"
                                borderRadius="md"
                                w="10rem"
                                value={stream?.percentWithdrawn}
                            />
                        </Flex>
                    </Flex>
                </Box>
                <Flex 
                    align="center"
                    bgGradient="linear(to-r, primary.100, secondary.200)"
                    borderColor="secondary.100"
                    borderRadius="lg"
                    boxShadow="2xl"
                    color="blackAlpha.900"
                    flexDirection="column"
                    justify="center"
                    textAlign="center"
                    mb={8}
                    px={16}
                    py={4}
                    zIndex={0}
                    maxW="100%"
                >
                    <Text fontSize="lg" fontWeight="bold">Claim Stats</Text>
                    <Text>
                        Total remaining balance: {new BigNumber(stream.remainingBalance).toFixed(2)}
                    </Text>
                    <Text>
                        Available to claim: {new BigNumber(stream.available).toFixed(2)}
                    </Text>
                </Flex>
                <Flex
                    align="center"
                    bgGradient="linear(to-r, primary.100, secondary.200)"
                    borderColor="secondary.100"
                    borderRadius="lg"
                    boxShadow="2xl"
                    color="blackAlpha.900"
                    justify="center"
                    mb={8}
                    px={16}
                    py={4}
                    zIndex={0}
                    maxW="100%"
                >
                    <Text textAlign="center" fontSize="xl" mr={4}>
                        {stream.stopTimeDisplay}
                    </Text>
                    <Tooltip label={tooltip} px={6} py={4}>
                        <InfoOutlineIcon />
                    </Tooltip>
                </Flex>
                <Box w="32rem" maxW="100%" margin="0 auto" mb={16}>
                    <Flex
                        aria-label="withdraw"
                        as="button"
                        backgroundSize="100% 100%"
                        bgGradient="linear(to-tr, secondary.100, primary.100)"
                        borderRadius="lg"
                        boxShadow="2xl"
                        onClick={onOpen}
                        p={1}
                        transition="background-size 200ms ease 0s, background-position 200ms ease 0s"
                        w="full"
                        _hover={{
                            backgroundPositionY: "50%",
                            backgroundSize: "100% 200%",
                        }}
                    >
                        <Flex
                            align="center"
                            backgroundColor="bg.main"
                            borderRadius="lg"
                            color="blackAlpha.900"
                            justify="center"
                            px={16}
                            py={3}
                            transition="background 200ms ease 0s"
                            w="full"
                            _hover={{
                                bgGradient:
                                    "linear(to-tr, secondary.100, primary.100)",
                                boxShadow: "2xl",
                            }}
                        >
                            <DownloadIcon boxSize={4} mr={2} />
                            <Text>Withdraw</Text>
                        </Flex>
                    </Flex>
                </Box>
                <Box w="32rem" maxW="100%" margin="0 auto" mb={16}>
                    <Divider borderColor="secondary.200" mb={8} />
                    <Text fontSize="xl">History</Text>
                    <List spacing={2} w="full">
                        <ListItem
                            display="flex"
                            flexDirection={{ base: "column", md: "row" }}
                            p={4}
                            w="100%"
                        >
                            <Box textAlign="center" w="50%" p={1}>
                                Amount
                            </Box>
                            <Box textAlign="center" w="50%" p={1}>
                                TX
                            </Box>
                        </ListItem>
                        {stream.withdrawals.map((withdrawal) => {
                            return (
                                <ListItem
                                    key={withdrawal.txhash}
                                    boxShadow="sm"
                                    border="2px solid"
                                    borderColor="secondary.100"
                                    borderRadius="lg"
                                    display="flex"
                                    flexDirection={{ base: "column", md: "row" }}
                                    p={1}
                                    w="100%"
                                >
                                    <Box textAlign="center" w="50%" p={1}>
                                        {new BigNumber(withdrawal.amount).div("1e+18").toString()}
                                    </Box>
                                    <Box textAlign="center" w="50%" p={1}>
                                        <Link
                                            isExternal
                                            href={makeEtherscanLink(
                                                withdrawal.txhash,
                                                "transaction"
                                            )}
                                        >
                                            View on explorer
                                        </Link>
                                    </Box>
                                </ListItem>
                            );
                        })}
                    </List>
                </Box>
            </Box>
        </>
    );
}

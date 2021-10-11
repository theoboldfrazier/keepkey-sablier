import {
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Link,
} from "@chakra-ui/react";
import BigNumber from "bignumber.js";
import { useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { useStreamContext } from "src/context/StreamProvider";
import { useWallet } from "src/context/WalletProvider";
import { useWithdraw } from "src/context/WithdrawalProvider";
import { makeEtherscanLink } from "src/lib/string.utils";

type WithdrawalButtonProps = {
    loading: boolean;
    onWithdrawal(): void;
    onBuildTx(): void;
    transaction: any;
};

function WithdrawalButton({
    loading,
    onWithdrawal,
    onBuildTx,
    transaction,
}: WithdrawalButtonProps) {
    const { connect, wallet } = useWallet();
    if (!wallet) return <Button onClick={connect}>Connect Wallet</Button>;
    if (transaction) return <Button disabled={loading} onClick={onWithdrawal}>Withdrawal</Button>;
    return <Button disabled={loading} onClick={onBuildTx}>Build Transaction</Button>;
}

export function WithdrawDrawer() {
    const [amount, setAmount] = useState<string>("");
    const [transaction, setTransaction] = useState<any>(null);
    const [withdrawalTx, setWithdrawalTx] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const { stream } = useStreamContext();
    const { isOpen, onClose, buildtx, withdrawal } = useWithdraw();
    const match = useRouteMatch<{ id: string }>("/stream/:id");

    const handleBuildTx = async () => {
        if (amount && match) {
            setLoading(true)
            const tx = await buildtx({ amount, id: match.params.id });
            setTransaction(tx);
            setLoading(false)
        }
    };

    const handleWithdrawal = async () => {
        if (amount && match) {
            setLoading(true)
            const tx = await withdrawal({ amount, id: match.params.id });
            setWithdrawalTx(tx);
            setLoading(false)
        }
    };

    const handleSetMax = () => {
        if (stream) setAmount(new BigNumber(stream.available).toFixed(0));
    };

    const handleClose = () => {
        setAmount("");
        setLoading(false);
        setTransaction(null)
        setWithdrawalTx(null)
        onClose();
    };

    return (
        <Drawer
            isOpen={isOpen}
            placement="right"
            onClose={handleClose}
            size="md"
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Create your account</DrawerHeader>
                <DrawerBody>
                    <FormControl id="id" mb={4}>
                        <FormLabel>Stream ID</FormLabel>
                        <Input disabled value={match?.params.id} />
                    </FormControl>
                    <FormControl id="amount" mb={4}>
                        <FormLabel>Withdrawal Amount</FormLabel>
                        <InputGroup size="md">
                            <Input
                                onChange={(e) => setAmount(e.target.value)}
                                value={amount}
                            />
                            <InputRightElement width="4.5rem">
                                <Button h="1.75rem" size="sm" onClick={handleSetMax}>MAX</Button>
                            </InputRightElement>
                        </InputGroup>
                        <FormHelperText>
                            Number of tokens you want to withdrawal
                        </FormHelperText>
                    </FormControl>
                    {transaction && (
                        <FormControl id="estimatedGas" mb={4}>
                            <FormLabel>Estimated Gas (ETH)</FormLabel>
                            <Input
                                disabled
                                value={new BigNumber(transaction.estimatedFee).div("1e+18").toString()}
                            />
                        </FormControl>
                    )}
                    {loading && (
                        <Box fontSize="sm">Loading...</Box>
                    )}
                    {withdrawalTx && (
                        <FormControl id="txHash" mb={4}>
                            <FormLabel>Transaction Hash</FormLabel>
                            <Link fontSize="sm" isExternal href={makeEtherscanLink(withdrawalTx.hash, 'transaction')}>
                                {withdrawalTx.hash}
                            </Link>
                        </FormControl>
                    )}
                </DrawerBody>
                <DrawerFooter>
                    <Button
                        colorScheme="secondary"
                        variant="outline"
                        mr={3}
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <WithdrawalButton
                        loading={loading}
                        onBuildTx={handleBuildTx}
                        onWithdrawal={handleWithdrawal}
                        transaction={transaction}
                    />
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

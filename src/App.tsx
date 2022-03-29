import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  useWalletKit,
  useSolana,
  useConnectedWallet
} from "@gokiprotocol/walletkit";

import { Button, Col, Row } from "antd";
import WalletInfo from "components/walletInfo";

import { AppDispatch } from "store";
import { setWalletInfo, WalletState } from "store/wallet.reducer";

import "./App.css";

function App() {
  // Goki hooks
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();
  const { disconnect, providerMut } = useSolana();
  const dispatch = useDispatch<AppDispatch>();

  const fetchBalance = useCallback(async () => {
    // TODO: fetch balance
    let walletInfo: WalletState = {
      walletAddress: wallet?.publicKey.toBase58() || "",
      balance: 0
    };
    if (wallet && providerMut) {
      walletInfo.balance = await providerMut.connection.getBalance(
        wallet.publicKey
      );
    }
    dispatch(setWalletInfo(walletInfo));
  }, [providerMut, wallet]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return (
    <Row justify="center" gutter={[24, 24]}>
      <Col span={12} style={{ paddingTop: "50px" }}>
        <WalletInfo />
      </Col>
      {/* Button connect wallet */}
      <Col span={24} style={{ textAlign: "center" }}>
        {wallet ? (
          <Button type="primary" onClick={disconnect}>
            Disconnect
          </Button>
        ) : (
          // Call connectWallet function when click Button
          <Button type="primary" onClick={connect}>
            Connect Wallet
          </Button>
        )}
      </Col>
    </Row>
  );
}

export default App;

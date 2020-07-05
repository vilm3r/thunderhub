import * as React from 'react';
import { useAddPeerMutation } from 'src/graphql/mutations/__generated__/addPeer.generated';
import { toast } from 'react-toastify';
import { getErrorContent } from 'src/utils/error';
import { useGetNodeQuery } from 'src/graphql/queries/__generated__/getNode.generated';
import { getNodeLink, renderLine } from 'src/components/generic/helpers';
import {
  Separation,
  Sub4Title,
  DarkSubTitle,
} from 'src/components/generic/Styled';
import { SecureButton } from 'src/components/buttons/secureButton/SecureButton';
import { LoadingCard } from 'src/components/loading/LoadingCard';

type CheckPeerProps = {
  setConnected: (state: boolean) => void;
  public_key: string;
  clear?: string;
  tor?: string;
};

export const CheckPeer = ({
  setConnected,
  public_key,
  clear,
  tor,
}: CheckPeerProps) => {
  const { data, loading, error } = useGetNodeQuery();

  const [addPeer, { loading: addLoading }] = useAddPeerMutation({
    refetchQueries: ['GetPeers'],
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: () => setConnected(true),
  });

  if (loading) {
    return <LoadingCard noCard={true} />;
  }

  if (!data?.getNode?.node?.capacity || error) {
    return <DarkSubTitle>Offers unavailable at the moment</DarkSubTitle>;
  }

  return (
    <>
      {renderLine('Connect with', data.getNode.node?.alias)}
      {renderLine('Node Public Key', getNodeLink(public_key))}
      <Separation />
      <Sub4Title>You need to connect first to this node.</Sub4Title>
      {clear && (
        <SecureButton
          withMargin={'16px 0 0'}
          callback={addPeer}
          loading={addLoading}
          disabled={addLoading}
          variables={{
            publicKey: public_key,
            socket: clear,
          }}
          fullWidth={true}
        >
          Connect
        </SecureButton>
      )}
      {tor && (
        <SecureButton
          withMargin={'16px 0 0'}
          callback={addPeer}
          loading={addLoading}
          disabled={addLoading}
          variables={{
            publicKey: public_key,
            socket: tor,
          }}
          fullWidth={true}
        >
          Connect TOR
        </SecureButton>
      )}
    </>
  );
};

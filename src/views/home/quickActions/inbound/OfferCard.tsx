import * as React from 'react';
import { useGetBaseUrisQuery } from 'src/graphql/queries/__generated__/getBaseUris.generated';
import { BaseOfferType } from 'src/graphql/types';
import { useGetPeersQuery } from 'src/graphql/queries/__generated__/getPeers.generated';
import { useAccountState } from 'src/context/AccountContext';
import { LoadingCard } from 'src/components/loading/LoadingCard';
import { useAddPeerMutation } from 'src/graphql/mutations/__generated__/addPeer.generated';
import { toast } from 'react-toastify';
import { getErrorContent } from 'src/utils/error';
import { useGetNodeLazyQuery } from 'src/graphql/queries/__generated__/getNode.generated';
import { getNodeLink, renderLine } from 'src/components/generic/helpers';
import {
  Separation,
  Sub4Title,
  DarkSubTitle,
} from 'src/components/generic/Styled';
import { SecureButton } from 'src/components/buttons/secureButton/SecureButton';
import { useConfigState } from 'src/context/ConfigContext';
import { usePriceState } from 'src/context/PriceContext';
import { getPrice } from 'src/components/price/Price';

type OfferProps = {
  offer: BaseOfferType;
};

export const OfferCard = ({ offer }: OfferProps) => {
  const [alreadyConnected, setConnected] = React.useState(false);
  const { auth } = useAccountState();

  const { currency, displayValues } = useConfigState();
  const priceContext = usePriceState();
  const format = getPrice(currency, displayValues, priceContext);

  const size = format({ amount: offer.size });
  const value = format({ amount: offer.value });

  const { data, loading } = useGetBaseUrisQuery();
  const { data: peerData, loading: peerLoading } = useGetPeersQuery({
    variables: { auth },
  });

  const [
    getNode,
    { data: node, loading: nodeLoading, called },
  ] = useGetNodeLazyQuery();

  React.useEffect(() => {
    if (
      !loading &&
      data &&
      data.getBaseUris &&
      !peerLoading &&
      peerData &&
      peerData.getPeers
    ) {
      const isPeer =
        peerData.getPeers
          .map(p => p.public_key)
          .indexOf(data.getBaseUris.public_key) >= 0;

      if (isPeer) {
        setConnected(true);
      } else {
        getNode({
          variables: { auth, publicKey: data.getBaseUris.public_key },
        });
      }
    }
  }, [data, loading, peerLoading, peerData, auth, getNode]);

  const [addPeer, { loading: addLoading }] = useAddPeerMutation({
    refetchQueries: ['GetPeers'],
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: () => setConnected(true),
  });

  if (loading || peerLoading || nodeLoading) {
    return <LoadingCard noCard={true} />;
  }

  if (!data || !peerData || (called && !node?.getNode?.node?.capacity)) {
    return <DarkSubTitle>Offer is unavailable at the moment</DarkSubTitle>;
  }

  if (!alreadyConnected && node) {
    return (
      <>
        {renderLine('Connect with', node.getNode.node?.alias)}
        {renderLine(
          'Node Public Key',
          getNodeLink(data.getBaseUris.public_key)
        )}
        <Separation />
        <Sub4Title>You need to connect first to this node.</Sub4Title>
        {data.getBaseUris.clear && (
          <SecureButton
            withMargin={'16px 0 0'}
            callback={addPeer}
            loading={addLoading}
            disabled={addLoading}
            variables={{
              publicKey: data.getBaseUris.public_key,
              socket: data.getBaseUris.clear,
            }}
            fullWidth={true}
          >
            Connect
          </SecureButton>
        )}
        {data.getBaseUris.tor && (
          <SecureButton
            withMargin={'16px 0 0'}
            callback={addPeer}
            loading={addLoading}
            disabled={addLoading}
            variables={{
              publicKey: data.getBaseUris.public_key,
              socket: data.getBaseUris.tor,
            }}
            fullWidth={true}
          >
            Connect TOR
          </SecureButton>
        )}
      </>
    );
  }

  return (
    <div>
      {renderLine('Channel Size', size)}
      {renderLine('Price', value)}
    </div>
  );
};

import * as React from 'react';
import { useGetBaseUrisQuery } from 'src/graphql/queries/__generated__/getBaseUris.generated';
import { BaseOfferType } from 'src/graphql/types';
import { useGetPeersQuery } from 'src/graphql/queries/__generated__/getPeers.generated';
import { useAccountState } from 'src/context/AccountContext';
import { LoadingCard } from 'src/components/loading/LoadingCard';
import { renderLine } from 'src/components/generic/helpers';
import { DarkSubTitle } from 'src/components/generic/Styled';
import { useConfigState } from 'src/context/ConfigContext';
import { usePriceState } from 'src/context/PriceContext';
import { getPrice } from 'src/components/price/Price';
import { CheckPeer } from './CheckPeer';

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

  React.useEffect(() => {
    if (loading || !data || !data.getBaseUris) return;
    if (peerLoading || !peerData || !peerData.getPeers) return;

    const peers = peerData.getPeers;
    const { public_key } = data.getBaseUris;

    const isPeer = peers.map(p => p.public_key).indexOf(public_key) >= 0;

    if (isPeer) {
      setConnected(true);
    }
  }, [data, loading, peerLoading, peerData, auth]);

  if (loading || peerLoading) {
    return <LoadingCard noCard={true} />;
  }

  if (!data || !peerData) {
    return <DarkSubTitle>Offer is unavailable at the moment</DarkSubTitle>;
  }

  const { public_key, clear, tor } = data.getBaseUris;

  if (!alreadyConnected) {
    return (
      <CheckPeer
        setConnected={setConnected}
        public_key={public_key}
        clear={clear}
        tor={tor}
      />
    );
  }

  return (
    <div>
      {renderLine('Channel Size', size)}
      {renderLine('Price', value)}
    </div>
  );
};

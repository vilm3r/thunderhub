import * as React from 'react';
import { useGetBaseOffersQuery } from 'src/graphql/queries/__generated__/getBaseOffers.generated';
import { animated, useTransition } from 'react-spring';
import { LoadingCard } from 'src/components/loading/LoadingCard';
import styled, { css } from 'styled-components';
import {
  backgroundColor,
  themeColors,
  mediaWidths,
  chartColors,
} from 'src/styles/Themes';
import {
  Card,
  DarkSubTitle,
  Separation,
  Sub4Title,
} from 'src/components/generic/Styled';
import { useConfigState } from 'src/context/ConfigContext';
import { usePriceState } from 'src/context/PriceContext';
import { getPrice } from 'src/components/price/Price';
import { BaseOfferType } from 'src/graphql/types';
import { OfferCard } from './OfferCard';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
`;

type TypeProps = {
  $isAvailable: Boolean;
};

const Item = styled(animated.div)<TypeProps>`
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  border-radius: 4px;
  margin: 8px;
  padding: 8px 32px;
  background: ${backgroundColor};
  will-change: transform, opacity;

  ${({ $isAvailable }) =>
    $isAvailable &&
    css`
      cursor: pointer;

      :hover {
        background: ${themeColors.blue2};
        color: white;
      }
    `}


  @media (${mediaWidths.mobile}) {
    padding: 8px ;
    flex-direction: column;
  }
`;

const Tag = styled.div`
  background: ${chartColors.orange2};
  color: white;
  border-radius: 4px;
  padding: 2px 4px;
  font-size: 14px;
`;

const PriceLine = styled.div`
  display: flex;
  justify-content: space-between;
`;

const renderInfo = () => (
  <>
    <Sub4Title>
      Buy inbound channels to your node to increase the amount of sats you can
      receive.
    </Sub4Title>
    <Separation />
  </>
);

export const GetInbound = () => {
  const [open, set] = React.useState(false);
  const [offer, offerSet] = React.useState<BaseOfferType>();

  const { data, loading } = useGetBaseOffersQuery();

  const { currency, displayValues } = useConfigState();
  const priceContext = usePriceState();
  const format = getPrice(currency, displayValues, priceContext);

  React.useEffect(() => {
    if (!loading && data && data.getBaseOffers) {
      if (data.getBaseOffers.length > 0) {
        set(true);
      }
    }
  }, [loading, data]);

  const transitions = useTransition(
    open && data?.getBaseOffers ? data.getBaseOffers : [],
    item => item._id,
    {
      unique: true,
      trail: 400 / (data?.getBaseOffers?.length || 1),
      from: { opacity: 0, transform: 'scale(0)' },
      enter: { opacity: 1, transform: 'scale(1)' },
      leave: { opacity: 0, transform: 'scale(0)' },
    }
  );

  if (loading) {
    return <LoadingCard />;
  }

  if (!open) {
    return (
      <Card>
        {renderInfo()}
        <DarkSubTitle>
          No inbound channel offers available right now.
        </DarkSubTitle>
      </Card>
    );
  }

  if (offer) {
    return (
      <Card>
        <OfferCard offer={offer} />
      </Card>
    );
  }

  return (
    <Card>
      {renderInfo()}
      <Container>
        {transitions.map(
          ({ item, key, props }) =>
            item && (
              <Item
                key={key}
                style={props}
                $isAvailable={item.available}
                onClick={() => offerSet(item)}
              >
                <div>{`Size: ${format({
                  amount: item.size,
                  breakNumber: true,
                })}`}</div>
                {!item.available ? (
                  <Tag>Out of Stock</Tag>
                ) : (
                  <PriceLine>
                    {`Price: ${format({
                      amount: item.value,
                    })}`}
                  </PriceLine>
                )}
              </Item>
            )
        )}
      </Container>
      <Separation />
      <Sub4Title>
        These channels will be opened for a month. *Longer if they have
        activity.
      </Sub4Title>
    </Card>
  );
};
